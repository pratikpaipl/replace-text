import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import * as moment from 'moment';
@Component({
  selector: 'item-tbl',
  templateUrl: './item-tbl.component.html',
  styleUrls: ['./item-tbl.component.scss'],
})
export class ItemTblComponent implements OnInit {

  @Input()
  isMain: boolean = false;
  @Input()
  extraMenu: boolean = true;

  @Input()
  from: string;
  @Input()
  Name: string = '';
  @Input()
  itemTitle: string = '';
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
  ReferenceTypeList: any=[];
  @Input()
  LanguageList: any;

  @Input()
  ProfileSlug: string;
  @Input()
  FundraiseSlug: string;
  @Input()
  keyword: string;
  @Input()
  address: string='';
  @Input()
  sort: string;

  @Input()
  type: string;
  @Input()
  subtype: string;
  @Input()
  prod: any;
  @Input()
  columnsWithCheckbox: any;
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
  scheduleData:any=[];

  SdgList: any = '';

  EnablerData:any=[]
  FundraiseData:any=[]
  FundingProfileData:any=[]

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  public isMenuOpen: boolean = false;
  constructor(public alertController: AlertController, public store: StorageService, public apiService: ApiService, public platform: Platform, public router: Router) {
    
  }
  ngOnInit() {
    if(this.prod != undefined && this.prod != '' && this.prod.ReferenceValueJsonData != undefined && this.prod.ReferenceValueJsonData != undefined && this.type == 'enablers' && this.from == 'admin') {
      let ReferenceValueJsonData = JSON.parse(this.prod.ReferenceValueJsonData);
      if(ReferenceValueJsonData != undefined && ReferenceValueJsonData != '' && ReferenceValueJsonData.length != 0) {
        
      }
    }
    if(this.prod != undefined && this.prod != '' && this.prod.EnablerData != undefined) {
      this.EnablerData = JSON.parse(this.prod.EnablerData);
    }
    if(this.prod != undefined && this.prod != '' && this.prod.FundraiseData != undefined && this.prod.FundraiseData != undefined) {
      this.FundraiseData = JSON.parse(this.prod.FundraiseData);
    }
    if(this.prod != undefined && this.prod != '' && this.prod.FundingProfileData != undefined) {
      this.FundraiseData = JSON.parse(this.prod.FundingProfileData);
    }
  }
  getTitle(){
    let titl=''
    titl=this.subtype =='users'?this.prod.ContactName:this.subtype =='full-report'?(this.prod.FPReferenceCode != undefined?this.prod.FPReferenceCode:this.prod.ReferenceCode)+' < > '+(this.prod.FNReferenceCode != undefined?this.prod.FNReferenceCode:this.prod.ReferenceCode) :this.prod.ReferenceCode !=undefined?this.prod.ReferenceCode:''
    return titl
  }
  nl2br(text: string) {
    if (text != undefined)
      return text.replace(/\\r\\n|\\r|\\n/gi, '\n');
  }
  openClick(prod) {
    prod.activePage = ''
    prod.activePage = 'contactUsMenu'
    // this.router.navigateByUrl('contact');
  }
  isPublic(){
    let rs = this.prod.ReferenceCode != undefined?(this.prod.ReferenceCode.includes('MIP') || this.prod.ReferenceCode.includes('MIR')):false
    return this.store.appType =='admin' && this.type !='full-report' && !rs;
  }
  click(item, sPos, pos?) {
    let cType = 'add'
    if (item.ReactionValue == this.store.InterestResult[sPos].ReferenceKey) {
      cType = 'remove'
    }
    this.change.emit({ ReactionType: 'interest', callType: cType, prod: this.prod, sPos: pos, IDs: item.EnablerSlug, click: this.store.InterestResult[sPos].ReferenceKey })
  }
  submittedDetails(type,  action?) {
    if (action == undefined)
    action = 'overview'
    let mAction = action;
    this.change.emit({ action: action, mAction: mAction, pageFrom: this.pageFrom })
  }
  filterItem(type,item){
    // if(this.pageFrom != 'Top')
    // this.change.emit({Type:type,item:item});
  }
  getDate(row,column){
    let date='';
    if(column.splitProps){
      let frmDate= row[column.splitProps[0]] != undefined?row[column.splitProps[0]]:''
      let toDate= row[column.splitProps[1]] != undefined?row[column.splitProps[1]]:''
      date =frmDate !=''? moment(frmDate).format('DD MMM yyyy') + ' ' + (toDate!=''?(this.store.getVal('to') + ' '+moment(toDate).format('DD MMM yyyy')):''):''
    }
    return date;
  }
  isInclude(key,column){
    if(column.splitProps){
      return column.splitProps[0] == key
    }
  }
  getDateWithName(row,column){
    let date='';
    if(column.splitProps){
      let createdBy= row[column.splitProps[0]] != undefined?row[column.splitProps[0]]:''
      let toDate= row[column.splitProps[1]] != undefined?row[column.splitProps[1]]:''
      date = (createdBy !=''? moment.utc(createdBy).format('DD MMM yyyy') + ' UTC <br />' + (toDate!=''?(' by '+' '+row[column.splitProps[1]]):''):'')
    }
    return date;
  }
  openMatching(item,fromEnabler){
    if(!fromEnabler)
    this.router.navigateByUrl('admin/full-report/'+(item.FundingProfileUID != undefined?item.FundingProfileUID:this.prod.FundingProfileUID) +'/'+item.FundraiseUID+'/detail')
    else
    this.router.navigateByUrl('admin/full-report/'+(item.FundingProfileUID != undefined?item.FundingProfileUID:this.prod.FundingProfileUID) +'/'+(item.FundraiseUID != undefined?item.FundraiseUID:this.prod.FundraiseUID)+'/'+item.EnablerSlug+'/detail')
  }
  matchingPath(item){
    return ((this.store.appType=='front'?'user':'admin')+'/full-report/'+(item.FP_EnablerSlug !=undefined?item.FP_EnablerSlug:this.FPEnablerSlug)+'/'+(item.FN_EnablerSlug !=undefined?item.FN_EnablerSlug:this.FNEnablerSlug)+'/detail')
  }
  Matching(item){
    this.router.navigateByUrl(this.matchingPath(item))
  }
  openEnabler(){
    this.router.navigateByUrl(this.store.appType=='front'?'user':this.store.appType+('/enabler/' + this.prod.EnablerSlug + '#overview'));
  }
  selectStatus(event){

  }
  routePath(type?,slug?) {
    let routePath = '';
    if (this.from != 'admin') { // || this.openFront == '1'
      routePath = ('/' + (type !=undefined?type:((this.type == 'enablers')?'enabler':this.type)) + '/' + ((this.type == 'enablers') ? this.prod.EnablerSlug : slug) + this.store.getSeprater()+'overview')
    } else if (this.from == 'admin') {
      if ((type !=undefined?type:this.type) == 'enablers') {
        routePath = ('/admin/enabler/' + this.prod.EnablerSlug + this.store.getSeprater()+'overview');
      }
      else if (this.type == 'permissions') {
      }
    }
    return routePath;
  }
  routePathFull(actionName,event) {
   
    let path;
    if(actionName=='full-report'){
    if(this.store.appType =='admin')
    path=('/admin'+this.store.getSeprater()+'full-report')
    else
    path=('/user'+this.store.getSeprater('user')+'full-report')
    }else if(actionName =='enablers'){
      if(this.pageFrom == 'profile')
      path=('user/enabler/' + event.EnablerSlug + this.store.getSeprater('user')+'overview')
      else
      path=('/admin/enabler/' + event.EnablerSlug +this.store.getSeprater('user')+ 'overview')
    }else if(actionName =='match-report'){
      if(this.pageFrom == 'profile')
      path=('user/full-report/'+event.FP_EnablerSlug+'/'+event.FN_EnablerSlug+'/detail')
      else
      path=('admin/full-report/'+event.FP_EnablerSlug+'/'+event.FN_EnablerSlug+'/detail')
    }
    else if(actionName =='profile' || actionName =='fundraise'){
      if(this.pageFrom == 'profile'){
        if(event.IsMyFundingProfile == 1 && actionName =='profile') {
          path='user/funding-profile/submissions'+'/'+event.FP_EnablerSlug+this.store.getSeprater('user')+(actionName+'-form')
        }else if(event.IsMyFundraise == 1 && actionName =='fundraise'){
          path='user/fundraise-need/submissions'+'/'+event.FN_EnablerSlug+this.store.getSeprater('user')+(actionName+'-form')
        }else{
          let actionPage = actionName=='profile'?'matching-funding-profiles':'matched-fundraise-needs';
          let pageType =(actionName=='profile'?'funding-profile':'fundraise-need')
          path = "user/"+((pageType !='fundraise-need')?'fundraise-need':'funding-profile')+"/details/"+actionPage+"/"+(event.FN_EnablerSlug !=undefined?event.FN_EnablerSlug:this.FNEnablerSlug)+"/"+(event.FP_EnablerSlug !=undefined?event.FP_EnablerSlug:this.FPEnablerSlug)+"/"+(pageType !='fundraise-need'? 'funding_profile_fundraise':'fundraise_funding_profile')+this.store.getSeprater('user')+(pageType =='fundraise-need'?'fundraise-form':'profile-form')
        }
      }
      else{
        path=('admin/'+(actionName=='profile'?'funding-profiles':'fundraise-needs')+'-submitted/'+(actionName =='profile'?event.FP_EnablerSlug:event.FN_EnablerSlug)+this.store.getSeprater()+(actionName+'-form'))
      }
    }
    else{
      if(this.store.appType =='admin')
      path=('admin/funding-profiles-submitted/'+event.FP_EnablerSlug+this.store.getSeprater()+actionName)
      else
      path=((event.IsMyFundingProfile==0?'funding-profile/':'user/funding-profile/'+(this.pageFrom =='profile'?'match-report/':'submissions/'))+ event.FP_EnablerSlug + this.store.getSeprater(event.IsMyFundingProfile==0?'':'user') + (event.IsMyFundingProfile!=0 ?actionName:'profile-form'))
    }
    return path
  }
  openReport(type,item){
    this.openPage(this.routePathFull(type,item))
  }
openFullPage(){
  this.change.emit({FunctionName:'onClick',route:'full-report'})
}
openPage(path){
  let val =(path).split('#')
  this.store.navigatePage([val.length>0?val[0]:''],val.length>1?val[1]:'')
}
callAction(event) {
  this.change.emit(event);
}
callFilter(event){
  event.Filter=true,
  this.change.emit(event);
}
callCountryFilter(){
  this.change.emit({companyFilter:true,item:this.prod});
}
changed(type,endPoint,rType,prod){
  let postData = new FormData();
  postData.append("ReactionType", rType);
  postData.append("ReactionValue", prod.ReactionValue !=undefined?prod.ReactionValue:'remove');
  postData.append("FN_EnablerSlug", prod.FN_EnablerSlug !=undefined?prod.FN_EnablerSlug :this.FNEnablerSlug);
  postData.append("FP_EnablerSlug", prod.FP_EnablerSlug !=undefined?prod.FP_EnablerSlug :this.FPEnablerSlug);
  this.apiService.update(type, endPoint, postData).subscribe(response => {
    let res: any = response;
    if (res.success) {
      if(res.data != undefined) {
        this.change.emit({ TotalExpressedInterest: res.data.TotalExpressedInterest })
      }
      this.store.showToast(res.message, 2000);
    }
  });
}
}
