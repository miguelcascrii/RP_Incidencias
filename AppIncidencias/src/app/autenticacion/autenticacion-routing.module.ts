import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutenticacionPage } from './autenticacion.page';

const routes: Routes = [
  {
    path: '',
    component: AutenticacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutenticacionPageRoutingModule {}
