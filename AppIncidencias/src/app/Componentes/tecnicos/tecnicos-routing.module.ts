import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TecnicosPage } from './tecnicos.page';

const routes: Routes = [
  {
    path: '',
    component: TecnicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TecnicosPageRoutingModule {}
