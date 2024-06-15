import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesUsuarioPage } from './detalles-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesUsuarioPageRoutingModule {}
