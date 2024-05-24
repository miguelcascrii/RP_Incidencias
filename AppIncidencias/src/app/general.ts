import { Router } from "@angular/router";
import { Usuario } from "./usuarios";

export class MetGenerales {
    

    constructor(
        private router : Router,
    ){}


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

    AbrePantallasGen(vntAbrir : string, itemDetalles ?: any){
        switch (vntAbrir) {
            case "DETALLESINCIDENCIA":
              this.AbrirVentana('nuevaincidencia','DETALLESINCIDENCIA',itemDetalles)
              break;
            case "NUEVAINCIDENCIA":
                this.AbrirVentana('nuevaincidencia','NUEVAINCIDENCIA')
              break;
            case "opcion3":
              console.log("Seleccionaste la Opción 3");
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
    AbrirVentana(NameVentana : string,NombreDatos : string,itemDet ?: any){
      let datos 
      if (itemDet !== undefined) {
        datos = {NombreDatos,itemDet};
        
      } else{
        datos = {NombreDatos}
      }
        //this.router.navigate([NameVentana], { state: datos });
        this.router.navigate([NameVentana], { state: datos });
    }


    /**
     * Metodo que comprueba si hay permisos para mostrar o no ciertas
     * funcionalidades de la aplicación
     * @param usuario
     * @param rol
     * @returns S | N
     */
    ComprobarPermisos(usuario ?: Usuario): string {
      console.log(usuario?.rol)
      if(usuario){
        
      if (usuario?.rol  === 0 ) {
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
