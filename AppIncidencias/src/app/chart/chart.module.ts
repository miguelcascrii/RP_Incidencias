// chart.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from './chart.component';

@NgModule({
  declarations: [ChartComponent],
  imports: [
    CommonModule,
    NgApexchartsModule
  ],
  exports: [ChartComponent, NgApexchartsModule] // Exporta ChartComponent y NgApexchartsModule
})
export class ChartModule {}
