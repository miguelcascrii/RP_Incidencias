import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Incidencia } from '../incidencias';
import { MetGenerales } from '../general';  // Ajusta la ruta según tu estructura de proyecto

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.page.html',
  styleUrls: ['./incidencias.page.scss'],
})
export class IncidenciasPage implements OnInit {
  btnTamPantalla: any;
  btnNuevoText: string = "Nueva Incidencia";
  CodCentro: any;
  ListaIncidencias: Incidencia[] = [];

  MetodosComunes: MetGenerales = new MetGenerales(this.router,this.afAuth,this.authService);


  constructor(
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
       
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.CodCentro = usuario?.centro;
          this.ListarIncidencias(this.CodCentro);
       
        });
      } else {
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
      this.TamañoPantalla();
    });
  }

  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false;
      this.btnNuevoText = " ";
    } else {
      this.btnTamPantalla = true;
      this.btnNuevoText = " Nueva Incidencia";
    }
  }

  ListarIncidencias(centro: string) {
    this.authService.DatoWhere(centro, 'Incidencias', 'centro').subscribe((res) => {
      this.ListaIncidencias = [];
      res.forEach((element: any) => {
        this.ListaIncidencias.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      this.OrdenarPorFecha();
      this.MetodosComunes.updatePaginatedItems(this.ListaIncidencias); // Actualiza los elementos paginados
    });
  }

  NuevaIncidencia() {
    this.MetodosComunes.AbrePantallasGen("NUEVAINCIDENCIA",false)
  }

  AbrirDetallesIncidencia(item : any){
    this.MetodosComunes.AbrePantallasGen("DETALLESINCIDENCIA",item,true)
  }

  goToPage(page: number) {
    this.MetodosComunes.goToPage(page, this.ListaIncidencias); // Navega a la página y actualiza los elementos paginados
  }

  OrdenarPorFecha() {
    this.ListaIncidencias.sort((a, b) => {
      const fechaA = new Date(b.fecha);
      const fechaB = new Date(a.fecha);
      return fechaA.getTime() - fechaB.getTime();
    });
  }
}
