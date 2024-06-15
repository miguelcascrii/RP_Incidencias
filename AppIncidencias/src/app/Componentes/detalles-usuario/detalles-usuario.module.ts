import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesUsuarioPageRoutingModule } from './detalles-usuario-routing.module';

import { DetallesUsuarioPage } from './detalles-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesUsuarioPageRoutingModule
  ],
  declarations: [DetallesUsuarioPage]
})
export class DetallesUsuarioPageModule {}
