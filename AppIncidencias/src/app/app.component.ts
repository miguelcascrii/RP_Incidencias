import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './servicios/auth/auth.service';
import { Usuario } from './usuarios';
import { Platform } from '@ionic/angular';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  SesionState: boolean = false;
  usuario?: Usuario;
  CodCentro: any;
  OcultMenu: boolean = false;
  ListaUsuarios : Usuario[]= [];
  ListaSolicitudes : Usuario[]= [];
  notificationCount : any
  FaltaInfo : boolean = true

  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private platform: Platform, private router: Router) {
    this.monitorRouteChanges();
  }

  public appPages = [
    { title: 'Inicio', url: 'home', icon: 'home' },
    { title: 'Incidencias', url: 'incidencias', icon: 'alert-circle' },
    { title: 'Tecnicos', url: 'tecnicos', icon: 'people-circle' },
    { title: 'Materiales', url: 'materiales', icon: 'construct' },
  ];

  public OpsUsuario = [
    { title: 'Cuenta', url: 'info-usuario', icon: 'person-circle' },
    { title: 'Centro', url: 'centro', icon: 'business' },
    { title: 'Usuarios', url: 'usuarios', icon: 'people' }
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authService.obtenerUsuarioPorEmail(user.email).subscribe(usuario => {
          this.CodCentro = usuario?.centro;
          if (this.CodCentro !== "000") {
            if (usuario?.solicitud === "S") {
              this.SesionState = false;
            } else {
              console.log(this.CodCentro);
              this.SesionState = true;
              this.ObtenerUser();
              this.ListarSolicitudes(this.CodCentro)
              this.ComprobarDatosUsuario(usuario)
            }
          } else {
            this.SesionState = false;
          }
          console.log("Sesion: " + this.SesionState);
        });
      } else {
        this.SesionState = false;
        this.EstadoDesconectado();
        console.log("Sesion: " + this.SesionState);
      }
    });
  }

  monitorRouteChanges() {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const authenticatedRoutes = ['/autenticacion']; // Define tus rutas autenticadas aquí
        this.OcultMenu = authenticatedRoutes.includes(event.urlAfterRedirects);
        console.log('OcultMenu:', this.OcultMenu); // Esto te ayudará a depurar
      });
  }

  CerrarSesion() {
    try {
      this.authService.logout().then(() => {
        this.EstadoDesconectado();
        this.SesionState = false;
        window.location.reload();
      }).catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  EstadoDesconectado() {
    try {
      if (!this.usuario) {
        console.error("Error: Usuario no definido.");
        return;
      }
      const usuario: Usuario = {
        nombre: this.usuario.nombre || '',
        apellidos: this.usuario.apellidos || '',
        email: this.usuario.email || '',
        telefono: this.usuario.telefono || '',
        foto: this.usuario.foto || '',
        rol: typeof this.usuario.rol === 'number' ? this.usuario.rol : 0,
        departamento: this.usuario.departamento || '',
        centro: this.usuario.centro || '',
        estado: 'Desconectado'
      };

      this.authService.UpdateUsuario(usuario);
    } catch (error) {
      console.error("ERROR: " + error);
    }
  }

  EstadoConectado() {
    try {
      if (!this.usuario) {
        console.error("Error: Usuario no definido.");
        return;
      }

      const usuario: Usuario = {
        nombre: this.usuario.nombre || '',
        apellidos: this.usuario.apellidos || '',
        email: this.usuario.email || '',
        telefono: this.usuario.telefono || '',
        foto: this.usuario.foto || '',
        rol: typeof this.usuario.rol === 'number' ? this.usuario.rol : 0,
        departamento: this.usuario.departamento || '',
        centro: this.usuario.centro || '',
        estado: 'Conectado'
      };

      this.authService.UpdateUsuario(usuario);
    } catch (error) {
      console.error("ERROR: " + error);
    }
  }

  ObtenerUsuarioCentro(email: any) {
    // Aquí va tu lógica para obtener el usuario por el centro.
  }

  ObtenerUser() {
    this.authService.obtenerUsuarioPorEmail().subscribe(usuario => {
      this.usuario = usuario;
      this.ComprobarEstado();
    });
  }

  ComprobarEstado() {
    if (this.usuario) {
      this.EstadoConectado();
    }
  }

  ListarSolicitudes(centro: string) {
    this.authService.DatoWhere(centro, 'Usuarios', 'centro').subscribe((res) => {
      this.ListaUsuarios = [];
      this.ListaSolicitudes = [];
  
      res.forEach((element: any) => {
        this.ListaUsuarios.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
  
      for (let us of this.ListaUsuarios) {
        if (us.solicitud === "S") {
          this.ListaSolicitudes.push(us);
        }
      }
  
      // Contador de elementos en ListaSolicitudes
      this.notificationCount = this.ListaSolicitudes.length;
    });
  }

  ComprobarDatosUsuario(usuario ?: Usuario){
    if(!usuario?.nombre || !usuario?.apellidos || !usuario?.email || !usuario?.telefono 
      ||!usuario?.foto ||!usuario?.rol || !usuario?.departamento
     ){
      this.FaltaInfo = false
    } else {
      this.FaltaInfo = true
    }
  }
}
