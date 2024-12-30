// home.module.ts

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SkeletonModule } from 'primeng/skeleton';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSliderModule } from '@angular/material/slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderModule } from 'src/app/_utilities/order.module';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    OrderModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    SkeletonModule,
    NgxPaginationModule,
    MatSliderModule,
    DatePipe,
    ImageModule,
    NgSelectModule,
    TooltipModule,
    RouterModule.forChild(routes),
  ],
  providers: [UserStatusService],
})
export class HomeModule {}
