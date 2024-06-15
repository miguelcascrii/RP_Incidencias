import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CentroPageRoutingModule } from './centro-routing.module';

import { CentroPage } from './centro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentroPageRoutingModule
  ],
  declarations: [CentroPage]
})
export class CentroPageModule {}
