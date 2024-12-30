import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SkeletonModule,
    LazyLoadImageModule,
    RouterModule.forChild([{ path: '', component: ChatComponent }]),
  ],
  providers: [UserStatusService],
})
export class ChatModule {}
