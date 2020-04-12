import { Component, OnInit, OnDestroy, Type } from '@angular/core';

// PrimeNG
import { SelectItem } from 'primeng/api';

// Services
import { JsonService } from '../../services/json.service';

@Component({
  selector: 'app-paises-chart',
  templateUrl: './paises-chart.component.html',
  styleUrls: ['./paises-chart.component.css']
})
export class PaisesChartComponent implements OnInit, OnDestroy {
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

  constructor(private jsonService: JsonService) {
    this.types = [];

    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.options = {
      title: {
        display: true,
        text: 'SARS-COV-2: Contagios por Países',
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
    this.getDataPoblaciones();
    this.getDataComunidades();
  }

  ngOnDestroy(): void {
    for (const ob of this.observables) {
      if (ob) {
        ob.unsubscribe();
      }
    }
  }

  getDataPoblaciones() {
    const ob = this.jsonService
      .getPoblacionesPaises()
      .subscribe((response: DataComunidad[]) => {
        this.poblaciones = response;
      });
    this.observables.push(ob);
  }

  getDataComunidades() {
    const ob = this.jsonService
      .getCoronaPaises()
      .subscribe((response: DataComunidad[]) => {
        this.data = response;

        this.selectedTypes = ['ESPAÑA', 'PORTUGAL', 'ITALIA'];
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
    const idxType = this.types.findIndex(fila => fila.value === row.poblacion);
    if (idxType < 0) {
      const objType: SelectItem = {label: row.poblacion, value: row.poblacion};

      this.types.push(objType);
    }
  }

  cargarLabels() {
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

        const idxPoblacion = this.poblaciones.findIndex(fila => fila.poblacion == row.poblacion);
        const color = this.poblaciones[idxPoblacion].color;

        if (!encontrado) {
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
          const idxPoblacion = this.poblaciones.findIndex(fila => fila.poblacion == row.poblacion);
          poblacionTotal = this.poblaciones[idxPoblacion].Total;
        }

        for (const dataset of this.dataChart.datasets) {
          if (dataset.label === row.poblacion) {
            let cantidad = 0;

            if (this.selectedModo.code === 'Contagiados') {
              cantidad = row.contagiados;
            }
            if (this.selectedModo.code === 'Fallecidos') {
              cantidad = row.fallecidos;
            }

            if (this.checked) {
              cantidad = ( (cantidad * 100000) / poblacionTotal);
            }

            dataset.data.push(cantidad);
          }
        }
      }
    }

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
}

interface DataComunidad {
  fecha: string;
  poblacion: string;
  contagiados: number;
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
