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

// Módulos
import { ChartModule } from 'primeng/chart';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { SheetComponent } from './components/sheet/sheet.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { MenuModule } from 'primeng/menu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PaisesChartComponent } from './components/paises-chart/paises-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    SheetComponent,
    BarChartComponent,
    PaisesChartComponent
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
    MenuModule,
    routing,
    SelectButtonModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
