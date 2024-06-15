import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './servicios/guard/auth.guard';

const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./Componentes/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'autenticacion',
    loadChildren: () => import('./Componentes/autenticacion/autenticacion.module').then( m => m.AutenticacionPageModule),
  },
  {
    path: 'info-usuario',
    loadChildren: () => import('./Componentes/info-usuario/info-usuario.module').then( m => m.InfoUsuarioPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'materiales',
    loadChildren: () => import('./Componentes/materiales/materiales.module').then( m => m.MaterialesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./Componentes/usuarios/usuarios.module').then( m => m.TecnicosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tecnicos',
    loadChildren: () => import('./Componentes/tecnicos/tecnicos.module').then( m => m.TecnicosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalles-usuario',
    loadChildren: () => import('./Componentes/detalles-usuario/detalles-usuario.module').then( m => m.DetallesUsuarioPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'incidencias',
    loadChildren: () => import('./Componentes/incidencias/incidencias.module').then( m => m.IncidenciasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevaincidencia',
    loadChildren: () => import('./Componentes/nuevaincidencia/nuevaincidencia.module').then( m => m.NuevaincidenciaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'atender-incidencia',
    loadChildren: () => import('./Componentes/atender-incidencia/atender-incidencia.module').then( m => m.AtenderIncidenciaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'centro',
    loadChildren: () => import('./Componentes/centro/centro.module').then( m => m.CentroPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
