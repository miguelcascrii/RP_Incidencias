import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtenderIncidenciaPageRoutingModule } from './atender-incidencia-routing.module';

import { AtenderIncidenciaPage } from './atender-incidencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtenderIncidenciaPageRoutingModule
  ],
  declarations: [AtenderIncidenciaPage]
})
export class AtenderIncidenciaPageModule {}
