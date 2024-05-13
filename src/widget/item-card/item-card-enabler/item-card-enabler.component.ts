import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'item-card-enabler',
  templateUrl: './item-card-enabler.component.html',
  styleUrls: ['./item-card-enabler.component.scss'],
})
export class ItemCardEnablerComponent implements OnInit {
  GenderLensJson: any = []
  ImpactThemesAndAreas: any = [];
  ESG: any = [];
  sdgList: any = []
  @Input()
  extraTitle: boolean = false;
  @Input()
  isAddForm: boolean = false;
  @Input()
  isMain: boolean = false;
  @Input()
  from: string;
  @Input()
  Name: string = '';
  @Input()
  AlertUID: any = '';
  @Input()
  openFront: string = '0';
  @Input()
  EnablerSlug: string;
  @Input()
  FPEnablerSlug: string;
  @Input()
  FNEnablerSlug: string;
  @Input()
  selectedEnabler: string;

  @Input()
  ProfileSlug: string;
  @Input()
  FundraiseSlug: string;
  @Input()
  keyword: string;
  @Input()
  address: string = '';
  @Input()
  sort: string;
  @Input()
  extraMenu: boolean=true;


  @Input()
  type: string;
  @Input()
  subtype: string;
  @Input()
  prod: any;
  @Input()
  pageFrom: any;
  @Input()
  isDetails: any = false;
  @Input()
  isAdd: any = false;
  @Input()
  byName: any;
  @Input()
  ActionType: any = '';
  @Input()
  apiAction: any = '';
  @Input()
  hideAction: any = '0';

  @Input()
  seeMore: any = false;

  @Input()
  scheduleData: any = [];

  SdgList: any = '';
  moreItem: any = 2;
  esgMoreItem: any = 2;
  genderMoreItem: any = 2;

  EnablerData: any = []
  FundraiseData: any = []
  FundingProfileData: any = []




  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  // ReactionValue:any;

