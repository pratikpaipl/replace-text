import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import { ReactiveFormsModule, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BottomBtnComponent } from 'src/widget/bottom-btn/bottom-btn.component';
import { TotalComponent } from 'src/widget/count/count.component';
import { EmptyListComponent } from 'src/widget/empty-list/empty-list.component';
import { SearchWithBrandComponent } from 'src/widget/search-with-brand/search-with-brand.component';
import { DropDownComponent } from 'src/widget/drop-down/drop-down.component';
import { ProdTitleComponent } from 'src/widget/prod-title/prod-title.component';
import { ItemCardComponent } from 'src/widget/item-card/item-card.component';
import { FooterComponent } from 'src/widget/footer/footer.component';
import { ErrorMessageComponent } from 'src/widget/error-message/error-message.component';
import { ErrorViewComponent } from 'src/widget/error-view/error-view.component';
import { TabsComponent } from 'src/widget/tabs/tabs.component';
import { ItemCntComponent } from 'src/widget/item-card/item-cnt/item-cnt.component';
import { ResourceTreeView } from 'src/widget/tree-view/tree-view.component';
import { SearchTreeView } from 'src/widget/tree-view-search/tree-view-search.component';
import { PageHeaderComponent } from 'src/widget/page-header/page-header.component';
import { WebHeaderComponent } from 'src/common-pages/home/widget/web-page-header/web-page-header.component';
import { WebPageFooterComponent } from 'src/common-pages/home/widget/web-page-footer/web-page-footer.component';
import { TagLineComponent } from 'src/widget/tag-line/tag-line.component';
import { PageFooterComponent } from 'src/widget/page-footer/page-footer.component';
import { AuthGuard } from './authguard.service';
import { ClassificationComponent } from 'src/widget/classification/classification.component';
import { BtnTitleComponent } from 'src/widget/btn-title/btn-title.component';
import { PageHeaderBackComponent } from 'src/widget/page-header-back/page-header-back.component';
import { EnablerItemsComponent } from 'src/widget/items/enabler-items/enabler-items.component';
import { ActionMenuComponent } from 'src/widget/action-menu/action-menu.component';
import { ActMenuComponent } from 'src/widget/act-menu/act-menu.component';
import { BreadCrumpComponent } from 'src/widget/bread-crump/bread-crump.component';
import { FilterCountComponent } from 'src/widget/filter-count/filter-count.component';
import { FilterViewComponent } from 'src/widget/filter-view/filter-view.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptorService } from 'src/services/interceptor/LoadingInterceptorService';
import { PermissionItemComponent } from 'src/widget/items/permission-item/permission-item.component';
import { PermissionCountComponent } from 'src/widget/item-card/permission-count/permission-count.component';
import { SettingItemComponent } from 'src/widget/setting-items/setting-items.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LabelRightImgCountComponent } from 'src/widget/label-right-img/label-right-img.component';
import { DataChipComponent } from 'src/widget/data-chip/data-chip.component';
import { FundingProfileItemsComponent } from 'src/widget/items/funding-profile-items/funding-profile-items.component';
import { StatusViewComponent } from 'src/widget/status-view/status-view.component';
import { EnablerCountComponent } from 'src/widget/item-card/enabler-count/enabler-count.component';
import { FundraiseItemsComponent } from 'src/widget/items/fundraise-items/fundraise-items.component';
import { FundingItemsComponent } from 'src/widget/items/funding-items/funding-items.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FundingProfilesSubmittedItemsComponent } from 'src/widget/items/funding-profiles-submitted-items/funding-profiles-submitted-items.component';
import { FundraiseNeedsSubmittedItemsComponent } from 'src/widget/items/fundraise-needs-submitted-items/fundraise-needs-submitted-items.component';
import { FundingProfilesMatchReportItemsComponent } from 'src/widget/items/funding-profiles-match-report-items/funding-profiles-match-report-items.component';
import { FundraiseMatchReportItemsComponent } from 'src/widget/items/fundraise-match-report-items/fundraise-match-report-items.component';
import { FullReportItemsComponent } from 'src/widget/items/full-report-items/full-report-items.component';
import { FundraiseCountComponent } from 'src/widget/item-card/fundraise-count/fundraise-count.component';
import { FundingProfileCountComponent } from 'src/widget/item-card/funding-profile-count/funding-profile-count.component';
import { FullReportPage } from 'src/admin/home/full-report/full-report.page';
import { LoadingService } from 'src/services/LoaderService';
import { ActSwitchComponent } from 'src/widget/act-switch/act-switch.component';
import { FullReportDetailPage } from 'src/admin/home/full-report/full-report-details/full-report-details.page';
import { DataSetupItemComponent } from 'src/widget/data-setup-items/data-setup-items.component';
import { ReferenceDataSettingPage } from 'src/admin/home/reference-data-setting/reference-data-setting.page';
import { InfiniteScrollComponent } from 'src/widget/infinite-scroll/infinite-scroll.component';
import { PageEndComponent } from 'src/widget/page-end/page-end.component';
import { EnablerFPFNFormConfigComponent } from 'src/widget/enabler-fp-fn-form-config/enabler-fp-fn-form-config.component';
import { CustomSelectComponent } from 'src/widget/custom-select/custom-select.component';
import { CustomTreeViewSelectComponent } from 'src/widget/custom-tree-view-select/custom-tree-view-select.component';
import { AddressComponent } from 'src/widget/address/address.component';
import { LoadingComponent } from 'src/services/loading/loading.component';
import { ShareComponent } from 'src/widget/share/share.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HeadTitleComponent } from 'src/widget/head-title/head-title.component';
import { EditorDataViewComponent } from 'src/widget/editor-data-view/editor-data-view.component';
import { ItemTblComponent } from 'src/widget/item-card/item-tbl/item-tbl.component';
import { EmailInputChipComponent } from 'src/widget/email-input-chip/email-input-chip.component';
import { MatChipsModule, MatIconModule, MatInputModule, MatListModule } from '@angular/material'
import { CmnOnlyNumberDirective } from './cmn-only-number.directive';
import { EnablerConfigDetailsComponent } from 'src/widget/enabler-config-details/enabler-config-details.component';
import { FundingProfileDetailsViewComponent } from 'src/widget/funding-profile-details-view/funding-profile-details-view.component';
import { FundraiseNeedDetailsViewComponent } from 'src/widget/fundraise-need-details-view/fundraise-need-details-view.component';
import { UsersItemsComponent } from 'src/widget/items/users-items/users-items.component';
import { EnablerDetailViewComponent } from 'src/widget/enabler-detail-view/enabler-detail-view.component';
import { ScrollVanishDirective } from 'src/directives/scroll-vanish.directive';
import { RefresherComponent } from 'src/widget/refresher/refresher.component';
import { SubscripionsItemsComponent } from 'src/widget/items/subscripions-items/subscripions-items.component';
import { PlanItemsComponent } from 'src/widget/items/plan-items/plan-items.component';
import { ContactComponent } from 'src/widget/contact/contact.component';
import { MatchmakingPage } from 'src/admin/home/matchmaking/matchmaking.page';
import { NumberInputComponent } from 'src/widget/number-input/number-input.component';
import { ImpactResourcesItemsComponent } from 'src/widget/items/impact-resources/impact-resources.component';
import { YesNoNeutralSwitchComponent } from 'src/widget/yes-no-neutral-switch/yes-no-neutral-switch.component';
import { AutoFocus } from 'src/directives/auto-focus.directive';
import { TextAreaComponent } from 'src/widget/text-area/text-area.component';
import { AddDeclaimerComponent } from 'src/widget/enabler-fp-fn-form-config/add-declaimer/add-declaimer.component';
import { ProductMenuComponent } from 'src/common-pages/home/widget/web-page-header/header-popover-menu/header-popover-menu.component';
import { SeoHiddenTagComponent } from 'src/widget/seo-hidden-tag/seo-hidden-tag.component';
import { PageContactComponent } from 'src/common-pages/home/widget/page-contact/page-contact.component';
import { ItemCardEnablerComponent } from 'src/widget/item-card/item-card-enabler/item-card-enabler.component';

