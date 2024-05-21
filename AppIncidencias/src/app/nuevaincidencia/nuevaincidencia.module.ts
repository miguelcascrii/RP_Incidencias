import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaincidenciaPageRoutingModule } from './nuevaincidencia-routing.module';

import { NuevaincidenciaPage } from './nuevaincidencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaincidenciaPageRoutingModule
  ],
  declarations: [NuevaincidenciaPage]
})
export class NuevaincidenciaPageModule {}
