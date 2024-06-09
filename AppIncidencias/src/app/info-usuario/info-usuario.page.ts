import { Component, OnInit,ViewChild,HostListener  } from '@angular/core';
import { Usuario } from '../usuarios';
import { AuthService } from '../servicios/auth/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Incidencia } from '../incidencias';
import { MetGenerales } from '../general';
import { IonContent } from '@ionic/angular';
import { Departamento } from '../departamentos';

@Component({
  selector: 'app-info-usuario',
  templateUrl: './info-usuario.page.html',
  styleUrls: ['./info-usuario.page.scss'],
})
export class InfoUsuarioPage implements OnInit {
  usuario?: Usuario
  CodCentro?: string = ""
  btnTamPantalla: any
  ModoEdicion: boolean = true
  TextModeEdit: String = "Editar"
  CentroUsuario : any
  ListaIncidencias : Incidencia [] = []
  ListaDpt : Departamento [] = []
  MisIncidencias : Incidencia [] = []
  VerIncidencias : boolean = false
  selectedDpt ?: string =""

  MetodosComunes: MetGenerales = new MetGenerales(this.router,this.afAuth,this.authService);
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email);
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.usuario = usuario;
          this.CodCentro = usuario?.centro;
         
          this.authService.ObtenerCentroPorCod(this.CodCentro).subscribe(centro => {
            this.CentroUsuario = centro;
          });

          this.listarIncidencias(this.CodCentro)
          this.listarDept(this.CodCentro)

          this.selectedDpt = usuario?.departamento
          
        });
      } else {
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
      this.TamañoPantalla()
    });

    

  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.TamañoPantalla();
  }

  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false
      this.VerIncidencias = true
      
    } else {
      this.btnTamPantalla = true
      this.VerIncidencias = false
    }
  }



  CancelarForm() {
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

  listarIncidencias(centro ?: string) {
    this.authService.DatoWhere(centro, 'Incidencias', 'centro').subscribe((res) => {
      this.ListaIncidencias = [];
      res.forEach((element: any) => {
        const incidencia: Incidencia = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        };
          this.ListaIncidencias.push(incidencia);
          this.MisIncidencias= []
          for(let item of this.ListaIncidencias){
            if(item.email == this.usuario?.email){
              this.MisIncidencias.push(item);
              console.log(item)
            }
          }
      });
    });
  }
  VerIncidencia(item : Incidencia){
    this.MetodosComunes.AbrePantallasGen("MISINCIDENCIAS",item,true)
  }

  btnVerIncidencias(sectionId: string) {
    this.VerIncidencias = !this.VerIncidencias;
    if (!this.VerIncidencias) {
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200); // Añade un pequeño retraso para asegurarte de que el DOM se ha actualizado
    }
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

    this.ngOnInit();
    toast.present();
    this.CancelarForm()
  }
}

