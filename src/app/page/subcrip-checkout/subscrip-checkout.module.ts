import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubcripCheckoutComponent } from './subcrip-checkout.component';

@NgModule({
  declarations: [SubcripCheckoutComponent],
  imports: [
    CommonModule,
    // FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: SubcripCheckoutComponent }]),
  ],
})
export class SubcripCheckoutModule {}