@NgModule()
export class NoopModule {}

@NgModule({
  entryComponents: [],
  declarations: [AutoFocus,RefresherComponent,ScrollVanishDirective,CmnOnlyNumberDirective,LoadingComponent,EditorDataViewComponent,EnablerConfigDetailsComponent,EnablerDetailViewComponent,FundingProfileDetailsViewComponent,FundraiseNeedDetailsViewComponent,FullReportDetailPage,SearchTreeView, ResourceTreeView, BottomBtnComponent,ShareComponent, FooterComponent,CustomSelectComponent,CustomTreeViewSelectComponent, TotalComponent, SeoHiddenTagComponent, EmptyListComponent,EmailInputChipComponent, SearchWithBrandComponent, DropDownComponent, ItemCardComponent, ItemCardEnablerComponent, ItemTblComponent, ClassificationComponent, ItemCntComponent, ProdTitleComponent,TabsComponent, ErrorMessageComponent, ErrorViewComponent, TagLineComponent,HeadTitleComponent,WebHeaderComponent,PageContactComponent,WebPageFooterComponent, PageHeaderComponent, PageHeaderBackComponent, PageFooterComponent, EnablerItemsComponent,ContactComponent,FundingItemsComponent,FundraiseItemsComponent,FullReportPage,UsersItemsComponent,SubscripionsItemsComponent,PlanItemsComponent,ImpactResourcesItemsComponent,FullReportItemsComponent,FundingProfileItemsComponent,FundraiseMatchReportItemsComponent,FundingProfilesMatchReportItemsComponent,FundingProfilesSubmittedItemsComponent,FundraiseNeedsSubmittedItemsComponent, BtnTitleComponent, ActionMenuComponent,ProductMenuComponent, ActMenuComponent, BreadCrumpComponent,  FilterCountComponent, FilterViewComponent, PermissionItemComponent,StatusViewComponent, PermissionCountComponent, SettingItemComponent,DataSetupItemComponent, LabelRightImgCountComponent,DataChipComponent,EnablerCountComponent,FundraiseCountComponent,FundingProfileCountComponent,ActSwitchComponent,MatchmakingPage, ReferenceDataSettingPage, InfiniteScrollComponent,PageEndComponent,NumberInputComponent,TextAreaComponent,EnablerFPFNFormConfigComponent,AddDeclaimerComponent,AddressComponent,YesNoNeutralSwitchComponent],
  imports: [MatIconModule,MatInputModule,MatListModule,MatChipsModule, CommonModule, IonicModule, FormsModule, ReactiveFormsModule,NgxDatatableModule, NgSelectModule,BsDatepickerModule.forRoot()],
  exports: [LoadingComponent,RefresherComponent,EditorDataViewComponent,EnablerConfigDetailsComponent,EnablerDetailViewComponent,FundingProfileDetailsViewComponent,FundraiseNeedDetailsViewComponent,FullReportDetailPage,SearchTreeView, ResourceTreeView, CommonModule, IonicModule, BsDatepickerModule,  BottomBtnComponent,ShareComponent, FooterComponent, CustomSelectComponent,CustomTreeViewSelectComponent, TotalComponent, SeoHiddenTagComponent, EmptyListComponent,EmailInputChipComponent, SearchWithBrandComponent, DropDownComponent, ItemCardComponent, ItemCardEnablerComponent, ItemTblComponent, ClassificationComponent, ItemCntComponent, ProdTitleComponent, TabsComponent, ErrorMessageComponent, ErrorViewComponent, TagLineComponent,HeadTitleComponent,WebHeaderComponent,PageContactComponent,WebPageFooterComponent, PageHeaderComponent, PageHeaderBackComponent, PageFooterComponent, EnablerItemsComponent,ContactComponent,FundingItemsComponent,FundraiseItemsComponent, FundingProfileItemsComponent,FundraiseMatchReportItemsComponent,FundingProfilesMatchReportItemsComponent,FullReportPage,UsersItemsComponent,SubscripionsItemsComponent,PlanItemsComponent,ImpactResourcesItemsComponent,FullReportItemsComponent,FundingProfilesSubmittedItemsComponent,FundraiseNeedsSubmittedItemsComponent,BtnTitleComponent, ActionMenuComponent,ProductMenuComponent, ActMenuComponent, BreadCrumpComponent,  FilterCountComponent, FilterViewComponent, PermissionItemComponent,StatusViewComponent, PermissionCountComponent, SettingItemComponent,DataSetupItemComponent,DataChipComponent,EnablerCountComponent, FundraiseCountComponent,FundingProfileCountComponent,ActSwitchComponent,MatchmakingPage, ReferenceDataSettingPage,InfiniteScrollComponent,PageEndComponent,LabelRightImgCountComponent,NumberInputComponent,TextAreaComponent,EnablerFPFNFormConfigComponent,AddDeclaimerComponent,AddressComponent,YesNoNeutralSwitchComponent],
  providers: [
    CookieService,
    { provide: 'LOCALSTORAGE', useFactory: getLocalStorage }, AuthGuard, InAppBrowser,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterViewComponent),  // replace name as appropriate
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShareComponent),  // replace name as appropriate
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmnOnlyNumberDirective),  // replace name as appropriate
      multi: true
    },
    LoadingService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true },
  ],
  
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
export function getLocalStorage() {
  return (typeof window !== "undefined") ? window.localStorage : null;
}

