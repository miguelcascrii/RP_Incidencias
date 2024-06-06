import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth/auth.service';
import { Material } from '../materiales';
import { MetGenerales } from '../general';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatCantidad } from '../materiales';
import { Incidencia } from '../incidencias';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-atender-incidencia',
  templateUrl: './atender-incidencia.page.html',
  styleUrls: ['./atender-incidencia.page.scss'],
})
export class AtenderIncidenciaPage implements OnInit {
  ListaMateriales: Material[] = [];
  CodCentro: any;
  results: Material[] = [];
  ListaMatAtend: MatCantidad[] = []; // Cambiar el tipo de datos a MatCantidad[]
  buscador: boolean = true;
  MostrarListaMatAtend: boolean = false;
  CantidadMat: number = 0;
  VentanaTitulo: string = ""
  IncidenciaRecib !: Incidencia
  btnTamPantalla: any;
  Perm : string = "";
  Permisos : boolean = false;


  MetodosComunes: MetGenerales = new MetGenerales(this.router, this.afAuth, this.authService);

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    const navigation = window.history.state;
    this.VentanaTitulo = navigation.NombreDatos;
    this.IncidenciaRecib = navigation.itemDet
    this.MetodosComunes.ObtenerCodCentro().subscribe(codCentro => {
      this.CodCentro = codCentro;
      console.log(this.CodCentro);
      this.listarMateriales(this.CodCentro);
      this.ComprobarListaMatAtent();
      this.TamañoPantalla()
    });

  }
  TamañoPantalla() {
    if (window.innerWidth <= 768) {
      this.btnTamPantalla = false;
    } else {
      this.btnTamPantalla = true;
    }
  }

  VerPermisos() {
    this.Perm = this.MetodosComunes.ComprobarPermisos();
    if (this.Perm === "N") {
      this.Permisos = false;
    } else {
      this.Permisos = true;
    }
  }


  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.ListaMateriales.filter(material =>
      material.marca.toLowerCase().includes(query) ||
      material.modelo.toLowerCase().includes(query) ||
      material.familia.toLowerCase().includes(query)
    );
  }

  ComprobarListaMatAtent() {
    this.MostrarListaMatAtend = this.ListaMatAtend.length === 0; // Verifica si ListaMatAtend está vacía
  }

  FormBuscadorMat() {
    this.buscador = false;
  }

  listarMateriales(centro: string) {
    this.authService.DatoWhere(centro, 'Materiales', 'codCentro').subscribe((res) => {
      this.ListaMateriales = [];
      res.forEach((element: any) => {
        const material: Material = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),

        };
        if (material.stock > 0) {
          this.ListaMateriales.push(material);
        }
      });
      this.results = [...this.ListaMateriales]; // Inicializar results con todos los materiales
    });
  }

  cancel() {
    this.router.navigate(['nuevaincidencia'], {
      state: { NombreDatos: 'DETALLESINCIDENCIA', itemDet: this.IncidenciaRecib, modoDetalles: true }
    });
  }

  SelectMaterial(material: Material) {
    const index = this.ListaMatAtend.findIndex(matAtend => matAtend.material.id === material.id);

    if (index === -1) {
      const matConCantidad: MatCantidad = {
        incidencia: '1', // Ajusta según sea necesario
        material: material,
        cantidad: 1 // Inicializa la cantidad en 1
      };
      this.ListaMatAtend.push(matConCantidad);
    } else {
      this.ListaMatAtend[index].cantidad++; // Incrementa la cantidad si el material ya está en la lista
    }

    this.ComprobarListaMatAtent();
  }

  cerrarBuscador() {
    this.buscador = true;
  }

  addMaterial(material: MatCantidad) {
    material.cantidad++;
  }

  removeMaterial(material: MatCantidad) {
    if (material.cantidad > 0) {
      material.cantidad--;
    }
  }

  async GuardarAtendida(comentario: any) {
    let stockmenor = true;

    for (let item of this.ListaMatAtend) {
      const matcanti: MatCantidad = {
        incidencia: this.IncidenciaRecib?.id,
        material: item.material,
        cantidad: item.cantidad
      };

      if (matcanti.material.stock < matcanti.cantidad) {
        stockmenor = false;
        const toast = await this.toastController.create({
          message: 'El stock de ' + matcanti.material.marca  + ' ' + matcanti.material.modelo + ' es inferior a la cantidad deseada',
          duration: 2400,
          position: 'bottom',
          color: 'warning',
        });
        toast.present();
      } else {
        stockmenor = true;
        const material: Material = {
          id: matcanti.material.id,
          familia: matcanti.material.familia,
          stock: Number(matcanti.material.stock) - matcanti.cantidad,
          marca: matcanti.material.marca,
          modelo: matcanti.material.modelo,
          codCentro: matcanti.material.codCentro
        };

        try {
          await this.authService.UpdateDatos(material, 'Materiales');
          await this.authService.GuardarCualDato(matcanti, 'MatCanAtendida');
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (stockmenor == true) {
      const incidencia: Incidencia = {
        id: this.IncidenciaRecib.id,
        email: this.IncidenciaRecib.email,
        nombre: this.IncidenciaRecib.nombre,
        aula: this.IncidenciaRecib.aula,
        fecha: this.IncidenciaRecib.fecha,
        descripcion: this.IncidenciaRecib.descripcion,
        atentida: true,
        comentario: comentario.value,
        tecnico: "",
        centro: this.IncidenciaRecib.centro || ""
      };
      try {
        await this.authService.UpdateDatos(incidencia, 'Incidencias');
        const toast = await this.toastController.create({
          message: '¡La incidencia ha sido solucionada!',
          duration: 2000,
          position: 'top',
          color: 'success',
        });
        toast.present();

        // Navegar de vuelta a la página de detalles con los datos actualizados
        this.router.navigate(['nuevaincidencia'], {
          state: { NombreDatos: 'DETALLESINCIDENCIA', itemDet: incidencia, modoDetalles: true }
        });
      } catch (error) {
        console.log("ERROR: " + error);
      }
    }
  }
  
}
