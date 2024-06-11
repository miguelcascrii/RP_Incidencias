// home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ChartModule } from '../chart/chart.module'; // Importa ChartModule aquí

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ChartModule // Asegúrate de importar ChartModule aquí
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
