import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../servicios/auth/auth.service';
import { Usuario } from '../usuarios';
import { Centro } from '../centros';
import { Aula } from '../aulas';
import { Departamento } from '../departamentos';
import { IonModal, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { MetGenerales } from '../general';
import { Router } from '@angular/router';

@Component({
  selector: 'app-centro',
  templateUrl: './centro.page.html',
  styleUrls: ['./centro.page.scss'],
})
export class CentroPage implements OnInit {
  message = 'Modal clickado';
  usuarioYo?: Usuario;
  CodCentro: string | undefined;
  CentroUsuario: any;
  btnTamPantalla: any;
  ListaAulas: Aula[] = [];
  ListaDept: Departamento[] = [];
  isDeptModalOpen = false;
  isAulaModalOpen = false;
  MostrarAul = false
  MostrarDept = false
  isFullscreen = false;

  MetodosComunes: MetGenerales = new MetGenerales(this.router, this.afAuth, this.authService);

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('AulaModal') aulaModal!: IonModal;


  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.usuarioYo = usuario;
          this.CodCentro = usuario?.centro;

          this.authService.ObtenerCentroPorCod(this.CodCentro).subscribe(centro => {
            this.CentroUsuario = centro;
          });

          this.listarAulas(this.CodCentro);
          this.listarDept(this.CodCentro);
        });
      }
    });
    this.ObtenerCentro();
    this.TamañoPantalla();
  }
  /**
   * VERIFICA EL TAMAÑO DE LA PANTALLA
   */
  TamañoPantalla() {
    this.isFullscreen = window.innerWidth <= 768;
    if (this.isFullscreen) {
      this.btnTamPantalla = false;
      this.MostrarAul = true;
      this.MostrarDept = true;
    } else {
      this.btnTamPantalla = true;
      this.MostrarAul = false;
      this.MostrarDept = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.TamañoPantalla();
  }

  /**
  * OBTIENE EL CENTRO DEL USUARIO ACTUAL
  * @param centro 
  */
  ObtenerCentro() {
    this.authService.ObtenerCentroPorCod(this.CodCentro).subscribe(centro => {
      this.CentroUsuario = centro;
    });
  }

  /**
  * OBTIENE LOS DATOS DE AULAS Y LOS ALMACENA EN UN ARRAY
  * @param centro 
  */
  listarAulas(centro?: string) {
    this.authService.DatoWhere(centro, 'Aulas', 'codCentro').subscribe((res) => {
      this.ListaAulas = [];
      res.forEach((element: any) => {
        const aula: Aula = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        };
        this.ListaAulas.push(aula);
      });
      this.MetodosComunes.updatePaginatedItems(this.ListaAulas, 3); // Actualiza los elementos paginados
    });

  }

  /**
   * OBTIENE LOS DATOS DE DEPARTAMENTOS Y LOS ALMACENA EN UN ARRAY
   * @param centro 
   */
  listarDept(centro?: string) {
    this.authService.DatoWhere(centro, 'Departamentos', 'centro').subscribe((res) => {
      this.ListaDept = [];
      res.forEach((element: any) => {
        const departamento: Departamento = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        };
        this.ListaDept.push(departamento);
      });
      this.MetodosComunes.updatePaginatedDept(this.ListaDept, 3); // Actualiza los elementos paginados de Departamentos
    });
  }



  //METODO PARA SALIR DEL MODAL
  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.ngOnInit()

  }
  //METODO PARA SALIR DEL MODAL
  cancelAulaModal() {
    this.aulaModal.dismiss(null, 'cancel');
    this.ngOnInit()

  }


  /**
   * MUESTRA UN MENSAJE INFORMATIVO
   * @param message 
   * @param color 
   */
  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color,
    });
    toast.present();
  }

  /**
   * OBTIENE EL ROL AL SALIR DEL MODAL
   * @param event 
   */
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  /**
   * METODO PARA AGREGAR UN NUEVO DEPARTAMENTO
   * @param name 
   */
  async NuevoDpt(name: any) {
    const departName = name.value.trim();

    // Comprobar si el nombre ya existe en ListaDept
    const nombreExiste = this.ListaDept.some(departamento => departamento.nombre.toLowerCase() === departName.toLowerCase());

    if (!departName) {
      await this.presentToast('¡El campo Nombre debe ser completado!', 'warning');
    } else if (nombreExiste) {
      await this.presentToast('¡El nombre del departamento ya existe!', 'warning');
    } else {
      const depart: Departamento = {
        nombre: departName,
        centro: this.CodCentro
      };

      await this.authService.GuardarCualDato(depart, 'Departamentos');
      await this.presentToast('¡El departamento ' + depart.nombre + ' se ha agregado con éxito!', 'success');
      this.cancel();
      this.ngOnInit();
    }
  }

  /**
   * METODO PARA AGREGAR UN NUEVO AULA
   * @param numero 
   * @param planta 
   */
  async NuevaAula(numero: any, planta: any) {

    const NumeroAula = numero.value.trim();
    const PlantaAula = planta.value.trim();

    // Comprobar si el nombre ya existe en ListaDept
    const nombreExiste = this.ListaAulas.some(aula => aula.numero.toLowerCase() === NumeroAula.toLowerCase());

    if (!NumeroAula) {
      await this.presentToast('¡El campo Numero o Nombre debe ser completado!', 'warning');
    } else if (nombreExiste) {
      await this.presentToast('¡El nombre del aula ya existe!', 'warning');
    } else {
      const aula: Aula = {
        numero: numero.value,
        planta: planta.value,
        pasillo: "",
        codCentro: this.CodCentro
      };

      await this.authService.GuardarCualDato(aula, 'Aulas');
      await this.presentToast('¡El aula ' + aula.numero + ' se ha agregado con éxito!', 'success');
      this.cancelAulaModal();
      this.ngOnInit();
    }
  }

  /**
   * PAGINACION DE LOS LISTADOS
   */
  goToPage(page: number) {

    this.MetodosComunes.goToPage(page, this.ListaAulas, 3);

  }
  goToPageDept(page: number) {
    this.MetodosComunes.goToPageDept(page, this.ListaDept, 3);
  }

  /**
   * Muestra el card que contiene el listado de Aulas 
   */
  VerAulas() {
    if (!this.btnTamPantalla) {
      this.MostrarAul = !this.MostrarAul
      if (this.MostrarDept === false) {
        this.MostrarDept = true
      }
    }
  }
  /**
   * Muestra el card que contiene el listado de Departamentos 
   */
  VerDept() {
    if (!this.btnTamPantalla) {
      this.MostrarDept = !this.MostrarDept
      if (this.MostrarAul === false) {
        this.MostrarAul = true
      }
    }
  }
}
