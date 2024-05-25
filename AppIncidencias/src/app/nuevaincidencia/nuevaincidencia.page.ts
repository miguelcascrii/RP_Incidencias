import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../usuarios';
import { Material } from '../materiales';
import { Aula } from '../aulas';
import { IonInput, IonDatetime } from '@ionic/angular';
import { Incidencia } from '../incidencias';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MetGenerales } from '../general';
import { MatAtendido } from '../matAtendidos';


@Component({
  selector: 'app-nuevaincidencia',
  templateUrl: './nuevaincidencia.page.html',
  styleUrls: ['./nuevaincidencia.page.scss'],
})
export class NuevaincidenciaPage implements OnInit {
  CodCentro: any;
  TitleVnt : String =""
  UsuarioYO?: Usuario;
  VentanaTitulo: string = "";
  btnTamPantalla: any;
  ListaMateriales: Material[] = [];
  ListaAulas: Aula[] = [];
  ListaUsuarios: Usuario[] = [];
  selectedEmail ?: string;
  selectedNombre ?: string;
  selectedDate ?: string;
  selectedAula ?: string;
  selecteDescripcion ?: string;
  IncidenciaRecib ?: Incidencia;
  ModoDetalles : boolean = false
  Permisos : boolean = false
  Perm : string = ""

  
  FormAtender : boolean = true

  @ViewChild('datetime') datetime !: IonDatetime;
  MetodosComunes: MetGenerales = new MetGenerales(this.router);


  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: any;

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private router : Router

  ) { }

  ngOnInit() {
    const navigation = window.history.state;
    this.VentanaTitulo = navigation.NombreDatos;
    this.IncidenciaRecib = navigation.itemDet

    console.log(this.IncidenciaRecib)
    

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
          this.ComprobarModo()
          this.VerPermisos()

          
        });
      } else {
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
      
      this.TamañoPantalla();
     
    });
    
  }

  VerPermisos(){
    this.Perm = this.MetodosComunes.ComprobarPermisos(this.UsuarioYO)

    
    if(this.Perm === "N"){
      this.Permisos = false
    }else{
      this.Permisos = true
    }
  }

  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false;
    } else {
      this.btnTamPantalla = true;
    }
  }

  ComprobarModo(){
    if(this.VentanaTitulo === "DETALLESINCIDENCIA"){
      this.ModoDetalles = true
      this.TitleVnt = "Detalles de Incidencia"
      this.selectedEmail = this.IncidenciaRecib?.email
      this.selectedNombre = this.IncidenciaRecib?.nombre
      this.selectedAula = this.IncidenciaRecib?.aula
      this.selectedDate = this.IncidenciaRecib?.fecha + " "
      this.selecteDescripcion = this.IncidenciaRecib?.descripcion

      console.log(this.selectedEmail)
    
  } else if(this.VentanaTitulo === "NUEVAINCIDENCIA"){
    this.ModoDetalles = false
    this.TitleVnt = "Nueva Incidencia"
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

  async NuevaIncidencia(email: any, nombre: any, aula: any, fecha: any, descripcion: any) {
    
    // Si la fecha se pasa como undefined obtendremos la fecha actual
    //ademas la formatea a YYY/MM/DD

    if (fecha === undefined || isNaN(Date.parse(fecha))) {
      const now = new Date();
      fecha = now.getFullYear() + '-' + 
              String(now.getMonth() + 1).padStart(2, '0') + '-' + 
              String(now.getDate()).padStart(2, '0');
    } else {
      const dateObj = new Date(fecha);
      fecha = dateObj.getFullYear() + '-' + 
              String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
              String(dateObj.getDate()).padStart(2, '0');
    }
  
    const incidencia : Incidencia = {
      email : email,
      nombre : nombre,
      aula : aula,
      fecha : fecha,
      descripcion : descripcion,
      atentida : false,
      comentario : "",
      centro : this.UsuarioYO?.centro || ""
    }
    try {
      this.authService.GuardarCualDato(incidencia,'Incidencias')
    const toast = await this.toastController.create({
      message: '¡La incidencia está en manos de los técnicoss!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
    this.cancel()
    

    } catch (error) {
      console.log("ERROR: " + error)
    }
    
  
  }

  cancel() {
    const datos = {NameVentana: 'NuevaInci' };
    this.router.navigate(['incidencias'], { state: datos });
    this.FormAtender = true

  }

/**
 *  METODOS Y VARIABLES DE FORMULARIO DE ATENDER INCIDENCIA 
 */
  selectComentario : string =""
  selects: { id: number, selectedValue: string }[] = [];
  nextId = 1;

  VerFormAtender(){
    if(this.FormAtender == true){
      this.FormAtender = false
    } else {
      this.FormAtender = true
    }
  }

  addSelect() {
    this.selects.push({ id: this.nextId, selectedValue: '' });
    this.nextId++;
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
}
