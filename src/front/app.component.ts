import { ChangeDetectorRef, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/services/api.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { EventService } from 'src/shared/EventService';
import { SegmentModel } from 'src/shared/segment.model';
import { StorageService } from 'src/shared/StorageService';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

declare const removeMenu: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})



export class AppComponent {
  activePage=''
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

  noteMsg = '';
  message = '';
  pageType = '';
  nameErr = '';
  emailErr = '';
  subjectErr = '';
  messageErr = '';
  
  public segments: SegmentModel[] = [];
  public segmentsProfile: SegmentModel[] = [];
  adminUrl=environment.redirectAdmin

  PLATFORMID:any=false;

  constructor( @Inject(PLATFORM_ID) platformId: any,private apiService:ApiService, private cdref: ChangeDetectorRef,private cookieService: CookieService, private platform: Platform,private menu: MenuController, public router: Router,private eventService: EventService, private authService: AuthenticationService,public store:StorageService) {

    this.PLATFORMID = isPlatformBrowser(platformId)

    this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.segments = []
      this.segmentsProfile = []
      await this.setMenu()
      this.headOfConcatForm = this.store.getVal('contact_us_exclamatory')
      for (let i = 0; i < this.segments.length; i++) {
        let key = this.segments[i].key=='fundraise-needs'?'investees':this.segments[i].key=='funding-profiles'?'investors':this.segments[i].key
        this.segments[i].label = this.store.updateSegmentName(this.segments[i].label,key)
      }
      for (let i = 0; i < this.segmentsProfile.length; i++) {
        const element = this.segmentsProfile[i];
        var k = element.key        
        this.segmentsProfile[i].label =  this.store.getVal(k == 'enablers'?'user_enablers':k == 'funding-profile-match-report'?'fundraise-need-match-report':k == 'fundraise-need-match-report'?'funding-profile-match-report':k.replace(/-/g, '_'))
      }
    });
    this.eventService.updateContactUs$.subscribe(async (item: any) => {
      this.clearError();
      // this.contact_type = item.contact_type
      this.email = item.Email
      this.message = item.Message
      this.contctSlug = item.PageSlug
      this.EnablerSlug= item.EnablerSlug
      this.FN_EnablerSlug= item.FN_EnablerSlug
      this.FP_EnablerSlug= item.FP_EnablerSlug

      this.PermissionKey = item.PermissionKey
      this.pageType = item.pageType !=undefined?item.pageType:''
      this.subject = item.Subject
      this.name = item.UserName
      this.emailTo = item.emailTo
      this.headOfConcatForm = this.store.getVal(this.PermissionKey == '' ? 'contact_us_exclamatory' : this.PermissionKey)

      this.subjectReadOnly = item.subjectReadOnly
      this.headOfConcatForm = this.store.getVal(this.PermissionKey == '' ? 'contact_us_exclamatory' : this.PermissionKey)
    });
    this.eventService.formRefresh$.subscribe(async (item: any) => {
      this.setMenu()
    });
    this.initializeApp();
    this.setMenu()
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    const newWidth = event.target.innerWidth;
    this.store.windowWidth = newWidth;
    this.store.windowHight = window.innerHeight;
    this.store.IsWebView = (window.innerWidth > 992 ? true : false);
  }


  initializeApp() {
    this.platform.ready().then(() => {
    });
  }
  ngOnInit(){
    if(this.PLATFORMID){
      this.store.windowWidth = window.innerWidth;
      this.store.windowHight = window.innerHeight;
      this.store.IsWebView = (window.innerWidth > 992 ? true : false);
    }
    let sTitle= this.store.getVal('enablers_list_social_title')
    let sDesc = this.store.getVal('enablers_list_social_description')
    this.store.updateMetaData(this.pageType,{
      EnablerName:sTitle, ShortDescription:sDesc,
      EnablerLogo:environment.social_logo
    })
  }
  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (document.visibilityState === 'visible') {
      this.store.setUpProcess('front')
    }
  }
  openAdmin() {
    if (this.store.AdminAccess) {
      this.menu.enable(true, "admin");
      // this.menu.open("admin");
      this.store.openAdmin();
    }
  }
  closeSub(type) {
    this.menu.close(type);
    this.menu.enable(true, "home");
    this.menu.open("home");
  }
  homePage(type) {
    this.menu.close(type);
    this.store.homePage()
  }
  closeNmenu(type) {
    this.menu.close(type);
  }
  openProfile() {
    this.menu.enable(true, "profile");
    this.menu.open("profile");
 
  }
  login() {
    this.menu.close();
    this.router.navigateByUrl('/auth#login', { skipLocationChange: true });
  }
  signUp() {
    this.menu.close();
    this.router.navigateByUrl('/auth#signup', { skipLocationChange: true });
  }
  async logout() {
    this.menu.close();
    this.authService.logout('admin')
  }
  getPath(type,key){
    key = (key=='explore'?'enablers':key)
    return (key=='plans_and_pricing' || key=='impact-funding-resources')?key:(type +this.store.getSeprater(type)+ key);
  }
  ClickItem(type, key) {
    this.menu.close();
    if(key=='plans_and_pricing'){
      this.router.navigate(['plans-and-pricing']);
    }else if(key =='impact-funding-resources'){
      this.router.navigate(['impact-funding-resources']);
    }else if(key =='home-page'){
      this.router.navigate(['home']);
    }else{

      key = (key=='explore'?'enablers':key)  
      let has =window.location.hash;
      let href =window.location.href;
      if(window.location.pathname =='/explore' && window.location.hash  ==''){
        window.location.hash = '#enablers'
      }
      if((href.includes('user#') || href.includes('explore#')) && has.replace('#','') == key){
        if(this.getPath(type,key) != 'explore/enablers')
        window.location.reload()
      }    
      this.router.navigateByUrl(this.getPath(type,key));
    }
  }
  setMenu() {
    this.isLogin = this.PLATFORMID? this.cookieService.check(environment.cookiesKey):false
    this.segments=[]
    this.segmentsProfile=[]
    this.segments.push({ key: 'home-page', icon: 'fa-home fas', active: '', label: this.store.getVal('home_page') })
    this.segments.push({ key: 'enablers', icon: 'fa-solid fa-vector-square', active: '', label: this.store.getVal('enablers') })
    this.segments.push({ key: 'fundraise-needs', icon: 'fa-rocket fa-solid', active: '', label: this.store.getVal('investees') })
    this.segments.push({ key: 'funding-profiles', icon: 'fa-money-bills fa-solid', active: '', label: this.store.getVal('investors') })
    this.segments.push({ key: 'impact-funding-resources', icon: 'fa-money-bills fa-solid', active: '', label: this.store.getVal('impact_funding_resources') })

    this.segmentsProfile.push({ key: 'my-profile', icon: 'fa-id-badge fa-solid', active: '', label: this.store.getVal('my_profile') })
    this.segmentsProfile.push({ key: 'change-password', icon: 'fas fa-lock', active: '', label: this.store.getVal('change_password') })
    this.segmentsProfile.push({ key: 'enablers', icon: 'fa-solid fa-vector-square', active: '', label: this.store.getVal('user_enablers') })
    this.segmentsProfile.push({ key: 'full-report', icon: 'fa-solid fa-infinity', active: '', label: this.store.getVal('full_report') })
    this.segmentsProfile.push({ key: 'activity-log', icon: 'fa-chart-line fa-solid', active:'',label:this.store.getVal('activity_log')})

    this.segmentsProfile.push({ key: 'my-funding-profiles', icon: 'fa-money-bills fa-solid', active:  '',label:this.store.getVal('my_funding_profiles'),mTitleKey:'side_funding_profiles', title:  this.store.getVal('side_funding_profiles')})
    this.segmentsProfile.push({ key: 'funding-profile-submissions', icon: 'fa-solid fa-money-bill-transfer', active: '',label:this.store.getVal('funding_profile_submissions')})
    this.segmentsProfile.push({ key: 'funding-profile-match-report', icon: 'fa-solid fa-infinity', active: '',label:this.store.getVal('fundraise_need_match_report')})
    this.segmentsProfile.push({ key: 'investore-suggested-enabler', icon: 'fa-solid fa-vector-square', active:'', label: this.store.getVal('investore_suggested_enabler') })
    

    // this.segmentsProfile.push({ key: 'profile-activity-log', icon: 'fas fa-lock', active:'',label:this.store.getVal('activity_log')})

    this.segmentsProfile.push({ key: 'my-fundraise-needs', icon: 'fa-brands fa-space-awesome', active:  '',label:this.store.getVal('my_fundraise_needs'),mTitleKey:'side_fundraise_needs',  title:this.store.getVal('side_fundraise_needs')})
    this.segmentsProfile.push({ key: 'fundraise-need-submissions', icon: 'fa-rocket fa-solid', active:'',label:this.store.getVal('fundraise_need_submissions')})
    this.segmentsProfile.push({ key: 'fundraise-need-match-report', icon: 'fa-solid fa-infinity', active:'',label:this.store.getVal('funding_profile_match_report')})
    this.segmentsProfile.push({ key: 'investee-suggested-enabler', icon: 'fa-solid fa-vector-square', active: '', label: this.store.getVal('investee_suggested_enabler') })
    // this.segmentsProfile.push({ key: 'need-activity-log', icon: 'fas fa-lock', active:'',label:this.store.getVal('activity_log')})

  }
  async openPage(path){
    this.menu.close('nmenu')
    this.router.navigateByUrl(path)
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  checkMail(): boolean {
    this.reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (this.email == '' || !this.reg.test(this.email))
  }
  checkSPChar(): boolean {
    // this.regMsg = /[a-zA-Z0-9'*#%&\/()=?![\]$£{}<>\\;,:._+]$/;
    this.regMsg = /^[a-zA-Z0-9'*#%&\/()=?![\]$£€{}<>;,:._\-+ \r|\n]+$/;
    return (this.message == '' || !this.regMsg.test(this.message))
  }
  setUserData() {
    this.store.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.store.isLogin){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      this.store.userData = datas;
      if(datas != undefined){
        this.name = datas?.UserData?.FirstName + ' ' + datas?.UserData?.LastName
        this.email = datas?.UserData?.Email
      }else{
        this.name = ''
        this.email = ''
      }
    } 
  }
  Contact() {
    this.menu.close();
    this.router.navigateByUrl('contact');
  }
  sendMail() {
    // if(this.name =='' && this.email =='')
    this.setUserData()
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
        if ((this.name == '') || this.subject == '' || this.checkMail() || this.checkSPChar()) {
          //this.globle.openAlert(msg);
        } else {
          let postData = new FormData();
          postData.append("PermissionKey", this.PermissionKey != undefined ? this.PermissionKey : '');
        
          postData.append("PageSlug", this.contctSlug != undefined ? this.contctSlug : '');
          postData.append("EnablerSlug", this.EnablerSlug != undefined ? this.EnablerSlug : '');
          postData.append("FN_EnablerSlug", this.FN_EnablerSlug != undefined ? this.FN_EnablerSlug : '');
          postData.append("FP_EnablerSlug", this.FP_EnablerSlug != undefined ? this.FP_EnablerSlug : '');
        
          postData.append("UserName", this.name != undefined ? this.name : '');
          postData.append("Email", this.email);
          postData.append("Subject", this.subject);
          postData.append("Message", this.message);
          postData.append("PageType", this.pageType);
        
          postData.append("Link", window.location.href);
          if (this.store.isNetwork()) {
            let apiEnd = (this.PermissionKey == 'contact_enabler'?'support/contact_enabler':'support/send_support_email')
            this.apiService.sendMail(apiEnd,postData).subscribe(response => {
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
      this.nameErr = '';
      this.emailErr = '';
      this.subjectErr = '';
      this.messageErr = '';
    }
}