  public isMenuOpen: boolean = false;
  constructor(public alertController: AlertController, public store: StorageService, public apiService: ApiService, public platform: Platform, public router: Router, private eventService: EventService) {
    
  }
  ngOnInit() {
    // console.log('prod - ',this.prod)
    if (this.prod != undefined && this.prod != '' && this.prod.ReferenceValueJsonData != undefined && this.prod.ReferenceValueJsonData != undefined && this.type == 'enablers' && this.from == 'admin') {
      let ReferenceValueJsonData = JSON.parse(this.prod.ReferenceValueJsonData);
      if (ReferenceValueJsonData != undefined && ReferenceValueJsonData != '' &&
        ReferenceValueJsonData.length != 0) {
      }
    }
    // this.getngModal(this.prod)
    if (this.prod != undefined && this.prod != '' && this.prod.EnablerData != undefined) {
      this.EnablerData = JSON.parse(this.prod.EnablerData);
    }
    if (this.prod != undefined && this.prod != '' && this.prod.FundraiseData != undefined && this.prod.FundraiseData != undefined) {
      this.FundraiseData = JSON.parse(this.prod.FundraiseData);
    }
    if (this.prod != undefined && this.prod != '' && this.prod.FundingProfileData != undefined) {
      this.FundraiseData = JSON.parse(this.prod.FundingProfileData);
    }
    if (this.prod != undefined && this.prod != '' && this.prod.ImpactThemesAndAreasJson != undefined) {
      this.ImpactThemesAndAreas = JSON.parse(this.prod.ImpactThemesAndAreasJson);
    }
    if (this.prod != undefined && this.prod != '' && this.prod.EsgJson != undefined) {
      this.ESG = JSON.parse(this.prod.EsgJson);
    }
    if (this.prod != undefined && this.prod != '' && this.prod.SdgsJson != undefined) {
      this.sdgList = JSON.parse(this.prod.SdgsJson);
    }
    if (this.prod != undefined && this.prod != '' && this.prod.GenderLensJson != undefined) {
      // this.GenderLensJson = JSON.parse(this.prod.GenderLensJson);
      this.GenderLensJson = [{
        "ReferenceKey": "",
        "ReferenceName": this.prod.GenderLens,
        "ParentReferenceName": this.store.getVal('gender_lens'),
      }];
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  getIcon(type){
    let checkStr= this.prod.ReferenceCode == undefined? type=='matching-funding-profiles'?this.prod.FPReferenceCode:this.prod.FNReferenceCode:this.prod.ReferenceCode
    let val =checkStr !=undefined?checkStr:''
    return type!=='matched-fundraise-needs'?val.includes('SIP-')?'fa-money-bill-transfer fa-solid':'fa-money-bills fa-solid':'fa-rocket fa-solid'
  }
  getTitle(){
    let titl=''
    titl = this.subtype =='impact-funding-resources'?this.prod.Title:this.subtype =='users'?this.prod.ContactName:this.subtype =='full-report'?(this.prod.FPReferenceCode != undefined?this.prod.FPReferenceCode:this.prod.ReferenceCode)+' < > '+(this.prod.FNReferenceCode != undefined?this.prod.FNReferenceCode:this.prod.ReferenceCode) :this.prod.ReferenceCode !=undefined?this.prod.ReferenceCode:''
    return titl
  }
  callIntroduce(type){
    let eslug = this.prod.EnablerSlug;
    let pslug = ((this.prod.FP_EnablerSlug != undefined && this.prod.FP_EnablerSlug !='')?this.prod.FP_EnablerSlug:this.FPEnablerSlug);
    let fslug = ((this.prod.FN_EnablerSlug != undefined && this.prod.FN_EnablerSlug !='')?this.prod.FN_EnablerSlug:this.FNEnablerSlug);
    ((this.prod.FP_EnablerSlug != undefined && this.prod.FP_EnablerSlug !='')?this.prod.FP_EnablerSlug:this.FPEnablerSlug)

    this.apiService.getIntroduceInfo(eslug,pslug,fslug,type).subscribe(async response => {
      let res: any = response;
      if(!res.success){
        this.store.showToast(res.message,5000,'error','middle')
      }else{
        let url = ('introduce/'+eslug+'/'+pslug+'/'+fslug+'/'+ this.type+'/'+(this.pageFrom == undefined || this.pageFrom == ''?'list':this.pageFrom.toLowerCase())+'/'+type)
        this.router.navigateByUrl(url);
      }
      return res.success
    });
  }

  async selectPlan(item){
      const alert = await this.alertController.create({
        message: (this.selectedEnabler !=undefined && this.selectedEnabler !='' || this.pageFrom =='pre-login')?this.store.getVal('buy_plan_conform_msg')+'<br /><b>'+item.PlanName+'</b>?':this.store.getVal('please_select_enabler'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons:  this.actionBtn((this.selectedEnabler !=undefined&& this.selectedEnabler !='' || this.pageFrom =='pre-login'),item), backdropDismiss: true
      });
      return await alert.present();
  }
  actionBtn(isTwo: boolean,item) {

    let buttons = [];
    buttons.push({
      text: this.store.getVal(isTwo?'yes':'okay'),
      handler: () => {
        if(isTwo){
          if(this.pageFrom =='pre-login'){
            if(this.store.appType =='admin'){
              this.store.openPage('auth?Plan='+item.PlanID+'#signup','1')
            }else{
                this.callUpdateRef(item)
            }
          }else{
            this.planApply(item);
          }
        }
      }
    })
    if(isTwo)
    buttons.push({
      text: this.store.getVal('no'),
      role: 'cancel',
      handler: () => { }
    })
    return buttons;
  
  }
  callUpdateRef(item) {
    if(this.store.isLogin){
      let postData = new FormData();
      postData.append("PlanID", item.PlanID);
      this.apiService.update('subscription_plans', 'save_reference_plan', postData).subscribe(response => {
        let res: any = response;
        if (res.success) {
          window.open(environment.redirectAdmin+('admin/add-enabler'), '_blank')
        }
        this.store.showToast(res.message, 2000,(res.success?undefined:'error'));
      });
    }else{
      window.open(environment.redirectAdmin+('auth?Plan='+item.PlanID+'#signup'), '_blank')
    }
  }
  planApply(item: any) {
    let postData = new FormData();
    postData.append("PlanID", item.PlanID);
    postData.append("EnablerID", this.selectedEnabler);
    this.apiService.selectPlan(postData).subscribe(async response => {
      let res: any = response;
      const alert = await this.alertController.create({
        message: res.message,
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: this.store.getVal('okay'),
            handler: () => {
              // this.openUserConfirmationBox();
              if(res.success)
              this.store.openPage('admin#subscripions',this.openFront)
            }
          }
        ], backdropDismiss: true
      });
      return await alert.present();
      // this.store.showToast(res.message, 2000,res.success?undefined:'error');
    });
  }
  cutomData(type){
    let prod = JSON.parse(JSON.stringify(this.prod));
      delete prod.EnablerName;
    return prod;
  }
  checkShowMore(item) {
    return item != undefined && item.ShowMore != undefined ? item.ShowMore : false
  }
  clickMoreAction(item, type) {
    let indsa = this[type == 'esg' ? 'ESG' :type == 'gender-lens' ? 'GenderLensJson' : 'ImpactThemesAndAreas'].findIndex(v => v.ReferenceKey == item.ReferenceKey)
    this[type == 'esg' ? 'ESG' :type == 'gender-lens' ? 'GenderLensJson' : 'ImpactThemesAndAreas'][indsa].ShowMore = !this[type == 'esg' ? 'ESG' :type == 'gender-lens' ? 'GenderLensJson' : 'ImpactThemesAndAreas'][indsa].ShowMore
  }
  getLbl(item, type) {
    return item != undefined && item['' + type] != undefined ? item['' + type] : undefined
  }
  trimString(string, length) {
    return string.length > length ? string.substring(0, length) + '...' : string;
  }
  nl2br(text: string) {
    if (text != undefined)
      return text.replace(/\\r\\n|\\r|\\n/gi, '\n');
  }
  getTags(datas){
    let lst= datas != undefined?datas.split(', '):[]
    return lst;
  }
  viewMore() {
    if (this.moreItem == 2) {
      this.moreItem = this.ImpactThemesAndAreas.length
    } else {
      this.moreItem = 2
    }
  }
  changeViewTag(event){
  if(event !=undefined && event.seeMore != undefined){
    this.seeMore = event.seeMore
  }
  }
  viewESGMore() {
    if (this.esgMoreItem == 2) {
      this.esgMoreItem = this.ESG.length
    } else {
      this.esgMoreItem = 2
    }
  }
  genderViewMore() {
    if (this.genderMoreItem == 2) {
      this.genderMoreItem = this.GenderLensJson.length
    } else {
      this.genderMoreItem = 2
    }
  }
  openClick(prod) {
    prod.activePage = ''
    prod.activePage = 'contactUsMenu'
    // this.router.navigateByUrl('contact');
  }
  click(item, sPos, pos?) {
    let cType = 'add'
    if (item.ReactionValue == this.store.InterestResult[sPos].ReferenceKey) {
      cType = 'remove'
    }
    this.change.emit({ ReactionType: 'interest', callType: cType, prod: this.prod, sPos: pos, IDs: item.EnablerSlug, click: this.store.InterestResult[sPos].ReferenceKey })
  }
  submittedDetails(type, action?) {
    if (action == undefined)
      action = 'overview'
    let mAction = action;
    if(type !=undefined ){
      this.store.setGetParameter('FilterType',type,type=='')
      this.store.setGetParameter('chipLbl',(type == 'introductions'?'total_'+type:type),type=='')
    }
    this.change.emit({ action: action, mAction: mAction, pageFrom: this.pageFrom })
  }
  filterItem(type, item) {
    // if(this.pageFrom != 'Top')
    // this.change.emit({Type:type,item:item});
  }
  openEnabler(){
    if(this.isAddForm){
      this.alertController.create({
        message: this.store.getVal('unsaved_changes'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
            {
                text: this.store.getVal('yes'),
                handler: () => { 
                  this.store.openPage(this.enablerPath(),this.openFront)
                }
            },
            {
                text: this.store.getVal('no'),
                role: 'cancel',
                handler: () => {
                    return false;
                }
            }
        ], backdropDismiss: true
    }).then(res => {
        res.present();      
      });
    }else{
      this.store.openPage(this.enablerPath(),this.openFront)
    }
  }

  enablerPath() {
    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    
    let routePath=''
    if (this.from != 'admin') { 
      routePath = (this.from == 'user' && !this.isAddForm ?'user':'')+('/' + (this.type == 'enablers'?'enabler':this.type) + '/' +  this.prod.EnablerSlug +this.store.getSeprater((this.from == 'user' && this.type == 'enablers'&& !this.isAddForm?this.from:undefined),apPath)+ 'overview');

      // routePath = '/enabler/'+ this.prod.EnablerSlug +this.store.getSeprater()+'overview'+(apPath!=undefined?apPath:'')
    } else if (this.from == 'admin') {
        routePath = ('/admin/enabler/' + this.prod.EnablerSlug +this.store.getSeprater(undefined,apPath)+ 'overview');
    }
    return routePath;
  }

  itemDetails(isSame?, type?,extraPath?,FilterType?) {
    if (!this.isAddForm) {
      this.store.openPage(this.routePath(isSame, type,extraPath,FilterType),this.openFront)
    } else {
      this.alertController.create({
        message: this.store.getVal('unsaved_changes'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: this.store.getVal('yes'),
            handler: () => {
              this.store.openPage(this.routePath(isSame, type,extraPath,FilterType),this.openFront)
            }
          },
          {
            text: this.store.getVal('no'),
            role: 'cancel',
            handler: () => {
              return false;
            }
          }
        ], backdropDismiss: true
      }).then(res => {
        res.present();
      });
    }
    // this.change.emit({});
  }
  openMatching(item, fromEnabler) {
    if (!fromEnabler)
      this.router.navigateByUrl('admin/full-report/' + (item.FundingProfileUID != undefined ? item.FundingProfileUID : this.prod.FundingProfileUID) + '/' + item.FundraiseUID + '/detail')
    else
      this.router.navigateByUrl('admin/full-report/' + (item.FundingProfileUID != undefined ? item.FundingProfileUID : this.prod.FundingProfileUID) + '/' + (item.FundraiseUID != undefined ? item.FundraiseUID : this.prod.FundraiseUID) + '/' + item.EnablerSlug + '/detail')
  }
  matchingPath(item) {
    return ((this.store.appType =='admin'?'admin/full-report/':'user/full-report/')+(item.FP_EnablerSlug != undefined ? item.FP_EnablerSlug : this.FPEnablerSlug) + '/' + (item.FN_EnablerSlug != undefined ? item.FN_EnablerSlug : this.FNEnablerSlug) + '/detail')
  }
  Matching(item) {
    this.router.navigateByUrl(this.matchingPath(item))
  }
  selectStatus(event) {

  }

