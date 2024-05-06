import { Component } from '@angular/core';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../usuarios';
import { Centro } from '../centros';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ListaCentros: Centro[] = [];
  ListaCentrosMostrar: Centro[] = [];
  bModoCentroV: boolean = true;
  usuario: Usuario | undefined;
  ResultBusqueda: boolean = true;

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
        console.log(user.email)
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.usuario = usuario;
          if (this.usuario?.centro == '000') {
            console.log("Sin centro")
            this.bModoCentroV = false
            this.cargarCentros();
          } else {
            console.log(usuario?.centro)
            this.bModoCentroV = true
          }
        });

      } else {
        console.log('ERROR' + Error);
      }
    });
  }

  onInputChange(event: any) {
    const searchTerm = event.target.value as string;
    console.log("Término de búsqueda:", searchTerm);
    this.miMetodoDeBusqueda(searchTerm);
  }

  miMetodoDeBusqueda(searchTerm: string) {
    this.ListaCentrosMostrar = [];
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
    console.log("> " + this.ListaCentrosMostrar);
    if (searchTerm === '') {
      this.ResultBusqueda = true;
      console.log("vacio")
    } else {
      this.ResultBusqueda = false;
      console.log("letras")
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
            console.log('Confirmación aceptada');
            console.log(centroCod)
            this.AsignarCentroNewUser(centroCod)
            this.mostrarLoader();
          }
        }
      ]
    });

    await alert.present();
  }


  async AsignarCentroNewUser(
    codCentro : any
  ) {
    console.log("Estoy en actualizar");

    const usuario: Usuario = {

      id: this.usuario?.email,
      nombre: this.usuario?.nombre,
      email: this.usuario?.email,
      telefono: this.usuario?.telefono,
      foto: this.usuario?.foto,
      rol: this.usuario?.rol,
      centro: codCentro,
    };

    this.authService.AsignarCentro(usuario);
    return false;
  }

  async mostrarLoader() {
    const loading = await this.loadingController.create({
      message: 'Redirigiendo...', // Mensaje opcional
      duration: 2000, // Duración en milisegundos, o puedes usar el método dismiss para cerrarla manualmente
      translucent: true, // Hace que la barra de carga sea translúcida
      cssClass: 'custom-loader-class' // Clase CSS opcional para personalizar el estilo
    });
    await loading.present();
    this.bModoCentroV = true;
  }





}
