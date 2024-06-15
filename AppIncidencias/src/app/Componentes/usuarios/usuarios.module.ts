import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TecnicosPageRoutingModule } from './usuarios-routing.module';

import { TecnicosPage } from './usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TecnicosPageRoutingModule
  ],
  declarations: [TecnicosPage]
})
export class TecnicosPageModule {}
