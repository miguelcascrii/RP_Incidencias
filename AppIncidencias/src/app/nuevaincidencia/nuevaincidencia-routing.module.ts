import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaincidenciaPage } from './nuevaincidencia.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaincidenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaincidenciaPageRoutingModule {}
