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



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

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
            email: result.user.email || '',
            telefono: result.user.phoneNumber || '',
            foto: result.user.photoURL || '',
            rol: 0,
            centro: '000' || '',
          };
          await this.guardarUsuario(usuario);
        }
        this.router.navigate(['home']);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
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

  obtenerCentroUsuario(codigo: string | null = null): Observable<Usuario | undefined> {
    return this.firestore.collection<Usuario>('Centros', ref => ref.where('codCentro', '==', codigo))
      .valueChanges({ idField: 'id' })
      .pipe(
        // Utiliza el operador map para transformar la lista de usuarios en un solo usuario
        map(usuarios => usuarios.length > 0 ? usuarios[0] : undefined)
      );
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/autenticacion']);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Manejar el error de acuerdo a tus necesidades
    }
  }

  ObtenerCentros(): Observable<any> {
    return this.firestore.collection('Centros').snapshotChanges();
  }

  AsignarCentro(usuario: Usuario){
    console.log("Actualizar tecnico, datos", usuario.email);
    this.firestore.collection("Usuarios").doc(usuario.id).update(usuario);
  }
}