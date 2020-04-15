import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Gráficas',
        items: [
          { label: 'Comunidades', icon: 'pi pi-fw pi-chart-line', routerLink: ['/comunidades'] },
          { label: 'Comunidad', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/comunidad'] },
          { label: 'Países', icon: 'pi pi-fw pi-chart-line', routerLink: ['/paises'] },
          { label: 'La Mancha', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/provincias'] },
        ],
      },
    ];
  }
}
