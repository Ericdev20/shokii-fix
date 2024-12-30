import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PasswordModule } from 'primeng/password';
import { PasswordRecoverComponent } from './password-recover.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PasswordRecoverComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PasswordModule,
    ReactiveFormsModule,
    NgbModule,
    ModalModule.forRoot(),
    RouterModule.forChild([{ path: '', component: PasswordRecoverComponent }]),
  ],
})
export class PasswordRecoverModule {}
