import { Router } from "@angular/router";
import { Usuario } from "./usuarios";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from "./servicios/auth/auth.service";
import { Observable, of } from "rxjs";
import { switchMap} from "rxjs";
import { startOfWeek, subWeeks } from 'date-fns';


export class MetGenerales {
  CodCentro : any
  UsuarioActivo ?: Usuario

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
  currentPageDpt: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageDPT: number = 5;
  paginatedItems: any[] = [];
  paginatedDept: any[] = [];

  updatePaginatedItems(ListaMostrar: any[], numberitem ?:any) {
    if(numberitem){
      this.itemsPerPage = numberitem
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = ListaMostrar.slice(startIndex, endIndex);
  }

  goToPage(page: number, ListaMostrar: any[], NumberItems ?: any) {
    this.currentPage = page;
    this.updatePaginatedItems(ListaMostrar,NumberItems);
  }

  updatePaginatedDept(ListaDept: any, numberitem ?:any) {
    if(numberitem){
      this.itemsPerPageDPT = numberitem
    }
    const startIndex = (this.currentPageDpt - 1) * this.itemsPerPageDPT;
    const endIndex = startIndex + this.itemsPerPageDPT;
    this.paginatedDept = ListaDept.slice(startIndex, endIndex);
  }
  goToPageDept(page: number, ListaDept: any, NumberItems ?: any) {
    this.currentPageDpt = page;
    this.updatePaginatedDept(ListaDept, NumberItems);
  }


  /**
   * RECOGE LA PANTALLA DE ORIGEN, PANTALLA DE DESTINO Y DATOS
   * LLAMA AL METODO AbrirVentana
   */

  AbrePantallasGen(vntAbrir: string, itemDetalles?: any, modoDetalles?: boolean) {
    switch (vntAbrir) {
      case "DETALLESINCIDENCIA":
        this.AbrirVentana('nuevaincidencia', 'DETALLESINCIDENCIA', itemDetalles, modoDetalles);
        break;
      case "MISINCIDENCIAS":
        this.AbrirVentana('nuevaincidencia', 'MISINCIDENCIAS', itemDetalles, modoDetalles);
        break
      case "NUEVAINCIDENCIA":
        this.AbrirVentana('nuevaincidencia', 'NUEVAINCIDENCIA');
        break;
      case "ATENDERINCIDENCIA":
        this.AbrirVentana('atender-incidencia', 'ATENDERINCIDENCIA', itemDetalles);
        break;
      case "MISDATOS":
        this.AbrirVentana('info-usuario', 'MISDATOS');
        break;
      case "CENTRO":
        this.AbrirVentana('centro', 'centro');
        break;
      default:
        console.log("Selecciona una opción");
        break;
    }
  }
  
  /**
   * REDIRECCIONA HACIA LA VENTANA Y MANDA DATOS
   * 
   * @param NameVentana 
   * @param NombreDatos 
   * @param itemDet 
   * @param modoDetalles 
   */
  AbrirVentana(NameVentana: string, NombreDatos: string, itemDet?: any, modoDetalles?: boolean) {
    let datos;
    if (itemDet !== undefined) {
      datos = { NombreDatos, itemDet, modoDetalles };
    } else {
      datos = { NombreDatos, modoDetalles };
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


  ListaDatos : any
  CargaChar1() {
    let ultimaFechaLunes = startOfWeek(new Date()); // Obtener la fecha del último lunes
    ultimaFechaLunes = subWeeks(ultimaFechaLunes, 1); // Restar una semana para obtener la fecha del lunes anterior
  
    let incidenciasDesdeUltimoLunes: any[] = [];
  
    this.authService.DatoWhere(this.CodCentro, 'Incidencias', 'centro').subscribe((res) => {
      this.ListaDatos = [];
      res.forEach((element: any) => {
        let incidencia = {
          id: element.payload.doc.id,
          data: element.payload.doc.data()
        };
  
        // Obtener la fecha de la incidencia y compararla con la fecha del último lunes
        let fechaIncidencia = new Date(incidencia.data.fecha); // Suponiendo que la fecha está en el objeto de incidencia como 'fecha'
        if (fechaIncidencia >= ultimaFechaLunes) {
          this.ListaDatos.push(incidencia);
          incidenciasDesdeUltimoLunes.push(incidencia);
        }
      });
  
      console.log('Incidencias desde el último lunes:', incidenciasDesdeUltimoLunes);
    });
  
    return incidenciasDesdeUltimoLunes; // Devolver el array de incidencias desde el último lunes
  }
  


}
