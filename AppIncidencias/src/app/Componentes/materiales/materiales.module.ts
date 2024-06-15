import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialesPageRoutingModule } from './materiales-routing.module';

import { MaterialesPage } from './materiales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialesPageRoutingModule
  ],
  declarations: [MaterialesPage]
})
export class MaterialesPageModule {}
