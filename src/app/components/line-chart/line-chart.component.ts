import { Component, OnInit, OnDestroy } from '@angular/core';

// PrimeNG
import { SelectItem } from 'primeng/api';

// Services
import { JsonService } from '../../services/json.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit, OnDestroy {
  public data: any;

  public dataChart: DataChart;
  public options: any;

  public selectedModo: Modo;
  modos: Modo[];

  types: SelectItem[];
  selectedTypes: string[] = ['La Mancha', 'C. Madrid', 'C. Valenciana'];

  public loadingData: boolean;

  private observables = new Array();

  constructor(private jsonService: JsonService) {
    this.types = [
      { label: 'Andalucía', value: 'Andalucía' },
      { label: 'Aragón', value: 'Aragón' },
      { label: 'Asturias', value: 'Asturias' },
      { label: 'Baleares', value: 'Baleares' },
      { label: 'Canarias', value: 'Canarias' },
      { label: 'Cantabria', value: 'Cantabria' },
      { label: 'La Mancha', value: 'La Mancha' },
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
        text: 'SARS-COV-2: Contagios por Comunidades Autonómicas',
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

    this.loadingData = true;
  }

  ngOnInit() {
    this.getDataComunidades();
  }

  ngOnDestroy(): void {
    for (const ob of this.observables) {
      if (ob) {
        ob.unsubscribe();
      }
    }
  }

  aplicarCambio() {
    this.loadingData = true;

    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.mostrarData();
  }

  getDataComunidades() {
    const ob = this.jsonService
      .getComunidades()
      .subscribe((response: DataComunidad[]) => {
        this.data = response;
        this.adaptarComunidad();
        this.mostrarData();
      });
    this.observables.push(ob);
  }

  mostrarData() {
    for (let row of this.data) {
      const idxSelCom = this.selectedTypes.indexOf(row.CCAA);

      if (idxSelCom >= 0) {
        const idxLabel = this.dataChart.labels.indexOf(row.FECHA);
        if (idxLabel < 0) {
          this.dataChart.labels.push(row.FECHA);
        }

        let datasetEncontrado = false;

        for (const dataset of this.dataChart.datasets) {
          if (dataset.label === row.CCAA) {
            datasetEncontrado = true;

            if (this.selectedModo.code === 'CASOS') {
              dataset.data.push(row.CASOS);
            }
            if (this.selectedModo.code === 'Hospitalizados') {
              dataset.data.push(row.Hospitalizados);
            }
            if (this.selectedModo.code === 'UCI') {
              dataset.data.push(row.UCI);
            }
            if (this.selectedModo.code === 'Recuperados') {
              dataset.data.push(row.Recuperados);
            }
            if (this.selectedModo.code === 'Fallecidos') {
              dataset.data.push(row.Fallecidos);
            }
          }
        }

        if (!datasetEncontrado) {
          // Dar de alta uno nuevo
          const newDataSet: DataSets = {
            label: null,
            borderColor: null,
            fill: false,
            data: [],
          };

          newDataSet.label = row.CCAA;
          newDataSet.borderColor = row.Color;
          if (this.selectedModo.code === 'CASOS') {
            newDataSet.data.push(row.CASOS);
          }
          if (this.selectedModo.code === 'Hospitalizados') {
            newDataSet.data.push(row.Hospitalizados);
          }
          if (this.selectedModo.code === 'UCI') {
            newDataSet.data.push(row.UCI);
          }
          if (this.selectedModo.code === 'Recuperados') {
            newDataSet.data.push(row.Recuperados);
          }
          if (this.selectedModo.code === 'Fallecidos') {
            newDataSet.data.push(row.Fallecidos);
          }

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

          // Dar de alta uno nuevo
    const newDataSet: DataSets = {
      label: "España",
      borderColor: "#FF4B4B",
      fill: false,
      data: [],
    };
    this.dataChart.datasets.push(newDataSet);

    for (let row of this.data) {
      if (fechaDefault !== row.FECHA) {
        if (fechaDefault !== null) {
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
          row.Color = '#3BB77B';
          break;
        case 'AR':
          row.CCAA = 'Aragón';
          row.Color = '#FF5833';
          break;
        case 'AS':
          row.CCAA = 'Asturias';
          row.Color = '#0072BD';
          break;
        case 'IB':
          row.CCAA = 'Baleares';
          row.Color = '#1D206F';
          break;
        case 'CN':
          row.CCAA = 'Canarias';
          row.Color = '#FFCC00';
          break;
        case 'CB':
          row.CCAA = 'Cantabria';
          row.Color = '#DA121A';
          break;
        case 'CM':
          row.CCAA = 'La Mancha';
          row.Color = '#B81626';
          break;
        case 'CL':
          row.CCAA = 'Castilla y León';
          row.Color = '#DB0A13';
          break;
        case 'CT':
          row.CCAA = 'Cataluña';
          row.Color = '#FFAB68';
          break;
        case 'CE':
          row.CCAA = 'Ceuta';
          row.Color = '#000000';
          break;
        case 'VC':
          row.CCAA = 'C. Valenciana';
          row.Color = '#7068FF';
          break;
        case 'EX':
          row.CCAA = 'Extremadura';
          row.Color = '#00AB39';
          break;
        case 'GA':
          row.CCAA = 'Galicia';
          row.Color = '#009ACD';
          break;
        case 'MD':
          row.CCAA = 'C. Madrid';
          row.Color = '#C70318';
          break;
        case 'ML':
          row.CCAA = 'Melilla';
          row.Color = '#4C86C9';
          break;
        case 'MC':
          row.CCAA = 'Murcia';
          row.Color = '#ED1C24';
          break;
        case 'NC':
          row.CCAA = 'Navarra';
          row.Color = '#DB0A13';
          break;
        case 'PV':
          row.CCAA = 'País Vasco';
          row.Color = '#009B48';
          break;
        case 'RI':
          row.CCAA = 'La Rioja';
          row.Color = '#FFC82E';
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

  clear() {
    this.selectedTypes = [];
  }
}

interface DataComunidad {
  CCAA: string;
  FECHA: string;
  CASOS: number;
  Hospitalizados: number;
  UCI: number;
  Fallecidos: number;
  Recuperados: number;
  Color: string;
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
