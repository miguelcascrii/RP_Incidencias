import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../../zClases/usuarios';
import { Centro } from '../../zClases/centros';
import { AlertController, LoadingController } from '@ionic/angular';
import { Incidencia } from 'src/app/zClases/incidencias';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  btnTamPantalla: any;
  public CodigoCentro: any;
  ListaCentros: Centro[] = [];
  ListaCentrosMostrar: Centro[] = [];
  bModoCentroV: boolean = true;
  usuario: Usuario | undefined;
  ResultBusqueda: boolean = true;
  CentroInvitado: string = "";
  ModoSoli: boolean = false;
  NombreCentroSelect: any;
  TextSolicitud: any;
  UsuMax1: any;
  Count1: any;
  UsuMax2: any;
  Count3: any;
  UsuMax3: any;
  Count2: any;
  ListaIncidencias: Incidencia[] = [];
  topThreeEmails: any[] = [];
  ListaTop3: any[] = [];
  CountAtentida: number = 0;
  CountPendiente: number = 0;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.usuario = usuario;
          if (usuario?.solicitud === 'S') {
            this.TextSolicitud = true;
            this.authService.ObtenerCentroPorCod(usuario.centro).subscribe(centro => {
              this.NombreCentroSelect = centro?.nombre;
              this.ModoSoli = true;
              this.bModoCentroV = false;
            });
          } else {
            if (this.usuario?.solicitud === 'R') {
              this.TextSolicitud = false;
              this.ModoSoli = true;
              this.bModoCentroV = false;
            } else {
              if (this.usuario?.centro == '000') {
                this.bModoCentroV = false;
                this.cargarCentros();
              } else {
                this.CodigoCentro = usuario?.centro;
                this.bModoCentroV = true;
                this.ListarIncidencias(usuario?.centro);
              }
            }
          }
        });
      } else {
        console.log('Usuario no autenticado');
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
      this.TamañoPantalla();
    });
  }

  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false;
    } else {
      this.btnTamPantalla = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.TamañoPantalla();
  }

  onInputChange(event: any) {
    const searchTerm = event.target.value as string;
    this.ListaCentrosMostrar = [];
    this.miMetodoDeBusqueda(searchTerm);
  }

  ListarIncidencias(centro: any) {
    this.authService.DatoWhere(centro, 'Incidencias', 'centro').subscribe((res) => {
      this.ListaIncidencias = [];
      res.forEach((element: any) => {
        this.ListaIncidencias.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      console.log('Lista de Incidencias:', this.ListaIncidencias);
      this.ContarIncidencias();
      this.ListaTop3 = this.obtenerTop3EmailsConIncidencias(this.ListaIncidencias);
      console.log('Top 3 emails con más incidencias:', this.ListaTop3);
    });
  }

  miMetodoDeBusqueda(searchTerm: string) {
    // Convertir el término de búsqueda a minúsculas
    const searchTermLower = searchTerm.toLowerCase();
    for (const centro of this.ListaCentros) {
      // Convertir el nombre del centro a minúsculas
      const nombreCentroLower = centro.nombre.toLowerCase();
      if (nombreCentroLower.includes(searchTermLower)) {
        // Agregar el nombre del centro
        this.ListaCentrosMostrar.push(centro);
      }
    }
    this.ResultBusqueda = searchTerm === '';
  }

  cargarCentros() {
    this.ListaCentros = [];
    this.firestore.collection<Centro>('Centros').get().subscribe(snapshot => {
      snapshot.forEach(doc => {
        this.ListaCentros.push(doc.data() as Centro);
      });
    });
  }

  CentroSelect(centroCod: String, centroNombre: String) {
    this.mostrarConfirmacion(centroNombre, centroCod);
  }

  async mostrarConfirmacion(centro: String, centroCod: String) {
    const alert = await this.alertController.create({
      header: 'Confirmación de centro',
      message: '¿Estás seguro de que deseas continuar en ' + centro + '?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirmación cancelada');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.AsignarCentroNewUser(centroCod);
          }
        }
      ]
    });

    await alert.present();
  }

  async AsignarCentroNewUser(codCentro: any) {
    const usuario: Usuario = {
      id: this.usuario?.email,
      nombre: this.usuario?.nombre,
      apellidos: '',
      email: this.usuario?.email,
      telefono: this.usuario?.telefono,
      foto: this.usuario?.foto,
      rol: this.usuario?.rol,
      departamento: '',
      centro: codCentro,
      estado: this.usuario?.estado,
      solicitud: 'S'
    };
    this.mostrarLoader(usuario);
  }

  async mostrarLoader(usuario: Usuario) {
    const loading = await this.loadingController.create({
      message: 'Mandando Solicitud...', // Mensaje opcional
      duration: 2000, // Duración en milisegundos
      translucent: true, // Hace que la barra de carga sea translúcida
      cssClass: 'custom-loader-class' // Clase CSS opcional para personalizar el estilo
    });
    await loading.present();
    await loading.onDidDismiss();

    this.authService.UpdateUsuario(usuario);
    this.ModoSoli = true;
  }

  VerCentroBusqueda() {
    this.ModoSoli = false;
    this.cargarCentros();
  }

  ContarIncidencias() {
    for (let item of this.ListaIncidencias) {
      if (item.atentida === false) {
        this.CountPendiente = this.CountPendiente + 1;
      } else if (item.atentida === true) {
        this.CountAtentida = this.CountAtentida + 1;
      }
      console.log(item.atentida);
    }
  }

  public obtenerTop3EmailsConIncidencias(listaDeIncidencias: Incidencia[]): { email: string, cantidad: number }[] {
    // Contador de incidencias por usuario
    const incidenciasPorUsuario = new Map<string, number>();

    // Contar las incidencias por usuario
    listaDeIncidencias.forEach(incidencia => {
      const emailUsuario = incidencia.email;
      if (incidenciasPorUsuario.has(emailUsuario)) {
        incidenciasPorUsuario.set(emailUsuario, incidenciasPorUsuario.get(emailUsuario)! + 1);
      } else {
        incidenciasPorUsuario.set(emailUsuario, 1);
      }
    });

    // Convertir el mapa a un array de objetos { email: string, cantidad: number }
    const usuariosConIncidencias: { email: string, cantidad: number }[] = [];
    incidenciasPorUsuario.forEach((cantidad, emailUsuario) => {
      usuariosConIncidencias.push({ email: emailUsuario, cantidad: cantidad });
    });

    // Ordenar por la cantidad de incidencias en orden descendente
    usuariosConIncidencias.sort((a, b) => b.cantidad - a.cantidad);

    // Tomar los primeros 3 usuarios y retornar el array
    return usuariosConIncidencias.slice(0, 3);
  }
}
