import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LineChartComponent } from './components/line-chart/line-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';

const appRoutes: Routes = [
    {path: '', component: LineChartComponent},
    {path: 'comunidades', component: LineChartComponent, data: {titulo: 'Comunidades'} },
    {path: 'comunidad', component: BarChartComponent, data: {titulo: 'comunidad'} },
    {path: '**', component: LineChartComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);