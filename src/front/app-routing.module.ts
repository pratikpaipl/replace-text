import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('../common-pages/home/home-page/home-page.module').then(m => m.HomePageModule) },
  { path: 'about', loadChildren: () => import('../common-pages/home/about/about-page.module').then(m => m.AboutPageModule) },
  { path: 'faq', loadChildren: () => import('../common-pages/home/faq/faq-page.module').then(m => m.FaqPageModule) },
  { path: 'features', loadChildren: () => import('../common-pages/home/features/features-page.module').then(m => m.FeaturesPageModule) },
  { path: 'how-it-works', loadChildren: () => import('../common-pages/home/how-it-works/how-it-works-page.module').then(m => m.HowItWorksPageModule) },
  { path: 'partners', loadChildren: () => import('../common-pages/home/partners/partners-page.module').then(m => m.PartnersPageModule) },
 
  { path: 'solutions/impact-investor-clubs', loadChildren: () => import('../common-pages/home/solutions/impact-investor-clubs/impact-investor-clubs.module').then(m => m.ImpactInvestorClubsModule) },
  { path: 'solutions/impact-and-sustainability-ecosystems', loadChildren: () => import('../common-pages/home/solutions/impact-sustainability-ecosystems/impact-sustainability-ecosystems.module').then(m => m.ImpactSustainabilityEcosystemsClubsModule) },
  { path: 'solutions/incubators-and-accelerators', loadChildren: () => import('../common-pages/home/solutions/incubators-and-accelerators/incubators-and-accelerators.module').then(m => m.IncubatorsAndAcceleratorsModule) },
  { path: 'solutions/investment-advisors-and-fundraisers', loadChildren: () => import('../common-pages/home/solutions/investment-advisors-fundraisers/investment-advisors-fundraisers.module').then(m => m.InvestmentAdvisorsFundraisersModule) },

  { path: 'explore/:page',loadChildren: () => import('../front/explore/explore.module').then(m => m.ExplorePageModule)},
  { path: 'impact-funding-resources', loadChildren: () => import('../common-pages/impact-funding-resources/impact-funding-resources.module').then(m => m.ImpactFundingResourcesPageModule) },
  { path: 'plans-and-pricing', loadChildren: () => import('../common-pages/plans-and-pricing/plans-and-pricing.module').then(m => m.PlansAndPricingPageModule) },
  { path: 'auth', loadChildren: () => import('../auth/auth.module').then(m => m.AuthPageModule)},
  { path: 'forgot-password', loadChildren: () => import('../auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)},
  { path: ':from/:type/:slug/teaser', loadChildren: () => import('../common-pages/view-teaser/view-teaser.module').then(m => m.ViewTeaserModule)},
  { path: 'user',  loadChildren: () => import('../user/user.module').then(m => m.UserPageModule)},

  { path: 'investor/:type', loadChildren: () => import('../common-pages/add-investor/add-investor.module').then(m => m.AddInvestorModule)},
  { path: 'enabler/:fslug/investor/:type', loadChildren: () => import('../common-pages/add-investor/add-investor.module').then(m => m.AddInvestorModule) },

  { path: 'investee/:type', loadChildren: () => import('../common-pages/add-investee/add-investee.module').then(m => m.AddInvesteeModule) },
  { path: 'enabler/:fslug/investee/:type', loadChildren: () => import('../common-pages/add-investee/add-investee.module').then(m => m.AddInvesteeModule) },

  { path: 'add-funding-profile', loadChildren: () => import('../common-pages/add-funding-profile/add-funding-profile.module').then(m => m.AddFundingProfilePageModule)},
  { path: 'add-fundraise', loadChildren: () => import('../common-pages/add-fundraise/add-fundraise.module').then(m => m.AddFundraisePageModule) },

  
  { path: 'enabler/:fslug/funding-profile/:type', loadChildren: () => import('../common-pages/add-funding-profile/add-funding-profile.module').then(m => m.AddFundingProfilePageModule) },
  { path: 'enabler/:fslug/fundraise/:type', loadChildren: () => import('../common-pages/add-fundraise/add-fundraise.module').then(m => m.AddFundraisePageModule) },
  { path: 'message/:from', loadChildren: () => import('../common-pages/msg-screen/msg-screen.module').then(m => m.MsgScreenPageModule) },
  { path: 'enabler/:slug/:page', loadChildren: () => import('./detail-pages/detail-pages.module').then(m => m.DetailPageModule)},
  { path: 'fundraise-need/:slug/:page', loadChildren: () => import('./detail-pages/detail-pages.module').then(m => m.DetailPageModule)},
  { path: 'funding-profile/:slug/:page', loadChildren: () => import('./detail-pages/detail-pages.module').then(m => m.DetailPageModule) },
  { path: 'impact-funding-resources/:slug/:page', loadChildren: () => import('./detail-pages/detail-pages.module').then(m => m.DetailPageModule) },
  { path: 'page/:from', loadChildren: () => import('../common-pages/common-page/common-page.module').then(m => m.CommonPageModule)},
  { path: 'reset_password/:from', loadChildren: () => import('../auth/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule) },

  { path: ':page/:from', loadChildren: () => import('../auth/accept-page-invitation/accept-page-invitation.module').then(m => m.AcceptInvitationPageModule)},

  { path: 'confirm-link', loadChildren: () => import('../auth/confirm-link/confirm-link.module').then(m => m.ConfirmLinkPageModule)},
  { path: 'report', loadChildren: () => import('../common-pages/add-report/add-report.module').then(m => m.AddReportPageModule)},
  { path: 'error', loadChildren: () => import('../common-pages/common-error/common-error.module').then(m => m.CommonErrorModule) },
  { path: 'contact',data:{permission:'contact_us',sTitleKey:'contact_us_for',sDescKey:'send_us_your_questions_comments_feedback'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },

  { path: 'contact-enabler/:ContctSlug/:FN_EnablerSlug/:FP_EnablerSlug/:PageType',data:{permission:'contact_enabler',sTitleKey:'contact',sDescKey:'send_us_your_questions_comments_feedback'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'report/:ContctSlug/:FN_EnablerSlug/:FP_EnablerSlug/:PageType',data:{permission:'report',sTitleKey:'report_an_issus_for',sDescKey:'send_us_issues_related_to_selected_information'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'contact-us/:ContctSlug/:FN_EnablerSlug/:FP_EnablerSlug/:PageType',data:{permission:'contact_us',sTitleKey:'contact_us_for',sDescKey:'send_us_your_questions_comments_feedback'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  
  { path: 'contact-enabler/:ContctSlug/:TypeSlug/:PageType',data:{permission:'contact_enabler',sTitleKey:'contact',sDescKey:'send_us_your_questions_comments_feedback'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'report/:ContctSlug/:TypeSlug/:PageType',data:{permission:'report',sTitleKey:'report_an_issus_for',sDescKey:'send_us_issues_related_to_selected_information'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'contact-us/:ContctSlug/:TypeSlug/:PageType',data:{permission:'contact_us',sTitleKey:'contact_us_for',sDescKey:'send_us_your_questions_comments_feedback'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },

  { path: 'contact-enabler/:ContctSlug/:PageType',data:{permission:'contact_enabler',sTitleKey:'contact',sDescKey:'send_us_your_questions_comments_feedback'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },
  { path: 'report/:ContctSlug/:PageType',data:{permission:'report',sTitleKey:'report_an_issus_for',sDescKey:'send_us_issues_related_to_selected_information'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },

  { path: 'contact-us/:ContctSlug/:PageType',data:{permission:'contact_us',sTitleKey:'contact_us_for',sDescKey:'send_us_your_questions_comments_feedback'}, loadChildren: () => import('../common-pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule) },

  { path: ':type/:action/disclaimer', loadChildren: () => import('../common-pages/content-text-page/content-text-page.module').then(m => m.ContentTextPageModule)},
  { path: ':type/:action/confidentiality', loadChildren: () => import('../common-pages/content-text-page/content-text-page.module').then(m => m.ContentTextPageModule)},

  { path: 'enabler/:enabler/:type/:action/disclaimer', loadChildren: () => import('../common-pages/content-text-page/content-text-page.module').then(m => m.ContentTextPageModule)},
  { path: 'enabler/:enabler/:type/:action/confidentiality', loadChildren: () => import('../common-pages/content-text-page/content-text-page.module').then(m => m.ContentTextPageModule)},

  // { path: ':type/:enabler/disclaimer/:action', loadChildren: () => import('../common-pages/content-text-page/content-text-page.module').then(m => m.ContentTextPageModule)},
  // { path: ':type/:enabler/confidentiality/:action', loadChildren: () => import('../common-pages/content-text-page/content-text-page.module').then(m => m.ContentTextPageModule)},

  // enabler/demo-facilitator/investor/add

  { path: 'unavailable', loadChildren: () => import('../common-pages/error-page/error-page.module').then(m => m.ErrorPagePageModule)},

  { path: '**', redirectTo: 'unavailable' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: NoPreloading,onSameUrlNavigation: 'reload',paramsInheritanceStrategy: 'emptyOnly',urlUpdateStrategy: 'eager',scrollPositionRestoration: 'top'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
