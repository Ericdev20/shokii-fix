import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserConditionComponent } from './user-condition.component';

@NgModule({
  declarations: [UserConditionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: UserConditionComponent }]),
  ],
})
export class UserConditionModule {}
