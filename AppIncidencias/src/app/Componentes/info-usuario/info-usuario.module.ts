import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoUsuarioPageRoutingModule } from './info-usuario-routing.module';

import { InfoUsuarioPage } from './info-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoUsuarioPageRoutingModule
  ],
  declarations: [InfoUsuarioPage]
})
export class InfoUsuarioPageModule {}
