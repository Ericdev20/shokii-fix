import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotationComponent } from './notation.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [NotationComponent],
  imports: [
    CommonModule,
    LazyLoadImageModule,
    // FormsModule,
    // ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: NotationComponent }]),
  ],
})
export class NotationModule {}
