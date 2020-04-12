import { Component, OnInit, OnDestroy } from '@angular/core';

// PrimeNG
import { SelectItem } from 'primeng/api';

// Services
import { JsonService } from '../../services/json.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit, OnDestroy {
  public data: any;
  public loadingData: boolean;

  public dataChart: DataChart;
  public options: any;

  // Botón
  public types: SelectItem[];
  public selectedType: string;

  // Observables
  private observables = new Array();

  constructor(
    private jsonService: JsonService
  ) {
    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.options = {
      title: {
        display: true,
        text: 'SARS-COV-2: por Comunidad Autonómica',
        fontSize: 16,
      },
      legend: {
        position: 'bottom',
      },
    };

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

    this.loadingData = false;
    this.selectedType = 'La Mancha';
  }

  ngOnInit(): void {
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

  aplicarCambio() {
    this.loadingData = true;

    this.dataChart = {
      labels: [],
      datasets: [],
    };

    this.mostrarData();
  }

  mostrarData() {
    this.dataChart = {
      labels: [],
      datasets: [
        {
          label: 'Contagiados',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [],
        },
        {
          label: 'Hospitalizados',
          backgroundColor: '#FF4B4B',
          borderColor: '#FF4B4B',
          data: [],
        },
        {
          label: 'Recuperados',
          backgroundColor: '#9CCC65',
          borderColor: '#1E88E5',
          data: [],
        },
        {
          label: 'Fallecidos',
          backgroundColor: '#000',
          borderColor: '#000',
          data: [],
        }
      ],
    };
    for (let row of this.data) {
      if (row.CCAA === this.selectedType) {
        this.dataChart.labels.push(row.FECHA);
        this.dataChart.datasets[0].data.push(row.CASOS);
        this.dataChart.datasets[1].data.push(row.Hospitalizados);
        this.dataChart.datasets[2].data.push(row.Recuperados);
        this.dataChart.datasets[3].data.push(row.Fallecidos);
      }
    }
    if (this.selectedType === 'España') {
      this.calcularEspaña();
    }

    this.loadingData = false;
  }

  calcularEspaña() {
    console.log('Ole');
    let fechaDefault = null;
    let sumatorioContagiados = 0;
    let sumatorioHospitalizados = 0;
    let sumatorioRecuperados = 0;
    let sumatorioFallecidos = 0;

    for (let row of this.data) {
      if (fechaDefault !== row.FECHA) {
        console.log(fechaDefault);
        if (fechaDefault !== null) {
          console.log('escribe');
          console.log(sumatorioContagiados);
          this.dataChart.labels.push(fechaDefault);
          this.dataChart.datasets[0].data.push(sumatorioContagiados);
          this.dataChart.datasets[1].data.push(sumatorioHospitalizados);
          this.dataChart.datasets[2].data.push(sumatorioRecuperados);
          this.dataChart.datasets[3].data.push(sumatorioFallecidos);
        }
        fechaDefault = row.FECHA;
        sumatorioContagiados = 0;
        sumatorioHospitalizados = 0;
        sumatorioRecuperados = 0;
        sumatorioFallecidos = 0;
      }

      sumatorioContagiados    += row.CASOS;
      sumatorioHospitalizados += row.Hospitalizados;
      sumatorioRecuperados    += row.Recuperados;
      sumatorioFallecidos     += row.Fallecidos;
    }

    this.dataChart.labels.push(fechaDefault);
    this.dataChart.datasets[0].data.push(sumatorioContagiados);
    this.dataChart.datasets[1].data.push(sumatorioHospitalizados);
    this.dataChart.datasets[2].data.push(sumatorioRecuperados);
    this.dataChart.datasets[3].data.push(sumatorioFallecidos);
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
  backgroundColor: string;
  borderColor: string;
}
