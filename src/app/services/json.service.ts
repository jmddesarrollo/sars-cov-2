import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(
    private http: HttpClient
  ) { }

  getCoronaComunidades() {
    return this.http.get('/assets/files/corona-comunidades.json');
  }

  getPoblacionesComunidades() {
    return this.http.get('/assets/files/poblaciones-comunidades.json');
  }

  getCoronaPaises() {
    return this.http.get('/assets/files/corona-paises.json');
  }

  getPoblacionesPaises() {
    return this.http.get('/assets/files/poblaciones-paises.json');
  }
}
