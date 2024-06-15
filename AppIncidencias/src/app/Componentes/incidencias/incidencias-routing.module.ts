import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidenciasPage } from './incidencias.page';

const routes: Routes = [
  {
    path: '',
    component: IncidenciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidenciasPageRoutingModule {}
