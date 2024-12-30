import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PremiumInfoPersoComponent } from './premium-info-perso.component';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ClipboardModule } from 'ngx-clipboard';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { UserStatusService } from 'src/app/core/_services/shared/user-status.service';
import { NgImageSliderModule } from 'ng-image-slider';

@NgModule({
  declarations: [PremiumInfoPersoComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    ToastModule,
    LazyLoadImageModule,
    ImageModule,
    ClipboardModule,
    RatingModule,
    OverlayPanelModule,
    NgImageSliderModule,
    RouterModule.forChild([{ path: '', component: PremiumInfoPersoComponent }]),
  ],
  providers: [UserStatusService],
})
export class PremiumInfoPersoModule {}
