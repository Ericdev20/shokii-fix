import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionHistoryComponent } from './transaction-history.component';

@NgModule({
  declarations: [TransactionHistoryComponent],
  imports: [
    CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: TransactionHistoryComponent },
    ]),
  ],
})
export class TransactionHistoryModule {}
