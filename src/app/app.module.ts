import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { LandingPageComponent } from './page/landing-page/landing-page.component';
import { NumberTakerComponent } from './page/number-taker/number-taker.component';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { MatRadioModule } from '@angular/material/radio';
import { InputNumberModule } from 'primeng/inputnumber';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { HeaderAfterAuthComponent } from './page/header-after-auth/header-after-auth.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, DatePipe } from '@angular/common';
import { LoaderInterceptor } from './core/_interceptor/loader.interceptor';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoaderService } from './core/_services/shared/loader.service';
import { LoaderComponent } from './page/loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { RatingModule } from 'primeng/rating';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SliderModule } from 'primeng/slider';
import { MatSliderModule } from '@angular/material/slider';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { ClipboardModule } from 'ngx-clipboard';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { environment } from 'src/environments/environment';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UserStatusService } from './core/_services/shared/user-status.service';
// import { NgZoomConfig, NgZoomModule } from 'ng-zoom';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ImageModule } from 'primeng/image';
import { OrderModule } from './_utilities/order.module';
// import { NgImageSliderModule } from 'ng-image-slider';
import { NotificationComponent } from './notification/notification.component';

import { messaging } from 'src/configs/firebase.config';
import { initializeApp } from 'firebase/app';

initializeApp(environment.firebaseConfig);

const config: SocketIoConfig = {
  url: environment.nodeUrl,
  options: {},
};

// const config1: NgZoomConfig = {
//   backgroundColor: '#00000061',
//   scaleUp : false ,
//   padding :0
// };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    HeaderAfterAuthComponent,
    LoaderComponent,
    NotificationComponent,
  ],

  imports: [
    BrowserModule,
    // WebcamModule,
    CommonModule,

    // MatCheckboxModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    OrderModule,
    // FormsModule,
    // SliderModule,
    // MessagesModule,
    // ToastModule,
    // ClipboardModule,
    // ReactiveFormsModule,
    // MatStepperModule,
    // MatInputModule,
    // MatButtonModule,
    // ButtonModule,
    // MatDatepickerModule,
    // MatFormFieldModule,
    // MatNativeDateModule,
    // MatSelectModule,
    // MatIconModule,
    // MatRadioModule,
    MatTooltipModule,
    MatSliderModule,
    OverlayPanelModule,
    NgbModule,
    CascadeSelectModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    DatePipe,
    BadgeModule,
    NgSelectModule,
    PasswordModule,
    RatingModule,
    SkeletonModule,
    NgxPaginationModule,
    DropdownModule,
    ModalModule.forRoot(),
    CalendarModule,
    ImageCropperModule,
    LazyLoadImageModule,
    ImageModule,
    // NgZoomModule,
    SocketIoModule.forRoot(config),
    // NgZoomModule.forRoot(config1)
    // NgImageSliderModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: 'messaging', useValue: messaging },

    DatePipe,
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    UserStatusService,
    /*{ provide: LocationStrategy, useClass: HashLocationStrategy },*/
    /*{ provide: APP_BASE_HREF, useValue: '/test/' }*/
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
