import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private datos: any;

  constructor() {}

  setDatos(data: any) {
    this.datos = data;
  }

  getDatos() {
    return this.datos;
  }
}
