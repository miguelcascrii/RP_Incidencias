import { Router } from "@angular/router";
import { Usuario } from "./usuarios";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from "./servicios/auth/auth.service";
import { Observable, of } from "rxjs";
import { switchMap

 } from "rxjs";
export class MetGenerales {
  CodCentro : any

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService : AuthService

  ) { }


  /**
   * Devuelve el centro al que pertenece el usuario
   * @returns Codigo de centro del usuario
   */
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



  /**
   * Metodo para crear paginación para cualquier pantalla
   */
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedItems: any[] = [];

  updatePaginatedItems(ListaMostrar: any[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = ListaMostrar.slice(startIndex, endIndex);
  }

  goToPage(page: number, ListaMostrar: any[]) {
    this.currentPage = page;
    this.updatePaginatedItems(ListaMostrar);
  }


  /**
   * 
   */

  AbrePantallasGen(vntAbrir: string, itemDetalles?: any) {
    switch (vntAbrir) {
      case "DETALLESINCIDENCIA":
        this.AbrirVentana('nuevaincidencia', 'DETALLESINCIDENCIA', itemDetalles)
        break;
      case "NUEVAINCIDENCIA":
        this.AbrirVentana('nuevaincidencia', 'NUEVAINCIDENCIA')
        break;
      case "ATENDERINCIDENCIA":
        this.AbrirVentana('atender-incidencia', 'ATENDERINCIDENCIA',itemDetalles)
        break;
      default:
        console.log("Selecciona una opción");
        break;
    }

  }

  /**
   * 
   * @param NameVentana Ventana a la que redirige
   * 
   */
  AbrirVentana(NameVentana: string, NombreDatos: string, itemDet?: any) {
    let datos
    if (itemDet !== undefined) {
      datos = { NombreDatos, itemDet };
    } else {
      datos = { NombreDatos }
    }
    this.router.navigate([NameVentana], { state: datos });
  }


  /**
   * Metodo que comprueba si hay permisos para mostrar o no ciertas
   * funcionalidades de la aplicación
   * @param usuario
   * @param rol
   * @returns S | N
   */
  ComprobarPermisos(usuario?: Usuario): string {
    console.log(usuario?.rol)
    if (usuario) {

      if (usuario?.rol === 0) {
        return "N";
      } else if (usuario?.rol === 1) {
        return "S";
      } else {
        return "N";
      }
    } else {
      return "N"
    }

  }
}
