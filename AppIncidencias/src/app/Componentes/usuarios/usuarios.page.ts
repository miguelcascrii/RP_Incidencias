import { Component, OnInit,HostListener } from '@angular/core';
import { AuthService } from '../../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../../zClases/usuarios';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataServiceService } from '../../data-service.service';
import { MetGenerales } from '../../servicios/general';

@Component({
  selector: 'app-tecnicos',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class TecnicosPage implements OnInit {
  NomColeccion = 'Usuarios'
  btnTamPantalla: any
  CodCentro: any
  usuarioReg: Usuario | undefined;
  ListaUsuarios: Usuario[] = []
  ListaUsuariosSinInvi: Usuario[] = []
  ListaSolicitudes: Usuario[] = []
  UserState !: string;
  Perm: string = "";
  Permisos: boolean = false;
  ModoInvitacion: boolean = false;
  TextIconSoli: string = ""
  MostrarSolicitudes: boolean = false
  notificationCount: number = -1
  MetodosComunes: MetGenerales = new MetGenerales(this.router, this.afAuth, this.authService);
  message: any

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit(): void {
    try {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
            this.usuarioReg = usuario;
            this.CodCentro = usuario?.centro;
            this.ListarUsuarios(this.CodCentro);
            this.ListarSolicitudes(this.CodCentro)
            this.VerPermisos(usuario)
          });
        } else {
          // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
        }
        this.TamañoPantalla()
      });
    } catch (error) {
      
    }
    

  }
  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false
      this.TextIconSoli = ""
    } else {
      this.btnTamPantalla = true
      this.TextIconSoli = "Solicitudes"
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.TamañoPantalla();
  }

  VerPermisos(usuario?: Usuario) {
    this.Perm = this.MetodosComunes.ComprobarPermisos(usuario);
    if (this.Perm === "N") {
      this.Permisos = false;
    } else {
      this.Permisos = true;
    }
  }

  ListarUsuarios(centro: string) {
    this.authService.DatoWhere(centro, this.NomColeccion, 'centro').subscribe((res) => {
      this.ListaUsuarios = [];
      this.ListaUsuariosSinInvi = []
      res.forEach((element: any) => {
        this.ListaUsuarios.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      for (let us of this.ListaUsuarios) {
        if (us.estado !== "invitado" && us.solicitud !== "S") {
          this.ListaUsuariosSinInvi.push(us)
        }
      }
    });
  }

  DetallesUser(usuario: Usuario) {
    const datos = { usuario: usuario, NameVentana: 'Usuarios' };
    this.router.navigate(['detalles-usuario'], { state: datos });
  }

  btnModoInvi() {
    this.ModoInvitacion = true
  }

  /**
   * METODO PARA INVITAR A USUARIO
   * @param email 
   */
  async MandarInvi(email: any) {
    //Comprobación que ha introducido un email
    if (!email.value) {
      const toast = await this.toastController.create({
        message: '¡Debes indicar un email!',
        duration: 2000,
        position: 'top',
        color: 'warning',
      });
      toast.present();
    } else {
      //Comprobación de que exista el email
      const EmailExiste = this.ListaUsuarios.some(usu => usu.email?.toLowerCase() === email.value.toLowerCase());
      if (!EmailExiste) {
        const usuario: Usuario = {
          nombre: '',
          apellidos: '',
          email: email.value,
          telefono: '',
          foto: '',
          rol: 0,
          departamento: '',
          centro: this.CodCentro,
          estado: 'invitado'
        };
        this.authService.InvitacionUsuario(usuario)
        const toast = await this.toastController.create({
          message: '¡El usuario ha sido invitado!',
          duration: 2000,
          position: 'top',
          color: 'success',
        });
        toast.present();
        this.ModoInvitacion = false
      } else {
        const toast = await this.toastController.create({
          message: '¡Este usuario ya existe!',
          duration: 2000,
          position: 'top',
          color: 'warning',
        });
        toast.present();
      }
    }
  }

  /**
   * OCULTAR O MOSTRAR FORM DE INVITACION
   */
  CancelarForm() {
    this.ModoInvitacion = !this.ModoInvitacion
  }


  //####### GESTION DE SOLICITUDES DE ACCESO AL CENTRO #######

  /**
   * ABRIR LISTADO
   */
  async GestSolicitudes() {
    if(this.notificationCount <= 0){
      const toast = await this.toastController.create({
        message: '¡No hay solicitudes en este momento!',
        duration: 1500,
        position: 'top',
        color: 'medium',
      });
      await toast.present();
    } else {
      this.MostrarSolicitudes = true
    }

   
  }

  /**
   * CERRAR LISTADO
   */
  CerrarSolicitudes() {
    this.MostrarSolicitudes = false
  }

  /**
   * CARGAR SOLICITUDES EN UN ARRAY
   * @param centro 
   */
  ListarSolicitudes(centro: string) {
    this.authService.DatoWhere(centro, this.NomColeccion, 'centro').subscribe((res) => {
      this.ListaUsuarios = [];
      this.ListaSolicitudes = [];
  
      res.forEach((element: any) => {
        this.ListaUsuarios.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
  
      for (let us of this.ListaUsuarios) {
        if (us.solicitud === "S") {
          this.ListaSolicitudes.push(us);
        }
      }
  
      // Contador de elementos en ListaSolicitudes
      this.notificationCount = this.ListaSolicitudes.length;
    });
  }
  

  /**
   * ACCIONES DE ACEPTAR O DENEGAR SOLICITUD
   * @param usuario 
   * @param Modobtn RECIBE [ACEPT] O [CANCEL]
   */
  async ActionSolicitud(usuario: Usuario, Modobtn: any) {

    if (Modobtn === "ACEPT") {
      this.message = "¿Confirmas aceptar la solicitud?"
    } else if (Modobtn === "CANCEL") {
      this.message = "¿Confirmas rechazar la solicitud?"
    }

    const alert = await this.alertController.create({
      header: 'CONFIRMACIÓN',
      message: this.message,
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
          text: 'Confirmar',
          handler: async () => {

            //BOTON MODO ACEPTAR
            if (Modobtn === "ACEPT") {
              if (usuario?.email) {
                const usuAcept: Usuario = {
                  id: usuario?.email,
                  nombre: usuario?.nombre,
                  apellidos: usuario?.apellidos,
                  email: usuario?.email,
                  telefono: usuario?.telefono,
                  foto: usuario?.foto,
                  rol: usuario?.rol,
                  departamento: '',
                  centro: usuario.centro,
                  estado: usuario?.estado,
                  solicitud: 'N'
                };
                await this.authService.UpdateUsuario(usuAcept);
                const toast = await this.toastController.create({
                  message: '¡Solicitud Aceptada!',
                  duration: 1000,
                  position: 'top',
                  color: 'warning',
                });
                await toast.present();
              }
              //BOTÓN MODO CANCELAR
            } else if (Modobtn === "CANCEL") {
              if (usuario?.email) {
                const usuAcept: Usuario = {
                  id: usuario?.email,
                  nombre: usuario?.nombre,
                  apellidos: usuario?.apellidos,
                  email: usuario?.email,
                  telefono: usuario?.telefono,
                  foto: usuario?.foto,
                  rol: 0,
                  departamento: '',
                  centro: '000',
                  estado: usuario?.estado,
                  solicitud : 'R'
                };
                await this.authService.UpdateUsuario(usuAcept);
                const toast = await this.toastController.create({
                  message: '¡Solicitud rechazada!',
                  duration: 1000,
                  position: 'top',
                  color: 'warning',
                });
                await toast.present();
              }
            }
            await alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

}


