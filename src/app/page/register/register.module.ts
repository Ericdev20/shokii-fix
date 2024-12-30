import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PasswordModule } from 'primeng/password';
import { RegisterComponent } from './register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderByPipe } from 'src/app/_utilities/order-by.pipe';
import { OrderModule } from 'src/app/_utilities/order.module';
import { MatSelectModule } from '@angular/material/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ImageModule } from 'primeng/image';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    OrderModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    PasswordModule,
    ReactiveFormsModule,
    NgSelectModule,
    InputNumberModule,
    MatTooltipModule,
    MatCheckboxModule,
    ImageModule,
    ImageCropperModule,
    DropdownModule,
    RouterModule.forChild([{ path: '', component: RegisterComponent }]),
  ],
})
export class registerModule {}
