import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../usuarios';
import { Material } from '../materiales';
import { Aula } from '../aulas';
import { IonInput, IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-nuevaincidencia',
  templateUrl: './nuevaincidencia.page.html',
  styleUrls: ['./nuevaincidencia.page.scss'],
})
export class NuevaincidenciaPage implements OnInit {
  CodCentro: any;
  UsuarioYO?: Usuario;
  VentanaTitulo: string = "";
  btnTamPantalla: any;
  ListaMateriales: Material[] = [];
  ListaAulas: Aula[] = [];
  ListaUsuarios: Usuario[] = [];
  selectedEmail !: string;
  selectedNombre ?: string;
  selectedDate ?: string;
  @ViewChild('datetime') datetime !: IonDatetime;


  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: any;

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    const navigation = window.history.state;
    this.VentanaTitulo = navigation.NameVentana;
    console.log(this.VentanaTitulo);

    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email);
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.UsuarioYO = usuario;
          this.CodCentro = usuario?.centro;
          this.selectedEmail = usuario?.email || ''; // Inicializar selectedEmail
          this.selectedNombre = usuario?.nombre || ''; // Inicializar selectedNombre

          this.listarMateriales(this.CodCentro);
          this.listarAulas(this.CodCentro);
          this.ListarUsuarios(this.CodCentro);
        });
      } else {
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

  ListarUsuarios(centro: string) {
    this.authService.DatoWhere(centro, 'Usuarios', 'centro').subscribe((res) => {
      this.ListaUsuarios = [];
      res.forEach((element: any) => {
        this.ListaUsuarios.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }

  onEmailChange(email: string) {
    const usuario = this.ListaUsuarios.find(user => user.email === email);
    if (usuario) {
      this.selectedNombre = usuario.nombre + " " + usuario.apellidos;
    }
  }

  onDateChange(event: CustomEvent) {
    this.selectedDate = event.detail.value;
  }

  NuevaIncidencia(email: any, nombre: any, aula: any, fecha: any, descripcion: any) {
    const datetimeValue = this.datetime ? this.datetime.value : null;
    console.log(email, nombre, aula, fecha, descripcion);
  }


  cancel() {
    // Implementa la lógica para cancelar la operación
  }
}
