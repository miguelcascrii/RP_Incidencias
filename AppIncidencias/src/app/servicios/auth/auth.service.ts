import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../../usuarios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Material } from 'src/app/materiales';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  UsuarioConect !: Usuario;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore

  ) { }

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
      console.log("ERROR: "+error)
      return error
    }
    
  }
  //Metodo de busqueda
  DatoWhere(valor: string | null = null, NomColeccion: string, CampoBuscar: string): Observable<any> {
    return this.firestore.collection<Usuario>(NomColeccion, ref => ref.where(CampoBuscar, '==', valor)).snapshotChanges();
  }
  //Metodo para listar
  ListarDatos(NomColeccion: string): Observable<any> {
    return this.firestore.collection(NomColeccion).snapshotChanges();
  }
  //Metodo para actualizar
  UpdateDatos(dato: any, NomColeccion: string) {
    try {
      this.firestore.collection(NomColeccion).doc(dato.id).update(dato);

    } catch (error) {
      console.log("ERROR" + error)
    }
  }
  //Metodo para eliminar registros
  DeleteDatos(id: string, NomColeccion: string): Promise<any> {
    return this.firestore.collection(NomColeccion).doc(id).delete();
  }
  // -----------------------
  //  FIN METODOS GENERALES
  // -----------------------


  async loginGoogle() {
    try {
      const result = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      if (result.user) {
        // Verificar si el usuario ya existe en la base de datos
        const usuarioExistente = await firstValueFrom(this.obtenerUsuarioPorEmail(result.user.email));
        if (!usuarioExistente) {
          // Si el usuario no existe, guarda los datos en la base de datos
          const usuario: Usuario = {
            nombre: result.user.displayName || '',
            apellidos:'',
            email: result.user.email || '',
            telefono: result.user.phoneNumber || '',
            foto: result.user.photoURL || '',
            rol: 0,
            departamento : '',
            centro: '000' || '',
            estado: 'Conectado'
          };
          await this.guardarUsuario(usuario);
          // Asignar el usuario conectado
          this.UsuarioConect = usuario;
        } else {
          // Si el usuario ya existe, actualizar su estado a "Conectado"
          usuarioExistente.estado = 'Conectado';
          await this.UpdateUsuario(usuarioExistente);
          // Asignar el usuario conectado
          this.UsuarioConect = usuarioExistente;
        }
        // Redirigir a la pantalla correspondiente
        this.router.navigate(['home']);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  }

  async logout() {
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
      // Manejar el error de acuerdo a tus necesidades
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

  // Otros métodos omitidos por brevedad...
}

