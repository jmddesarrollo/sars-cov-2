import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LineChartComponent } from './components/line-chart/line-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { PaisesViewComponent } from './views/paises-view/paises-view.component';
import { ProvinciasViewComponent } from './views/provincias-view/provincias-view.component';
import { PoblacionesTableComponent } from './components/poblaciones-table/poblaciones-table.component';

const appRoutes: Routes = [
    {path: '', component: PaisesViewComponent},
    {path: 'comunidades', component: LineChartComponent, data: {titulo: 'Comunidades'} },
    {path: 'comunidad', component: BarChartComponent, data: {titulo: 'Comunidad'} },
    {path: 'paises', component: PaisesViewComponent, data: {titulo: 'Países'} },
    {path: 'provincias', component: ProvinciasViewComponent, data: {titulo: 'Provincias'} },
    {path: 'tablas', component: PoblacionesTableComponent, data: {titulo: 'Tablas'} },
    {path: '**', component: PaisesViewComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
