import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, PopoverController } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { appApi } from 'src/shared/app.constants';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
})
export class ActionMenuComponent implements OnInit {

  EnablerSlug: any = ''
  ProfileSlug: any = ''
  FundraiseSlug: any = ''
  userData: any;
  Name: any = ''
  Email: any = ''
  objData: any;
  mObjData: any;
  ActionMenu: any;
  isDisableDisplay = false;
  isPageRole = false;
  id = '';
  type = '';
  subType = '';
  pageFrom = '';
  from = '';
  pageType = '';
  activePage = ''
  ActionType = ''
  FP_EnablerSlug = ''
  FN_EnablerSlug = ''

  ActionName = ''
  keyword = ''
  sort = 'nearest'
  address = ''

  constructor(public navParams: NavParams, public eventService: EventService, public alertController: AlertController, public apiService: ApiService, public store: StorageService, public router: Router,private cookieService: CookieService, public popoverController: PopoverController) {
    var data = this.navParams.get("value");
    this.mObjData = data;
    this.objData = this.mObjData.item;
    this.ActionMenu = this.mObjData.ActionMenu;
   
    if (this.mObjData.pageFrom != undefined) 
      this.pageFrom = this.mObjData.pageFrom;
    if (this.mObjData.ActionType != undefined)
      this.ActionType = this.mObjData.ActionType;
    if (this.mObjData.EnablerSlug != undefined)
      this.EnablerSlug = this.mObjData.EnablerSlug;
    if (this.mObjData.ProfileSlug != undefined)
      this.ProfileSlug = this.mObjData.ProfileSlug;
    if (this.mObjData.FundraiseSlug != undefined)
      this.FundraiseSlug = this.mObjData.FundraiseSlug;
    if (this.mObjData.type != undefined)
      this.type = this.mObjData.type;
    if (this.mObjData.pageType != undefined)
      this.pageType = this.mObjData.pageType;
    if (this.mObjData.from != undefined)
      this.from = this.mObjData.from;
    if (this.mObjData.id != undefined)
      this.id = this.mObjData.id;
    if (this.mObjData.FP_EnablerSlug != undefined)
      this.FP_EnablerSlug = this.mObjData.FP_EnablerSlug;
    if (this.mObjData.FN_EnablerSlug != undefined)
      this.FN_EnablerSlug = this.mObjData.FN_EnablerSlug;

    if (this.mObjData.ActionName != undefined)
      this.ActionName = this.mObjData.ActionName
    if (this.mObjData.keyword != undefined)
      this.keyword = this.mObjData.keyword
    if (this.mObjData.sort != undefined)
      this.sort = this.mObjData.sort
    if (this.mObjData.address != undefined)
      this.address = this.mObjData.address
  }

  ngOnInit() {
    if(this.cookieService.check(environment.cookiesKey)){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      if (datas != undefined && datas.UserData != undefined) {
        this.userData = datas
        this.store.userData = datas
        this.Name = this.userData?.UserData?.FirstName + ' ' + this.userData?.UserData?.LastName
        this.Email = this.userData?.UserData?.Email      }
    } else {
      this.Name = ''
      this.Email = ''
    }
  }
  
 
  actionTrigger(action, TextKey, PageType) {
    var data = {
      key: TextKey,
      pageType: PageType,
      action: action
    }
    this.popoverController.dismiss(data);
    // this[action](TextKey, PageType);
  }

  async requestAccessConfirm(key, pageType) {
    const alert = await this.alertController.create({
      message: this.store.getVal('user_requesting_brand_page_admin_access'),
      animated: true,
      cssClass: 'alertCustomCssBtn',
      buttons: [
        {
          text: this.store.getVal('yes'),
          handler: () => {
            this.requestAccess(key, pageType);
          }
        },
        {
          text: this.store.getVal('no'),
          role: 'cancel',
          handler: () => {
          }
        }
      ], backdropDismiss: true
    });
    return await alert.present();
  }

