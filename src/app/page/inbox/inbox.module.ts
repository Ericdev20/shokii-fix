import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InboxComponent } from './inbox.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';

@NgModule({
  declarations: [InboxComponent],
  imports: [
    CommonModule,
    LazyLoadImageModule,
    FormsModule,
    ImageModule,
    RouterModule.forChild([
      {
        path: '',
        component: InboxComponent,
      },
    ]),
  ],
  providers: [UserStatusService],
})
export class InboxModule {}
