import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../usuarios';
import { MatCantidad, Material } from '../materiales';
import { Aula } from '../aulas';
import { IonInput, IonDatetime } from '@ionic/angular';
import { Incidencia } from '../incidencias';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MetGenerales } from '../general';
import { AlertController } from '@ionic/angular';



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
  ListaMatAtentida : MatCantidad[] = []
  selectedEmail ?: string;
  selectedNombre ?: string;
  selectedDate ?: string;
  selectedAula ?: string;
  selecteDescripcion ?: string;
  selectedID ?: string
  selectedComent ?: string
  IncidenciaRecib ?: Incidencia;
  ModoDetalles : boolean = false
  Permisos : boolean = false
  Perm : string = ""
  estAtentida : boolean = false

  @ViewChild('datetime') datetime !: IonDatetime;
  MetodosComunes: MetGenerales = new MetGenerales(this.router,this.afAuth,this.authService,);


  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: any;

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private router : Router,
    private alertController: AlertController


  ) { }

  ngOnInit() {
    const navigation = window.history.state;
    this.VentanaTitulo = navigation.NombreDatos;
    this.IncidenciaRecib = navigation.itemDet
    if(this.IncidenciaRecib?.atentida === false){
      this.estAtentida = false
    }else{
      this.estAtentida = true
    }
    
      

    console.log(this.IncidenciaRecib)
    

    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email);
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.UsuarioYO = usuario;
          this.CodCentro = usuario?.centro;
          this.selectedEmail = usuario?.email || ''; // Inicializar selectedEmail
          this.selectedNombre = usuario?.nombre || ''; // Inicializar selectedNombre
          
          this.listarAulas(this.CodCentro);
          this.ListarUsuarios(this.CodCentro);
          this.ComprobarModo()
          this.VerPermisos()
          this.ListarMatUtilizados(this.IncidenciaRecib?.id)
         
          
          
        });
      } else {
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
      this.TamañoPantalla();
      
    });
    
  }
  ComprobarEstadoInci(){
    if(this.IncidenciaRecib?.atentida === false){
      this.estAtentida = false
     
    }else{
      this.estAtentida = true
    }
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
      this.selectedID = this.IncidenciaRecib?.id
      this.selectedEmail = this.IncidenciaRecib?.email
      this.selectedNombre = this.IncidenciaRecib?.nombre
      this.selectedAula = this.IncidenciaRecib?.aula
      this.selectedDate = this.IncidenciaRecib?.fecha + " "
      this.selecteDescripcion = this.IncidenciaRecib?.descripcion
      this.selectedComent = this.IncidenciaRecib?.comentario

      console.log(this.selectedEmail)
    
  } else if(this.VentanaTitulo === "NUEVAINCIDENCIA"){
    this.ModoDetalles = false
    this.TitleVnt = "Nueva Incidencia"
  }
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
      tecnico : "",
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
  }

  VerFormAtender(){
    this.MetodosComunes.AbrePantallasGen("ATENDERINCIDENCIA",this.IncidenciaRecib)
  }
  async eliminarInci(){
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar esta incidencia?`,
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
          text: 'Eliminar',
          handler: async () => {
            if (this.selectedID) {
              await this.authService.DeleteInci(this.selectedID)
              const toast = await this.toastController.create({
                message: '¡La incidencia ha sido eliminada!',
                duration: 2000,
                position: 'top',
                color: 'danger',
              });
              await toast.present();
              this.cancel();  
            }
            await alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  ListarMatUtilizados(incidencia ?: string) {
    this.authService.DatoWhere(incidencia, 'MatCanAtendida', 'incidencia').subscribe((res) => {
      this.ListaMatAtentida = [];
      res.forEach((element: any) => {
        this.ListaMatAtentida.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });

  
  }


}
