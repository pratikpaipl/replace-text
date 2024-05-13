import { Component, OnInit, Input, Inject, PLATFORM_ID, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { ActionMenuComponent } from '../action-menu/action-menu.component';
import * as $ from 'jquery'
import { CookieService } from "ngx-cookie-service";
import { actType, appApi } from 'src/shared/app.constants';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ShareComponent } from '../share/share.component';

@Component({
  selector: 'act-menu',
  templateUrl: './act-menu.component.html',
  styleUrls: ['./act-menu.component.scss'],
})
export class ActMenuComponent implements OnInit {

  activePage=''
  UserName:any=''
  Email:any=''


  @Input()
  showFeatured: any = true
  @Input()
  itemTitle: any = ''

  @Input()
  Slug: any
  @Input()
  UserSlug: any = ''
  @Input()
  EnablerSlug: any = ''
  @Input()
  FundraiseSlug: any = ''
  @Input()
  ProfileSlug: any = ''
  @Input()
  ActionType: any = ''
  @Input()
  FP_EnablerSlug: any = ''
  @Input()
  FN_EnablerSlug: any = ''

  @Input()
  isAddForm: any=false;
  @Input()
  from: string;
  @Input()
  pageFrom: string;
  @Input()
  pageType: string;
  @Input()
  prod: any;
  @Input()
  title: string;
  @Input()
  subType: string;
  @Input()
  role: string;
  @Input()
  Name: string = '';
  @Input()
  apiAction: string = '';
  
  @Input()
  keyword = ''
  @Input()
  sort = 'nearest'
  @Input()
  address = ''

  userData:any

  isAction = false;
  PLATFORMID=false

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(@Inject(PLATFORM_ID) platformId: any,private cookieService: CookieService, public store: StorageService,public alertController: AlertController, public eventService: EventService, public apiService: ApiService, public popoverController: PopoverController,public actionSheetController: ActionSheetController, public router: Router, public navCtrl: NavController,public modalController: ModalController, ) {
    this.PLATFORMID = isPlatformBrowser(platformId)
  }

