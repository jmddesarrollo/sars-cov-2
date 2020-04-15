import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paises-view',
  templateUrl: './paises-view.component.html',
  styleUrls: ['./paises-view.component.css']
})
export class PaisesViewComponent implements OnInit {
  public typePoblacion: string;
  constructor() {
    this.typePoblacion = 'paises';
   }

  ngOnInit(): void {
  }

}
