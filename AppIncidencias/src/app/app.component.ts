import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './servicios/auth/auth.service';
import { Usuario } from './usuarios';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  SesionState : boolean = false;
  usuario: Usuario | null = null;
  
  constructor(private afAuth: AngularFireAuth,private authService: AuthService) {}

  public appPages = [
    { title: 'Inicio', url: 'home', icon: 'home' },
    { title: 'Usuario', url: 'info-usuario', icon: 'person' },
    { title: 'Materiales', url: 'materiales', icon: 'construct' },
    
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log('El usuario ha iniciado sesión:', user.displayName);
        this.usuario = {
          nombre: user.displayName || '',
          email: user.email || '',
          telefono: user.phoneNumber || '',
          foto: user.photoURL || '',
          rol: 0 ,
          centro : 0 || '',
        };
        this.SesionState = true;
      } else {
        console.log('El usuario no ha iniciado sesión.');
        this.SesionState = false;
      }
    });
  }

  async CerrarSesion() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
