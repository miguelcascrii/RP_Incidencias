import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../../zClases/usuarios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Centro } from 'src/app/zClases/centros';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  UsuarioConect !: Usuario;
  NombreCentroInvitado : any

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private platform: Platform 

  ) {}

  // #####################################################################
  //
  // METODOS GENERALES, GUARDAR, BUSCAR POR ALGUN VALOR, EDITAR Y ELIMINAR
  //
  // #####################################################################

  //Metodo para guardar
  GuardarCualDato(dato: any, NomColeccion: string) {
    try {
      return this.firestore.collection(NomColeccion).doc(dato.id).set(dato);
    } catch (error) {
      console.log("ERROR: " + error)
      return error
    }

  }
  //Metodo de busqueda
  DatoWhere(valor: string | null = null, NomColeccion: string, CampoBuscar: string): Observable<any> {
    return this.firestore.collection<any>(NomColeccion, ref => ref.where(CampoBuscar, '==', valor)).snapshotChanges();
  }
  //Metodo para listar
  ListarDatos(NomColeccion: string): Observable<any> {
    return this.firestore.collection(NomColeccion).snapshotChanges();
  }
  /**
   * 
   * @param dato 
   * @param NomColeccion 
   */
  UpdateDatos(dato: any, NomColeccion: string) {
    try {
      this.firestore.collection(NomColeccion).doc(dato.id).update(dato);

    } catch (error) {
      console.log("ERROR" + error)
    }
  }



  /**
   * Metodo para eliminar registros
   * @param id 
   * @param NomColeccion 
   * @returns 
   */
  DeleteDatos(id: string, NomColeccion: string): Promise<any> {
    return this.firestore.collection(NomColeccion).doc(id).delete();
  }

  DeleteInci(id: any): Promise<any> {
    return this.firestore.collection('Incidencias').doc(id).delete();
  }
  // -----------------------
  //  FIN METODOS GENERALES
  // -----------------------


  // -----------------------
  //   METODOS ESPECÍFICOS
  // -----------------------

  ObtenerCentroPorCod(codCentro: string | null = null): Observable<Usuario | undefined> {
    return this.firestore.collection<Centro>('Centros', ref => ref.where('codCentro', '==', codCentro))
      .valueChanges({ idField: 'id' })
      .pipe(
        // Utiliza el operador map para transformar la lista de centros
        map(Centro => Centro.length > 0 ? Centro[0] : undefined)
      );
  }

  //
  //
  //
  //
  async ComprobarUserInvi(): Promise<boolean> {
    try {
      const result = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      if (result.user) {
        const usuarioExistente = await firstValueFrom(this.obtenerUsuarioPorEmail(result.user.email));
        return !!usuarioExistente; // Retorna true si el usuario existe, de lo contrario false
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al comprobar usuario:', error);
      return false;
    }
  }


  async loginGoogle() {
    try {
      this.logout()
      let result;
  
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        // Iniciar sesión usando el método signInWithRedirect en plataformas móviles
        await this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
        result = await this.afAuth.getRedirectResult();
      } else {
        // Iniciar sesión usando el método signInWithPopup en plataformas web
        result = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider().setCustomParameters({ 'redirect_uri': 'https://appincidencias-67ac7.web.app/autenticacion' }));
      }
  
      if (result.user) {
        const usuarioExistente = await firstValueFrom(this.obtenerUsuarioPorEmail(result.user.email));
        
        this.NombreCentroInvitado = await firstValueFrom(this.ObtenerCentroPorCod(usuarioExistente?.centro).pipe(
            map(centro => centro?.nombre)
        ));
  
        if (!usuarioExistente) {
          const usuario: Usuario = {
            nombre: result.user.displayName || '',
            apellidos: '',
            email: result.user.email || '',
            telefono: result.user.phoneNumber || '',
            foto: result.user.photoURL || '',
            rol: 0,
            departamento: '',
            centro: '000' || '',
            estado: 'Conectado',
          };
          await this.guardarUsuario(usuario);
          this.UsuarioConect = usuario;
          this.router.navigate(['home']);
        } else {
          if (usuarioExistente.estado == "invitado") {
            const usuario: Usuario = {
              nombre: result.user.displayName || '',
              apellidos: '',
              email: result.user.email || '',
              telefono: result.user.phoneNumber || '',
              foto: result.user.photoURL || '',
              rol: usuarioExistente.rol,
              departamento: '',
              centro: usuarioExistente.centro || '',
              estado: 'Conectado'
            };
  
            try {
              const alert = await this.alertController.create({
                header: 'Has sido invitado a unirte',
                message: '¿Deseas unirte a ' + this.NombreCentroInvitado + '?',
                buttons: [
                  {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                      this.logout();
                      this.DeleteUsuario(usuario.email);
                    }
                  }, {
                    text: 'Aceptar',
                    handler: () => {
                      this.UpdateUsuario(usuario);
                      this.router.navigate(['home']);
                    }
                  }
                ]
              });
              await alert.present();
            } catch (error) {
              console.error("Error al obtener el nombre del centro invitado:", error);
              const alert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo obtener el nombre del centro. Por favor, intenta de nuevo.',
                buttons: ['OK']
              });
              await alert.present();
            }
          } else {
            usuarioExistente.estado = 'Conectado';
            await this.UpdateUsuario(usuarioExistente);
            this.router.navigate(['home']);
          }
  
          this.UsuarioConect = usuarioExistente;
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  }
  



async logout(): Promise<void> {
  try {
    // Actualizar el estado del usuario a "Desconectado" antes de cerrar sesión
    if (this.UsuarioConect) {
      this.UsuarioConect.estado = 'Desconectado';
      await this.UpdateUsuario(this.UsuarioConect);
    }
    await this.afAuth.signOut();
    this.router.navigate(['/autenticacion']);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error; // Lanzar el error para que pueda ser manejado en CerrarSesion
  }
}

  private guardarUsuario(usuario: Usuario) {
    return this.firestore.collection('Usuarios').doc(usuario.email).set(usuario);
  }

  obtenerUsuarioPorEmail(email: string | null = null): Observable<Usuario | undefined> {
    return this.firestore.collection<Usuario>('Usuarios', ref => ref.where('email', '==', email))
      .valueChanges({ idField: 'id' })
      .pipe(
        // Utiliza el operador map para transformar la lista de usuarios en un solo usuario
        map(usuarios => usuarios.length > 0 ? usuarios[0] : undefined)
      );
  }

  UpdateUsuario(usuario: Usuario) {
    return this.firestore.collection("Usuarios").doc(usuario.email).update(usuario);
  }

  DeleteUsuario(email?: string): Promise<any> {
    return this.firestore.collection('Usuarios').doc(email).delete();
  }

  InvitacionUsuario(UserInvi: Usuario) {
    this.guardarUsuario(UserInvi)
  }
}

