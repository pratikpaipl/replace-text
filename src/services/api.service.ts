import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { Page } from 'src/widget/items/model/page.class';
import { CookieService } from 'ngx-cookie-service';
import {  map, timeout } from 'rxjs/operators';
import { PagedData } from 'src/widget/items/model/paged-data';
import { ResponseData } from 'src/widget/items/model/response-data.class';
import { Observable } from 'rxjs';
import { LoadingService } from './LoaderService';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

declare const browserUID: any;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // timeOut:10000
  downloadedFile;
  PLATFORMID:any=false
  constructor(@Inject(PLATFORM_ID) platformId: any,private loadingScreenService: LoadingService,private http: HttpClient,private cookieService: CookieService, public store: StorageService,public router: Router, public platform: Platform) {
    this.PLATFORMID = isPlatformBrowser(platformId)
  }


  languageList(): any {
    return this.callGet("language/valid_language_list");
  }

  catchError(error): any {
    let erData = error;
    if (error instanceof HttpErrorResponse) {
      erData =  JSON.stringify(error)
    }
    console.log('catchError ',erData)
    if(this.PLATFORMID){
      let postData = new FormData();
      postData.append('LanguageCode', (this.store.lng != null?this.store.lng:'en'))
      postData.append('application', this.store.appType)
      postData.append('ErrorLog', erData)
      this.http.post(environment.BaseUrl +'error/add', postData).subscribe(async response => {
        let res: any = response;
        
      });
    }
  }

  getSort(SortBy) {
    return (SortBy == 'nearest' ? 'recent' : SortBy)
  }
  /* Common Pages*/
  pageContent(slug): any {
    var parms = '?PageSlug=' + slug
    return this.callGet('cms/page_content', parms);
  }
  
  labelList(IsAdmin): any {
    var parms = "?ListType=" + IsAdmin
    return this.callGet('label/list', parms);
  }

  signUp(postData): any {
    return this.callPost('auth/signup', postData);
  }
  login(postData): any {
    return this.callPost('auth/login', postData);
  }
  logout(postData): any {
    return this.callPost('auth/logout', postData);
  }
  confirmPageInvitation(postData, isSkip?): any {
    return this.callPost('admin_role/confirm_page_access_invitation', postData,isSkip);
  }
  getShareLink(shareKey): any {
    var parms = "?ShareKey=" + shareKey
    return this.callGet('share/get_link', parms);
  }
  resendConfirmationEmail(postData): any {
    return this.callPost('auth/resend_confirmation_email', postData);
  }
  forgotPassword(postData): any {
    return this.callPost('auth/forgot_password', postData);
  }
  resetPassword(postData): any {
    return this.callPost('auth/reset_password', postData);
  }
  updateNewPassword(postData): any {
    return this.callPost('auth/update_new_password', postData);
  }
  updateUserProfile(postData): any {
    return this.callPost('auth/update_user_profile', postData);
  }
  getProfile(postData): any {
    return this.callPost('auth/getProfile', postData);
  }
  changeEmail(postData): any {
    return this.callPost('auth/change_user_email', postData);
  }
  changePassword(postData): any {
    return this.callPost('auth/change_password', postData);
  }
  confirmAuthEmail(postData): any {
    return this.callPost('auth/confirm_email', postData);
  }
  updateNewEmail(postData): any {
    return this.callPost('auth/update_new_email', postData);
  }
  getUniqCode(postData): any {
    return this.callPost('auth/get_token', postData, true);
  }
  generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return 'P'+uuid.toString();
};
  /* Support */
  sendMail(endPoint,postData,isToast?): any {
    var header = { headers: { 'isToast':isToast} };
    return this.callPost(endPoint, postData,isToast!=undefined?header:false);
  }

  /* Delte */
  deleteData(endPoint, param): any {
    return this.callPost(endPoint, param);
  }


  /* Alerts / Deals */
  getDeals(pType, endPoint, AlertUID, FundraiseUID, DealSlug, Keyword, SortBy, SkipCount, LimitCount, PageType): any {
    var parms = "?" + pType + "=" + FundraiseUID + "&" + ((AlertUID != undefined && AlertUID != '') ? ("AlertUID=" + AlertUID + "&") : '')
    parms = parms + "DealSlug=" + DealSlug + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + this.getSort(SortBy) + "&SkipCount=" + SkipCount + "&LimitCount=" + LimitCount + "&PageType=" + PageType
    return this.callGet("fundraise/" + endPoint, parms);
  }
  getDealSummary(FundraiseUID): any {
    var parms = "?FundraiseUID=" + FundraiseUID
    return this.callGet("fundraise/fundraise_summary", parms);
  }

  /* Deals Details */
  getDetails(FundraiseUID, AlertUID): any {
    var parms = "?FundraiseUID=" + FundraiseUID + "&AlertUID=" + AlertUID
    return this.callGet("fundraise/fundraise_detail", parms);
  }

  /* Front detail */
  getFrontDetails(from,type, slug, Keyword, SortBy,IsProfile?,IsSubmittedEnabler?,enablerSlug?): any {
    Keyword == undefined ? Keyword = '' : Keyword
    let params = "?Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=0&LimitCount=1&PermissionTextKey=download_all"
    if (type == 'enabler') {
      params = params + "&EnablerSlug=" + slug + "&PageType="+type
      if(IsProfile != undefined && IsSubmittedEnabler!= undefined ){
        params = params+"&IsProfile=1"
        params = params+"&IsSubmittedEnabler=1"
      }  

      return this.callGet('enabler/'+(from != 'user'?"enabler_detail":"user_enabler_detail"), params);
    }else if (type == 'fundraise-need') {
      params = params + "&"+(from != 'user'?"FN_EnablerSlug=":"FundraiseSlug=") + slug + "&PageType=fundraise_enabler"

      if(IsProfile != undefined && IsSubmittedEnabler!= undefined ){
        params = params+"&IsProfile=1&IsSubmittedEnabler=1&EnablerSlug="+enablerSlug
      }  
      console.log('params ',params)
      return this.callGet("fundraise/"+(from == 'user'?"my_fn_detail":"valid_submitted_at_enablers_details"), params);
    }else if (type == 'funding-profile') {
      params = params +"&"+(from != 'user'?"FP_EnablerSlug=":"ProfileSlug=") + slug + "&PageType=funding_profile_enabler"
      if(IsProfile != undefined && IsSubmittedEnabler!= undefined ){
        params = params+"&IsProfile=1&IsSubmittedEnabler=1&EnablerSlug="+enablerSlug
      }  
      console.log('params ',params)
      return this.callGet("funding_profile/"+(from == 'user'?"my_fp_detail":"valid_submitted_at_enablers_details"), params);
    }else if(type =='impact-funding-resources'){
      params = params + "&ImpactFundingResourcesSlug=" + slug + "&PageType="+type
      return this.callGet('user/impact_funding_resources_detail', params);
    }
  }


  confirmEmail(type, end, postData): any {
    return this.callPost(type + '/' + end, postData);
  }
  fullReport(apiEnd,EnablerSlug,FN_EnablerSlug,FP_EnablerSlug, Keyword, SortBy,SkipCount,LimitCount): any {
    let parms='?EnablerSlug='+EnablerSlug+'&FN_EnablerSlug='+FN_EnablerSlug+'&FP_EnablerSlug='+FP_EnablerSlug+'&Keyword='+Keyword+'&SortBy='+SortBy+'&SkipCount='+SkipCount+'&LimitCount='+LimitCount
    return this.callGet(apiEnd,parms);
  }
  matchMakingReport(FP_EnablerSlug,FN_EnablerSlug,EnablerSlug, Keyword, SortBy,SkipCount,LimitCount,apiAction): any {
    let parms='?FP_EnablerSlug='+FP_EnablerSlug+'&FN_EnablerSlug='+FN_EnablerSlug+'&EnablerSlug='+EnablerSlug+'&Keyword='+Keyword+'&SortBy='+SortBy+'&SkipCount='+SkipCount+'&LimitCount='+LimitCount+'&PageType='+apiAction
    return this.callGet('report/matchmaking_report',parms);
  }
  enablerMatchingReport(apiEnd,selType,slTypeSlug,EnablerSlug): any {
    
    let parms='?'+selType+'='+slTypeSlug+'&EnablerSlug='+EnablerSlug
    return this.callGet(apiEnd,parms);
  }
  summaryReport(EnablerSlug, Keyword, SortBy,SkipCount,LimitCount): any {
    let parms='?EnablerSlug='+EnablerSlug+'&Keyword='+Keyword+'&SortBy='+SortBy+'&SkipCount='+SkipCount+'&LimitCount='+LimitCount
    return this.callGet('report/summary_report',parms);
  }
  fundingProfileMatchReport(apiEnd,Keyword, FN_EnablerSlug,SortBy,SkipCount,LimitCount,PageType): any {
    let parms='?Keyword='+Keyword+'&FN_EnablerSlug='+FN_EnablerSlug+'&SortBy='+SortBy+'&SkipCount='+SkipCount+'&LimitCount='+LimitCount+'&PageType='+PageType
    return this.callGet(apiEnd,parms);
  }
  fundraiseMatchReport(apiEnd,Keyword,FP_EnablerSlug, SortBy,SkipCount,LimitCount,pageType): any {
    let parms='?Keyword='+Keyword+'&FP_EnablerSlug='+FP_EnablerSlug+'&SortBy='+SortBy+'&SkipCount='+SkipCount+'&LimitCount='+LimitCount+'&PageType='+pageType
    return this.callGet(apiEnd,parms);
  }

  addReaction(FundraiseUID, AlertUID, ReactionType, ReactionValue, EnablerSlug, Type) {
    let postData = new FormData();
    postData.append("FundraiseUID", FundraiseUID);
    if (AlertUID != undefined)
      postData.append("AlertUID", AlertUID);
    if (EnablerSlug != undefined && Type != 'fundraise')
      postData.append("EnablerSlug", EnablerSlug);
    postData.append("ReactionType", ReactionType);
    postData.append("ReactionValue", ReactionValue);

    return this.callPost("alert/add_reaction", postData);
  }
  removeReaction(FundraiseUID, AlertUID, ReactionType, ReactionValue, EnablerSlug, Type) {
    let postData = new FormData();
    postData.append("FundraiseUID", FundraiseUID);
    if (AlertUID != undefined)
      postData.append("AlertUID", AlertUID);
    if (EnablerSlug != undefined && Type != 'fundraise')
      postData.append("EnablerSlug", EnablerSlug);
    postData.append("ReactionType", ReactionType);
    postData.append("ReactionValue", ReactionValue);

    return this.callPost("alert/remove_reaction", postData);
  }


  addData(from, postData, type,ext?): any {
    if (type.includes('add')) {
      return this.callPost(from + '/'+(ext!=undefined?ext:type), postData);
    } else  {
      return this.callPut(from + '/'+(ext!=undefined?ext:type), postData);
    }
  }
  impactInvestmentInfo(): any {
    return this.callGet('matchmaking_api/ImpactInvestmentInfo');
  }
  validateFundraise(postData,urlEnd): any {
    return this.callPost('fundraise/'+urlEnd, postData);
  }
  validateFundingProfile(postData,urlEnd): any {
    return this.callPost('funding_profile/'+urlEnd, postData);
  }
  confirmYes(postData): any {
    return this.callPost('fundraise/confirm_yes', postData);
  }
  
  /* Enabler */
  validateCompany(postData): any {
    return this.callPost('enabler/validate_company', postData);
  }
  
  getEnablerReferenceData(EnablerID,type) {
   // var parms = "?EnablerID=" + EnablerID + "&PageType="+Type;
    var parms = "?EnablerID=" + (EnablerID !=undefined?EnablerID:'');
    return this.callGet(type+"/get_"+(type=='funding_profile'?'fp':'fn')+"_reference_data", parms);
  }
  getContactSubmitterInfo(type,EnablerSlug,TypeSlug) {
   // var parms = "?EnablerID=" + EnablerID + "&PageType="+Type;
    var parms = "?EnablerSlug=" + EnablerSlug+"&"+(type == 'fundraise'?'FN':'FP')+'_EnablerSlug='+TypeSlug;
    return this.callGet(type+"/contact_submitter_info", parms);
  }
  getMatchmakingReportInfo(type,EnablerSlug,TypeSlug) {
   // var parms = "?EnablerID=" + EnablerID + "&PageType="+Type;
    var parms = "?EnablerSlug=" + EnablerSlug+"&"+(type == 'fundraise'?'FN':'FP')+'_EnablerSlug='+TypeSlug;
    return this.callGet(type+"/send_matchmaking_report_info", parms);
  }
  getIntroduceInfo(EnablerSlug,FP_EnablerSlug,FN_EnablerSlug,PageType) {
   // var parms = "?EnablerID=" + EnablerID + "&PageType="+Type;
    var parms = "?EnablerSlug=" + EnablerSlug+"&FP_EnablerSlug="+FP_EnablerSlug+"&FN_EnablerSlug="+FN_EnablerSlug+"&PageType="+PageType;
    return this.callGet("report/introduce_email_info", parms);
  }
  getContactInfo(params,EnablerSlug,FP_EnablerSlug,FN_EnablerSlug) {
     var parms = "?"+params+"=" + EnablerSlug+"&FP_EnablerSlug="+FP_EnablerSlug+"&FN_EnablerSlug="+FN_EnablerSlug+"";
     return this.callGet("support/contact_info", parms);
   }
  getSubmitToInfo(type,EnablerSlug,TypeSlug) {
   // var parms = "?EnablerID=" + EnablerID + "&PageType="+Type;
    var parms = "?EnablerSlug=" + EnablerSlug+"&"+(type == 'fundraise'?'Fundraise':'FundingProfile')+'Slug='+TypeSlug;
    return this.callGet(type+"/submit_"+(type == 'fundraise'?'fn':'fp')+"_to_enabler_info", parms);
  }
  
  adminEnablerList(apiEnd,EnablerSlug, EnablerUID, SdgIDs,EsgKeys, CountryOfEnabler, ImpactThemesAndAreasKey, Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip): any {
    var parms = "?EnablerSlug=" + EnablerSlug + "&EnablerUID=" + EnablerUID + "&SdgIDsKey=" + SdgIDs+ "&EsgKey=" + EsgKeys + "&CountryOfEnabler=" + CountryOfEnabler + "&ImpactThemesAndAreasKey=" + ImpactThemesAndAreasKey + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet(apiEnd, parms, isSkip);
  }
  getEnablerList(apiEnd,EnablerSlug, EnablerUID, SdgIDs,EsgKeys, CountryOfEnabler, ImpactThemesAndAreasKey,  Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip,IsProfile?,IsSubmittedEnabler?): any {
    var parms = "?EnablerSlug=" + EnablerSlug + "&EnablerUID=" + EnablerUID + "&SdgIDsKey=" + SdgIDs +"&EsgKey=" + EsgKeys + "&CountryOfEnabler=" + CountryOfEnabler + "&ImpactThemesAndAreasKey=" + ImpactThemesAndAreasKey + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType

    if(IsProfile != undefined)
      parms = parms+"&IsProfile="+IsProfile
    if(IsSubmittedEnabler != undefined)
      parms = parms+"&IsSubmittedEnabler="+IsSubmittedEnabler


    return this.callGet(apiEnd, parms, isSkip);
  }
  getFundraiseViewList(ProfileSlug, Keyword, SortBy, SkipCount, LimitCount, isSkip): any {
    var parms = "?ProfileSlug=" + ProfileSlug + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount
    return this.callGet("funding_profile/valid_fundraise_view_admin", parms, isSkip);
  }
  getEnablerViewList(apiEnd,slParamName,ProfileSlug, Keyword, SortBy, SkipCount, LimitCount, isSkip,pageType,slParmName?,slParmVal?): any {
    var parms = "?"+slParamName+"=" + ProfileSlug + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+"&PageType="+pageType
    if(slParmName !=undefined)
    parms = parms+"&"+slParmName+"="+slParmVal
    return this.callGet(apiEnd, parms, isSkip);
  }
  getAdminEnablerDetails(EnablerSlug, EnablerUID, Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip?): any {
    if (Keyword == undefined)
      Keyword = ''
      var parms = "?EnablerSlug=" + EnablerSlug + "&EnablerUID=" + EnablerUID + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("enabler/enabler_detail_admin", parms, isSkip);
  }

  /* funding profile */
  adminFundingProfileList(ProfileSlug, FundingProfileUID, EnablerSlug, SdgIDs,EsgKeys, CountryOfEnabler, ImpactThemesAndAreasKey, Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip): any {
    var parms = "?ProfileSlug=" + ProfileSlug + "&FundingProfileUID=" + FundingProfileUID + "&EnablerSlug=" + EnablerSlug + "&SdgIDsKey=" + SdgIDs +"&EsgKey=" + EsgKeys + "&CountryOfEnabler=" + CountryOfEnabler + "&ImpactThemesAndAreasKey=" + ImpactThemesAndAreasKey + "&Keyword=" + Keyword + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("funding_profile/valid_enabler_fp_list_admin", parms, isSkip);
  }
  /* Funding Profile submmited */
  adminFundingProfileSubmittedList(apiEnd,parmNm,EnablerSlug, Keyword, SortBy,ImpactThemesAndAreasKey,SdgIDs,EsgKeys,FundingProviderType,GenderLens,MinimumTicketSize, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip,FilterType): any {
    var parms = "?"+parmNm+"="+EnablerSlug+ "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy+ "&ImpactThemesAndAreasKey=" + ImpactThemesAndAreasKey+ "&SdgIDsKey=" + SdgIDs +"&EsgKey=" + EsgKeys +"&FundingProviderType=" + FundingProviderType +"&GenderLens=" + GenderLens +"&MinimumTicketSize=" + MinimumTicketSize + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType+"&FilterType="+FilterType
    return this.callGet(apiEnd, parms, isSkip);
  }
  adminFundingProfileSubmittedDetails(FN_EnablerSlug,  Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip?): any {
    if (Keyword == undefined)
      Keyword = ''
      var parms = "?FP_EnablerSlug=" + FN_EnablerSlug+"&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("funding_profile/valid_submitted_at_enablers_details_admin", parms, isSkip);
  }
  myFundingProfileSubmittedDetails(FP_EnablerSlug,  Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip?): any {
    if (Keyword == undefined)
      Keyword = ''
      var parms = "?FP_EnablerSlug=" + FP_EnablerSlug+"&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("funding_profile/my_fp_submitted_at_enablers_details", parms, isSkip);
  }
  myFundraiseSubmittedDetails(FN_EnablerSlug,  Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip?): any {
    if (Keyword == undefined)
      Keyword = ''
      var parms = "?FN_EnablerSlug=" + FN_EnablerSlug+"&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("fundraise/my_fn_submitted_at_enablers_details", parms, isSkip);
  }
  RelationDetails(ParentType,FP_EnablerSlug,  FN_EnablerSlug, PageType): any {
    var parms = "?FP_EnablerSlug=" + FP_EnablerSlug+"&FN_EnablerSlug=" + FN_EnablerSlug + "&PageType=" + PageType 
    return this.callGet(ParentType.replace('-',"_")+"/valid_"+(ParentType=='fundraise'?'fp':'fn')+"_report_details", parms);
  }
  FundingProfileSubmittedList(apiEnd,paramNm,EnablerSlug, Keyword, SortBy,ImpactThemesAndAreasKey,SdgIDs,EsgKeys, FundingProviderType,FundingType,FundingStage,MinimumTicketSize,GenderLens, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip,FilterType,IsProfile?,IsSubmittedEnabler?): any {
    var parms = "?"+paramNm+"="+EnablerSlug+ "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy +"&ImpactThemesAndAreasKey=" + ImpactThemesAndAreasKey+"&SdgIDsKey=" + SdgIDs+"&EsgKey=" + EsgKeys +"&FundingProviderTypeKey=" + FundingProviderType+"&FundingTypeKey=" + FundingType+"&FundingStageKey=" + FundingStage +"&GenderLensKey=" + GenderLens +"&MinimumTicketSizeKey=" + MinimumTicketSize + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType+"&FilterType="+FilterType

    if(IsProfile != undefined)
      parms = parms+"&IsProfile="+IsProfile
    if(IsSubmittedEnabler != undefined)
      parms = parms+"&IsSubmittedEnabler="+IsSubmittedEnabler

    return this.callGet(apiEnd, parms, isSkip);
  }
  FundingProfileSubmittedDetails(FN_EnablerSlug,  Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip?): any {
    if (Keyword == undefined)
      Keyword = ''
      var parms = "?FP_EnablerSlug=" + FN_EnablerSlug+"&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("funding_profile/valid_submitted_at_enablers_details", parms, isSkip);
  }
  /* Fundraise submmited */
  adminFundraiseSubmittedList(apiEnd,parmNm,Keyword, ImpactThemesAndAreasKey,SdgIDs,EsgKeys,SortBy, SkipCount, LimitCount, PermissionTextKey, EnablerSlug, PageType, isSkip,FilterType): any {
    var parms = "?"+parmNm+"="+EnablerSlug + "&Keyword=" + encodeURIComponent(Keyword)+"&ImpactThemesAndAreasKey=" + ImpactThemesAndAreasKey+"&SdgIDsKey=" + SdgIDs +"&EsgKey=" + EsgKeys + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType+"&FilterType="+FilterType
    return this.callGet(apiEnd, parms, isSkip);
  }
  getAdminFundraiseSubmittedDetails(FN_EnablerSlug,  Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip?): any {
    if (Keyword == undefined)
      Keyword = ''
      var parms = "?FN_EnablerSlug=" + FN_EnablerSlug+"&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("fundraise/valid_submitted_at_enablers_details_admin", parms, isSkip);
  }
  FundraiseSubmittedList(apiEnd,Keyword, ImpactThemesAndAreasKey,SdgIDs,EsgKeys,SortBy, SkipCount, LimitCount, PermissionTextKey,ParsmName, Slug, PageType, isSkip,FilterType,IsProfile?,IsSubmittedEnabler?): any {
    var parms = "?"+ParsmName+"="+Slug+"&Keyword=" + encodeURIComponent(Keyword)+"&ImpactThemesAndAreasKey=" + ImpactThemesAndAreasKey+"&SdgIDsKey=" + SdgIDs +"&EsgKey=" + EsgKeys + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType+"&FilterType="+FilterType //EnablerSlug="+EnablerSlug + "&

    if(IsProfile != undefined)
      parms = parms+"&IsProfile="+IsProfile
    if(IsSubmittedEnabler != undefined)
      parms = parms+"&IsSubmittedEnabler="+IsSubmittedEnabler

    return this.callGet(apiEnd,parms, isSkip);
  }
  ImpactFundingResourcesList(apiEnd,Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip): any {
    var parms = "?Keyword=" + encodeURIComponent(Keyword)+ "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKeys=" + PermissionTextKey + "&PageType=" + PageType //EnablerSlug="+EnablerSlug + "&
    return this.callGet(apiEnd,parms, isSkip);
  }
  getFundraiseSubmittedDetails(FN_EnablerSlug,  Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip?): any {
    if (Keyword == undefined)
      Keyword = ''
      var parms = "?FN_EnablerSlug=" + FN_EnablerSlug+"&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("fundraise/valid_submitted_at_enablers_details", parms, isSkip);
  }

  /* Fundraise List */
  adminFundraiseList(SlugParamNm,Slug,   Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip): any {
    var parms = "?"+SlugParamNm+"=" + Slug + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("fundraise/valid_enabler_fn_list_admin", parms, isSkip);
  }
  getAdminFundraiseDetails(FundraiseSlug, EnablerUIDs, Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip?): any {
    if (Keyword == undefined)
      Keyword = ''
      var parms = "?FundraiseSlug=" + FundraiseSlug + "&EnablerUIDs=" + EnablerUIDs + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("fundraise/fn_detail_admin", parms, isSkip);
  }
  getFundraiseFundingProfile(FundraiseSlug,  Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip): any {
    var parms = "?FundraiseSlug=" + FundraiseSlug + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("fundraise/valid_funding_profile_view_admin", parms, isSkip);
  }


  getFundingProfileList(ProfileSlug, FundingProfileUID, SdgIDs,EsgKeys, CountryOfEnabler, ImpactThemesAndAreasKey,  Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip): any {
    var parms = "?ProfileSlug=" + ProfileSlug + "&FundingProfileUID=" + FundingProfileUID + "&SdgIDsKey=" + SdgIDs +"&EsgKey=" + EsgKeys + "&CountryOfEnabler=" + CountryOfEnabler + "&ImpactThemesAndAreasKey=" + ImpactThemesAndAreasKey + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("funding_profile/valid_explorer_list", parms, isSkip);
  }
  getFundingProfileEnablerList(ProfileSlug,  Keyword, SortBy, SkipCount, LimitCount, isSkip): any {
    var parms = "?ProfileSlug="+ProfileSlug+"&Keyword="+encodeURIComponent(Keyword)+"&SortBy="+SortBy+"&SkipCount="+SkipCount+"&LimitCount="+LimitCount
    return this.callGet("funding_profile/valid_enabler_admin", parms, isSkip);
  }

  getAdminFundingProfileDetails(ProfileSlug, FundingProfileUID, Keyword, SortBy, SkipCount, LimitCount, PermissionTextKey, PageType, isSkip?): any {
    if (Keyword == undefined)
      Keyword = ''
      var parms = "?ProfileSlug=" + ProfileSlug + "&FundingProfileUID=" + FundingProfileUID + "&Keyword=" + encodeURIComponent(Keyword) + "&SortBy=" + SortBy + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount+ "&PermissionTextKey=" + PermissionTextKey + "&PageType=" + PageType
    return this.callGet("funding_profile/fp_detail_admin", parms, isSkip);
  }

  /* Permission */
  getPageUserList(SkipCount, LimitCount, slug, pageType): any {
    var parms = "?SkipCount=" + SkipCount + "&LimitCount=" + LimitCount + "&PageSlug=" + slug + "&PermissionTextKey=add_page_user,download_page_user,transfer_ownership&PageType=" + pageType
    return this.callGet("admin_role/page_user_list", parms);
  }
  getPageOwnerDetails(PageSlug, pageFrom): any {
    var parms = "?PageSlug=" + PageSlug + "&PageType=" + pageFrom
    return this.callGet("admin_role/page_owner_detail", parms);
  }
  addPermissionRole(postData, type): any {
    if (type != 'edit')
      return this.callPost('admin_role/assign_page_user_access_permission', postData);
    else
      return this.callPut('admin_role/update_page_user_access_permission', postData);
  }
  deletePermissionRole(PageSlug, PageUserID): any {
    let postData = new FormData();
    postData.append('PageUserID', PageUserID);
    postData.append('PageSlug', PageSlug);
    return this.callPost('admin_role/delete_page_access_role', postData);
  }
  changePageOwnerShip(postData): any {
    return this.callPost('admin_role/send_page_ownership_invitation', postData);
  }
  checkPageUserRole(postData): any {
    return this.callPost('admin_role/check_page_user_role', postData);
  }
  getPageUserDetails(PageSlug, PageUserID, fromPage): any {
    var parms = "?PageSlug=" + PageSlug + "&PageUserID=" + PageUserID + "&PermissionTextKey=transfer_ownership,add_page_user,download_page_user&&PageType=" + fromPage + "_permission"
    return this.callGet("admin_role/page_user_permission_detail", parms);
  }

  /* Settings */

  getSettingParameterList(apEnd,parm): any {
    // var parms = "?PageType="+PageType+"&PageSlug=" + PageSlug
    return this.callGet(apEnd, parm);
  }

  updateSetting(pageType,postData): any {
    return this.callPost(pageType+"/update_setting", postData);
  }
  updateSettingParameters(postData): any {
    return this.callPost("setting/update_setting_parameters", postData);
  }


  
  /* data_setup */
  getDataSetupList(apEnd,parm): any {
    // var parms = "?PageType="+PageType+"&PageSlug=" + PageSlug
    return this.callGet(apEnd, parm);
  }

  getImpactThemeAreaList(ReferenceName): any {
    var parms = "?ParentImpactThemeKey=" + ReferenceName
    return this.callGet("enabler/get_list_area_by_impact_theme", parms);
  }

  updateDataSetup(postData): any {
    return this.callPost("enabler/update_data_setup", postData);
  }

  pitchCall(type,apiEnd,param): any {
    if(type =='view'){
      const queryString = new URLSearchParams(param).toString()
      return this.callGet(apiEnd+'?', queryString,true);
    }
    else
    return this.callPost(apiEnd, param);
  }
  teaserCall(apiEnd,param): any {
      const queryString = new URLSearchParams(param).toString()
      return this.callGet(apiEnd+'?', queryString,true);
  }
  /* Enable, Active, Featured Update */
  update(from, type, postData): any {
    return this.callPut(from + '/' + type, postData);
  }

  selectPlan(postData): any {
    return this.callPut('subscription_plans/subscribe_plan', postData);
  }

  
  /* Download */
  callDownload(endPoint, slugParam1, slug1, Keyword, SortBy, pageType, slugParam2?, slug2?, slugParam3?, slug3?,countryOfEnabler?,ImpactThemesAndAreasKey?,sdgIDsKey?,esgKey?,permissionTextKey?,slugParam4?,slug4?) {
    let params = "?Keyword=" + this.store.checkUndefined(Keyword) 
    + "&SortBy=" + this.getSort(SortBy) 
    + "&PageType=" + pageType
    +(slugParam1 != undefined && slugParam1 != '' && slug1 != undefined && slug1 != ''?"&"+slugParam1 + "=" + slug1:'')
    +(slugParam2 != undefined && slugParam2 != '' && slug2 != undefined && slug2 != ''?"&"+slugParam2 + "=" + ((slug2 == undefined)?'':slug2):'')
    +(slugParam3 != undefined && slugParam3 != '' && slug3 != undefined && slug3 != ''?"&"+slugParam3 + "=" + ((slug3 == undefined)?'':slug3):'')
    +(slugParam4 != undefined && slugParam4 != '' && slug4 != undefined && slug4 != ''?"&"+slugParam4 + "=" + ((slug4 == undefined)?'':slug4):'')+(countryOfEnabler != undefined && countryOfEnabler != ''?"&CountryOfEnabler=" + countryOfEnabler:'')
    +(ImpactThemesAndAreasKey != undefined && ImpactThemesAndAreasKey != ''?"&ImpactThemesAndAreasKey=" + ImpactThemesAndAreasKey:'')
    +(sdgIDsKey != undefined && sdgIDsKey != ''?"&SdgIDsKey=" + sdgIDsKey:'')
    +(esgKey != undefined && esgKey != ''?"&EsgKey=" + esgKey:'')
    +(permissionTextKey != undefined && permissionTextKey != ''?"&PermissionTextKey=" + permissionTextKey:'')
    return this.callGet(endPoint + params,'', false, true);
  }

  pitchDownload(url){
    window.open(url, '_blank');
    // return this.callGet(url.replace(environment.BaseUrl.replace('api',''),''),'', false, true,fa);
  }

  /* geolocation */
  placeDetails(placeId): any {
    var parms = '?PlaceID=' + placeId
    return this.callGet('geocoder/place_details', parms);
  }
  
  getPlanList(PageType){
    var parms = '?PageType=' + PageType+'&IsPlanDetails=1'
    return this.callGet('subscription_plans/valid_plan_list', parms);
  }

  suggestions(keyword, isType, isSkip): any {
    var parms = '?Keyword=' + encodeURIComponent(keyword)
    if (isType)
    parms = parms + '&SearchType=regions'
    // postData.append("SearchType", 'regions');
    return this.callGet('geocoder/place_suggestions', parms, isSkip);
  }

  getFaqList(){
    return this.callGet('common/get_faq_list');
  }

  getData(endPoint, type, slugParam, slug, EnablerSlugParam?, EnablerSlug?, prodSlug?, pageType?, IssuedTo?): any {
    var parms;
    if (slug != undefined && (slugParam == EnablerSlugParam)) {
      parms = '?' + slugParam + '=' + (slug !=undefined && slug !=''?slug:EnablerSlug)
    }else{
      parms = '?' + slugParam + '=' + slug
    }
    if (EnablerSlugParam != undefined && EnablerSlug !='' && (slugParam != EnablerSlugParam)) {
      parms = parms + '&' + EnablerSlugParam + '=' + EnablerSlug
    }
    if (prodSlug != undefined && prodSlug != '') {
      parms = parms + '&ProductSlug=' + prodSlug
      if (IssuedTo != undefined && IssuedTo == 'product') {
        parms = parms + '&PageSlug=' + prodSlug
      }
    }
    if (pageType != undefined) {
      parms = parms + '&PageType=' + pageType
    }
    return this.callGet(endPoint + '/' + type + '_info', parms);
  }


  callPost(endPoint, postData, isSkip?) {
    postData.append('LanguageCode', (this.store.lng != null?this.store.lng:'en'))
    postData.append('application', (this.store.appType == 'location' ? 'shop_' + this.store.appType : this.store.appType))
    return this.http.post(environment.BaseUrl + endPoint, postData, { headers: { 'skip': isSkip ? 'true' : 'false', } });
  }
  callPut(endPoint, postData, isSkip?) {
    postData.append('LanguageCode',(this.store.lng != null?this.store.lng:'en'))
    postData.append('application', (this.store.appType == 'location' ? 'shop_' + this.store.appType : this.store.appType))
    return this.http.put(environment.BaseUrl + endPoint, postData, { headers: { 'skip': isSkip ? 'true' : 'false' } });
  }
  callGet(endPoint, postData?, isSkip?, isDownload?) {
    const d = new Date();
    let ms = d.getTime();
    var params = '';
    params = (postData != undefined && postData != '') ? postData + "&" : "?";
    params = params + "LanguageCode=" + (this.store.lng != null?this.store.lng:'en');
    params = params + "&CurrentTime=" + ms;
    params = params + "&application=" + ((this.store.appType == 'location') ? ('shop_' + this.store.appType) : this.store.appType);
    if (isSkip == undefined)
      isSkip = false

    if (isDownload == undefined) {
      return this.http.get(environment.BaseUrl + endPoint + params, { headers: { 'skip': isSkip ? 'true' : 'false' }, });
    }
    else {
      this.http.get(environment.BaseUrl + endPoint + "&LanguageCode=" + this.store.lng+ "&application=" + this.store.appType).subscribe(response => {
        let res: any = response;
        // let res = this.store.decryptData(response,atob(environment.keyData))
        if (res.success) {
          const url = res.data.url;
          window.open(url, '_blank');
          // this.saveFileFromUrl(url);
        } else {
          this.store.showToast(res.message, 1500, 'error')
        }
      });
    }
  }

    /* Filter View  */
    signupInfo(): any {
      return this.callGet('auth/signup_info');
    }
    encodeString(string:any='') {
      return string != undefined && string.trim() != ''? encodeURIComponent(string):'' 
    }
    referenceList(type): any {
      var parms = "?ReferenceType=" + type
      return this.callGet('reference_value/reference_list', parms);
    }

    filterData(SdgShow,esgShow,CountryShow,ImpactThemeAreaShow,FundingProviderType?,MinimumTicketSize?,FundingType?,FundingStage?,Enabler?,GenderLens?) {
      var parms = '?Sdg=' + SdgShow + '&Esg=' + esgShow+ '&Country=' + CountryShow+ '&FundingProviderType=' + (FundingProviderType?true:false)+ '&MinimumTicketSize=' + (MinimumTicketSize?true:false)+ '&FundingType=' + (FundingType?true:false) +'&FundingStage=' + (FundingStage?true:false) +'&Enabler='+(Enabler?true:false)+'&GenderLens='+(GenderLens?true:false) +'&ImpactThemeArea=' + ImpactThemeAreaShow + '&ListType=' + (this.store.appType == 'admin' ? 'admin' : 'front');
      return this.callGet('common/filter_list', parms);
    }
    
    getAllReferenceValueData(ReferenceType,Keyword,SkipCount, LimitCount): any {
      var parms = "?ReferenceType=" + ReferenceType + '&Keyword=' + Keyword + "&SkipCount=" + SkipCount+ "&LimitCount=" + LimitCount;
      return this.callGet('reference_value/all_reference_list', parms);
    }
    getParentReferenceValueData(ReferenceType,LanguageID): any {
      var parms = "?ReferenceType=" + ReferenceType + '&LanguageID=' + LanguageID;
      return this.callGet('reference_value/get_parent_reference_data', parms);
    }
    updateReferenceData(postData):any {
      return this.callPut("reference_value/update_reference_value", postData);
    }

  
    saveFileFromUrl(url: any) {

    const req = new HttpRequest('GET', url, {
      reportProgress: true,
      responseType: "blob"//blob type pls
    });

    //all possible events
    this.http.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          //do whatever you have to do with the file using event.body
          //i'm gonna write the file in my case
          var url = window.URL.createObjectURL(event.body);
          window.open(url);
          break;
      }
    });
  }

  /* TABLE DATA */
  getResults(apiEnd,page: Page,parms,limit:any=10): Observable<PagedData<ResponseData>> {
    const d = new Date();
    let ms = d.getTime();
    parms = (parms != undefined && parms != '') ? parms + "&" : "?";
    parms = parms + "SkipCount="  + page.pageNumber * page.size;
    parms = parms + "&LimitCount="+limit;
    parms = parms + "&LanguageCode=" + (this.store.lng != null?this.store.lng:'en');
    parms = parms + "&CurrentTime=" + ms;
    parms = parms + "&application=" + this.store.appType;
    let url = environment.BaseUrl+apiEnd+parms
    let header:any
    if(this.PLATFORMID){
      if(this.cookieService.check(environment.cookiesKey)){
        let res = this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
        header={Authorization:'Bearer ' + (res!=undefined?res.data.token.token!=undefined?res.data.token.token:undefined:undefined),pi2life_api_key: environment.apiKey}
      }else{      
        header={pi2life_api_key: environment.apiKey}
      }
    }else{      
      header={pi2life_api_key: environment.apiKey}
    }
    this.loadingScreenService.startLoading();
    return this.http.get<ResponseData>(url, {headers: header})
      .pipe(map((d) => {
        return this.getPagedData(page, d);
      }));
  }

  private getPagedData(
    page: Page,
    data: ResponseData
  ): PagedData<ResponseData> {
    const pagedData = new PagedData<ResponseData>();
    page.totalElements = data.data.totalData;
    page.totalPages = Math.ceil(page.totalElements / page.size);
    const start = page.pageNumber * page.size;
    // const end = Math.min(start + page.size, page.totalElements);
    this.loadingScreenService.stopLoading();
    let lists: any = data.data.list != undefined ?data.data.list:data.data.reference_value_list != undefined?data.data.reference_value_list:[];
    // let language_list: any = data.data.language_list != undefined ?data.data.language_list:[];
    // let reference_type_list: any = data.data.reference_type_list != undefined ?data.data.reference_type_list :[];
    let PitchSubmitted=false;
    for (let i = 0; i < lists.length; i++) {
      PitchSubmitted = lists[i].PitchSubmitted != undefined
      pagedData.results.push(lists[i]);
    }
    pagedData.datas = data.data;
    pagedData.page = page;
    pagedData.PitchSubmitted = PitchSubmitted;
    return pagedData;
  }

}
