import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ImageModule } from 'primeng/image';
import { ClipboardModule } from 'ngx-clipboard';
import { RatingModule } from 'primeng/rating';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FreeInfoPersoComponent } from './free-info-perso.component';
import { NgImageSliderModule } from 'ng-image-slider';

@NgModule({
  declarations: [FreeInfoPersoComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    ToastModule,
    LazyLoadImageModule,
    ImageModule,
    ClipboardModule,
    RatingModule,
    NgImageSliderModule,
    OverlayPanelModule,
    RouterModule.forChild([{ path: '', component: FreeInfoPersoComponent }]),
  ],
  providers: [UserStatusService],
})
export class FreeInfoPersoModule {}
