import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(
    private http: HttpClient
  ) { }

  getComunidades() {
    return this.http.get('/assets/files/convertcsv.json');
  }
}
