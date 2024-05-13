import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('../auth/auth.module').then(m => m.AuthPageModule)},
  { path: 'forgot-password', loadChildren: () => import('../auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)},
  { path: ':from/:type/:slug/teaser', loadChildren: () => import('../common-pages/view-teaser/view-teaser.module').then(m => m.ViewTeaserModule)},
  { path: 'admin', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'plans-and-pricing', loadChildren: () => import('../common-pages/plans-and-pricing/plans-and-pricing.module').then(m => m.PlansAndPricingPageModule) },
  { path: 'user',  loadChildren: () => import('../user/user.module').then(m => m.UserPageModule)},
  { path: 'message/:from', loadChildren: () => import('../common-pages/msg-screen/msg-screen.module').then(m => m.MsgScreenPageModule)},
  { path: 'contact-submitter/:fslug/:pslug/:ptype/:from/:mptype', loadChildren: () => import('../common-pages/compose-mail/compose-mail.module').then(m => m.ComposeMailPageModule)},
  { path: 'match-report/:fslug/:pslug/:ptype/:from/:mptype', loadChildren: () => import('../common-pages/send-matchmaking-report/send-matchmaking-report.module').then(m => m.SendMatchmakingReportPageModule)},
  { path: 'introduce/:eslug/:pslug/:fslug/:ptype/:from/:mptype', loadChildren: () => import('../common-pages/introduce/introduce.module').then(m => m.IntroducePageModule)},
  { path: 'page/:from', loadChildren: () => import('../common-pages/common-page/common-page.module').then(m => m.CommonPageModule)},
  { path: 'reset_password/:from', loadChildren: () => import('../auth/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)},
  
  { path: ':page/:from', loadChildren: () => import('../auth/accept-page-invitation/accept-page-invitation.module').then(m => m.AcceptInvitationPageModule) },

  { path: 'confirm-link', loadChildren: () => import('../auth/confirm-link/confirm-link.module').then(m => m.ConfirmLinkPageModule)},
  { path: 'error', loadChildren: () => import('../common-pages/common-error/common-error.module').then(m => m.CommonErrorModule) },
  { path: 'contact',data:{permission:'contact_us',sTitleKey:'contact_us_for',sDescKey:'send_us_your_questions_comments_feedback'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  
  // { path: 'contact/:ContctSlug/:FN_EnablerSlug/:FP_EnablerSlug/:PermissionKey/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  // { path: 'contact/:ContctSlug/:TypeSlug/:PermissionKey/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  // { path: 'contact/:ContctSlug/:PermissionKey/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },

  { path: 'contact-enabler/:ContctSlug/:FN_EnablerSlug/:FP_EnablerSlug/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'report/:ContctSlug/:FN_EnablerSlug/:FP_EnablerSlug/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'contact-us/:ContctSlug/:FN_EnablerSlug/:FP_EnablerSlug/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  
  { path: 'contact-enabler/:ContctSlug/:TypeSlug/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'report/:ContctSlug/:TypeSlug/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'contact-us/:ContctSlug/:TypeSlug/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },

  { path: 'contact-enabler/:ContctSlug/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'report/:ContctSlug/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'contact-us/:ContctSlug/:PageType', loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },

  { path: 'unavailable', loadChildren: () => import('../common-pages/error-page/error-page.module').then(m => m.ErrorPagePageModule)},
  
  { path: '**', redirectTo: 'unavailable' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: NoPreloading, onSameUrlNavigation: 'reload', paramsInheritanceStrategy: 'emptyOnly', urlUpdateStrategy: 'eager', scrollPositionRestoration: 'top'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
