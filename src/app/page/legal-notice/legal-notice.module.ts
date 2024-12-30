import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LegalNoticeComponent } from './legal-notice.component';

@NgModule({
  declarations: [LegalNoticeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LegalNoticeComponent }]),
  ],
})
export class LegalNoticeModule {}