  ngOnInit() {
    if(this.PLATFORMID){
      $('.action_menu .menuicons').click(function () {
        if ($(this).parent().hasClass('open')) {
          $(this).parent().removeClass('open');
        } else {
          $('.action_menu').removeClass('open');
          $(this).parent().addClass('open');
        }
      });
    }
  }
  checkTop(){
   return this.PLATFORMID?!(window.location.href.includes('user')):false
  }
  ngOnChanges() {
    if(this.cookieService.check(environment.cookiesKey)){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      if (datas != undefined && datas.UserData != undefined) {
        this.userData = datas
        this.UserName = this.userData?.UserData?.FirstName + ' ' + this.userData?.UserData?.LastName
        this.Email = this.userData?.UserData?.Email
      }
    } else {
      this.UserName = ''
      this.Email = ''
    }
  }
  async openShare(){
    let share=this.store.getVal('share');
    let twitter=this.store.getVal('twitter');
    let facebook=this.store.getVal('facebook');
    let linkedin=this.store.getVal('linkedin')  

    const modal = await this.modalController.create({
      component: ShareComponent,
      cssClass: "modal-share",
      componentProps: { value: { ShareUrl:(this.routePath(false).length ==0?window.location.href :(window.location.origin+this.routePath(false))),share:share,twitter:twitter,facebook:facebook,linkedin:linkedin } },
    });
    await modal.present();
    await modal.onDidDismiss().then(() => {
      
    });
  }
  routePath(isSame) {
    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    
    let action;
    (this.apiAction != 'enabler') ? action = 'enabler' : ''
    let strPath = '';
    if (this.pageType =='matched-fundraise-needs' ){
      if(isSame){
        if(this.store.appType != 'admin'){
          strPath = ('/user/funding-profile/submissions/' + this.FP_EnablerSlug+this.store.getSeprater('user')+'profile-form')
        }else{
          strPath = ('admin/'+'funding-profiles-submitted/'+this.prod.FP_EnablerSlug+this.store.getSeprater(undefined,apPath)+'profile-form')
        }
      }else{
        if(this.prod.IsMyFundraise == 1) {
          strPath =('/user/fundraise-need/submissions/' + this.prod.FN_EnablerSlug+this.store.getSeprater('user',apPath)+'fundraise-form')
        }else{
          strPath = "user/funding-profile/details/"+this.pageType+"/"+(this.prod.FN_EnablerSlug !=undefined?this.prod.FN_EnablerSlug:this.FN_EnablerSlug)+"/"+(this.prod.FP_EnablerSlug !=undefined?this.prod.FP_EnablerSlug:this.FP_EnablerSlug)+"/fundraise_funding_profile"+this.store.getSeprater('user',apPath)+"fundraise-form"              
        }
      }
    }else if(this.pageType =='matching-funding-profiles' ){
      if(isSame){
        if(this.store.appType != 'admin'){
          strPath = ('/user/fundraise-need/submissions/' + this.FN_EnablerSlug+this.store.getSeprater('user',apPath)+'fundraise-form')
        }else{
          strPath = ('admin/'+'fundraise-needs-submitted/'+this.prod.FN_EnablerSlug+this.store.getSeprater(undefined,apPath)+'fundraise-form')

        }
      }else{
        if(this.prod.IsMyFundingProfile == 1||this.prod.IsMyFundraise == 1) {
          strPath = ('/user/funding-profile/submissions/' + this.prod.FP_EnablerSlug+this.store.getSeprater('user',apPath)+'profile-form')
        }else{
          strPath = "user/fundraise-need/details/"+this.pageType+"/"+(this.prod.FN_EnablerSlug !=undefined?this.prod.FN_EnablerSlug:this.FN_EnablerSlug)+"/"+(this.prod.FP_EnablerSlug !=undefined?this.prod.FP_EnablerSlug:this.FP_EnablerSlug)+"/funding_profile_fundraise"+this.store.getSeprater('user',apPath)+"profile-form"
        }
      }
    }
    else if (this.from != 'admin') {
      if(this.pageType=='funding-profiles' && this.prod.FP_EnablerSlug !=undefined && this.from =='profile' && this.pageFrom !='details'){
        strPath = ('/user/funding-profile/submissions/' + this.prod.FP_EnablerSlug+this.store.getSeprater('user',apPath)+'profile-form')
      }
      else if(this.pageType=='funding-profiles' && this.prod.ProfileSlug!=undefined && this.from =='profile' && this.pageFrom !='details' ){
        strPath =('/user/funding-profile/' + this.prod.ProfileSlug+this.store.getSeprater('user',apPath)+'profile-form')
      }
      else if(this.pageType=='funding-profiles' && this.prod.FP_EnablerSlug !=undefined && this.from =='front' && this.pageFrom !='details'){
        strPath =('/funding-profile/' + this.prod.FP_EnablerSlug+this.store.getSeprater(undefined,apPath)+'profile-form')
      }
      else if(this.pageType=='funding-profiles' && this.prod.FP_EnablerSlug !=undefined && this.from =='front' && this.pageFrom =='details'){
        strPath =('/funding-profile/' + this.prod.FP_EnablerSlug+this.store.getSeprater(undefined,apPath)+'profile-form')
      }
      else if(this.pageType=='fundraise' && this.prod.FN_EnablerSlug !=undefined&& this.from =='profile' && this.pageFrom !='details'){
        strPath =('/user/fundraise-need/submissions/' + this.prod.FN_EnablerSlug+this.store.getSeprater('user',apPath)+'fundraise-form')
      }
      else if((this.pageType=='fundraise' || this.pageType=='fundraise-needs') && this.prod.FN_EnablerSlug !=undefined&& this.from =='front' && this.pageFrom !='details'){
        strPath =('/fundraise-need/' + this.prod.FN_EnablerSlug+this.store.getSeprater(undefined,apPath)+'fundraise-form')
      }
      else if((this.pageType=='fundraise' || this.pageType=='fundraise-needs') && this.prod.FN_EnablerSlug !=undefined&& this.from =='front' && this.pageFrom =='details'){
        strPath =('/fundraise-need/' + this.prod.FN_EnablerSlug+this.store.getSeprater(undefined,apPath)+'fundraise-form')
      }
      else if(this.pageType=='fundraise' && this.prod.FundraiseSlug !=undefined&& this.from =='profile' && this.pageFrom !='details'){
        strPath =('/user/fundraise-need/' + this.prod.FundraiseSlug+this.store.getSeprater('user',apPath)+'fundraise-form')
      }
      else{
        strPath = ('/' + (this.pageType == 'enablers'?'enabler':this.pageType) + '/' + ((this.pageType == 'enablers') ? this.prod.EnablerSlug : this.Slug) +this.store.getSeprater(undefined,apPath)+ 'overview');
      }      
    } else if (this.from == 'admin') {
      if (this.pageType == 'funding-profile-view') {
        if(this.prod.ProfileSlug !=undefined)
        strPath = ('/admin/funding-profile/' + this.prod.ProfileSlug +this.store.getSeprater(undefined,apPath)+ 'profile-form');
      } else if (this.pageType == 'enabler-view' || this.pageType == 'enablers'|| this.pageType == 'enabler') {
        if(this.prod.EnablerSlug !=undefined)
        strPath = ('/admin/enabler/' + this.prod.EnablerSlug +this.store.getSeprater(undefined,apPath)+ 'overview');
      } else if (this.pageType == 'fundraise-view' || this.pageType == 'fundraise' ) {
        if(this.prod.FundraiseSlug !=undefined)
        strPath = ('/admin/' +(this.pageType == 'fundraise-view'?'fundraise-needs':'fundraise')+'/' + this.prod.FundraiseSlug + (this.pageType == 'fundraise-view'?this.store.getSeprater(undefined,apPath)+'fundraise-form':this.store.getSeprater(undefined,apPath)+'overview'));
        else if(this.prod.ProfileSlug !=undefined)
        strPath = ('/admin/funding-profile/' + this.prod.ProfileSlug +this.store.getSeprater(undefined,apPath)+ 'profile-form');
      } else {

      }
    }
    let exParms = !strPath.includes('#')?(apPath!=undefined?apPath:''):''
    return strPath+exParms;
  }
  async presentPopover(ev: any, item) {
    this.callAction(ev, item)
    
  }
  async callAction(ev: any, item) {
    var ActionMenu = [];
    if (item.ActionMenuData!= undefined) {
      let Permission = JSON.parse(item.ActionMenuData);
      for (let i = 0; i < Permission.length; i++) {
        const element = Permission[i];
        if (element.TextKey != undefined && element.TextKey != null) {
          if (element.TextKey == 'active' || element.TextKey == 'enable' || element.TextKey == 'featured' || element.TextKey == 'front_panel') {
            let lbl
            if (element.TextKey == 'active') {
              if (item.IsActive) {
                lbl = this.store.getVal('inactive');
              } else {
                lbl = this.store.getVal('active');
              }
              ActionMenu.push({ "DisplayName": lbl, "FunctionName": element.FunctionName, TextKey: element.TextKey, PageType: (element.PageType != undefined ? element.PageType : this.pageType) })
            }
            if (element.TextKey == 'enable') {
              if (item.IsEnable) {
                lbl = this.store.getVal('disable');
              } else {
                lbl = this.store.getVal('enable');
              }
              ActionMenu.push({ "DisplayName": lbl, "FunctionName": element.FunctionName, TextKey: element.TextKey, PageType: (element.PageType != undefined ? element.PageType : this.pageType) })
            }
            if (element.TextKey == 'featured') {
              if (item.IsFeatured) {
                lbl = this.store.getVal('featured_off');
              } else {
                lbl = this.store.getVal('featured_on');
              }
              ActionMenu.push({ "DisplayName": lbl, "FunctionName": element.FunctionName, TextKey: element.TextKey, PageType: (element.PageType != undefined ? element.PageType : this.pageType) })
            }
            if (element.TextKey == 'front_panel') {
              if (item.IsActive) {
                ActionMenu.push({ "DisplayName": this.store.getVal(element.TextKey), "FunctionName": element.FunctionName, TextKey: element.TextKey, PageType: (element.PageType != undefined ? element.PageType : this.pageType) })
              }
            }
          } else {
            ActionMenu.push({ "DisplayName": this.store.getVal(element.TextKey), "FunctionName": element.FunctionName, TextKey: element.TextKey, PageType: (element.PageType != undefined ? element.PageType : this.pageType) })
          }
        }
      }
    }
    if (ActionMenu.length > 0) {
      var id = ''
      if (this.pageType == 'enablers')
        id = item.EnablerID
      if (this.pageType == 'permissions')
        id = item.PageUserID

      var data = { ActionMenu: ActionMenu, item: item, ActionName: this.Name, from: this.from, id: id, type: this.subType, pageType: this.pageType, keyword: this.keyword, sort: this.sort, address: this.address, ActionType: this.ActionType, pageFrom: this.pageFrom, EnablerSlug : this.EnablerSlug,FundraiseSlug:this.FundraiseSlug,ProfileSlug:this.ProfileSlug,FP_EnablerSlug : this.FP_EnablerSlug,FN_EnablerSlug: this.FN_EnablerSlug }

      if(!this.store.IsWebView){
        this.presentSortSheet(ActionMenu)
      }else{
        const popover = await this.popoverController.create({
          component: ActionMenuComponent,
          componentProps: { value: data },
          cssClass: 'action-component',
          event: ev,
          translucent: true,
          side: 'bottom',
          alignment: 'end',
          showBackdrop: false,
          animated: true
        });
        await popover.present();
        popover.onDidDismiss()
          .then((result) => {
            if (result.data != undefined){

              if(!this.isAddForm){
                this.activePage = result.data.action
                if(result.data.key == 'delete' || result.data.key == 'delete_page_user'){
                  let msg = this.store.getVal((result.data.pageType =='user' && !this.store.IsSystemAdmin)?'user_data_delete_confirmation':'delete_confirmation')
                  this.deleteItem(this.prod, result.data.pageType, msg,result)
                }else{
                  if(result.data.key == 'share')
                    this.openShare()
                  else
                    this[result.data.action](result.data.key, result.data.pageType);
                }
              }else{
                this.alertController.create({
                  message: this.store.getVal('unsaved_changes'),
                  animated: true,
                  cssClass: 'alertCustomCssBtn',
                  buttons: [
                      {
                          text: this.store.getVal('yes'),
                          handler: () => { 
                            this.activePage = result.data.action
                            if(result.data.key == 'delete' || result.data.key == 'delete_page_user'){
                              let msg = this.store.getVal((result.data.pageType =='user' && !this.store.IsSystemAdmin)?'user_data_delete_confirmation':'delete_confirmation')
                              this.deleteItem(this.prod, result.data.pageType, msg,result)
                            }else{
                              if(result.data.key == 'share')
                                this.openShare()
                              else
                                this[result.data.action](result.data.key, result.data.pageType);
                            }
                          }
                      },
                      {
                          text: this.store.getVal('no'),
                          role: 'cancel',
                          handler: () => {
                          }
                      }
                  ], backdropDismiss: true
              }).then(res => {
                  res.present();      
                });
              }

              
            }
          });
      }

    } else {
      this.store.showToast(this.store.getVal('you_have_no_premission'), 1500)
    }
  }

