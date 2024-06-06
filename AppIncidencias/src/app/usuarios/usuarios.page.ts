import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../usuarios';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataServiceService } from '../data-service.service';
import { MetGenerales } from '../general';

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
  UserState !: string;
  Perm: string = "";
  Permisos: boolean = false;
  ModoInvitacion: boolean = false;

  MetodosComunes: MetGenerales = new MetGenerales(this.router, this.afAuth, this.authService);


  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email);
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.usuarioReg = usuario;
          this.CodCentro = usuario?.centro;
          this.ListarUsuarios(this.CodCentro);
          console.log(this.CodCentro)
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


      for(let us of this.ListaUsuarios){
        if(us.estado !== "invitado"){
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

  async MandarInvi(email: any) {
    
    if (!email.value) {
      
      const toast = await this.toastController.create({
        message: '¡Debes indicar un email!',
        duration: 2000,
        position: 'top',
        color: 'warning',
      });
      toast.present();
    } else {
      console.log(email.value)
      const EmailExiste = this.ListaUsuarios.some(usu => usu.email?.toLowerCase() === email.value.toLowerCase());
      if (!EmailExiste) {
        const usuario: Usuario = {
          nombre:'',
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


}
