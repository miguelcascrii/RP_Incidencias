import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../usuarios';
import { Centro } from '../centros';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChartComponent } from 'ng-apexcharts';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  btnTamPantalla : any
  public CodigoCentro: any;
  ListaCentros: Centro[] = [];
  ListaCentrosMostrar: Centro[] = [];
  bModoCentroV: boolean = true;
  usuario: Usuario | undefined;
  ResultBusqueda: boolean = true;
  CentroInvitado: string = ""
  ModoSoli: boolean = false
  NombreCentroSelect: any
  TextSolicitud: any
  @ViewChild('miCanvas') miCanvas !: ElementRef<HTMLCanvasElement>;

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
            this.TextSolicitud = true
            this.authService.ObtenerCentroPorCod(usuario.centro).subscribe(centro => {
              this.NombreCentroSelect = centro?.nombre
              this.ModoSoli = true
              this.bModoCentroV = false
            });

          } else {
            if (this.usuario?.solicitud === 'R') {
              this.TextSolicitud = false
              this.ModoSoli = true
              this.bModoCentroV = false
            } else {
              if (this.usuario?.centro == '000') {
                this.bModoCentroV = false;
                this.cargarCentros();
              } else {
                this.CodigoCentro = usuario?.centro;
                this.bModoCentroV = true
              }
            }
          }
        });
      } else {
        console.log('Usuario no autenticado');
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
      this.TamañoPantalla()
    });
  }

  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false;
    } else {
      this.btnTamPantalla = true;
    }
  }

  onInputChange(event: any) {
    const searchTerm = event.target.value as string;
    this.ListaCentrosMostrar = [];
    this.miMetodoDeBusqueda(searchTerm);
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
    if (searchTerm === '') {
      this.ResultBusqueda = true;

    } else {
      this.ResultBusqueda = false;

    }
  }

  cargarCentros() {
    this.ListaCentros = []
    this.firestore.collection<Centro>('Centros').get().subscribe(snapshot => {
      snapshot.forEach(doc => {
        this.ListaCentros.push(doc.data() as Centro);
      });
    });
  }

  CentroSelect(centroCod: String, centroNombre: String) {

    this.mostrarConfirmacion(centroNombre, centroCod)

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

            this.AsignarCentroNewUser(centroCod)

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
    this.mostrarLoader(usuario)

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
    this.ModoSoli = true
  }

  VerCentroBusqueda() {
    this.ModoSoli = false;
    this.cargarCentros();
  }






}
