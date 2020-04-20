import { Component, OnInit, OnDestroy, Input } from '@angular/core';

// PrimeNG
import { SelectItem } from 'primeng/api';

// Services
import { JsonService } from '../../services/json.service';
import { ColoresService } from '../../services/colores.service';

@Component({
  selector: 'app-poblaciones-chart',
  templateUrl: './poblaciones-chart.component.html',
  styleUrls: ['./poblaciones-chart.component.css'],
})
export class PoblacionesChartComponent implements OnInit, OnDestroy {
  @Input() typePoblacion: string;

  public data: any;
  public poblaciones: any;

  public dataChart: DataChart;
  public options: any;

  public selectedModo: Modo;
  modos: Modo[];

  public checked: boolean;

  types: SelectItem[];
  selectedTypes: string[];

  public loadingData: boolean;

  private observables = new Array();

  constructor(
    private jsonService: JsonService,
    private coloresService: ColoresService
  ) {
    this.types = [];

    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.options = {
      title: {
        display: true,
        text: 'SARS-COV-2: Por Países',
        fontSize: 16,
      },
      legend: {
        position: 'bottom',
      },
    };

    this.modos = [
      { name: 'Contagiados', code: 'Contagiados' },
      { name: 'Fallecidos', code: 'Fallecidos' },
    ];

    this.selectedModo = this.modos[0];

    this.checked = false;

    this.loadingData = true;
  }

  ngOnInit() {
    if (this.typePoblacion === 'provincias') {
      this.getPoblacionesProvincias();
      this.getCoronaProvincias();
    } else {
      this.getPoblacionesPaises();
      this.getCoronaPaises();
    }

    if (this.typePoblacion === 'provincias') {
      this.options.title.text = 'SARS-COV-2: Por Provincias de CLM';
      this.modos = [
        { name: 'Contagiados', code: 'Contagiados' },
        { name: 'Hospitalizados', code: 'Hospitalizados' },
        { name: 'Fallecidos', code: 'Fallecidos' },
      ];
    }
  }

  ngOnDestroy(): void {
    for (const ob of this.observables) {
      if (ob) {
        ob.unsubscribe();
      }
    }
  }

  getPoblacionesPaises() {
    const ob = this.jsonService
      .getPoblacionesPaises()
      .subscribe((response: DataComunidad[]) => {
        this.poblaciones = response;
      });
    this.observables.push(ob);
  }
  getPoblacionesProvincias() {
    const ob = this.jsonService
      .getPoblacionesProvincias()
      .subscribe((response: DataComunidad[]) => {
        this.poblaciones = response;
      });
    this.observables.push(ob);
  }

  getCoronaPaises() {
    const ob = this.jsonService
      .getCoronaPaises()
      .subscribe((response: DataComunidad[]) => {
        this.data = response;

        this.selectedTypes = ['ESPAÑA', 'PORTUGAL', 'ITALIA', 'ALEMANIA', 'FRANCIA'];
        this.cargarLabels();
        this.cargarData();
      });
    this.observables.push(ob);
  }
  getCoronaProvincias() {
    const ob = this.jsonService
      .getCoronaProvincias()
      .subscribe((response: DataComunidad[]) => {
        this.data = response;

        this.selectedTypes = [
          'Albacete',
          'Ciudad Real',
          'Cuenca',
          'Guadalajara',
          'Toledo',
        ];
        this.cargarLabels();
        this.cargarData();
      });
    this.observables.push(ob);
  }

  aplicarCambio() {
    this.loadingData = true;

    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.cargarLabels();
    this.cargarData();
  }

  cargarTypes(row) {
    const idxType = this.types.findIndex(
      (fila) => fila.value === row.poblacion
    );
    if (idxType < 0) {
      const objType: SelectItem = {
        label: row.poblacion,
        value: row.poblacion,
      };

      this.types.push(objType);
    }
  }

  cargarLabels() {
    let num = 0;
    for (const row of this.data) {
      this.cargarTypes(row);

      const idxLabel = this.dataChart.labels.indexOf(row.fecha);

      if (idxLabel < 0) {
        this.dataChart.labels.push(row.fecha);
      }

      const idxSelPoblacion = this.selectedTypes.indexOf(row.poblacion);
      if (idxSelPoblacion >= 0) {
        let encontrado = false;
        for (const dataset of this.dataChart.datasets) {
          if (dataset.label === row.poblacion) {
            encontrado = true;
          }
        }

        if (!encontrado) {
          // Asignar color
          let color = '#000000';

          if (row.poblacion === 'ESPAÑA' || row.poblacion === 'Toledo') {
            color = '#E74C3C';
          } else {
            color = this.coloresService.getColor(num);
            num++;
          }

          // Dar de alta uno nuevo
          const newDataSet: DataSets = {
            label: row.poblacion,
            borderColor: color,
            fill: false,
            data: [],
          };

          this.dataChart.datasets.push(newDataSet);
        }
      }
    }
  }

  cargarData() {
    for (const row of this.data) {
      const idxSelPoblacion = this.selectedTypes.indexOf(row.poblacion);
      if (idxSelPoblacion >= 0) {
        let poblacionTotal = 0;

        if (this.checked) {
          const idxPoblacion = this.poblaciones.findIndex(
            (fila) => fila.poblacion == row.poblacion
          );
          poblacionTotal = this.poblaciones[idxPoblacion].Total;
        }

        for (const dataset of this.dataChart.datasets) {
          if (dataset.label === row.poblacion) {
            let cantidad = 0;

            if (this.selectedModo.code === 'Contagiados') {
              cantidad = row.contagiados;
            }
            if (this.selectedModo.code === 'Hospitalizados') {
              cantidad = row.hospitalizados;
            }
            if (this.selectedModo.code === 'Fallecidos') {
              cantidad = row.fallecidos;
            }

            if (this.checked) {
              cantidad = (cantidad * 100000) / poblacionTotal;
            }

            dataset.data.push(cantidad);
          }
        }
      }
    }

    this.rectificaciones();

    this.loadingData = false;
  }

  cambiarModo() {
    this.loadingData = true;

    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.cargarLabels();
    this.cargarData();
  }

  rectificaciones() {
    if (
      this.typePoblacion === 'provincias' &&
      this.selectedModo.code === 'Hospitalizados'
    ) {
      this.dataChart.labels = this.dataChart.labels.slice(22);
      for (const dataset of this.dataChart.datasets) {
        dataset.data = dataset.data.slice(22);
      }
    }
    if (
      this.typePoblacion === 'provincias' &&
      this.selectedModo.code === 'Fallecidos'
    ) {
      this.dataChart.labels = this.dataChart.labels.slice(25);
      for (const dataset of this.dataChart.datasets) {
        dataset.data = dataset.data.slice(25);
      }
    }
  }
}

interface DataComunidad {
  fecha: string;
  poblacion: string;
  contagiados: number;
  hospitalizados: number;
  fallecidos: number;
}

interface DataChart {
  labels: string[];
  datasets: DataSets[];
}

interface DataSets {
  label: string;
  data: number[];
  fill: boolean;
  borderColor: string;
}

interface Modo {
  name: string;
  code: string;
}
