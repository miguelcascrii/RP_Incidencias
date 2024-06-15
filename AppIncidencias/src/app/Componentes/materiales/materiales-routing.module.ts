import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialesPage } from './materiales.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialesPageRoutingModule {}
