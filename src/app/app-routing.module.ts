import { NgModule, Component } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { AuthGuard } from './core/_guards/auth.guard';
import { KissFeatureComponent } from './page/kiss-feature/kiss-feature.component';

const routes: Routes = [
  // { path: 'acceuil', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: '',
    loadChildren: () =>
      import('./page/landing-page/landing/landing.module').then(
        (m) => m.LandingModule
      ),
  },
  {
    path: 'accueil',
    loadChildren: () =>
      import('./page/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./page/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./page/register/register.module').then((m) => m.registerModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./page/number-taker/number-taker.module').then(
        (m) => m.NumberTakerModule
      ),
  },
  {
    path: 'verify',
    loadChildren: () =>
      import('./page/otp/otp.module').then((m) => m.OtpModule),
  },
  {
    path: 'password-recover',
    loadChildren: () =>
      import('./page/password-recover/password-recover.module').then(
        (m) => m.PasswordRecoverModule
      ),
  },

  {
    path: 'contact',
    loadChildren: () =>
      import('./page/contact/contact.module').then((m) => m.ContactModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'abonnement',
    loadChildren: () =>
      import('./page/subscription/subscription.module').then(
        (m) => m.SubscriptionModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./page/chat/chat.module').then((m) => m.ChatModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'personalInfo-premium/:role/:id/:profil',
    loadChildren: () =>
      import('./page/premium-info-perso/premium-info-perso.module').then(
        (m) => m.PremiumInfoPersoModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'personalInfo-free/:role/:id/:profil',
    loadChildren: () =>
      import('./page/free-info-perso/free-info-perso.module').then(
        (m) => m.FreeInfoPersoModule
      ),
    canActivate: [AuthGuard],
  },

  // {
  //   path: 'personalInfo-free/:role/:id/:profil',
  //   component: FreeInfoPersoComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'myprofile',
    loadChildren: () =>
      import('./page/user-setting/user-setting.module').then(
        (m) => m.UserSettingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'subcription-checkout/:id',
    loadChildren: () =>
      import('./page/subcrip-checkout/subscrip-checkout.module').then(
        (m) => m.SubcripCheckoutModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'checkout',
    loadChildren: () =>
      import('./page/kiss-checkout/kiss-checkout.module').then(
        (m) => m.KissCheckoutModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'purchase',
    loadChildren: () =>
      import('./page/transaction-history/transaction-history.module').then(
        (m) => m.TransactionHistoryModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'reviews',
    loadChildren: () =>
      import('./page/notation/notation.module').then((m) => m.NotationModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'user-setting',
    loadChildren: () =>
      import('./page/user-setting/user-setting.module').then(
        (m) => m.UserSettingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'inbox/:id',
    loadChildren: () =>
      import('./page/inbox/inbox.module').then((m) => m.InboxModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'about-us',
    loadChildren: () =>
      import('./page/about-us/about-us.module').then((m) => m.AboutUsModule),
  },
  {
    path: 'how-it-works',
    loadChildren: () =>
      import('./page/about-us/about-us.module').then((m) => m.AboutUsModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./page/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule
      ),
  },
  {
    path: 'terms-of-use',
    loadChildren: () =>
      import('./page/user-condition/user-condition.module').then(
        (m) => m.UserConditionModule
      ),
  },

  {
    path: 'faq',
    loadChildren: () =>
      import('./page/faq/faq.module').then((m) => m.FaqModule),
  },
  // {
  //   path: 'legal-notice',
  //   loadChildren: () =>
  //     import('./page/legal-notice/legal-notice.module').then(
  //       (m) => m.LegalNoticeModule
  //     ),
  // },

  { path: 'kiss-info', component: KissFeatureComponent },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
