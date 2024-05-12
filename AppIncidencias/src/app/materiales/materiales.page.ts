import { Component, OnInit } from '@angular/core';
import { Material } from '../materiales';
import { AuthService } from '../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../usuarios';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.page.html',
  styleUrls: ['./materiales.page.scss'],
})
export class MaterialesPage implements OnInit {
  NomColeccion = 'Materiales'
  usuario: Usuario | undefined;
  CodCentro: any
  VisualFormNuevoMaterial: Boolean = false;
  btnTamPantalla: any
  ListaMateriales: Material[] = []
  ModoDetalles: Boolean = true;
  ToastMSG: string = '';
  TitleForm: string = '';
  TextModeEdit : String = 'Activar Modo Edición';
  EditionMode : boolean  = false

  material: Material = {

    familia: '',
    stock: 0,
    marca: '',
    modelo: '',
    codCentro: '',
  };

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.email);
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.usuario = usuario;
          this.CodCentro = usuario?.centro;
          this.listarMateriales(this.CodCentro);
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

  async NuevoMaterial(
    newCategoria: any,
    newMarca: HTMLInputElement,
    newModelo: HTMLInputElement,
    newStock: HTMLInputElement,
  ) {
    const material: Material = {
      familia: newCategoria.value,
      stock: Number(newStock.value),
      marca: newMarca.value,
      modelo: newModelo.value,
      codCentro: this.CodCentro,
    };

    this.authService.GuardarCualDato(material, this.NomColeccion);

    const toast = await this.toastController.create({
      message: '¡Añadido correctamente!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    this.ngOnInit
    this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial
    toast.present();
  }

  async ActualizarMaterial(
    Categoria: any,
    Marca: HTMLInputElement,
    Modelo: HTMLInputElement,
    Stock: HTMLInputElement,
    ID: HTMLInputElement
  ) {

    try {
      console.log("Estoy en actualizar");
      const material: Material = {
        id: ID.value,
        familia: Categoria.value,
        stock: Number(Stock.value),
        marca: Marca.value,
        modelo: Modelo.value,
        codCentro: this.CodCentro,
      };

      this.authService.UpdateDatos(material, 'Materiales');

      // Muestra un Toast después de la actualización
      const toast = await this.toastController.create({
        message: '¡Material actualizado con éxito!',
        duration: 2000,
        position: 'top',
        color: 'success',
      });

      toast.present();
      this.ngOnInit()
      this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial;

      
    } catch (error) {
      console.log("ERROR: "+ error)
    }
    return false;
  }

  listarMateriales(centro: string) {
    this.authService.DatoWhere(centro, this.NomColeccion, 'codCentro').subscribe((res) => {
      this.ListaMateriales = [];
      res.forEach((element: any) => {
        this.ListaMateriales.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }

  FormNuevoMat() {
    this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial;
    this.ModoDetalles = false
    console.log("Vacio " + this.material)
  }

  SelectMaterial(material: Material) {
    this.material = material;
    this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial;
    this.ModoDetalles = true;
    console.log("Material" + this.material)
  

  }

  CancelarForm() {
    this.ngOnInit
    this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial
    this.EditionMode = false
    this.TextModeEdit = "Activar Modo Edición"
  }

  EliminarMaterial(material : Material){
    this.mostrarConfirmacionEliminar(material)
  }

  async mostrarConfirmacionEliminar(material: Material) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar ${material.marca} ${material.modelo}?`,
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
          //role:"cancel",
          handler: async () => {
            const idMat = material.id;
            if (idMat) {
              await this.authService.DeleteDatos(idMat,this.NomColeccion);
              const toast = await this.toastController.create({
                message: '¡El material ha sido eliminado!',
                duration: 2000,
                position: 'top',
                color: 'danger',
              });
              toast.present();
            }
            await alert.dismiss(); // Espera a que la alerta se cierre antes de continuar
            this.ngOnInit
            this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial
          }
        }
      ]
    });
  
    await alert.present();
  }

  ModoEditar(){
    
    if(this.EditionMode === true){
      this.EditionMode = false
      this.TextModeEdit = "Activar Modo Edición"
    }else{
      this.EditionMode = true
      this.TextModeEdit = "Desactivar Modo Edición"
    }
  }




}
