import { Component, OnInit,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Incidencia } from '../../zClases/incidencias';
import { MetGenerales } from '../../servicios/general';

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
  ListaIncidenciasFLTR: Incidencia[] = [];
  selectedOption: string = 'todas'; // Valor por defecto

  MetodosComunes: MetGenerales = new MetGenerales(this.router, this.afAuth, this.authService);

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

  // LLLAMA A TAMAÑOPANTALLA AL REDIMENSIONAR LA PANTALLA
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.TamañoPantalla();
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
      this.filtrarIncidencias(); // Filtra incidencias después de cargar
      this.MetodosComunes.updatePaginatedItems(this.ListaIncidenciasFLTR); // Actualiza los elementos paginados
    });
  }

  NuevaIncidencia() {
    this.MetodosComunes.AbrePantallasGen("NUEVAINCIDENCIA", false);
  }

  AbrirDetallesIncidencia(item: any) {
    this.MetodosComunes.AbrePantallasGen("DETALLESINCIDENCIA", item, true);
  }

  goToPage(page: number) {
    this.MetodosComunes.goToPage(page, this.ListaIncidenciasFLTR); // Navega a la página y actualiza los elementos paginados
  }

  OrdenarPorFecha() {
    this.ListaIncidencias.sort((a, b) => {
      const fechaA = new Date(b.fecha);
      const fechaB = new Date(a.fecha);
      return fechaA.getTime() - fechaB.getTime();
    });
  }

  onOptionChange(event: any) {
    this.selectedOption = event.detail.value;
    this.filtrarIncidencias(); // Filtra las incidencias al cambiar la opción
  }

  filtrarIncidencias() {
    if (this.selectedOption === 'todas') {
      this.ListaIncidenciasFLTR = [...this.ListaIncidencias];
    } else if (this.selectedOption === 'atendidas') {
      this.ListaIncidenciasFLTR = this.ListaIncidencias.filter(inc => inc.atentida === true);
    } else if (this.selectedOption === 'pendientes') {
      this.ListaIncidenciasFLTR = this.ListaIncidencias.filter(inc => inc.atentida === false);
    }
    this.MetodosComunes.updatePaginatedItems(this.ListaIncidenciasFLTR); // Actualiza la paginación después de filtrar
  }
}
