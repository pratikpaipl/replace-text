import { CUSTOM_ELEMENTS_SCHEMA, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserPage } from './user.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { ProfilePage } from './profile/profile.page';
import { ChangeEmailPage } from './change-email/change-email.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { MyFundingProfilePage } from './my-funding-profile/my-funding-profile.page';
import { MyFundraiseNeedPage } from './my-fundraise-need/my-fundraise-need.page';
import { NeedSubmissionsPage } from './fundraise-submissions/need-submissions.page';
import { ProfileSubmissionsPage } from './profile-submissions/profile-submissions.page';
import { FundraisMatchmakingReportPage } from './fundrais-matchmaking-report/fundrais-matchmaking-report.page';
import { ProfileMatchmakingReportPage } from './profile-matchmaking-report/profile-matchmaking-report.page';
import { ProfileSubmissionDetailsPage } from './profile-submissions/profile-submissions-details/profile-submissions-details.page';
import { AddFundingProfilePage } from 'src/common-pages/add-funding-profile/add-funding-profile.page';
import { NgSelectModule } from '@ng-select/ng-select';
import { FundraiseSubmissionDetailsPage } from './fundraise-submissions/fundraise-submissions-details/fundraise-submissions-details.page';
import { AddFundraisePage } from 'src/common-pages/add-fundraise/add-fundraise.page';
import { FullReportDetailPage } from 'src/admin/home/full-report/full-report-details/full-report-details.page';
import { MyFullReportPage } from './my-full-report/my-full-report.page';
import { AuthGuard } from 'src/shared/authguard.service';
import { EnablerMatchReportPage } from './enabler-match-report/enabler-match-report.page';
import { EnablerSelectPage } from './enabler-select/enabler-select.page';
import { PitchPdfPage } from './pdf-viewer/pitch-pdf-view';
import { RelationDetailPage } from 'src/common-pages/relation-detail-page/relation-detail.page';
import { ActivityLogPage } from 'src/admin/home/activity-log/activity-log.page';
import { SuggestedEnablerPage } from './suggested-enabler/suggested-enabler.page';
import { UserEnablers } from './user-enablers/user-enablers.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AddInvestor } from 'src/common-pages/add-investor/add-investor.page';
import { AddInvestee } from 'src/common-pages/add-investee/add-investee.page';
import { SuggestedDetailPage } from './suggested-enabler/suggested-detail-pages/suggested-detail-pages.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-email',
    component: ChangeEmailPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-funding-profiles',
    component: MyFundingProfilePage,
    canActivate: [AuthGuard],
  },
 
  {
    path: 'my-fundraise-needs',
    component: MyFundraiseNeedPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'fundraise-need/:slug',
    canActivate: [AuthGuard],
    loadChildren: () => import('../front/detail-pages/detail-pages.module').then(m => m.DetailPageModule)
  },
  {
    path: 'funding-profile/:slug',
    canActivate: [AuthGuard],
    loadChildren: () => import('../front/detail-pages/detail-pages.module').then(m => m.DetailPageModule)
  },
  
  {
    path: 'funding-profile-submissions',
    canActivate: [AuthGuard],
    component: ProfileSubmissionsPage,
  },
  {
    path: 'funding-profile/:parent/:slug',
    component: ProfileSubmissionDetailsPage,
  },
  {
    path: 'fundraise-need-submissions',
    canActivate: [AuthGuard],
    component: NeedSubmissionsPage,
  },
  {
    path: 'fundraise-need/:parent/:slug',
    // canActivate: [AuthGuard],
    component: FundraiseSubmissionDetailsPage,
  },
  
  {
    path: ':eslug/submitted/funding-profile/:slug',
    component: SuggestedDetailPage,
  },
  {
    path: ':eslug/submitted/fundraise-need/:slug',
    component: SuggestedDetailPage,
  },
  {
    path: 'funding-profile-match-report',
    canActivate: [AuthGuard],
    component: ProfileMatchmakingReportPage,
  },
  {
    path: 'fundrais-need-match-report',
    canActivate: [AuthGuard],
    component: FundraisMatchmakingReportPage,
  },
  {
    path: 'change-password',
    canActivate: [AuthGuard],
    component: ChangePasswordPage,
  },
  {
    path: 'enablers',
    canActivate: [AuthGuard],
    component: UserEnablers,
  },
  { path: 'enabler/:slug', loadChildren: () => import('../../src/front/detail-pages/detail-pages.module').then(m => m.DetailPageModule)},
  {
    path: 'full-report',
    canActivate: [AuthGuard],
    component: MyFullReportPage,
  },
  {
    path: 'activity-log',
    canActivate: [AuthGuard],
    component: ActivityLogPage,
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfilePage,
  },
  {
    path: 'enabler/:type/:slug',
    // canActivate: [AuthGuard],
    component: EnablerSelectPage,
  },
  {
    path: 'funding-profiles/:fpslug/:type',
    // canActivate: [AuthGuard],
    component: AddFundingProfilePage,
  },
  {
    path: 'enabler/:fpslug/:fslug/funding-profile/:type',
    // canActivate: [AuthGuard],
    component: AddFundingProfilePage,
  },
  {
    path: 'enabler/:fnslug/:fslug/fundraise/:type',
    // canActivate: [AuthGuard],
    component: AddFundraisePage,
  },
  {
    path: 'enabler/:fnslug/:fslug/investee/:type',
    // canActivate: [AuthGuard],
    component: AddInvestee,
  },
  {
    path: 'match-report/config/:from/:type/:tslug/:fslug',
    // canActivate: [AuthGuard],
    component: EnablerMatchReportPage,
  },
  {
    path: 'master/funding-profile/:type',
     canActivate: [AuthGuard],
    component: AddFundingProfilePage,
  },

  {
    path: 'investor/:fpslug/:type',
    // canActivate: [AuthGuard],
    component: AddInvestor,
  },
  {
    path: 'enabler/:fpslug/:fslug/investor/:type',
    // canActivate: [AuthGuard],
    component: AddInvestor,
  },

  {
    path: 'master/investor/:type',
     canActivate: [AuthGuard],
    component: AddInvestor,
  },
  { path: 'fundraise-needs/:fnslug/:type', component: AddFundraisePage},
  { path: 'investee/:fnslug/:type', component: AddInvestee,},
  { path: 'master/fundraise-need/:type', component: AddFundraisePage},
  { path: 'master/investee/:type', component: AddInvestee},
  { path: ':type/:FundingProfileUID/:FundraiseUID/detail', component: FullReportDetailPage,},
  
  {
    path: ':pSlug/:fSlug/:ptype/pitch-view',
    // canActivate: [AuthGuard],
    component: PitchPdfPage,
  },

  {
    path: ':parent/:from/:fromtab/:fnslug/:fpslug/:pType',
    component: RelationDetailPage,
  },
];
@NgModule({
  imports: [NgSelectModule, SharedModule, FormsModule, RouterModule.forChild(routes),PdfViewerModule],
  declarations: [UserPage, ChangePasswordPage, ChangeEmailPage,UserEnablers,MyFullReportPage,ActivityLogPage,MyFundingProfilePage,MyFundraiseNeedPage,SuggestedEnablerPage,ProfileSubmissionsPage,ProfileSubmissionDetailsPage,NeedSubmissionsPage,RelationDetailPage,FundraiseSubmissionDetailsPage,ProfileMatchmakingReportPage,FundraisMatchmakingReportPage, ProfilePage,EnablerSelectPage,EnablerMatchReportPage,PitchPdfPage,SuggestedDetailPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class UserPageModule {
  isBrowser: boolean;
  constructor( @Inject(PLATFORM_ID) private platformId,){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
 }
