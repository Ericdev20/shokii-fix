import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './contact.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    // FormsModule,
    ReactiveFormsModule,
    ToastModule,
    RouterModule.forChild([{ path: '', component: ContactComponent }]),
  ],
})
export class ContactModule {}
