import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LineChartComponent } from './components/line-chart/line-chart.component';

const appRoutes: Routes = [
    {path: '', component: LineChartComponent},
    {path: 'home', component: LineChartComponent, data: {titulo: 'Home'} },

    {path: '**', component: LineChartComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);