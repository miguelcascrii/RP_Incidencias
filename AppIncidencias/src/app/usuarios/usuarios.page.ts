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
  UserState !: string;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private router : Router
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

  ListarUsuarios(centro: string) {
    this.authService.DatoWhere(centro, this.NomColeccion, 'centro').subscribe((res) => {
      this.ListaUsuarios = [];
      res.forEach((element: any) => {
        this.ListaUsuarios.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      
    });
  }

  DetallesUser(usuario: Usuario) {
    const datos = { usuario: usuario, NameVentana: 'Usuarios' };
    this.router.navigate(['detalles-usuario'], { state: datos });
  }


}