  requestAccess(key, pageType) {
    
  }
  onDeleteUser(key, pageType) {
    this.activePage=''
     var data = {
       key: key,
       apiEnd:'user/delete',
       pageType: pageType,
       action: 'delete'
     }
      this.popoverController.dismiss(data);
   }
  onDelete(key, pageType) {
      this.activePage = ''
    var data = {
      key: key,
      apiEnd:
      pageType =='enabler_permission'?'admin_role/delete_page_access_role':
      pageType =='funding_profile_enabler'?'funding_profile/'+((this.store.appType!='admin'? 'my_':'')+'delete'):
      pageType =='fundraise_enabler'?'fundraise/'+((this.store.appType!='admin'?'my_':'')+'delete'):
      (pageType =='funding_profile' || pageType =='fundraise')? pageType+'/'+((pageType=='fundraise'?'fn':'fp')+'_delete'):
      undefined,
      pageType: pageType,
      action: 'delete'
    }
    this.popoverController.dismiss(data);
  }
  onDeleteFrontFundingProfile(key, pageType) {
    this.activePage = ''
    var data = {
      key: key,
      apiEnd:'funding_profile/'+(this.store.appType!='admin'? 'my_':'')+'delete',
      pageType: pageType,
      action: 'delete'
    }
    this.popoverController.dismiss(data);
  }
  onDeleteFrontFundraise(key, pageType) {
    this.activePage = ''
    var data = {
      key: key,
      apiEnd:'fundraise/'+(this.store.appType!='admin'? 'my_':'')+'delete',
      pageType: pageType,
      action: 'delete'
    }
    this.popoverController.dismiss(data);
  }
  onDownloadCompany(key, pageType) {
    this.activePage = ''
    this.popoverController.dismiss();

  }
  download(key, pageType) {
    this.activePage = ''
    this.popoverController.dismiss();
    let slug = ''
    let exSlug = ''
    let EnablerSlug = ''
    let endPoint = ''
    let slugParam = ''
    let exSlugParam = ''
    if(this.from == 'user' && (this.pageType == 'full-report' || this.type =='full-report') && pageType == 'funding_profile_enabler') {
      endPoint = appApi.matchmakingReportAdminExcel
      slugParam = 'FP_EnablerSlug'
      exSlugParam = 'FN_EnablerSlug'
      slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
      exSlug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
    } else if(this.from == 'user' && this.pageType ==  'funding-profile-match-report' && pageType == 'funding_profile_enabler') {
      endPoint = appApi.myFullMatchReportExcel
      slugParam = 'FP_EnablerSlug'
      exSlugParam = 'FN_EnablerSlug'
      slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
      exSlug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
    } else {
      if (this.from == 'admin') {
        if((this.type =='full-report') && ((this.pageType == 'fundraise-need-match-report' || this.pageType =='matched-fundraise-needs' ) && pageType == 'funding_profile_fundraise') || ((this.pageType == 'funding-profile-match-report' || this.pageType =='matching-funding-profiles') && pageType == 'fundraise_funding_profile')) {
          endPoint = appApi.matchmakingReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
          exSlug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
        }else if(this.pageType == 'fundraise-need-match-report' && pageType == 'fundraise_enabler') {
          endPoint = appApi.fundraiseReportListAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.FP_EnablerSlug != undefined ? this.FP_EnablerSlug : ''
          exSlug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
        } else if(this.pageType == 'funding-profile-match-report' && pageType == 'funding_profile_enabler') {
          endPoint = appApi.fundingProfileReportListAdminExcel
          slugParam = 'FN_EnablerSlug'
          exSlugParam = 'FP_EnablerSlug'
          slug = this.FN_EnablerSlug != undefined ? this.FN_EnablerSlug : ''
          exSlug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
        } else if(((this.pageType == 'fundraise-need-match-report' || this.pageType =='matched-fundraise-needs' ) && pageType == 'funding_profile_fundraise') || ((this.pageType == 'funding-profile-match-report' || this.pageType =='matching-funding-profiles') && pageType == 'fundraise_funding_profile')) {
          endPoint = pageType == 'funding_profile_fundraise'?appApi.fundraiseReportListAdminExcel:appApi.fundingProfileReportListAdminExcel
          slugParam = pageType == 'funding_profile_fundraise'?'FP_EnablerSlug':'FN_EnablerSlug'
          exSlugParam = pageType == 'funding_profile_fundraise'?'FN_EnablerSlug':'FP_EnablerSlug'
          slug =  pageType == 'funding_profile_fundraise'?(this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''):this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
          exSlug =  pageType == 'funding_profile_fundraise'?(this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''):(this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : '')
          EnablerSlug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        } else if(this.pageType == 'fundraise-need-match-report' && pageType == 'fundraise_enabler') {
          endPoint = appApi.myFNMatchReportExcel
          slugParam = 'FN_EnablerSlug'
          slug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
        } else if(pageType == 'fundraise_enabler') {
          endPoint = appApi.FNsubmittedAtEnablersDetailAdminExcel
          slugParam = 'FN_EnablerSlug'
          slug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
          exSlugParam = 'EnablerSlug'
          exSlug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        } else if(pageType == 'funding_profile_enabler') {
          endPoint = appApi.FPsubmittedAtEnablersDetailAdminExcel
          slugParam = 'FP_EnablerSlug'
          slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
          exSlugParam = 'EnablerSlug'
          exSlug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        }else if(pageType == 'fundraise_funding_profile') {
          endPoint = appApi.fundingProfileReportListAdminExcel
          slugParam = 'FN_EnablerSlug'
          slug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
          exSlugParam = 'EnablerSlug'
          exSlug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        } else if(pageType == 'enablers' || pageType == 'enabler') {
          slugParam = 'EnablerSlug'
          endPoint = appApi.EnablerDetailAdminExcel
          slug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        } else if(pageType == 'funding_profile') {
          slugParam = 'ProfileSlug'
          endPoint = appApi.FPDetailAdminExcel
          slug = this.objData.ProfileSlug != undefined ? this.objData.ProfileSlug : ''
        } else if(pageType == 'fundraise' || pageType == 'fundraise-needs') {
          slugParam = 'FundraiseSlug'
          endPoint = appApi.FNDetailAdminExcel
          slug = this.objData.FundraiseSlug != undefined ? this.objData.FundraiseSlug : ''
        }else if(pageType =='funding_profile_fundraise'){
          endPoint = appApi.matchmakingReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
          exSlug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
          EnablerSlug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        } else if(this.pageType = 'full-report') {
          endPoint = appApi.fullReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
          exSlug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
          EnablerSlug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        }
      } else if(this.from == 'profile' || this.from == 'user') {
        if(pageType == 'funding_profile' && this.pageFrom != 'funding-profile-submissions') {
          slugParam = 'ProfileSlug'
          endPoint = appApi.myFPDetailExcel
          slug = this.objData.ProfileSlug != undefined ? this.objData.ProfileSlug : ''
        } else if(pageType == 'fundraise' && this.pageFrom != 'fundraise-need-submissions') {
          slugParam = 'FundraiseSlug'
          endPoint = appApi.myFNDetailExcel
          slug = this.objData.FundraiseSlug != undefined ? this.objData.FundraiseSlug : ''
        } else if((pageType == 'funding_profile_enabler') || (pageType == 'funding_profile' && this.pageFrom == 'funding-profile-submissions')) {
          slugParam = 'FP_EnablerSlug'
          endPoint = appApi.myFPSubmittedAtEnablersDetailExcel
          slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
        } else if((pageType == 'fundraise_enabler') || (pageType == 'fundraise' && this.pageFrom == 'fundraise-need-submissions')) {
          slugParam = 'FN_EnablerSlug'
          endPoint = appApi.myFNSubmittedAtEnablersDetailExcel
          slug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
        } else if(pageType == 'enablers' || pageType == 'enabler') {
          slugParam = 'EnablerSlug'
          endPoint = appApi.EnablerDetailExcel
          slug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        } else if(pageType =='funding_profile_fundraise'){
          endPoint = appApi.matchmakingReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
          exSlug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
          EnablerSlug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        } else if(this.pageType = 'full-report') {
          endPoint = appApi.fullReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
          exSlug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
          EnablerSlug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        }
      } else if(this.from == 'front') {
        if(pageType == 'funding_profile_enabler') {
          slugParam = 'FP_EnablerSlug'
          endPoint = appApi.exploreFPsubmittedAtEnablersDetailExcel
          slug = this.objData.FP_EnablerSlug != undefined ? this.objData.FP_EnablerSlug : ''
        } else if(pageType == 'fundraise_enabler') {
          slugParam = 'FN_EnablerSlug'
          endPoint = appApi.exploreFNsubmittedAtEnablersDetailExcel
          slug = this.objData.FN_EnablerSlug != undefined ? this.objData.FN_EnablerSlug : ''
        } else if(pageType == 'enablers' || pageType == 'enabler') {
          slugParam = 'EnablerSlug'
          endPoint = appApi.EnablerDetailExcel
          slug = this.objData.EnablerSlug != undefined ? this.objData.EnablerSlug : ''
        } 
      }
    }
    this.apiService.callDownload(endPoint, slugParam, slug, this.keyword, this.sort, pageType,exSlugParam !=''?exSlugParam:'EnablerSlug',exSlug != ''?exSlug:EnablerSlug,(slugParam == 'EnablerSlug' || exSlugParam == 'EnablerSlug' )?'':'EnablerSlug', this.EnablerSlug);

  }
  onFeatured(key, pageType) {
    this.updateData(this.objData.IsFeatured, 'featured', pageType)
  }
  onActive(key, pageType) {
    this.updateData(this.objData.IsActive, 'active', pageType)
  }
  onEnable(key, pageType) {
    this.updateData(this.objData.IsEnable, 'enable', pageType)
  }
  updateData(arg: boolean, type, pageType) {
    let postData = new FormData();
    let fromPage = ''
    let endPoint = ''
    postData.append("PageType", pageType);
    if (this.ActionType != undefined && this.ActionType != '')
      postData.append('Type', this.ActionType)
    else
      if (this.objData.Type != undefined)
        postData.append('Type', this.objData.Type)

    if (type == 'active') {
      endPoint = 'update_active'
      postData.append("IsActive", arg ? '0' : '1');
    }
    if (type == 'enable') {
      endPoint = 'update_enable'
      postData.append("IsEnable", arg ? '0' : '1');
    }
    if (type == 'featured') {
      endPoint = 'update_featured'
      postData.append("IsFeatured", arg ? '0' : '1');
    }



    // this.apiService.update(fromPage, endPoint, postData).subscribe(response => {
    //   // let res: any = response;
    //   let res = this.store.getReponseData(response)
    //   this.activePage = ''
    //   this.popoverController.dismiss();
    //   if (res.success) {
    //     if (type == 'active') {
    //       this.objData.IsActive = arg ? 0 : 1
    //     }
    //     if (type == 'enable') {
    //       this.objData.IsEnable = arg ? 0 : 1
    //     }
    //     if (type == 'featured') {
    //       this.objData.IsFeatured = arg ? 0 : 1
    //     }
    //     this.store.showToast(res.message, 2000);
    //     this.objData.pageFrom = this.pageFrom;

    //   }

    // });
  }

}
