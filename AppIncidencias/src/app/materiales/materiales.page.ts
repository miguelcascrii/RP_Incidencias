import { Component, OnInit } from '@angular/core';
import { Material } from '../materiales';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../usuarios';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.page.html',
  styleUrls: ['./materiales.page.scss'],
})
export class MaterialesPage implements OnInit {

  usuario: Usuario | undefined;
  CodCentro : any
  VisualFormNuevoMaterial : Boolean = false;
  btnTamPantalla :any
  ListaMateriales : Material[] = []


  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastController : ToastController
  ) { }

  ngOnInit(): void {
    
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email);
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.usuario = usuario;
          this.CodCentro = usuario?.centro;
          this.listarMateriales();
        });
      } else {
        console.log('Usuario no autenticado');
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
      this.TamañoPantalla()
    });
  
  }

  TamañoPantalla(){
    if (window.innerWidth <= 768) {
      console.log("Dispositivo móvil");
      this.btnTamPantalla = false
    } else {
      console.log("Pantalla de escritorio");
      this.btnTamPantalla = true
    }
  }

  onResize(event: any) {
    if (event.target.innerWidth <= 768) {
      console.log("Dispositivo móvil");
    } else {
      console.log("Pantalla de escritorio");
    }
  }

  async NuevoMaterial(
    newCategoria: any,
    newMarca: HTMLInputElement,
    newModelo:HTMLInputElement,
    newStock:HTMLInputElement
  ){
    const fechaActual = new Date();
    const material: Material = {
    familia: newCategoria.value,
    stock: Number(newStock.value),
    marca: newMarca.value,
    modelo : newModelo.value,
    codCentro : this.CodCentro,
    };
    this.authService.GuardarMaterial(material);

    newCategoria.value="";
    newMarca.value="";
    newModelo.value="";
    newStock.value="";


    const toast = await this.toastController.create({
      message: '¡Añadido correctamente!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    this.FormNuevoMat();
    toast.present();
  }

  listarMateriales() {
    this.authService.ObtenerMateriales().subscribe((res) => {
      this.ListaMateriales = [];
      res.forEach((element: any) => {
        this.ListaMateriales.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }

  FormNuevoMat(){
    this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial;
  }

  

}
