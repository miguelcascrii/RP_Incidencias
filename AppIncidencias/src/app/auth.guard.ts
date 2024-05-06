import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.afAuth.authState.pipe(
      map(user => {
        if (!user) {
          // Si el usuario no está autenticado, redirigirlo a la página de autenticación
          return this.router.createUrlTree(['/autenticacion']); // Ajusta la ruta según la configuración de tu proyecto
        } else {
          // Si el usuario está autenticado, permitir el acceso a la ruta solicitada
          return true;
        }
      })
    );
  }
}
