import { Component, OnInit, OnDestroy } from '@angular/core';

// PrimeNG
import { SelectItem } from 'primeng/api';

// Services
import { JsonService } from '../../services/json.service';
import { ColoresService } from '../../services/colores.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnDestroy {
  public data: any;
  public poblaciones: any;

  public dataChart: DataChart;
  public options: any;

  public selectedModo: Modo;
  modos: Modo[];

  public checked: boolean;

  types: SelectItem[];
  selectedTypes: string[] = ['La Mancha', 'C. Madrid', 'C. Valenciana', 'Castilla y León', 'Cataluña', 'Navarra',
'País Vasco', 'La Rioja', 'España'];

  public loadingData: boolean;

  private observables = new Array();

  constructor(
    private jsonService: JsonService,
    private coloresService: ColoresService
    ) {
    this.types = [
      { label: 'Andalucía', value: 'Andalucía' },
      { label: 'Aragón', value: 'Aragón' },
      { label: 'Asturias', value: 'Asturias' },
      { label: 'Baleares', value: 'Baleares' },
      { label: 'Canarias', value: 'Canarias' },
      { label: 'Cantabria', value: 'Cantabria' },
      { label: 'Castilla La Mancha', value: 'La Mancha' },
      { label: 'Castilla y León', value: 'Castilla y León' },
      { label: 'Cataluña', value: 'Cataluña' },
      { label: 'Ceuta', value: 'Ceuta' },
      { label: 'C. Valenciana', value: 'C. Valenciana' },
      { label: 'Extremadura', value: 'Extremadura' },
      { label: 'Galicia', value: 'Galicia' },
      { label: 'C. Madrid', value: 'C. Madrid' },
      { label: 'Melilla', value: 'Melilla' },
      { label: 'Murcia', value: 'Murcia' },
      { label: 'Navarra', value: 'Navarra' },
      { label: 'País Vasco', value: 'País Vasco' },
      { label: 'La Rioja', value: 'La Rioja' },
      { label: 'España', value: 'España' }
    ];

    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.options = {
      title: {
        display: true,
        text: 'SARS-COV-2: Por Comunidades Autonómicas',
        fontSize: 16,
      },
      legend: {
        position: 'bottom',
      },
    };

    this.modos = [
      { name: 'Contagios', code: 'CASOS' },
      { name: 'Hospitalizados', code: 'Hospitalizados' },
      { name: 'UCI', code: 'UCI' },
      { name: 'Recuperados', code: 'Recuperados' },
      { name: 'Fallecidos', code: 'Fallecidos' },
    ];
    this.selectedModo = this.modos[0];

    this.checked = true;

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

  getDataComunidades() {
    const ob = this.jsonService
      .getCoronaComunidades()
      .subscribe((response: DataComunidad[]) => {
        this.data = response;
        this.adaptarComunidad();
        this.mostrarData();
      });
    this.observables.push(ob);
  }

  getDataPoblaciones() {
    const ob = this.jsonService
      .getPoblacionesComunidades()
      .subscribe((response: DataComunidad[]) => {
        this.poblaciones = response;
      });
    this.observables.push(ob);
  }

  aplicarCambio() {
    this.loadingData = true;

    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.mostrarData();
  }

  mostrarData() {
    let num = 0;
    for (const row of this.data) {
      const idxSelCom = this.selectedTypes.indexOf(row.CCAA);

      if (idxSelCom >= 0) {
        let poblacionTotal = 0;
        if (this.checked) {
          const idxPoblacion = this.poblaciones.findIndex(poblacion => poblacion.Comunidad == row.CCAA);
          poblacionTotal = this.poblaciones[idxPoblacion].Total;
        }

        const idxLabel = this.dataChart.labels.indexOf(row.FECHA);
        if (idxLabel < 0) {
          this.dataChart.labels.push(row.FECHA);
        }

        let datasetEncontrado = false;

        for (const dataset of this.dataChart.datasets) {
          if (dataset.label === row.CCAA) {
            datasetEncontrado = true;
            let cantidad = 0;
            if (this.selectedModo.code === 'CASOS') {
              cantidad = row.CASOS;
            }
            if (this.selectedModo.code === 'Hospitalizados') {
              cantidad = row.Hospitalizados;
            }
            if (this.selectedModo.code === 'UCI') {
              cantidad = row.UCI;
            }
            if (this.selectedModo.code === 'Recuperados') {
              cantidad = row.Recuperados;
            }
            if (this.selectedModo.code === 'Fallecidos') {
              cantidad = row.Fallecidos;
            }

            if (this.checked) {
              cantidad = ( (cantidad * 1000000) / poblacionTotal);
            }

            dataset.data.push(cantidad);
          }
        }

        if (!datasetEncontrado) {
          let newCantidad = 0;

          // Dar de alta uno nuevo
          const newDataSet: DataSets = {
            label: null,
            borderColor: null,
            fill: false,
            data: [],
          };

          newDataSet.label = row.CCAA;

          // Asignar color
          newDataSet.borderColor = '#000000';

          newDataSet.borderColor = this.coloresService.getColor(num);
          num++;
          //

          if (this.selectedModo.code === 'CASOS') {
            newCantidad = row.CASOS;
          }
          if (this.selectedModo.code === 'Hospitalizados') {
            newCantidad = row.Hospitalizados;
          }
          if (this.selectedModo.code === 'UCI') {
            newCantidad = row.UCI;
          }
          if (this.selectedModo.code === 'Recuperados') {
            newCantidad = row.Recuperados;
          }
          if (this.selectedModo.code === 'Fallecidos') {
            newCantidad = row.Fallecidos;
          }

          if (this.checked) {
            newCantidad = ( (newCantidad * 1000000) / poblacionTotal);
          }
          newDataSet.data.push(newCantidad);

          this.dataChart.datasets.push(newDataSet);
        }
      }
    }

    const idxEspaña = this.selectedTypes.indexOf("España");
    if (idxEspaña >= 0) {
      this.calcularEspaña();
    }

    this.loadingData = false;
  }

  calcularEspaña() {
    let fechaDefault = null;
    let sumatorio = 0;
    const idxEspaña = this.dataChart.datasets.length;

    let poblacionTotal = 0;
    if (this.checked) {
      const idxPoblacion = this.poblaciones.findIndex(poblacion => poblacion.Comunidad == "España");
      poblacionTotal = this.poblaciones[idxPoblacion].Total;
    }

    // Dar de alta uno nuevo
    const newDataSet: DataSets = {
      label: "España",
      borderColor: "#E74C3C",
      fill: false,
      data: [],
    };
    this.dataChart.datasets.push(newDataSet);

    for (let row of this.data) {
      if (fechaDefault !== row.FECHA) {
        if (fechaDefault !== null) {
          if (this.selectedTypes.length === 1) {
            this.dataChart.labels.push(fechaDefault);
          }
          if (this.checked) {
            sumatorio = ( (sumatorio * 1000000) / poblacionTotal);
          }
          this.dataChart.datasets[idxEspaña].data.push(sumatorio);
        }
        fechaDefault = row.FECHA;
        sumatorio = 0;
      }

      if (this.selectedModo.code === 'CASOS') {
        sumatorio += row.CASOS;
      }
      if (this.selectedModo.code === 'Hospitalizados') {
        sumatorio += row.Hospitalizados;
      }
      if (this.selectedModo.code === 'UCI') {
        sumatorio += row.UCI;
      }
      if (this.selectedModo.code === 'Recuperados') {
        sumatorio += row.Recuperados;
      }
      if (this.selectedModo.code === 'Fallecidos') {
        sumatorio += row.Fallecidos;
      }
    }
    if (this.selectedTypes.length === 1) {
      this.dataChart.labels.push(fechaDefault);
    }
    if (this.checked) {
      sumatorio = ( (sumatorio * 1000000) / poblacionTotal);
    }
    this.dataChart.datasets[idxEspaña].data.push(sumatorio);
  }

  cambiarModo() {
    this.loadingData = true;

    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.mostrarData();
  }

  adaptarComunidad(): void {
    for (let row of this.data) {
      switch (row.CCAA) {
        case 'AN':
          row.CCAA = 'Andalucía';
          break;
        case 'AR':
          row.CCAA = 'Aragón';
          break;
        case 'AS':
          row.CCAA = 'Asturias';
          break;
        case 'IB':
          row.CCAA = 'Baleares';
          break;
        case 'CN':
          row.CCAA = 'Canarias';
          break;
        case 'CB':
          row.CCAA = 'Cantabria';
          break;
        case 'CM':
          row.CCAA = 'La Mancha';
          break;
        case 'CL':
          row.CCAA = 'Castilla y León';
          break;
        case 'CT':
          row.CCAA = 'Cataluña';
          break;
        case 'CE':
          row.CCAA = 'Ceuta';
          break;
        case 'VC':
          row.CCAA = 'C. Valenciana';
          break;
        case 'EX':
          row.CCAA = 'Extremadura';
          break;
        case 'GA':
          row.CCAA = 'Galicia';
          break;
        case 'MD':
          row.CCAA = 'C. Madrid';
          break;
        case 'ML':
          row.CCAA = 'Melilla';
          break;
        case 'MC':
          row.CCAA = 'Murcia';
          break;
        case 'NC':
          row.CCAA = 'Navarra';
          break;
        case 'PV':
          row.CCAA = 'País Vasco';
          break;
        case 'RI':
          row.CCAA = 'La Rioja';
          break;
        default:
          break;
      }

      row = this.tratarNulos(row);
    }
  }

  tratarNulos(row: DataComunidad) {
    if (!row.CASOS) {
      row.CASOS = 0;
      if (row.PCR) {
        row.CASOS = row.PCR + row.TestAc;
      }
    }
    if (!row.Hospitalizados) {
      row.Hospitalizados = 0;
    }
    if (!row.UCI) {
      row.UCI = 0;
    }
    if (!row.Recuperados) {
      row.Recuperados = 0;
    }
    if (!row.Fallecidos) {
      row.Fallecidos = 0;
    }

    return row;
  }
}

interface DataComunidad {
  CCAA: string;
  FECHA: string;
  CASOS: number;
  PCR: number;
  TestAc: number;
  Hospitalizados: number;
  UCI: number;
  Fallecidos: number;
  Recuperados: number;
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
