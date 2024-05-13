import { Component, Inject, Input, NgZone, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../shared/StorageService';
import { EventService } from '../../shared/EventService';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';

declare var $: any;
@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  attachedFile:any;
  isSizeExclude:any;
  IsDeleteFile:any = false
  fileName: any='';

  loadData = false;
  isView = false;
  reg: any = "";
  regMsg: any = "";
  name = '';
  subjectReadOnly = false;
  headOfConcatForm;
  emailTo = '';
  email = '';
  subject = '';
  imgError = false;
  Email1 = false;

  emails:any=[]

  noteMsg = '';
  message = '';
  nameErr = '';
  emailErr = '';
  subjectErr = '';
  isMessageError=false
  messageErr = '';
  breadCrumpData: any;
  subLabel:any
  loadMsg: string='';
  private subscription: any;
  isCalled: boolean=false;

  PermissionKey:any='contact_enabler'
  // EnablerSlug:any=''

  @Input()
  ContactData:any;
  @Input()
  ContctSlug:any=''
  @Input()
  FN_EnablerSlug:any=''
  @Input()
  FP_EnablerSlug:any=''
  @Input()
  pagePath: string ='';
  pageType:any
  PLATFORMID:any

  constructor(@Inject(PLATFORM_ID) platformId: any,private location: Location,public store: StorageService, private zone: NgZone,private cookieService: CookieService, public apiService: ApiService, private route: ActivatedRoute, public router: Router, private eventService: EventService) {

    this.PLATFORMID = isPlatformBrowser(platformId)

    this.pageType = this.route.snapshot.paramMap.get('PageType') != undefined? this.route.snapshot.paramMap.get('PageType'):'contact_us'

    if(this.FN_EnablerSlug == undefined && this.FP_EnablerSlug == undefined){
      let tSlug:any= this.route.snapshot.paramMap.get('TypeSlug')
      if(tSlug != undefined){
        this.FN_EnablerSlug =tSlug.includes('SIR') || tSlug.includes('MIR')?tSlug:undefined
        this.FP_EnablerSlug =tSlug.includes('SIP') || tSlug.includes('MIP')?tSlug:undefined
      }
    }
  }
  setPathPage() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() != undefined && this.router.getCurrentNavigation().extras !=undefined) {
        if (this.router.getCurrentNavigation().extras.state != undefined) {
          this.pagePath = this.router.getCurrentNavigation().extras.state.pagePath
        }else{
          this.pagePath=''
        }
      }else{
        this.pagePath=''
      }
    });
  }
  async getData() {
    this.subscription = await this.apiService.getContactInfo('EnablerSlug',this.ContctSlug, this.FP_EnablerSlug,this.FN_EnablerSlug).subscribe(async response => {
      let res: any = response;
      if (res.success && res.data != undefined) {
        this.isView = true
        this.ContactData=res.data.contact_detail
        this.setBreadTitle() 
      }else{
        this.store.showToast(res.message,3000,'error')
      }
    });
  }

  checkMail(): boolean {
    this.reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/;
    return (this.email == '' || !this.reg.test(this.email))
  }
  checkSPChar(): boolean {
    this.regMsg = /^[a-zA-Z0-9'*#%&\/()=?![\]$£€{}<>;,:._\-+ \r|\n]+$/;
    return (this.message == '' || !this.regMsg.test(this.message))
  }

  
  async ngOnInit() {
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      await this.setBreadTitle() 
      await this.setMeat();
    });
    this.name = this.store.isLogin?(this.store.userData.UserData.FirstName+(this.store.userData.UserData.LastName != undefined?' '+this.store.userData.UserData.LastName:'')):''
    this.email=this.store.isLogin?this.store.userData.UserData.Email:''
    await this.setMeat()
  }
  setMeat() {
    let sTitle = this.store.getVal((this.PermissionKey == 'report')?'report_an_issus_for':(this.PermissionKey == 'Contact_enabler'||this.PermissionKey == 'contact_enabler'||this.PermissionKey == 'contact-enabler')?'contact':'contact_us_for')+' '+(this.ContactData != undefined? this.ContactData.EnablerName:this.ContactData.Title != undefined?this.ContactData.Title:'')
    let sDesc=this.store.getVal((this.PermissionKey == 'report')?'send_us_issues_related_to_selected_information':'send_us_your_questions_comments_feedback') 
    this.store.updateMetaData('contact-us',{ ContactName:sTitle, ShortDescription:sDesc, EnablerLogo:(this.ContactData != undefined? this.ContactData.EnablerLogo:environment.social_logo)})
  }
  setBreadTitle() {
    if(this.ContactData != undefined){
      let st = this.PermissionKey != 'contact_enabler' && this.ContactData.EnablerName != undefined?this.ContactData.EnablerName:this.ContactData.Title != undefined?this.ContactData.Title:undefined;    
      if(this.ContactData.FN_ReferenceCode != '' && this.ContactData.FP_ReferenceCode !='' ){
        st=this.ContactData.FN_ReferenceCode+' <> '+this.ContactData.FP_ReferenceCode +' '+this.store.getVal('of')+' '+this.ContactData.EnablerName;
      }
      if(this.ContactData.FN_ReferenceCode != '' && this.ContactData.FP_ReferenceCode =='' ){
        st= this.ContactData.FN_ReferenceCode+' '+this.store.getVal('of')+' '+this.ContactData.EnablerName
      }
      if(this.ContactData.FN_ReferenceCode == '' && this.ContactData.FP_ReferenceCode !='' ){          
        st= this.ContactData.FP_ReferenceCode+' '+this.store.getVal('of')+' '+this.ContactData.EnablerName
      }
      // this.title = this.title + (st!=undefined && st != ''?' - '+st:'')      
      this.setTitle(st)    
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.FN_EnablerSlug = this.store.getFilterFromUrl('FN_EnablerSlug',undefined)
    this.FP_EnablerSlug =  this.store.getFilterFromUrl('FP_EnablerSlug',undefined)
    this.getData()    
  }
  setTitle(name){
    // if(name != undefined && name !='')
    // this.store.titleCntWithPage(name,this.title,this.ContactData);  
    // else
    // this.store.titleCntWithPage(this.title!= undefined?this.title:'Contact us',undefined,this.ContactData);  
  }

  callAction(event) {    
     if (event == 1) {
      this.sendMail()
    }
  }
  sendMail() {
    let datas=undefined
    this.isMessageError=false
    this.clearError(false)
    this.store.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.name =='' && this.email =='')
    if(this.store.isLogin) {
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      datas = res!=undefined?res.data:undefined
      if (datas != undefined && datas.UserData != undefined) {
        this.name = datas.UserData.FirstName + ' ' + datas.UserData.LastName
        this.email = datas.UserData.Email
      }
    }
    if (this.name == '') {
      this.nameErr = this.store.getVal('please_enter_name')
    }
    if (this.checkMail()) {
      this.emailErr = this.store.getVal('please_enter_valid_email')
    }

    if (this.subject == '') {
      this.subjectErr = this.store.getVal('please_enter_subject')
    }
    if (this.message == '') {
      this.isMessageError=true
      this.messageErr = this.store.getVal('please_enter_message')
    }else{
      if (this.checkSPChar()) {
        this.isMessageError=true
        this.messageErr = this.store.getVal('please_enter_valid_message')
      }
      if (this.name == '' || this.subject == '' || this.checkMail() || this.checkSPChar()) {
        //this.globle.openAlert(msg);
      } else {
        let postData = new FormData();
        postData.append("PermissionKey", this.PermissionKey != undefined ? this.PermissionKey : '');
        postData.append("PageSlug", this.ContctSlug != undefined ? this.ContctSlug : '');
  
        postData.append("EnablerSlug", this.ContctSlug != undefined ? this.ContctSlug : '');
        postData.append("FN_EnablerSlug", this.FN_EnablerSlug != undefined ? this.FN_EnablerSlug : '');
        postData.append("FP_EnablerSlug", this.FP_EnablerSlug != undefined ? this.FP_EnablerSlug : '');
  
        postData.append("UserName", this.name != undefined ? this.name : '');
        postData.append("Email", this.email);
        postData.append("Subject", this.subject);
        postData.append("Message", this.message);
        postData.append("PageType", this.pageType);
  
        postData.append("Link",this.pagePath);
  
        if (this.store.isNetwork()) {
          this.apiService.sendMail(this.PermissionKey == 'contact_enabler'?'support/contact_enabler':'support/send_support_email',postData,'true').subscribe(response => {
            let res: any = response;
            if (res.success) {
              if(!this.store.isLogin){
                this.name = '';
                this.email = '';
              }
              this.subject = '';
              this.message = '';
              this.clearError(res.success)
              this.store.showToast(res.message, 2000);
            } else {           
              this.store.showToast(res.message, 2000, 'error');
            }
          });
        }
      }
    }
  }
  clearError(isClear) {
    if(isClear){
      this.subject = '';
      this.message = '';
      this.attachedFile=undefined;
      $('#upload').val('')
      // this.store.backPage();
    }
    this.nameErr = '';
    this.emailErr = '';
    this.subjectErr = '';
    this.messageErr = '';
    this.isCalled=false
  }
  openFPath(pageType, prod,isNew?) {
    let pType = (pageType=='fundraise-needs' ||pageType=='fundraise-need' ||pageType=='fundraise-needs-submitted')?'fundraise-need':'funding-profile'
    let slug = pageType=='fundraise-need'?prod.FundraiseSlug != undefined?prod.FundraiseSlug:prod.FN_EnablerSlug:pageType=='funding-profiles-submitted'?prod.FP_EnablerSlug:pageType=='fundraise-needs-submitted' || pageType =='fundraise-needs'?prod.FN_EnablerSlug:prod.ProfileSlug != undefined?prod.ProfileSlug:prod.FP_EnablerSlug
    let action = (pageType=='fundraise-needs' || pageType=='fundraise-need' ||pageType=='fundraise-needs-submitted')?'fundraise-form':'profile-form'
    return (isNew==undefined? environment.redirectFrontPath:'') + pType + '/' + slug +'/' +action
}
routePath(type?,extraPath?) {

  let strPath = '';
  if(this.ContactData != undefined){
    if (type == 'matched-fundraise-needs') {
        if(this.store.appType== 'admin'){
          strPath = this.getAdminMatchPath('fundraise',extraPath)
        }else{
            if(this.PLATFORMID){
              if(!this.location.path().includes('/user')){
                strPath = this.openFPath('fundraise-need',this.ContactData,true)
              }
              else if (this.ContactData.IsMyFundraise == 1 || this.store.appType =='admin') {
                strPath = ('user/fundraise-need/submissions/' + (this.ContactData.FN_EnablerSlug!= undefined?this.ContactData.FN_EnablerSlug:this.FN_EnablerSlug) + this.store.getSeprater('user',undefined) + extraPath);
              }else if (this.ContactData.FP_EnablerSlug == undefined || this.ContactData.FP_EnablerSlug =='') {
                strPath = ('/user/fundraise-need/submissions/' + (this.ContactData.FN_EnablerSlug != undefined?this.ContactData.FN_EnablerSlug:this.FN_EnablerSlug) + this.store.getSeprater('user',undefined) + 'fundraise-form')
              } else if ((this.ContactData.FP_EnablerSlug != undefined || this.ContactData.FP_EnablerSlug !='') && (this.ContactData.FN_EnablerSlug != undefined || this.ContactData.FN_EnablerSlug !='')) {
                strPath = "user/funding-profile/details/fundraise-need-match-report/" + (this.ContactData.FN_EnablerSlug != undefined?this.ContactData.FN_EnablerSlug:this.FN_EnablerSlug) + "/" + (this.ContactData.FP_EnablerSlug != undefined?this.ContactData.FP_EnablerSlug:this.FP_EnablerSlug) + "/funding_profile_fundraise" + this.store.getSeprater('user',undefined) + "fundraise-form"
              }    
            }
        }
    } else if (type == 'matching-funding-profiles') {
      if(this.store.appType== 'admin'){
        strPath = this.getAdminMatchPath('profile',extraPath)
      }else{
        if(this.PLATFORMID){
          if(!this.location.path().includes('/user')){
            strPath = this.openFPath('funding-profile',this.ContactData,true)
          }
          else if (this.ContactData.IsMyFundingProfile == 1 || this.store.appType =='admin') {
            strPath = ('user/funding-profile/submissions/' + (this.ContactData.FP_EnablerSlug != undefined?this.ContactData.FP_EnablerSlug:this.FP_EnablerSlug) + this.store.getSeprater('user',undefined) + extraPath);
          }else if (this.ContactData.FN_EnablerSlug == undefined || this.ContactData.FN_EnablerSlug =='') {
            strPath = ('/user/funding-profile/submissions/' + (this.ContactData.FP_EnablerSlug != undefined?this.ContactData.FP_EnablerSlug:this.FP_EnablerSlug) + this.store.getSeprater('user',undefined) + 'profile-form')
          } else if ((this.ContactData.FP_EnablerSlug != undefined || this.ContactData.FP_EnablerSlug !='') && (this.ContactData.FN_EnablerSlug != undefined || this.ContactData.FN_EnablerSlug !='')){
            strPath = "user/fundraise-need/details/funding-profile-match-report/" + (this.ContactData.FN_EnablerSlug !=undefined?this.ContactData.FN_EnablerSlug:this.FN_EnablerSlug) + "/" + (this.ContactData.FP_EnablerSlug != undefined?this.ContactData.FP_EnablerSlug:this.FP_EnablerSlug) + "/fundraise_funding_profile" + this.store.getSeprater('user',undefined) + "profile-form"  
          }
        }
        }      
    } 
  }
  return strPath;
}
itemDetails(type?,extraPath?) {
    this.store.openPage(this.routePath(type,extraPath),'1')
}
getAdminMatchPath(actionName,extraPath): string {
  let endPoint = actionName+'-form'
  endPoint = extraPath != undefined?extraPath:endPoint
  return ('admin/'+(actionName=='profile'?'funding-profiles':'fundraise-needs')+'-submitted/'+(actionName =='profile'?this.ContactData.FP_EnablerSlug:this.ContactData.FN_EnablerSlug)+this.store.getSeprater()+endPoint)
}

openFrontPath(pageType, detailData,isNew?) {
    this.store.openFrontPage(this.openFPath(pageType, detailData,isNew))
}
openPage(page){
  this.router.navigateByUrl(page)
}
  ngOnDestroy(): void {
    if(this.subLabel !=undefined)
    this.subLabel.unsubscribe();
    if(this.subscription !=undefined)
    this.subscription.unsubscribe();
  }
}
