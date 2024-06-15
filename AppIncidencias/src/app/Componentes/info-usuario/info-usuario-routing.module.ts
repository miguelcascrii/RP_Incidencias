import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoUsuarioPage } from './info-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: InfoUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoUsuarioPageRoutingModule {}
