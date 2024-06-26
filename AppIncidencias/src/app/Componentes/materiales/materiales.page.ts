import { Component, OnInit,HostListener } from '@angular/core';
import { Material } from '../../zClases/materiales';
import { AuthService } from '../../servicios/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../../zClases/usuarios';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { MetGenerales } from '../../servicios/general';
import { Router } from '@angular/router';

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
  Perm : string = "";
  Permisos : boolean = false;

  material: Material = {

    familia: '',
    stock: 0,
    marca: '',
    modelo: '',
    codCentro: '',
  };

  MetodosComunes: MetGenerales = new MetGenerales(this.router, this.afAuth, this.authService);

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
          this.usuario = usuario;
          this.CodCentro = usuario?.centro;
          this.listarMateriales(this.CodCentro);
          console.log(this.CodCentro)
          this.VerPermisos(usuario)
        });
      } else {
        // Realiza cualquier otra acción que necesites cuando el usuario no esté autenticado
      }
      this.EditionMode = false
      this.TextModeEdit = 'Activar Modo Edición';
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.TamañoPantalla();
  }
  
  VerPermisos(usuario ?: Usuario) {
    this.Perm = this.MetodosComunes.ComprobarPermisos(usuario);
    if (this.Perm === "N") {
      this.Permisos = false;
    } else {
      this.Permisos = true;
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
try {
  if(material.familia && material.stock && material.marca && material.modelo){
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
  } else{
    const toast = await this.toastController.create({
      message: '¡Debes completar todos los campos!',
      duration: 1000,
      position: 'top',
      color: 'warning',
    });
    toast.present();
  }
} catch (error) {
  
}
    
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
      this.MetodosComunes.updatePaginatedItems(this.ListaMateriales); // Actualiza los elementos paginados

    });
  }

  FormNuevoMat() {
    this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial;
    this.ModoDetalles = false
    console.log("Vacio " + this.material)
  }

  SelectMaterial(material: Material) {
      console.log(this.Permisos)

      if(this.Permisos === true){
      this.material = material;
      this.VisualFormNuevoMaterial = !this.VisualFormNuevoMaterial;
      this.ModoDetalles = true;
      console.log("Material" + this.material)
    }
    
  

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

  goToPage(page: number) {
    this.MetodosComunes.goToPage(page, this.ListaMateriales); // Navega a la página y actualiza los elementos paginados
  }




}