  routePath(isSame?, type?,extraPath?,FilterType?) {

    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;

    if(FilterType !=undefined && FilterType !=''){
      apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
      apPath = (apPath+'FilterType='+ FilterType)
      apPath = apPath+'&chipLbl='+(FilterType == 'introductions'?'total_'+FilterType:FilterType)
    }

    type == undefined ? this.type : type
    let action;
    (this.apiAction != 'enabler') ? action = 'enabler' : ''
    let strPath = '';
    if (type == 'matched-fundraise-needs') {
        if(this.store.appType== 'admin'){
          strPath = this.getAdminMatchPath('fundraise',extraPath,apPath)
        }else{
          if (isSame) {
            strPath = ('/user/funding-profile/submissions/' + (this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : this.FPEnablerSlug) + this.store.getSeprater('user',apPath) + extraPath)
          } else {
            if (this.isUser(type) || this.store.appType =='admin') {
              strPath = ('user/fundraise-need/submissions/' + (this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : this.FNEnablerSlug) + this.store.getSeprater('user',apPath) + extraPath);
            } else {
              strPath = "user/funding-profile/details/fundraise-need-match-report/" + (this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : this.FNEnablerSlug) + "/" + (this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : this.FPEnablerSlug) + "/funding_profile_fundraise" + this.store.getSeprater('user',apPath) + "fundraise-form"
            }    
          }
        }
    } else if (type == 'matching-funding-profiles') {
      if(this.store.appType== 'admin'){
        strPath = this.getAdminMatchPath('profile',extraPath,apPath)
      }else{
        if (isSame) {
          strPath = ('/user/fundraise-need/submissions/' + (this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : this.FNEnablerSlug) + this.store.getSeprater('user',apPath) +extraPath)
        } else {
          if (this.isUser(type) || this.store.appType =='admin') {
            strPath = ('user/funding-profile/submissions/' + (this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : this.FPEnablerSlug) + this.store.getSeprater('user',apPath) + extraPath)+(apPath!=undefined && this.store.getSeprater('user',apPath)=='/'?apPath:'');
          } else {
            strPath = "user/fundraise-need/details/funding-profile-match-report/" + (this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : this.FNEnablerSlug) + "/" + (this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : this.FPEnablerSlug) + "/fundraise_funding_profile" + this.store.getSeprater('user',apPath) + "profile-form"  
          }
        }
      }
    } else if (this.from != 'admin' || this.openFront == '1') {
      if (type == 'funding-profiles' && this.prod.FP_EnablerSlug != undefined && this.from == 'profile' && this.pageFrom != 'details') {
        strPath = ('/user/funding-profile/submissions/' + this.prod.FP_EnablerSlug + this.store.getSeprater('user',apPath) + 'profile-form')
      }
      else if (type == 'funding-profiles' && this.prod.ProfileSlug != undefined && this.from == 'profile' && this.pageFrom != 'details') {
        strPath = ('/user/funding-profile/' + this.prod.ProfileSlug + this.store.getSeprater('user',apPath) + 'profile-form')
      }
      else if (type == 'funding-profiles' && this.prod.FP_EnablerSlug != undefined && this.from == 'front' && this.pageFrom != 'details') {
        strPath = ('/funding-profile/' + this.prod.FP_EnablerSlug + this.store.getSeprater(undefined,apPath) + 'profile-form')+(apPath!=undefined && this.store.getSeprater(undefined,apPath)=='/'?apPath:'')
      }
      else if (type == 'funding-profiles' && this.prod.FP_EnablerSlug != undefined && this.from == 'front' && this.pageFrom == 'details') {
        strPath = ('/funding-profile/' + this.prod.FP_EnablerSlug + this.store.getSeprater(undefined,apPath) + 'profile-form')+(apPath!=undefined && this.store.getSeprater(undefined,apPath)=='/'?apPath:'')
      }
      else if (type == 'fundraise' && this.prod.FN_EnablerSlug != undefined && this.from == 'profile' && this.pageFrom != 'details') {
        strPath = ('/user/fundraise-need/submissions/' + this.prod.FN_EnablerSlug + this.store.getSeprater('user',apPath) + 'fundraise-form')
      }
      else if ((type == 'fundraise' || type == 'fundraise-needs') && this.prod.FN_EnablerSlug != undefined && this.from == 'front' && this.pageFrom != 'details') {
        strPath = ('/fundraise-need/' + this.prod.FN_EnablerSlug + this.store.getSeprater(undefined,apPath) + 'fundraise-form')+(apPath!=undefined && this.store.getSeprater(undefined,apPath)=='/'?apPath:'')
      }
      else if ((type == 'fundraise' || type == 'fundraise-needs') && this.prod.FN_EnablerSlug != undefined && this.from == 'front' && this.pageFrom == 'details') {
        strPath = ('/fundraise-need/' + this.prod.FN_EnablerSlug + this.store.getSeprater(undefined,apPath) + 'fundraise-form')+(apPath!=undefined && this.store.getSeprater(undefined,apPath)=='/'?apPath:'')
      }
      else if (type == 'fundraise' && this.prod.FundraiseSlug != undefined && this.from == 'profile' && this.pageFrom != 'details') {
        strPath = ('/user/fundraise-need/' + this.prod.FundraiseSlug + this.store.getSeprater('user',apPath) + 'fundraise-form')
      }
      else {
        strPath = ('/' + (type == 'enablers' ? 'enabler' : type) + '/' + this.prod.EnablerSlug + this.store.getSeprater(undefined,apPath) + 'overview')+(apPath!=undefined && this.store.getSeprater(undefined,apPath)=='/'?apPath:'');
      }
    } else if (this.from == 'admin') {
      if (type == 'funding-profile-view') {
        if (this.prod.ProfileSlug != undefined)
          strPath = ('/admin/funding-profile/' + this.prod.ProfileSlug + this.store.getSeprater(undefined,apPath) + 'profile-form');
      } else if (type == 'enabler-view' || type == 'enablers' || type == 'enabler') {
        if (this.prod.EnablerSlug != undefined)
          strPath = ('/admin/enabler/' + this.prod.EnablerSlug + this.store.getSeprater(undefined,apPath) + 'overview');
      } else if (type == 'fundraise-view' || type == 'fundraise') {
        if (this.prod.FundraiseSlug != undefined)
          strPath = ('/admin/' + (type == 'fundraise-view' ? 'fundraise-needs' : 'fundraise') + '/' + this.prod.FundraiseSlug + (type == 'fundraise-view' ? this.store.getSeprater(undefined,apPath) + 'fundraise-form' : this.store.getSeprater(undefined,apPath) + 'overview'));
        else if (this.prod.ProfileSlug != undefined)
          strPath = ('/admin/funding-profile/' + this.prod.ProfileSlug + this.store.getSeprater(undefined,apPath) + 'profile-form');
      } else {

      }
    }
    return strPath;
  }
  getAdminMatchPath(actionName,extraPath,apPath?): string {
    let endPoint = actionName+'-form'
    endPoint = extraPath != undefined?extraPath:endPoint
    return ('admin/'+(actionName=='profile'?'funding-profiles':'fundraise-needs')+'-submitted/'+(actionName =='profile'?this.prod.FP_EnablerSlug:this.prod.FN_EnablerSlug)+this.store.getSeprater(undefined,apPath)+endPoint)
  }



