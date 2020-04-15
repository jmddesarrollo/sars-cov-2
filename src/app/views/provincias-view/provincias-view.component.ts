import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provincias-view',
  templateUrl: './provincias-view.component.html',
  styleUrls: ['./provincias-view.component.css']
})
export class ProvinciasViewComponent implements OnInit {
  public typePoblacion: string;
  constructor() {
    this.typePoblacion = 'provincias';
   }

  ngOnInit(): void {
  }

}
