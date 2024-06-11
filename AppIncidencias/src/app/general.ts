import { Router } from "@angular/router";
import { Usuario } from "./usuarios";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from "./servicios/auth/auth.service";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

export class MetGenerales {
  CodCentro: any;
  UsuarioActivo?: Usuario;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) { }

  ObtenerCodCentro(): Observable<string | undefined> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.authService.obtenerUsuarioPorEmail(user.email).pipe(
            switchMap(usuario => {
              this.CodCentro = usuario?.centro;
              return of(this.CodCentro);
            })
          );
        } else {
          return of(undefined);
        }
      })
    );
  }

  currentPage: number = 1;
  currentPageDpt: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageDPT: number = 5;
  paginatedItems: any[] = [];
  paginatedDept: any[] = [];

  updatePaginatedItems(ListaMostrar: any[], numberitem?: any) {
    if (numberitem) {
      this.itemsPerPage = numberitem;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = ListaMostrar.slice(startIndex, endIndex);
  }

  goToPage(page: number, ListaMostrar: any[], NumberItems?: any) {
    this.currentPage = page;
    this.updatePaginatedItems(ListaMostrar, NumberItems);
  }

  updatePaginatedDept(ListaDept: any, numberitem?: any) {
    if (numberitem) {
      this.itemsPerPageDPT = numberitem;
    }
    const startIndex = (this.currentPageDpt - 1) * this.itemsPerPageDPT;
    const endIndex = startIndex + this.itemsPerPageDPT;
    this.paginatedDept = ListaDept.slice(startIndex, endIndex);
  }

  goToPageDept(page: number, ListaDept: any, NumberItems?: any) {
    this.currentPageDpt = page;
    this.updatePaginatedDept(ListaDept, NumberItems);
  }

  AbrePantallasGen(vntAbrir: string, itemDetalles?: any, modoDetalles?: boolean) {
    switch (vntAbrir) {
      case "DETALLESINCIDENCIA":
        this.AbrirVentana('nuevaincidencia', 'DETALLESINCIDENCIA', itemDetalles, modoDetalles);
        break;
      case "MISINCIDENCIAS":
        this.AbrirVentana('nuevaincidencia', 'MISINCIDENCIAS', itemDetalles, modoDetalles);
        break;
      case "NUEVAINCIDENCIA":
        this.AbrirVentana('nuevaincidencia', 'NUEVAINCIDENCIA');
        break;
      case "ATENDERINCIDENCIA":
        this.AbrirVentana('atender-incidencia', 'ATENDERINCIDENCIA', itemDetalles);
        break;
      case "MISDATOS":
        this.AbrirVentana('info-usuario', 'MISDATOS');
        break;
      default:
        console.log("Selecciona una opción");
        break;
    }
  }

  AbrirVentana(NameVentana: string, NombreDatos: string, itemDet?: any, modoDetalles?: boolean) {
    let datos;
    if (itemDet !== undefined) {
      datos = { NombreDatos, itemDet, modoDetalles };
    } else {
      datos = { NombreDatos, modoDetalles };
    }
    this.router.navigate([NameVentana], { state: datos });
  }

  ComprobarPermisos(usuario?: Usuario): string {
    if (usuario) {
      if (usuario.rol === 0) {
        return "N";
      } else if (usuario.rol === 1) {
        return "S";
      } else {
        return "N";
      }
    } else {
      return "N";
    }
  }
}
