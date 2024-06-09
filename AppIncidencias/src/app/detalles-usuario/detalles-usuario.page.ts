import { Component, OnInit,HostListener } from '@angular/core';
import { Usuario } from '../usuarios';
import { AuthService } from '../servicios/auth/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MetGenerales } from '../general';
import { Departamento } from '../departamentos';
@Component({
  selector: 'app-detalles-usuario',
  templateUrl: './detalles-usuario.page.html',
  styleUrls: ['./detalles-usuario.page.scss'],
})
export class DetallesUsuarioPage implements OnInit {

  VentanaTitulo: string = ""
  usuario?: Usuario;
  usuarioYo ?: Usuario;
  CentroUsuario: any //Tipo Centro
  CodCentro: string | undefined
  ModoEdicion: boolean = true
  TextModeEdit : string = "Activar Modo Edición"
  btnTamPantalla: any
  DeleteTecnico?: Usuario
  btnTitleEliminar : string = "Eliminar"
  Perm : string = "";
  Permisos : boolean = false;
  ListaDpt : Departamento [] = []
  selectedDpt ?: string = ""

  MetodosComunes: MetGenerales = new MetGenerales(this.router, this.afAuth, this.authService);

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private afAuth : AngularFireAuth
  ) { }

  ngOnInit(): void {
    const navigation = window.history.state;
    this.usuario = navigation.usuario;
    this.VentanaTitulo = navigation.NameVentana;
    this.CodCentro = this.usuario?.centro
    this.btnTitleEliminar =""

    if(this.usuario?.rol == 0){
      this.btnTitleEliminar = "Eliminar Usuario"
    } else {
      this.btnTitleEliminar = "Eliminar de Técnicos"
    }

    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email);
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.usuarioYo = usuario;
          
          this.VerPermisos(this.usuarioYo)

          this.listarDept(this.CodCentro)
          this.selectedDpt = this.usuario?.departamento
        });
      } else {
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
    });
    
    this.authService.ObtenerCentroPorCod(this.CodCentro).subscribe(centro => {
      this.CentroUsuario = centro;
      console.log(this.CentroUsuario);
      
    });
    
    this.TamañoPantalla()
  }
  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false
    } else {
      this.btnTamPantalla = true
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.TamañoPantalla();
  }

  listarDept(centro ?: string) {
    this.authService.DatoWhere(centro, 'Departamentos', 'centro').subscribe((res) => {
      this.ListaDpt = [];
      res.forEach((element: any) => {
        const dept: Departamento = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        };
          this.ListaDpt.push(dept);
      });
    });
  }

  VerPermisos(usuario ?: Usuario) {
    this.Perm = this.MetodosComunes.ComprobarPermisos(usuario);
    if (this.Perm === "N") {
      this.Permisos = false;
    } else {
      this.Permisos = true;
    }
   console.log(this.Permisos)
  }

  CancelarForm() {

    if (this.VentanaTitulo == 'Tecnicos') {
      this.router.navigate(['tecnicos']);
    } else if (this.VentanaTitulo == 'Usuarios') {
      this.router.navigate(['usuarios']);
    }
    this.ModoEdicion = true
    this.TextModeEdit = "Activar Modo Edición"
  }

  ModoEditar() {

    if (this.ModoEdicion === true) {
      this.TextModeEdit = "Desactivar Modo Edición"
      this.ModoEdicion = false
    
    } else {
      this.TextModeEdit = "Activar Modo Edición"
      this.ModoEdicion = true
    }

    console.log(this.ModoEdicion)
  }

  async ActualizarUsuario(
    id: HTMLInputElement,
    email: HTMLInputElement,
    nombre: HTMLInputElement,
    apellidos: HTMLInputElement,
    telefono: HTMLInputElement,
    rol: HTMLInputElement,
    departamento: any,
  ) {
    const usuarioUp: Usuario = {
      id: id.value,
      email: email.value,
      nombre: nombre.value,
      apellidos: apellidos.value,
      telefono: telefono.value,
      rol: this.usuario?.rol,
      departamento: departamento.value
    }

    this.authService.UpdateUsuario(usuarioUp)
    const toast = await this.toastController.create({
      message: '¡' + this.usuario?.nombre + ' ha sido actualizado!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });

    this.CancelarForm();
    toast.present();
  }

  btnEliminar() {
    if (this.VentanaTitulo == 'Tecnicos') {
      this.EliminarDeTecnicos()
    } else if (this.VentanaTitulo == 'Usuarios') {
      this.DeleteUsuario()
    }
  }

  async EliminarDeTecnicos() {

    const DeleteTecnico: Usuario = {
      id: this.usuario?.id,
      email: this.usuario?.email,
      nombre: this.usuario?.nombre,
      apellidos: this.usuario?.apellidos,
      telefono: this.usuario?.telefono,
      rol: 0,
      departamento: this.usuario?.departamento
    }
  
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación de técnicos',
      message: `¿Estás seguro de que deseas eliminar ${this.usuario?.nombre} ${this.usuario?.apellidos} de tecnicos?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            if (this.usuario?.email) {
              await this.authService.UpdateUsuario(DeleteTecnico)
              const toast = await this.toastController.create({
                message: `¡${this.usuario?.nombre} ${this.usuario?.apellidos} ha sido eliminado de técnicos!`,
                duration: 2000,
                position: 'top',
                color: 'danger',
              });
              toast.present();
              this.CancelarForm();  // Mover aquí la llamada
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async DeleteUsuario(){
    this.mostrarConfirmacionEliminar()
  }


  async mostrarConfirmacionEliminar() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar ${this.usuario?.nombre} ${this.usuario?.apellidos}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            if (this.usuario?.email) {
              await this.authService.DeleteUsuario(this.usuario?.email);
              const toast = await this.toastController.create({
                message: '¡El usuario ha sido eliminado!',
                duration: 2000,
                position: 'top',
                color: 'danger',
              });
              await toast.present();
              this.CancelarForm();  // Mover aquí la llamada
            }
            await alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
  

}
