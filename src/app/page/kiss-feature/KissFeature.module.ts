import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KissFeatureComponent } from './kiss-feature.component';

@NgModule({
  declarations: [KissFeatureComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: KissFeatureComponent,
      },
    ]),
  ],
})
export class KissFeatureModule {}
