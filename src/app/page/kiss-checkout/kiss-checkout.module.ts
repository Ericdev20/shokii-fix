import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KissCheckoutComponent } from './kiss-checkout.component';
import { OrderByPipe } from 'src/app/_utilities/order-by.pipe';
import { OrderModule } from 'src/app/_utilities/order.module';

@NgModule({
  declarations: [KissCheckoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    OrderModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: KissCheckoutComponent }]),
  ],
})
export class KissCheckoutModule {}
