import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { EventService } from 'src/shared/EventService';
import { SegmentModel } from 'src/shared/segment.model';
import { StorageService } from 'src/shared/StorageService';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

declare const removeMenu: any;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})



export class AppComponent {
  isLogin: any = false;
  isView: any = false;

  contctSlug:any=''
  
  EnablerSlug:any
  FN_EnablerSlug:any
  FP_EnablerSlug:any



  PermissionKey:any=''
  reg: any = "";
  regMsg: any = "";
  name = '';
  email = '';
  subjectReadOnly = false;
  headOfConcatForm;
  emailTo = '';
  subject = '';
  activePage='';
  noteMsg = '';
  message = '';
  nameErr = '';
  emailErr = '';
  subjectErr = '';
  messageErr = '';
  pageType = '';
  public segments: SegmentModel[] = [];
  public segmentsProfile: SegmentModel[] = [];
  subscription: Subscription;
  PLATFORMID:any
  static PLATFOMRID: any;
  constructor(@Inject(PLATFORM_ID) platformId: any,private apiService:ApiService,private platform: Platform,private cookieService: CookieService, private menu: MenuController, private router: Router, private eventService: EventService, public store: StorageService, private authService: AuthenticationService) {
    AppComponent.PLATFOMRID = isPlatformBrowser(platformId)
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.segments = []
      this.segmentsProfile = []
      await this.setMenu()
      this.headOfConcatForm = this.store.getVal('contact_us_exclamatory')
      for (let i = 0; i < this.segments.length; i++) {
          this.segments[i].label = this.store.updateSegmentName(this.segments[i].label,this.segments[i].key)
      }
      for (let i = 0; i < this.segmentsProfile.length; i++) {
        const element = this.segmentsProfile[i];
          this.segmentsProfile[i].label = this.store.getVal(element.key.replace(/-/g, '_'))
      }
    });
    this.eventService.updateContactUs$.subscribe(async (item: any) => {
      this.clearError();
      this.email = item.Email
      this.message = item.Message
      this.contctSlug = item.PageSlug

      this.EnablerSlug = item.EnablerSlug
      this.FN_EnablerSlug = item.FN_EnablerSlug
      this.FP_EnablerSlug = item.FP_EnablerSlug
      
      this.PermissionKey = item.PermissionKey
      this.subject = item.Subject
      this.name = item.UserName
      this.emailTo = item.emailTo
      this.pageType = item.pageType !=undefined?item.pageType:''
      this.headOfConcatForm = this.store.getVal(this.PermissionKey == '' ? 'contact_us_exclamatory' : this.PermissionKey)

      this.subjectReadOnly = item.subjectReadOnly
      this.headOfConcatForm = this.store.getVal(this.PermissionKey == '' ? 'contact_us_exclamatory' : this.PermissionKey)
    });
    this.eventService.formRefresh$.subscribe(async (item: any) => {
      this.store.lng = this.store.lng;
      this.setMenu()
    });
    this.initializeApp();
    this.setMenu()
    platform.ready().then(() => {
      this.store.screenWidth = platform.width()
      this.store.windowWidth = platform.width()
    });
    
  }
  ngOnInit(){
    this.store.windowWidth = window.innerWidth;
    this.store.windowHight = window.innerHeight;
    this.store.IsWebView = (window.innerWidth > 992 ? true : false);
  }
  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (document.visibilityState === 'visible') {
      this.store.setUpProcess('admin')
    }
  }
  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    const newWidth = event.target.innerWidth;
    this.store.windowWidth = newWidth;
    this.store.windowHight = window.innerHeight;
    this.store.screenWidth = newWidth
    this.store.IsWebView = (window.innerWidth > 992 ? true : false);
  }
  
  setMenu() {
    let datas=undefined
    this.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.isLogin){
      let res = this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      datas = res!=undefined?res.data:undefined
    }

    // this.isLogin =this.PLATFORMID?this.cookieService.check(environment.cookiesKey):false
    this.segments=[]
    this.segmentsProfile=[]

    this.segments.push({ key: 'back-office',icon: '', active: this.pageType == 'back-office' ? 'active' : '', label:this.store.getVal('back_office')})
    this.segments.push({ key: 'switch-to-marcket-place',icon: 'fa-solid fa-shuffle', active: this.pageType == 'switch-to-marcket-place' ? 'active' : '', label:this.store.getVal('switch_to_marcket_place')})

    this.segments.push({ key: 'dashboard', icon: 'fas fa-home', active: '', label: this.store.getVal('dashboard'),mTitleKey:'general',title:  this.store.getVal('general')  })

    this.segments.push({ key: 'enablers', icon: 'fa-solid fa-vector-square', active: '', label: this.store.getVal('enablers') })
    this.segments.push({ key: 'summary', icon: 'fas fa-tags', active: '', label: this.store.getVal('summary') })
    this.segments.push({ key: 'full-report', icon: 'fa-solid fa-infinity', active: '', label: this.store.getVal('full_report') })
    this.segments.push({ key: 'subscripions',icon: 'fa-solid fa-file-invoice', active:  '', label: this.store.getVal('subscripions')})
    this.segments.push({ key: 'matchmaking',icon: 'fa-solid fa-file-csv', active:  '', label: this.store.getVal('csv_matchmaking')})

    this.store.IsSystemAdmin = datas!=undefined?datas.UserData != undefined?(datas.UserData.IsSystemAdmin == 1):false:false
    this.store.AdminAccess = datas!=undefined?datas.UserData != undefined?(datas.UserData.AdminAccess == 1):false:false
    if(this.store.IsSystemAdmin){
      let obj = { key: 'reference-data', icon: 'fa-solid fa-database', active: '', label: this.store.getVal('reference_data') }
      let isExist = this.segments.some(o => o.key === obj.key );
      if(!isExist)
      this.segments.push(obj);
    }
    
    this.segments.push({ key: 'users', icon: 'fa-solid fa-user', active: '', label: this.store.getVal('users') })
    this.segments.push({ key: 'contact_us', icon: 'fa-regular fa-comment', active: '', label: this.store.getVal('contact_us') })
    
    if(this.store.IsSystemAdmin){
      let obj = { key: 'funding-profiles', icon: 'fa-money-bills fa-solid', active: '', label: this.store.getVal('funding_profiles') ,mTitleKey:'funding_providers',title:  this.store.getVal('funding_providers') }
      let isExist = this.segments.some(o => o.key === obj.key );
      if(!isExist)
      this.segments.push(obj);
      
      let objMSFP = { key: 'funding-profiles-submitted', icon: 'fa-solid fa-money-bill-transfer', active: '', label: this.store.getVal('funding_profiles_submitted') }     
      let isExistMSFP = this.segments.some(o => o.key === objMSFP.key );
      if(!isExistMSFP)
      this.segments.push(objMSFP);
    }else{
      let obj = { key: 'funding-profiles-submitted', icon: 'fa-solid fa-money-bill-transfer', active: '', label: this.store.getVal('funding_profiles_submitted'),mTitleKey:'funding_providers',title:  this.store.getVal('funding_providers') }
      let isExist = this.segments.some(o => o.key === obj.key );
      if(!isExist)
      this.segments.push(obj);
    }
    this.segments.push({ key: 'fundraise-need-match-report', icon: 'fa-solid fa-infinity', active: '', label: this.store.getVal('fundraise_need_match_report') })
   

    if(this.store.IsSystemAdmin){
      let obj = { key: 'fundraise-needs', icon: 'fa-brands fa-space-awesome', active:  '', label: this.store.getVal('fundraise_needs'),mTitleKey:'investees',title:  this.store.getVal('investees') }
      let isExist = this.segments.some(o => o.key === obj.key );
      if(!isExist)
      this.segments.push(obj);      
     
      let objMSFN = { key: 'fundraise-needs-submitted', icon: 'fa-rocket fa-solid', active:  '', label: this.store.getVal('fundraise_needs_submitted') }     
      let isExistMSFN = this.segments.some(o => o.key === objMSFN.key );
      if(!isExistMSFN)
      this.segments.push(objMSFN);
    }else{

      let obj = { key: 'fundraise-needs-submitted', icon: 'fa-rocket fa-solid', active:  '', label: this.store.getVal('fundraise_needs_submitted'),mTitleKey:'investees',title:  this.store.getVal('investees') }  
      let isExist = this.segments.some(o => o.key === obj.key );
      if(!isExist)
      this.segments.push(obj);
    }

    this.segments.push({ key: 'funding-profile-match-report', icon: 'fa-solid fa-infinity', active: '', label: this.store.getVal('funding_profile_match_report') })

    this.segmentsProfile.push({ key: 'my-profile', icon: 'fa-id-badge fa-solid', active: '', label: this.store.getVal('my_profile') })
    this.segmentsProfile.push({ key: 'change-password', icon: 'fas fa-lock', active: '', label: this.store.getVal('change_password') })
    this.segmentsProfile.push({ key: 'log_out', icon: 'fa-solid fa-right-from-bracket', active: '', label: this.store.getVal('log_out') })
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
        this.menu.enable(false);
    });
  }
  closeSub(type) {
    this.menu.close(type);
    this.menu.enable(true, "home");
    this.menu.open("home");
  }

  login() {
    this.menu.close();
    this.router.navigateByUrl('/auth#login', { skipLocationChange: true });
  }
  signUp() {
    this.menu.close();
    this.router.navigateByUrl('/auth#signup', { skipLocationChange: true });
  }
   logout() {
    this.menu.close();
    this.authService.logout('admin')
  }
  getPath(type,key){
    return (key=='plans_and_pricing')?key:(type +this.store.getSeprater(type)+ key);
  }
  ClickItem(type, key) {
    this.activePage=''
    if(key=='plans_and_pricing'){
      this.menu.close();
      this.router.navigate(['plans-and-pricing']);
    }
    else if(key=='contact_us' || key=='contact'){
      this.menu.close();
      this.Contact()
    }else if(key =='log_out'){
      this.menu.close();
      this.logout()
    }else if(key =='switch-to-marcket-place'){
      this.menu.close();
      window.open(environment.redirectFrontPath, '_blank')
    }else{
        this.menu.close();
        this.router.navigateByUrl(this.getPath(type,key));
    }
  }
  
  checkMail(): boolean {
    this.reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/;
    return (this.email == '' || !this.reg.test(this.email))
  }
  checkSPChar(): boolean {
    // +''*#%&/|()=?![]$£€{}<>\;,:.-_
    this.regMsg = /^[a-zA-Z0-9'*#%&\/()=?![\]$£€{}<>;,:._\-+ \r|\n]+$/;
    // this.regMsg = /^[a-zA-Z0-9'*#%&\/()=?![\]$£€{}<>\\;,:._+ \r|\n]+$/;
    return (this.message == '' || !this.regMsg.test(this.message))
  }

  Contact() {
    this.router.navigateByUrl('contact');
  }
  sendMail() {
    let datas=undefined
    this.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.name =='' && this.email =='')
    if(this.isLogin) {
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
      this.messageErr = this.store.getVal('please_enter_message')
    }else{
      if (this.checkSPChar()) {
        this.messageErr = this.store.getVal('please_enter_valid_message')
      }
      if (this.name == '' || this.subject == '' || this.checkMail() || this.checkSPChar()) {
        //this.globle.openAlert(msg);
      } else {
        let postData = new FormData();
        postData.append("PermissionKey", this.PermissionKey != undefined ? this.PermissionKey : '');
        postData.append("PageSlug", this.contctSlug != undefined ? this.contctSlug:'');
        postData.append("EnablerSlug", this.EnablerSlug != undefined ? this.EnablerSlug:'');
        postData.append("FN_EnablerSlug", this.FN_EnablerSlug != undefined ? this.FN_EnablerSlug:'');
        postData.append("FP_EnablerSlug", this.FP_EnablerSlug != undefined ? this.FP_EnablerSlug:'');
        postData.append("UserName", this.name != undefined ? this.name : '');
        postData.append("Email", this.email);
        postData.append("Subject", this.subject);
        postData.append("Message", this.message);
        postData.append("PageType", this.pageType);
        postData.append("Link", window.location.href);
  
        if (this.store.isNetwork()) {
          this.apiService.sendMail("support/send_support_email",postData,'true').subscribe(response => {
            let res: any = response;
            if (res.success) {
              this.name = '';
              this.email = '';
              this.subject = '';
              this.message = '';
              this.clearError()
              this.store.showToast(res.message, 2000);
            } else {           
              this.store.showToast(res.message, 2000, 'error');
            }
            removeMenu();
          });
        }
      }
    }
  }
  clearError() {
    // this.nameErr = '';
    // this.emailErr = '';
    // this.subjectErr = '';
    // this.messageErr = '';
  }
}
