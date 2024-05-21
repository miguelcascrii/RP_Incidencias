import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../usuarios';
import { AuthService } from '../servicios/auth/auth.service';
import { Auth } from 'firebase/auth';
import { DataServiceService } from '../data-service.service';
import { Centro } from '../centros';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Aula } from '../aulas';
import { Incidencia } from '../incidencias';
import { Material } from '../materiales';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-nuevaincidencia',
  templateUrl: './nuevaincidencia.page.html',
  styleUrls: ['./nuevaincidencia.page.scss'],
})
export class NuevaincidenciaPage implements OnInit {
  CodCentro : any;
  UsuarioYO ?: Usuario;
  VentanaTitulo : string = ""
  btnTamPantalla: any
  ListaMateriales: Material[] = []
  ListaAulas: Aula[] = []

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name : any;

  constructor(
    private authService : AuthService,
    private toast : ToastController,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    const navigation = window.history.state;
    this.VentanaTitulo = navigation.NameVentana;
    console.log(this.VentanaTitulo)

    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email);
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.UsuarioYO = usuario;
          this.CodCentro = usuario?.centro;

          this.listarMateriales(this.CodCentro);
          this.listarAulas(this.CodCentro)
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

  listarMateriales(centro: string) {
    this.authService.DatoWhere(centro, 'Materiales', 'codCentro').subscribe((res) => {
      this.ListaMateriales = [];
      res.forEach((element: any) => {
        this.ListaMateriales.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }

  listarAulas(centro: string) {
    this.authService.DatoWhere(centro, 'Aulas', 'codCentro').subscribe((res) => {
      this.ListaAulas = [];
      res.forEach((element: any) => {
        this.ListaAulas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }
  

  
}
