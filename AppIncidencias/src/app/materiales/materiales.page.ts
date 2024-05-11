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
  ModoDetalles: Boolean = false;
  ToastMSG: string = '';
  TitleForm: string = '';

  material: Material = {

    familia: '',
    stock: 0,
    marca: '',
    modelo: '',
    codCentro: '',
  };
  materialVacio: Material = {

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
    newCategoria: string,
    newMarca: string,
    newModelo: string,
    newStock: number
  ) {
    const material: Material = {
      familia: newCategoria,
      stock: Number(newStock),
      marca: newMarca,
      modelo: newModelo,
      codCentro: this.CodCentro,
    };

    this.authService.GuardarCualDato(material, this.NomColeccion);

    const toast = await this.toastController.create({
      message: '¡Añadido correctamente!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    this.FormNuevoMat();
    toast.present();
  }

  async ActualizarMaterial(
    newCategoria: string,
    newMarca: string,
    newModelo: string,
    newStock: number,
    newID: any
  ) {

    try {
      console.log("Estoy en actualizar");
      const material: Material = {
        id: newID,
        familia: newCategoria,
        stock: Number(newStock),
        marca: newMarca,
        modelo: newModelo,
        codCentro: this.CodCentro,
      };

      this.authService.UpdateDatos(material, 'Materiales');

      // Muestra un Toast después de la actualización
      const toast = await this.toastController.create({
        message: '¡Técnico actualizado con éxito!',
        duration: 2000,
        position: 'top',
        color: 'success',
      });

      toast.present();

      this.listarMateriales(this.CodCentro)
      this.FormNuevoMat()
      
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
    this.TitleForm = 'Nuevo material'
    this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial;
    this.ModoDetalles = false
    this.material = this.materialVacio
    console.log("Nuevo " + this.ModoDetalles)
  }

  SelectMaterial(material: Material) {
    this.TitleForm = 'Editar material'

    this.material = material;
    this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial;
    this.ModoDetalles = true;
    console.log("Selct" + this.ModoDetalles)
  

  }

  async ComprobarVentana(
    newCategoria: any,
    newMarca: HTMLInputElement,
    newModelo: HTMLInputElement,
    newStock: HTMLInputElement,
    newID: HTMLInputElement
  ) {
    console.log(this.CodCentro)
    if (this.ModoDetalles === true) {
      console.log("Update" + this.ModoDetalles)
      this.ActualizarMaterial(newCategoria.value, newMarca.value, newModelo.value, Number(newStock.value), newID.value)
      this.ToastMSG = '¡Actualizado correctamente!'
    } else {
      console.log("Guardar" + this.ModoDetalles)
      this.NuevoMaterial(newCategoria.value, newMarca.value, newModelo.value, Number(newStock.value))
      this.ToastMSG = 'Guardado correctamente'

      newCategoria.value = "";
      newMarca.value = "";
      newModelo.value = "";
      newStock.value = "";
    }
  }

  CancelarForm() {
    this.listarMateriales(this.CodCentro)
    this.FormNuevoMat()
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
                message: '¡El técnico ha sido eliminado!',
                duration: 2000,
                position: 'top',
                color: 'danger',
              });
              toast.present();
            }
            await alert.dismiss(); // Espera a que la alerta se cierre antes de continuar
            this.listarMateriales(this.CodCentro)
            this.FormNuevoMat()
          }
        }
      ]
    });
  
    await alert.present();
  }




}
