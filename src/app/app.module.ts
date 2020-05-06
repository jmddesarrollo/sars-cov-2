import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// HTTP
import { HttpClientModule } from '@angular/common/http';

// Rutas
import { routing, appRoutingProviders } from './app.routes';

// Formularios
// Modulo para trabajo con formularios.
import { FormsModule} from '@angular/forms';

// Services
import { ColoresService } from './services/colores.service';

// Módulos
import { ChartModule } from 'primeng/chart';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';

import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { PoblacionesChartComponent } from './components/poblaciones-chart/poblaciones-chart.component';
import { PaisesViewComponent } from './views/paises-view/paises-view.component';
import { ProvinciasViewComponent } from './views/provincias-view/provincias-view.component';
import { PoblacionesTableComponent } from './components/poblaciones-table/poblaciones-table.component';


@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    BarChartComponent,
    PaisesViewComponent,
    ProvinciasViewComponent,
    PoblacionesChartComponent,
    PoblacionesTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    ChartModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    InputSwitchModule,
    TableModule,
    MenuModule,
    routing,
    SelectButtonModule
  ],
  providers: [
    appRoutingProviders,
    ColoresService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
