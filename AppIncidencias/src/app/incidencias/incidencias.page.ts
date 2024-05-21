import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.page.html',
  styleUrls: ['./incidencias.page.scss'],
})
export class IncidenciasPage implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }


  NuevaIncidencia(){
    const datos = {NameVentana: 'NuevaInci' };
    this.router.navigate(['nuevaincidencia'], { state: datos });
  }

}
