import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CentroPage } from './centro.page';

const routes: Routes = [
  {
    path: '',
    component: CentroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentroPageRoutingModule {}
