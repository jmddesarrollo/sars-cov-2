import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LineChartComponent } from './components/line-chart/line-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { PaisesChartComponent } from './components/paises-chart/paises-chart.component';

const appRoutes: Routes = [
    {path: '', component: LineChartComponent},
    {path: 'comunidades', component: LineChartComponent, data: {titulo: 'Comunidades'} },
    {path: 'comunidad', component: BarChartComponent, data: {titulo: 'Comunidad'} },
    {path: 'paises', component: PaisesChartComponent, data: {titulo: 'Países'} },
    {path: '**', component: LineChartComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);