  async presentSortSheet(list) {
    let actionSheet;
    actionSheet = await this.actionSheetController.create({
      header: this.itemTitle,
      cssClass: 'my-custom-class',
      buttons: this.createButtons(list)
    });
    await actionSheet.present();
  }
  createButtons(itemList) {
    let buttons = [];
    for (let i = 0; i < itemList.length; i++) {
      let element = itemList[i];
      let button = {
        text: element.DisplayName,
        value: element.FunctionName,
        // cssClass:((element.TextKey=="contact_enabler" || element.TextKey=="report" ) && !this.store.isLogin || element.TextKey=="introduce" ||element.TextKey=="contact_submitter" ?"":element.FunctionName),
        cssClass:"",
        handler: (item) => {

          if(!this.isAddForm){
            this.activePage = element.FunctionName          
          if(element.TextKey == 'delete' || element.TextKey == 'delete_page_user'){
            let msg = this.store.getVal((element.pageType =='user' && !this.store.IsSystemAdmin)?'user_data_delete_confirmation':'delete_confirmation')
            this.deleteItem(this.prod, (element.pageType != undefined?element.pageType:element.PageType), msg,element)
          }else{
            if(element.TextKey == 'share')
              this.openShare()
            else
            this[element.FunctionName](element.TextKey, element.PageType);
          }
          }else{
            this.alertController.create({
              message: this.store.getVal('unsaved_changes'),
              animated: true,
              cssClass: 'alertCustomCssBtn',
              buttons: [
                  {
                      text: this.store.getVal('yes'),
                      handler: () => { 
                        this.activePage = element.FunctionName          
                        if(element.TextKey == 'delete' || element.TextKey == 'delete_page_user'){
                          let msg = this.store.getVal((element.pageType =='user' && !this.store.IsSystemAdmin)?'user_data_delete_confirmation':'delete_confirmation')
                          this.deleteItem(this.prod, (element.pageType != undefined?element.pageType:element.PageType), msg,element)
                        }else{
                          if(element.TextKey == 'share')
                            this.openShare()
                          else
                          this[element.FunctionName](element.TextKey, element.PageType);
                        }
                      }
                  },
                  {
                      text: this.store.getVal('no'),
                      role: 'cancel',
                      handler: () => {
                      }
                  }
              ], backdropDismiss: true
          }).then(res => {
              res.present();      
            });
          }

          
          return true;
        }
      }
      buttons.push(button);
    
      // break;
    }
    return buttons;
  }
  async deleteItem(item: any, pageType, msg,result?) {
    const alert = await this.alertController.create({
      header: this.store.getVal('delete'),
      message: msg,
      animated: true,
      cssClass: 'alertCustomCssBtn',
      buttons: [
        {
          text: this.store.getVal('cancel'),
          role: 'cancel',
          handler: () => {}
        },
        {
          text: this.store.getVal('delete'),
          handler: () => {
            this.deleteData(item, pageType,result);
          }
        }
      ], backdropDismiss: true
    });
    return await alert.present();
  }
  deleteData(item, pageType,result?) {
    let postData = new FormData();
    let rs = result != undefined? result.data !=undefined?result.data:result:undefined
    let endPoint = rs !=undefined&&rs.apiEnd !=undefined?rs.apiEnd:'';
    if(endPoint != undefined && endPoint !=''){
      if(item.EnablerSlug != undefined)
      postData.append('EnablerSlug', item.EnablerSlug)
      if(item.FP_EnablerSlug != undefined)
      postData.append('FP_EnablerSlug', item.FP_EnablerSlug )
      if(item.ProfileSlug != undefined)
      postData.append('ProfileSlug', item.ProfileSlug )
      if(item.FN_EnablerSlug != undefined)
      postData.append('FN_EnablerSlug', item.FN_EnablerSlug )
      if(item.FundraiseSlug != undefined)
      postData.append('FundraiseSlug', item.FundraiseSlug )
    }  
    postData.append('PageType', pageType)
    if (pageType == actType.enabler) {
      endPoint = appApi.enablerDelete;
      postData.append('EnablerSlug', item.EnablerSlug)
    } else if (pageType == actType.enabler_permission) {
      endPoint = appApi.roleDelete;
      postData.append('PageUserID', item.PageUserID);
      postData.append('PageSlug', this.EnablerSlug);
    } else if (pageType == actType.user) {
      endPoint = appApi.userDelete;
      postData.append('UserSlug', item.UserSlug);
    }else {
      endPoint = (pageType =='funding_profile_enabler'?'funding_profile/'+((this.store.appType!='admin'? 'my_':'')+'delete'):
      pageType =='fundraise_enabler'?'fundraise/'+((this.store.appType!='admin'?'my_':'')+'delete'):
      (pageType =='funding_profile' || pageType =='fundraise')? pageType+'/'+((pageType=='fundraise'?'fn':'fp')+'_delete'):
      '')
      if(item.EnablerSlug != undefined)
      postData.append('EnablerSlug', item.EnablerSlug)
      if(item.FP_EnablerSlug != undefined){
        postData.append('FP_EnablerSlug', item.FP_EnablerSlug)
      }
      if(item.FN_EnablerSlug != undefined){
        postData.append('FN_EnablerSlug', item.FN_EnablerSlug)
      }
      if(item.ProfileSlug != undefined){
        postData.append('ProfileSlug', item.ProfileSlug)
      }
      if(item.FundraiseSlug != undefined){
        postData.append('FundraiseSlug', item.FundraiseSlug)
      }
    }
    this.apiService.deleteData(endPoint, postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        if (this.pageFrom == 'Top') {
          this.router.navigateByUrl('/admin#' + this.pageType, { replaceUrl: true })
        }
        item.pageFrom = this.pageFrom
        item.segment = this.pageType

        if(item.Email != undefined && item.Email == this.userData.UserData.Email){
          this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
          this.store.navigatePage([(this.store.appType =='front'?'user':this.store.appType)],(pageType.includes('submissions')?pageType:this.subType),undefined,undefined,true)
        }else if (this.pageFrom == 'relation' ) {
          this.store.backPage();
        }else{
          this.eventService.publishDeleteData(item);
        }       
      }
      this.store.showToast(res.message, 2000,!res.success?'error':undefined);
    });

  }
  onEditEnabler() {
    if (this.subType == 'enablers') {
      this.router.navigateByUrl('/admin/enabler/' + this.prod.EnablerSlug + '/edit');
    }
  }
  onEditUser() {
      this.router.navigateByUrl('/admin/user/' + this.prod.UserSlug + '/edit');
  }
  onDeleteUser(key, pageType) {
   this.activePage=''
    var data = {
      key: key,
      apiEnd:'user/delete',
      pageType: pageType,
      action: 'delete'
    }
  }
  onEditFundraise() {
    if(this.prod.FN_EnablerSlug != undefined && this.prod.FNSubmissionAccept != undefined){
        this.router.navigateByUrl((this.store.appType =='front'?'user':'admin')+'/enabler/'+this.prod.FN_EnablerSlug+'/'+this.prod.EnablerSlug +'/investee/edit/'+this.pageFrom);
    }else if(this.from =='admin' && this.prod.FundraiseSlug != undefined){
      this.router.navigateByUrl('admin/investee/'+this.prod.FundraiseSlug+'/edit_fn');
    }else{
      this.router.navigateByUrl('user/investee/'+this.prod.FundraiseSlug+'/edit_fn');
    }

  }
  onEditFundingProfile() {
    if(this.prod.FP_EnablerSlug != undefined && this.prod.FPSubmissionAccept != undefined){
      this.router.navigateByUrl((this.store.appType =='front'?'user':'admin')+'/enabler/'+this.prod.FP_EnablerSlug+'/'+this.prod.EnablerSlug +'/investor/edit/'+this.pageFrom);
    }else if(this.from =='admin' && this.prod.ProfileSlug !=undefined){
      this.router.navigateByUrl('admin/investor/'+this.prod.ProfileSlug+'/edit_fp');
    }else{
      this.router.navigateByUrl('user/investor/'+this.prod.ProfileSlug+'/edit_fp');
    }
  }
  onEditFrontFundingProfile() {
      this.router.navigateByUrl('user/enabler/'+this.prod.FP_EnablerSlug+'/'+this.prod.EnablerSlug+'/investor/my_edit');
  }
  onCloneFrontFundingProfile() {
    if(this.prod.FPSubmissionAccept == 1)
    this.router.navigateByUrl('user/enabler/'+this.prod.FP_EnablerSlug+'/'+this.prod.EnablerSlug+'/investor/clone');
    else
    this.store.showToast(this.store.getVal('form_configuration_error'),2000,'error')
  }
  onEditFrontFundraise() {
    this.router.navigateByUrl('user/enabler/'+this.prod.FN_EnablerSlug+'/'+this.prod.EnablerSlug+'/investee/my_edit');
  }
  onCloneFrontFundraise() {
    if(this.prod.FNSubmissionAccept == 1)
    this.router.navigateByUrl('user/enabler/'+this.prod.FN_EnablerSlug+'/'+this.prod.EnablerSlug+'/investee/clone');
    else
    this.store.showToast(this.store.getVal('form_configuration_error'),2000,'error')
  }
  onEditPageUser() {  
    this.activePage = '' 
    let path ='/admin/' + this.subType + '/' + (this.subType == 'enablers' ? this.EnablerSlug : '') + '/permission/' +  ((this.pageType == 'enablers')?this.prod.EnablerID:this.prod.PageUserID) + '/edit'
    this.store.openPage(path,'0');
  }
  onPageRole() {
    this.activePage = ''
    this.store.saveData('PageType', this.subType);
  }
  download(key, pageType) {
    this.activePage = ''
    let slug = ''
    let exSlug = ''
    let EnablerSlug = ''
    let endPoint = ''
    let slugParam = ''
    let exSlugParam = ''
    if(this.from == 'user' && (this.pageType == 'full-report' || this.subType =='full-report') && pageType == 'funding_profile_enabler') {
      endPoint = appApi.matchmakingReportAdminExcel
      slugParam = 'FP_EnablerSlug'
      exSlugParam = 'FN_EnablerSlug'
      slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
      exSlug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
    } else if(this.from == 'user' && this.pageType ==  'funding-profile-match-report' && pageType == 'funding_profile_enabler') {
      endPoint = appApi.myFullMatchReportExcel
      slugParam = 'FP_EnablerSlug'
      exSlugParam = 'FN_EnablerSlug'
      slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
      exSlug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
    } else {
      if (this.from == 'admin') {
        if((this.subType =='full-report') && ((this.pageType == 'fundraise-need-match-report' || this.pageType =='matched-fundraise-needs' ) && pageType == 'funding_profile_fundraise') || ((this.pageType == 'funding-profile-match-report' || this.pageType =='matching-funding-profiles') && pageType == 'fundraise_funding_profile')) {
          endPoint = appApi.matchmakingReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
          exSlug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
        }else if(this.pageType == 'fundraise-need-match-report' && pageType == 'fundraise_enabler') {
          endPoint = appApi.fundraiseReportListAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.FP_EnablerSlug != undefined ? this.FP_EnablerSlug : ''
          exSlug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
        } else if(this.pageType == 'funding-profile-match-report' && pageType == 'funding_profile_enabler') {
          endPoint = appApi.fundingProfileReportListAdminExcel
          slugParam = 'FN_EnablerSlug'
          exSlugParam = 'FP_EnablerSlug'
          slug = this.FN_EnablerSlug != undefined ? this.FN_EnablerSlug : ''
          exSlug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
        } else if(((this.pageType == 'fundraise-need-match-report' || this.pageType =='matched-fundraise-needs' ) && pageType == 'funding_profile_fundraise') || ((this.pageType == 'funding-profile-match-report' || this.pageType =='matching-funding-profiles') && pageType == 'fundraise_funding_profile')) {
          endPoint = pageType == 'funding_profile_fundraise'?appApi.fundraiseReportListAdminExcel:appApi.fundingProfileReportListAdminExcel
          slugParam = pageType == 'funding_profile_fundraise'?'FP_EnablerSlug':'FN_EnablerSlug'
          exSlugParam = pageType == 'funding_profile_fundraise'?'FN_EnablerSlug':'FP_EnablerSlug'
          slug =  pageType == 'funding_profile_fundraise'?(this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''):this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
          exSlug =  pageType == 'funding_profile_fundraise'?(this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''):(this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : '')
          EnablerSlug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        } else if(this.pageType == 'fundraise-need-match-report' && pageType == 'fundraise_enabler') {
          endPoint = appApi.myFNMatchReportExcel
          slugParam = 'FN_EnablerSlug'
          slug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
        } else if(pageType == 'fundraise_enabler') {
          endPoint = appApi.FNsubmittedAtEnablersDetailAdminExcel
          slugParam = 'FN_EnablerSlug'
          slug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
          exSlugParam = 'EnablerSlug'
          exSlug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        } else if(pageType == 'funding_profile_enabler') {
          endPoint = appApi.FPsubmittedAtEnablersDetailAdminExcel
          slugParam = 'FP_EnablerSlug'
          slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
          exSlugParam = 'EnablerSlug'
          exSlug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        }else if(pageType == 'fundraise_funding_profile') {
          endPoint = appApi.fundingProfileReportListAdminExcel
          slugParam = 'FN_EnablerSlug'
          slug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
          exSlugParam = 'EnablerSlug'
          exSlug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        } else if(pageType == 'enablers' || pageType == 'enabler') {
          slugParam = 'EnablerSlug'
          endPoint = appApi.EnablerDetailAdminExcel
          slug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        } else if(pageType == 'funding_profile') {
          slugParam = 'ProfileSlug'
          endPoint = appApi.FPDetailAdminExcel
          slug = this.prod.ProfileSlug != undefined ? this.prod.ProfileSlug : ''
        } else if(pageType == 'fundraise' || pageType == 'fundraise-needs') {
          slugParam = 'FundraiseSlug'
          endPoint = appApi.FNDetailAdminExcel
          slug = this.prod.FundraiseSlug != undefined ? this.prod.FundraiseSlug : ''
        }else if(pageType =='funding_profile_fundraise'){
          endPoint = appApi.matchmakingReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
          exSlug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
          EnablerSlug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        } else if(this.pageType = 'full-report') {
          endPoint = appApi.fullReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
          exSlug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
          EnablerSlug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        }
      } else if(this.from == 'profile' || this.from == 'user') {
        if(pageType == 'funding_profile' && this.pageFrom != 'funding-profile-submissions') {
          slugParam = 'ProfileSlug'
          endPoint = appApi.myFPDetailExcel
          slug = this.prod.ProfileSlug != undefined ? this.prod.ProfileSlug : ''
        } else if(pageType == 'fundraise' && this.pageFrom != 'fundraise-need-submissions') {
          slugParam = 'FundraiseSlug'
          endPoint = appApi.myFNDetailExcel
          slug = this.prod.FundraiseSlug != undefined ? this.prod.FundraiseSlug : ''
        } else if((pageType == 'funding_profile_enabler') || (pageType == 'funding_profile' && this.pageFrom == 'funding-profile-submissions')) {
          slugParam = 'FP_EnablerSlug'
          endPoint = appApi.myFPSubmittedAtEnablersDetailExcel
          slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
        } else if((pageType == 'fundraise_enabler') || (pageType == 'fundraise' && this.pageFrom == 'fundraise-need-submissions')) {
          slugParam = 'FN_EnablerSlug'
          endPoint = appApi.myFNSubmittedAtEnablersDetailExcel
          slug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
        } else if(pageType == 'enablers' || pageType == 'enabler') {
          slugParam = 'EnablerSlug'
          endPoint = appApi.EnablerDetailExcel
          slug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        } else if(pageType =='funding_profile_fundraise'){
          endPoint = appApi.matchmakingReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
          exSlug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
          EnablerSlug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        } else if(this.pageType = 'full-report') {
          endPoint = appApi.fullReportAdminExcel
          slugParam = 'FP_EnablerSlug'
          exSlugParam = 'FN_EnablerSlug'
          slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
          exSlug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
          EnablerSlug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        }
      } else if(this.from == 'front') {
        if(pageType == 'funding_profile_enabler') {
          slugParam = 'FP_EnablerSlug'
          endPoint = appApi.exploreFPsubmittedAtEnablersDetailExcel
          slug = this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : ''
        } else if(pageType == 'fundraise_enabler') {
          slugParam = 'FN_EnablerSlug'
          endPoint = appApi.exploreFNsubmittedAtEnablersDetailExcel
          slug = this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : ''
        } else if(pageType == 'enablers' || pageType == 'enabler') {
          slugParam = 'EnablerSlug'
          endPoint = appApi.EnablerDetailExcel
          slug = this.prod.EnablerSlug != undefined ? this.prod.EnablerSlug : ''
        } 
      }
    }
    this.apiService.callDownload(endPoint, slugParam, slug, this.keyword, this.sort, pageType,exSlugParam !=''?exSlugParam:'EnablerSlug',exSlug != ''?exSlug:EnablerSlug,(slugParam == 'EnablerSlug' || exSlugParam == 'EnablerSlug' )?'':'EnablerSlug', this.EnablerSlug);

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
  callCheckIntroduceData(eslug,pslug,fslug,mptype) {
    this.apiService.getIntroduceInfo(eslug,pslug,fslug,mptype).subscribe(async response => {
     let res: any = response;
     if(!res.success){
       this.store.showToast(res.message,5000,'error','middle')
     }else{
       let url = ('introduce/'+eslug+'/'+pslug+'/'+fslug+'/'+ this.pageType+'/'+(this.pageFrom == undefined || this.pageFrom == ''?'list':this.pageFrom.toLowerCase())+'/'+mptype)
       this.router.navigateByUrl(url);
     }
     return res.success
   });
   // return false
 }
 contactUsMenu(key, pageType) {
  if ((key != 'contact_us' && key !='contact-impact-funding-resources') && !this.store.isLogin) {
      let url =window.location.href
      this.store.navSavePage=url.replace(window.location.origin,'');
    this.router.navigateByUrl('/auth#login');
    return
  }
  if(key == 'contact_submitter'){
    
    let fnslug = (this.FN_EnablerSlug != undefined && this.FN_EnablerSlug !='')?this.FN_EnablerSlug:this.prod.FN_EnablerSlug;
    let fpslug = (this.FP_EnablerSlug != undefined && this.FP_EnablerSlug !='')?this.FP_EnablerSlug:this.prod.FP_EnablerSlug;
    
    let slug = ((fnslug != undefined && fnslug !='')?(fnslug):(fpslug != undefined && fpslug !='')?fpslug:'');
    
    let url = ('contact-submitter/'+this.prod.EnablerSlug+'/'+slug+'/'+ this.pageType+'/'+this.pageFrom.toLowerCase()+'/'+pageType)
    this.router.navigateByUrl(url);
  }else if(key == 'introduce'){
    this.callCheckIntroduceData(this.prod.EnablerSlug,((this.prod.FP_EnablerSlug != undefined && this.prod.FP_EnablerSlug !='')?this.prod.FP_EnablerSlug:this.FP_EnablerSlug),((this.prod.FN_EnablerSlug != undefined && this.prod.FN_EnablerSlug !='')?this.prod.FN_EnablerSlug:this.FN_EnablerSlug),pageType)
  }else{
    let PermissionKey= key;
    let PageSlug = this.prod.SummaryID !=undefined?this.prod.SummaryID:this.prod.ImpactFundingResourcesSlug !=undefined?this.prod.ImpactFundingResourcesSlug:this.prod.EnablerSlug !=undefined?this.prod.EnablerSlug:this.EnablerSlug != undefined ?this.EnablerSlug:'';

    pageType = (this.prod.SummaryID !=undefined?'activity-log':pageType)

    let FN_EnablerSlug= this.prod.FN_EnablerSlug !=undefined?this.prod.FN_EnablerSlug:this.FN_EnablerSlug != undefined ?this.FN_EnablerSlug:'';
    let FP_EnablerSlug= this.prod.FP_EnablerSlug !=undefined?this.prod.FP_EnablerSlug:this.FP_EnablerSlug != undefined ?this.FP_EnablerSlug:'';
    let path='';
    // this.store.setGetParameter('path','',true)
    this.store.setGetParameter('FN_EnablerSlug','',true)
    this.store.setGetParameter('FP_EnablerSlug','',true)

    // let apPath='?path='+ encodeURIComponent(window.location.href)
    let apPath=''
    
    if(FN_EnablerSlug != '' && FP_EnablerSlug != ''){
      if(PermissionKey =='contact_enabler'){
        console.log('1')
        
        apPath = apPath+'?FN_EnablerSlug='+FN_EnablerSlug+'&FP_EnablerSlug='+FP_EnablerSlug
        if(this.from != 'front'){
          console.log('2')
          path= 'user/enabler/' +PageSlug +this.store.getSeprater('user',apPath)+ 'contact';
        }else{
          path='/enabler/'+PageSlug+'/contact'+apPath
        }
      }else{        
        path=(PermissionKey).replace('_','-')+'/'+PageSlug+'/'+FN_EnablerSlug+'/'+FP_EnablerSlug+'/'+pageType //+'?path='+ encodeURIComponent(window.location.href)
      }
    }else if((FN_EnablerSlug != '' || FP_EnablerSlug !='') && PermissionKey != ''){
      if(PermissionKey =='contact_enabler'){
        console.log('3',this.from)
        apPath = apPath+'?'+(FN_EnablerSlug != ''?'FN_EnablerSlug':'FP_EnablerSlug')+'='+(FN_EnablerSlug != ''?FN_EnablerSlug:FP_EnablerSlug)
        if(this.from != 'front'){
          console.log('4')
          path= 'user/enabler/' +PageSlug +this.store.getSeprater('user',apPath)+ 'contact';
        }else{
        path='/enabler/'+PageSlug+'/contact'+apPath
      }
      }else{        
        path=(PermissionKey).replace('_','-')+'/'+PageSlug+'/'+(FN_EnablerSlug != ''?FN_EnablerSlug:FP_EnablerSlug)+'/'+pageType//+'?path='+ encodeURIComponent(window.location.href)
      }
    }else{
      if(PermissionKey =='contact_enabler'){
        console.log('5')
        if(this.from != 'front'){
          console.log('6')
          path= 'user/enabler/' +PageSlug +this.store.getSeprater('user',undefined)+ 'contact';
        }else{
          path='/enabler/'+PageSlug+'/contact'//+apPath
        }
      }else{
        path =(PermissionKey).replace('_','-')+'/'+PageSlug+'/'+pageType //+'?path='+ encodeURIComponent(window.location.href)
      }
    }
    localStorage.setItem('pagePath',window.location.href)
    this.store.openPage(path,'1',undefined,window.location.href);
  }
}
}

