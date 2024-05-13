import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthGuard } from 'src/shared/authguard.service';
import { SummaryPage } from './summary/summary.page';
import { FundraiseMatchReportPage } from './fundraise-match-report/fundraise-match-report.page';
import { FundingProfileMatchReportPage } from './funding-profile-match-report/funding-profile-match-report.page';
import { EnablerPage } from './enabler/enabler.page';
import { EnablerDetailsPage } from './enabler/enabler-details/enabler-details.page';
import { AddPermissionPage } from './permissions/add-permission/add-permission.page';
import { TransferOwnershipPage } from './permissions/transfer-ownership/transfer-ownership.page';
import { ImLocationPage } from './import-files/im-files.page';
import { AddFilesPage } from './import-files/import/im-import.page';
import { FullReportDetailPage } from './full-report/full-report-details/full-report-details.page';
import { FundingProfilePage } from './funding-profile/funding-profile.page';
import { FundingProfileDetailsPage } from './funding-profile/funding-profile-details/funding-profile-details.page';
import { FundraiseNeedsDetailsPage } from './fundraise-needs/fundraise-needs-details/fundraise-needs-details.page';
import { FundraiseNeedsPage } from './fundraise-needs/fundraise-needs.page';
import { AddEnablerPage } from './enabler/add-enabler/add-enabler.page';
import { AddFundraisePage } from 'src/common-pages/add-fundraise/add-fundraise.page';
import { AddFundingProfilePage } from 'src/common-pages/add-funding-profile/add-funding-profile.page';
import { FundingProfileSubmittedDetailsPage } from './funding-profiles-submitted/funding-profiles-submitted-details/funding-profiles-submitted-details.page';
import { FundingProfilesSubmittedPage } from './funding-profiles-submitted/funding-profiles-submitted.page';
import { FundraiseNeedsSubmittedDetailsPage } from './fundraise-needs-submitted/fundraise-needs-submitted-details/fundraise-needs-submitted-details.page';
import { FundraiseNeedsSubmittedPage } from './fundraise-needs-submitted/fundraise-needs-submitted.page';
import { ReferenceDataSettingPage } from './reference-data-setting/reference-data-setting.page';
import { AddReferenceDataPage } from './reference-data-setting/add-reference-data/add-reference-data.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { ExtraSharedModule } from 'src/shared/extra-shared.module';
import { UsersPage } from './users/users.page';
import { AddUserPage } from './users/add-user/add-user.page';
import { SubscripionsPage } from './subscripions/subscripions.page';
import { AddSubscripionsPage } from './subscripions/add-subscripions/add-subscripions.page';
import { MatchmakingPage } from './matchmaking/matchmaking.page';
import { AddInvestor } from 'src/common-pages/add-investor/add-investor.page';
import { AddInvestee } from 'src/common-pages/add-investee/add-investee.page';
import { ContentTextPage } from 'src/common-pages/content-text-page/content-text-page.page';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Home Page'
    },
    canActivate: [AuthGuard],
    component: HomePage,
  },
  {
    path: 'enablers',
    canActivate: [AuthGuard],
    component: EnablerPage,
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardPage,
  },
  {
    path: 'fundraise-needs',
    canActivate: [AuthGuard],
    component: FundraiseNeedsPage,
  },
  {
    path: 'summary',
    canActivate: [AuthGuard],
    component: SummaryPage,
  },
  {
    path: 'matchmaking',
    canActivate: [AuthGuard],
    component: MatchmakingPage,
  },
  {
    path: 'subscripions',
    canActivate: [AuthGuard],
    component: SubscripionsPage,
  },
  {
    path: 'subscripions/:add',
    canActivate: [AuthGuard],
    component: AddSubscripionsPage,
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: UsersPage,
  },
  { path: ':action/:type/disclaimer', canActivate: [AuthGuard], component: ContentTextPage, },
  { path: ':action/:type/confidentiality', canActivate: [AuthGuard], component: ContentTextPage, }, 
  
  { path: 'enabler/:enabler/:action/:type/disclaimer', canActivate: [AuthGuard], component: ContentTextPage, },
  { path: 'enabler/:enabler/:action/:type/confidentiality', canActivate: [AuthGuard], component: ContentTextPage, }, 
  {
    path: 'user/:uslug/edit',
    canActivate: [AuthGuard],
    component: AddUserPage,
  },
  {
    path: 'user/add',
    canActivate: [AuthGuard],
    component: AddUserPage,
  },
  {
    path: 'full-report/:FundingProfileUID/:FundraiseUID/detail',
    canActivate: [AuthGuard],
    component: FullReportDetailPage,
  },
  {
    path: 'full-report/:FundingProfileUID/:FundraiseUID/:EnablerSlug/detail',
    canActivate: [AuthGuard],
    component: FullReportDetailPage,
  },
  {
    path: 'fundraise-need-match-report',
    canActivate: [AuthGuard],
    component: FundraiseMatchReportPage,
  },
  {
    path: 'add-enabler',
    canActivate: [AuthGuard],
    component: AddEnablerPage,
  },
  {
    path: 'add-reference-data',
    canActivate: [AuthGuard],
    component: AddReferenceDataPage,
  },
  {
    path: 'enabler/:fslug/edit',
    canActivate: [AuthGuard],
    component: AddEnablerPage,
  },
  {
    path: 'enabler/:slug',
    canActivate: [AuthGuard],
    component: EnablerDetailsPage,
  },
  {
    path: 'funding-profiles/:slug',
    canActivate: [AuthGuard],
    component: FundingProfileDetailsPage,
  },
  {
    path: 'funding-profiles-submitted/:slug',
    canActivate: [AuthGuard],
    component: FundingProfileSubmittedDetailsPage,
  },

  {
    path: 'fundraise-needs/:slug',
    canActivate: [AuthGuard],
    component: FundraiseNeedsDetailsPage,
  },
  {
    path: 'fundraise-needs-submitted/:slug',
    canActivate: [AuthGuard],
    component: FundraiseNeedsSubmittedDetailsPage,
  },
  {
    path: 'funding-profile-match-report',
    canActivate: [AuthGuard],
    component: FundingProfileMatchReportPage,
  },
  {
    path: ':from/:slug/permission/add',
    canActivate: [AuthGuard],
    component: AddPermissionPage,
  },
  { path: 'enabler/:fnslug/:fslug/fundraise/:type/:page', canActivate: [AuthGuard], component: AddFundraisePage,},
  { path: 'enabler/:fnslug/:fslug/investee/:type/:page', canActivate: [AuthGuard], component: AddInvestee,},
  { path: 'enabler/:fslug/fundraise/add', canActivate: [AuthGuard], component: AddFundraisePage,},
  { path: 'enabler/:fslug/investee/add', canActivate: [AuthGuard], component: AddInvestee,},
  { path: 'enabler/:fpslug/:fslug/funding-profile/:type/:page', canActivate: [AuthGuard], component: AddFundingProfilePage},
  { path: 'enabler/:fpslug/:fslug/investor/:type/:page', canActivate: [AuthGuard], component: AddInvestor},
  { path: 'enabler/:fslug/funding-profile/add', canActivate: [AuthGuard], component: AddFundingProfilePage,},
  { path: 'enabler/:fslug/investor/add', canActivate: [AuthGuard], component: AddInvestor,},
  { path: 'fundraise-need/:fnslug/:type', canActivate: [AuthGuard], component: AddFundraisePage, },
  { path: 'investee/:fnslug/:type', canActivate: [AuthGuard], component: AddInvestee},
  { path: 'funding-profile/:fpslug/:type', canActivate: [AuthGuard], component: AddFundingProfilePage},
  { path: 'investor/:fpslug/:type', canActivate: [AuthGuard], component: AddInvestor},
  { path: ':from/:slug/permission/:PageUserID/edit', canActivate: [AuthGuard], component: AddPermissionPage,},
  { path: ':from/:slug/permission/transfer-ownership', canActivate: [AuthGuard], component: TransferOwnershipPage,},
  { path: 'im-files', canActivate: [AuthGuard], component: ImLocationPage, },
  { path: 'add-import-files', canActivate: [AuthGuard], component: AddFilesPage, },
  { path: 'reference-data', canActivate: [AuthGuard], component: ReferenceDataSettingPage, },



  // admin/enabler/demo-facilitator/investee/disclaimer/edit
  // { path: ':type/:enabler/disclaimer/:action', canActivate: [AuthGuard], component: ContentTextPage, },
  // { path: ':type/:enabler/confidentiality/:action', canActivate: [AuthGuard], component: ContentTextPage, },   
];

@NgModule({
  imports: [NgSelectModule,ExtraSharedModule, SharedModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [HomePage, FundraiseNeedsPage,FundraiseNeedsDetailsPage,FundraiseNeedsSubmittedPage,FundraiseNeedsSubmittedDetailsPage, FundingProfilePage,FundingProfileDetailsPage,FundingProfilesSubmittedPage,FundingProfileSubmittedDetailsPage,DashboardPage,EnablerPage, EnablerDetailsPage, SummaryPage,SubscripionsPage,AddSubscripionsPage,UsersPage,AddUserPage,FundraiseMatchReportPage, FundingProfileMatchReportPage, AddPermissionPage, TransferOwnershipPage,ImLocationPage,AddFilesPage, AddEnablerPage,AddReferenceDataPage ],
  exports: [ ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule { }
