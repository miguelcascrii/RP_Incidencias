import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './servicios/auth/auth.service';
import { Usuario } from './usuarios';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  SesionState: boolean = false;
  usuario?: Usuario;

  constructor(private afAuth: AngularFireAuth, private authService: AuthService,private platform: Platform) {
   // this.initializeApp();
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
        this.SesionState = true;
        this.ObtenerUser();
      } else {
        this.SesionState = false;
        this.EstadoDesconectado();
      }
    });
  }

  CerrarSesion() {
    try {
      this.SesionState = false;
      this.authService.logout();
      this.EstadoDesconectado(); // Llamamos al método EstadoDesconectado() al cerrar sesión
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
}
