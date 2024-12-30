import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NumberTakerComponent } from './number-taker.component';

@NgModule({
  declarations: [NumberTakerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: NumberTakerComponent }]),
  ],
})
export class NumberTakerModule {}
