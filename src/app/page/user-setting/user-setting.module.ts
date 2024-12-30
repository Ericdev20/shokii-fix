import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSettingComponent } from './user-setting.component';
import { ImageModule } from 'primeng/image';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderByPipe } from 'src/app/_utilities/order-by.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ImageCropperModule } from 'ngx-image-cropper';
import { OrderModule } from 'src/app/_utilities/order.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [UserSettingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    OrderModule,
    ImageModule,
    InputNumberModule,
    InputTextModule,
    PasswordModule,
    ImageCropperModule,
    LazyLoadImageModule,
    RouterModule.forChild([{ path: '', component: UserSettingComponent }]),
  ],
})
export class UserSettingModule {}
