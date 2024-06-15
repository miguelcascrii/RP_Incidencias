import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtenderIncidenciaPage } from './atender-incidencia.page';

const routes: Routes = [
  {
    path: '',
    component: AtenderIncidenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtenderIncidenciaPageRoutingModule {}
