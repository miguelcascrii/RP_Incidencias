import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../usuarios';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataServiceService } from '../data-service.service';
import { MetGenerales } from '../general';

@Component({
  selector: 'app-tecnicos',
  templateUrl: './tecnicos.page.html',
  styleUrls: ['./tecnicos.page.scss'],
})
export class TecnicosPage implements OnInit {
  NomColeccion = 'Usuarios'
  btnTamPantalla: any
  CodCentro: any
  usuarioReg: Usuario | undefined;
  ListaUsuarios: Usuario[] = []
  ListaTecnicos: Usuario[] = []
  ListaNOTecnicos : Usuario[] = []
  UserState !: string;
  VisualTecNuevo : Boolean = true
  NameVentana !: string;

  Perm : string = "";
  Permisos : boolean = false;

  MetodosComunes: MetGenerales = new MetGenerales(this.router, this.afAuth, this.authService);

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private navCtrl: NavController, 
    private router: Router,
    private dataService: DataServiceService
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email);
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.usuarioReg = usuario;
          this.CodCentro = usuario?.centro;
          this.ListarUsuarios(this.CodCentro);
          this.VerPermisos(usuario)
        });
      } else {
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
     
      this.TamañoPantalla()
    });
  }

  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false
    } else {
      this.btnTamPantalla = true
    }
  }

  VerPermisos(usuario ?: Usuario) {
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
      res.forEach((element: any) => {
        this.ListaUsuarios.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      this.BuscarTecnicos()
    });
  }

  BuscarTecnicos(){
    this.ListaNOTecnicos = []
    this.ListaTecnicos = []
    for(let item of this.ListaUsuarios)
      if(item.rol === 1){
        this.ListaTecnicos.push(item)
      } else if(item.rol === 0){
        this.ListaNOTecnicos.push(item)
      }
  }

  btnNuevoTecnico(){
    this.VisualTecNuevo = !this.VisualTecNuevo
  }

  SelectUsuario(userSelect : Usuario){
    this.ConfirmNuevoTecnico(userSelect)
  }


  async ConfirmNuevoTecnico(usuario: Usuario) {
    const alert = await this.alertController.create({
      header: 'Convertir a técnico',
      message: `¿Estás seguro de que deseas hacer tecnico a ${usuario.email}?`,
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
          text: 'Estoy seguro',
          //role:"cancel",
          handler: async () => {
            const user = usuario.email;
            if (user) {
              await this.AsignarRole(usuario);
              const toast = await this.toastController.create({
                message: '¡Enhorabuena,'+ usuario.nombre +' es un nuevo técnico!',
                duration: 2000,
                position: 'top',
                color: 'success',
              });
              toast.present();
            }
            await alert.dismiss(); // Espera a que la alerta se cierre antes de continuar
            this.ngOnInit
            this.VisualTecNuevo = !this.VisualTecNuevo
          }
        }
      ]
    });
    await alert.present();
  }

  AsignarRole(UserUpdate : Usuario){
    const usuario : Usuario = {
      nombre : UserUpdate.nombre,
      apellidos : UserUpdate.apellidos,
      email : UserUpdate.email,
      departamento :  UserUpdate.departamento,
      rol : 1,
      telefono : UserUpdate.telefono,
      foto : UserUpdate.foto,
      centro : UserUpdate.centro,
      estado : UserUpdate.estado
    }

    this.authService.UpdateUsuario(usuario)

  }
  DetallesUser(usuario: Usuario) {
    const datos = { usuario: usuario, NameVentana: 'Tecnicos' };
    this.router.navigate(['detalles-usuario'], { state: datos });
  }

  

  


}
