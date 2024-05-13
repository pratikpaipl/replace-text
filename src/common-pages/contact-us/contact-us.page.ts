import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../shared/StorageService';
import { EventService } from '../../shared/EventService';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;
declare const getActionsFromMessage
@Component({
  selector: 'contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  attachedFile:any;
  isSizeExclude:any;
  IsDeleteFile:any = false
  fileName: any='';

  title:any
  detailData: any;

  loadData = false;
  isMessageError = false;
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
  messageErr = '';
  breadCrumpData: any;
  subLabel:any
  loadMsg: string='';
  private subscription: any;
  sub:any;
  isCalled: boolean=false;

  ContactData:any;
  PermissionKey:any
  
  sTitleKey:any
  sDescKey:any
  ContctSlug:any=''
  // EnablerSlug:any=''
  FN_EnablerSlug:any=''
  FP_EnablerSlug:any=''
  pageType:any
  PLATFORMID:any
  pagePath: string ='';

  constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService,private cookieService: CookieService, public apiService: ApiService, private route: ActivatedRoute, public router: Router, private eventService: EventService) {

    this.PLATFORMID = isPlatformBrowser(platformId)
    this.ContctSlug = this.route.snapshot.paramMap.get('ContctSlug')
    this.FN_EnablerSlug = this.route.snapshot.paramMap.get('FN_EnablerSlug')
    this.FP_EnablerSlug = this.route.snapshot.paramMap.get('FP_EnablerSlug')
    if(this.PLATFORMID){
      this.pagePath = localStorage.getItem('pagePath') != undefined?localStorage.getItem('pagePath'):'';
      localStorage.removeItem('pagePath')      
    }
    this.pageType = this.route.snapshot.paramMap.get('PageType') != undefined? this.route.snapshot.paramMap.get('PageType'):'contact_us'   
    if(this.FN_EnablerSlug == undefined && this.FP_EnablerSlug == undefined){
      let tSlug:any= this.route.snapshot.paramMap.get('TypeSlug')
      if(tSlug != undefined){
        this.FN_EnablerSlug =tSlug.includes('SIR') || tSlug.includes('MIR')?tSlug:undefined
        this.FP_EnablerSlug =tSlug.includes('SIP') || tSlug.includes('MIP')?tSlug:undefined
      }
    }
  }
   
  async getData() {
    this.subscription = await this.apiService.getContactInfo(this.pageType=='impact-funding-resources'?'ImpactFundingResourcesSlug':'EnablerSlug', this.pageType !='activity-log'? this.ContctSlug:'', this.FP_EnablerSlug,this.FN_EnablerSlug).subscribe(async response => {
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
    this.sub = await this.route.data.subscribe(v => {
      this.PermissionKey = v.permission;
      this.sTitleKey = v.sTitleKey;
      this.sDescKey = v.sDescKey;
      return
    });
    await this.setMeat()
    this.title = await this.store.getVal(this.PermissionKey)
    this.subLabel =await this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.title = this.store.getVal(this.PermissionKey) //await this.store.getVal('contact_us')     
      this.setMeat();
      this.setBreadTitle() 
    });
    this.name = this.store.isLogin?(this.store.userData.UserData.FirstName+(this.store.userData.UserData.LastName != undefined?' '+this.store.userData.UserData.LastName:'')):''
    this.email=this.store.isLogin?this.store.userData.UserData.Email:''
   
  }
  setMeat() {

    let sTitle = this.store.getVal(this.sTitleKey)+' Funder' 
    let sDesc=this.store.getVal(this.sDescKey)

    this.store.updateMetaData('contact-us',{ ContactName:sTitle, ShortDescription:sDesc, EnablerLogo:environment.social_logo})
  }
  setBreadTitle() {
    if(this.ContactData != undefined){
      let st = this.ContactData.Title != undefined?this.ContactData.Title:this.PermissionKey != 'contact_enabler' && this.ContactData.EnablerName != undefined?this.ContactData.EnablerName:undefined;    
      if(this.ContactData.FN_ReferenceCode != '' && this.ContactData.FP_ReferenceCode !='' ){
        st=this.ContactData.FN_ReferenceCode+' <> '+this.ContactData.FP_ReferenceCode+' '+this.store.getVal('of')+' '+this.ContactData.EnablerName;
      }
      if(this.ContactData.FN_ReferenceCode != '' && this.ContactData.FP_ReferenceCode =='' ){
        st= this.ContactData.FN_ReferenceCode+' '+this.store.getVal('of')+' '+this.ContactData.EnablerName
      }
      if(this.ContactData.FN_ReferenceCode == '' && this.ContactData.FP_ReferenceCode !='' ){          
        st= this.ContactData.FP_ReferenceCode+' '+this.store.getVal('of')+' '+this.ContactData.EnablerName
      }
      this.title = this.title + (st!=undefined && st != ''?' '+(this.PermissionKey != 'report'?this.store.getVal('for')+' ':'')+st:'')   
      this.setTitle(st)    
    }else{
      this.setTitle(undefined)
    }
  }
  async ionViewWillEnter() {
    this.title = await this.store.getVal(this.PermissionKey)
    this.getData()
  }  
  openEnabler(){
    this.store.openPage(this.enablerPath(),'1')
  }
  enablerPath() {
    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    
    let routePath=''
    if (this.store.appType != 'admin') {      
      routePath = '/enabler/'+ this.ContactData.EnablerSlug +this.store.getSeprater()+'overview'+(apPath!=undefined?apPath:'')
    } else if (this.store.appType == 'admin') {
        routePath = ('/admin/enabler/' + this.ContactData.EnablerSlug +this.store.getSeprater(undefined,apPath)+ 'overview');
    }
    return routePath;
  }
  setTitle(name){
    this.title = (this.pageType == 'activity-log'?this.store.getVal('contact_us_for_csv_matchmaking_activity_log')+' '+this.ContctSlug:this.title)
    this.store.titleCntWithPage(this.title,undefined,this.ContactData);
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
        if(this.pageType != 'activity-log'){
          postData.append("PageSlug", this.ContctSlug != undefined ? this.ContctSlug : '');
          if(this.pageType != "impact-funding-resources")
          postData.append("EnablerSlug", this.ContctSlug != undefined ? this.ContctSlug : '');
          postData.append("FN_EnablerSlug", this.FN_EnablerSlug != undefined ? this.FN_EnablerSlug : '');
          postData.append("FP_EnablerSlug", this.FP_EnablerSlug != undefined ? this.FP_EnablerSlug : '');
        }
        else{
          postData.append("SummaryID", this.ContctSlug != undefined ? this.ContctSlug : '');
        }
        if(this.pageType == "impact-funding-resources")
        postData.append("ImpactFundingResourcesTitle", this.ContactData.Title != undefined ? this.ContactData.Title : '');
        postData.append("UserName", this.name != undefined ? this.name : '');
        postData.append("Email", this.email);
        postData.append("Subject", this.subject);
        postData.append("Message", this.message);
        postData.append("PageType", this.pageType);
  
        postData.append("Link",this.pagePath != undefined && this.pagePath !=''?this.pagePath:'');
  
        if (this.store.isNetwork()) {
          this.apiService.sendMail((this.pageType == 'activity-log'?'matchmaking_api/send_matchmaking_email':this.PermissionKey == 'contact_enabler'?'support/contact_enabler':'support/send_support_email'),postData,'true').subscribe(response => {
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
      this.store.backPage();
    }
    this.nameErr = '';
    this.emailErr = '';
    this.subjectErr = '';
    this.messageErr = '';
    this.isCalled=false
  }
  ngOnDestroy(): void {
    if(this.subLabel !=undefined)
    this.subLabel.unsubscribe();
    this.sub.unsubscribe();
    if(this.subscription !=undefined)
    this.subscription.unsubscribe();
  }
}