  isUser(type?) {
    return ((type == 'matching-funding-profiles' && this.prod.IsMyFundingProfile == 1) || (type == 'matched-fundraise-needs' && this.prod.IsMyFundraise == 1))
  }
  callAction(event) {
    if (event != undefined && event.pageFrom == 'details') {
      event.item = this.prod
      event.ClickFrom = this.type
      this.eventService.publishChangeSegment(event);
    } else {
      this.change.emit(event);
    }
  }
  changePitchStatus(type,endPoint,row) {
    // row.cassette1Bill = '22';
    let postData = new FormData();
    postData.append("RequestStatus", row.PitchRequestStatus);
    postData.append("FN_EnablerSlug", row.FN_EnablerSlug);
    postData.append("FP_EnablerSlug", row.FP_EnablerSlug);
    this.apiService.update(type, endPoint, postData).subscribe(response => {
      // let res = this.store.getReponseData(response)
      let res: any = response;
      if (res.success) {
        if(res.data != undefined) {
          // this.change.emit({ TotalExpressedInterest: res.data.TotalExpressedInterest })
        }
        this.store.showToast(res.message, 2000);
      }
    });

  }
  callFilter(event) {
    event.Filter = true
    this.change.emit(event);
  }
  callCountryFilter() {
    this.change.emit({ companyFilter: true, item: this.prod });
  }
  onSelectionChanged(event,type){
    this.changed(type,'update_reaction','interest',this.prod,event)
  }
  changed(type, endPoint, rType, prod,value?) {
    let postData = new FormData();
    postData.append("ReactionType", rType);
    postData.append("ReactionValue", value  != undefined && value  != '' ? value : 'remove');
    // postData.append("ReactionValue", this.ReactionValue != undefined ? this.ReactionValue : 'remove');
    postData.append("FN_EnablerSlug", prod.FN_EnablerSlug != undefined ? prod.FN_EnablerSlug : this.FNEnablerSlug);
    postData.append("FP_EnablerSlug", prod.FP_EnablerSlug != undefined ? prod.FP_EnablerSlug : this.FPEnablerSlug);
    this.apiService.update(type, endPoint, postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        if (res.data != undefined) {
          if(type =='funding_profile'){
            this.prod.FPExpressedInterestKey = value
            this.prod.FPReactionValueKey = value
          }else{            
            this.prod.FNExpressedInterestKey = value;
            this.prod.FNReactionValueKey = value
          }
          this.change.emit({ TotalExpressedInterest: res.data.TotalExpressedInterest,item: this.prod })
        }
        this.store.showToast(res.message, 2000);
      }
    });

  }
  callRequest(item,isView?) {
    //PitchRequestStatus
    let apiEnd = 'fundraise/'
    let type = 'view'
    let postData = new FormData();
    postData.append("FN_EnablerSlug", item.FN_EnablerSlug);
    if ((item.PitchRequestStatus == undefined || item.PitchRequestStatus == '' || item.PitchRequestStatus == 'blank')) {
      apiEnd = apiEnd + 'add_pitch_request'
      type = 'add'
      postData.append("FP_EnablerSlug", (item.FP_EnablerSlug != undefined ? item.FP_EnablerSlug : this.FPEnablerSlug));
    } else {
      apiEnd = apiEnd + 'view_pitch'
      postData.append("RequestStatus", 'approved');
    }
    if(item.PitchRequestStatus !='approved' && !isView){
      this.apiService.pitchCall(type, apiEnd, postData).subscribe(response => {
        let res: any = response;
        if (res.success) {
          if(item.PitchRequestStatus !='approved')
          this.eventService.publishDeleteData(this.prod);
        if (type == 'add')
        this.store.showToast(res.message, 2000, !res.success ? 'error' : undefined);
      }
    });
  }else {
    let path ='user/' + (this.prod.FP_EnablerSlug != undefined ? this.prod.FP_EnablerSlug : this.FPEnablerSlug) +'/'+ (this.prod.FN_EnablerSlug != undefined ? this.prod.FN_EnablerSlug : this.FNEnablerSlug) + '/funding-profile-match-report/pitch-view'
    this.store.openPage(path,this.openFront)
  }
  }

  openPageAction(type){
    if(type =='matched-fundraise-needs' || type =='matching-funding-profiles' || type == 'full-report'){
      localStorage.setItem('scroll','1')
      this.router.navigateByUrl(this.matchingPath(this.prod))
    }else if(type =='funding-profile' || type =='funding-profiles' || type =='fundraise-need'||type =='fundraise-needs'|| type =='fundraise'){
      if(this.pageFrom != 'Top'){
        localStorage.setItem('scroll','1')
        this.itemDetails(undefined,type);
      }else{
        setTimeout(() => {
          this.store.scrollToEnd('#tabs_contents');
        }, 500);
      }
    }
  }

  // test() {
  //   (prod.IsMyEnabler != undefined && prod.IsMyEnabler == '1') || 
  //   (
  //     prod.TotalMatched > 0 || 
  //     prod.TotalFundraise > 0 || 
  //     prod.TotalFundingProfile > 0 || 
  //     prod.TotalSubmittedFundingProfiles > 0 || 
  //     prod.TotalSubmittedFundraiseNeeds > 0 || 
  //     from == 'admin' || 
  //     from == 'profile' || 
  //     (
  //       (
  //         (prod.FPSubmissionAccept != 0 && store.appType =='front') ||  
  //         store.appType =='admin'
  //       ) && 
  //       store.checkPermission(prod,'submit_funding_profile') || 
  //       (
  //         (prod.FNSubmissionAccept != 0 && store.appType =='front') ||  
  //         store.appType =='admin'
  //       ) && 
  //       store.checkPermission(prod,'submit_fundraise_need'))
  //   )
  // }
}
