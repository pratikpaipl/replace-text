
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonInfiniteScroll, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SegmentModel } from '../shared/segment.model';
import { ApiService } from 'src/services/api.service';
import { StorageService } from '../shared/StorageService';
import { Location, isPlatformBrowser } from '@angular/common'
import { EventService } from 'src/shared/EventService';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

declare var $: any;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit,OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('content') content: any;
  isView = false;
  oneSignalId: any;
  loadMsgLogin: any = '';
  loadMsgSignup: any = '';
  dataAction: any = [];
  countryList: any = [];
  PlanList: any = [];
  emailL: any = '';
  passwordL: any = '';
  isPasswordUnL = false
  passErrL = ''
  emailErrL = ''
  InvitationKey: any = '';
  Latitude: any = '';
  Longitude: any = '';
  Address: any = '';
  City: any = '';
  State: any = '';
  Country: any = '';
  ZipCode: any = '';
  email: any = '';
  password: any = '';
  isRemember = true;
  fname: any = '';
  lname: any = '';
  gender: any = '';
  CompanyName: any = '';
  RegistrationNo: any = '';
  CompanyNotRegisterd: any = false;
  CompanyRegistryRecord: any = '';
  CountriesOfIncorporation: any;
  selectPlanDetail: any;
  
  passwordTypeL: string = 'password';
  passwordIconL: string = 'eye-off';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  pageType = 'login';
  isDisabled = false
  isLnameUn = false
  isFnameUn = false
  isCompanyNameUn = false
  isRegistrationNoUn = false
  isCopmanyRegistryRecord = false
  isCountry = false
  isPasswordUn = false
  passErr = ''
  emailErr = ''
  fnameErr = ''
  lnameErr = ''
  NavigatePage: any;
  type: any;

  public segments: SegmentModel[] = []
  public selectedSegment: string = '';
  public selectedSegmentLbl: string = '';
  screenWidth: any;

  extraVal: any;
  inviteFromConfrom: any=false;
  inviteMsg: any;
  prevUrl: any;

  redirectPage:any
  public PLATFORMID: any;

  @ViewChild('emailLogin') emailLogin : ElementRef;
  @ViewChild('emailLoginM') emailLoginM : ElementRef;

  constructor(@Inject(PLATFORM_ID) platformId: any,public platform: Platform, private location: Location, public store: StorageService, private zone: NgZone, public apiService: ApiService, private route: ActivatedRoute, public router: Router,private cookieService: CookieService,  private eventService: EventService,private cdref: ChangeDetectorRef) {
 this.PLATFORMID = isPlatformBrowser(platformId)
    this.NavigatePage = this.route.snapshot.paramMap.get('type');
    this.segments.push({
      key: 'signup',
      icon:'fa-solid fa-user-plus',
      label: this.store.getVal('sign_up')
    })
    this.segments.push({
      key: 'login',
      icon:'fa-solid fa-chalkboard-user',
      label: this.store.getVal('log_in')
    })
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        if (this.router.getCurrentNavigation().extras.state != undefined) {
          this.redirectPage = this.router.getCurrentNavigation().extras.state.url
        }
      }
    });
    this.eventService.updateLabel$.subscribe((item: any) => {
      this.segments[0].label = this.store.getVal('sign_up')
      this.segments[1].label = this.store.getVal('log_in')
      this.setTitle()
    });
    this.eventService.formRefresh$.subscribe((item: any) => {
      if (this.cookieService.check(environment.cookiesKey) && (this.router.url == ("/auth#login"))) {
        this.router.navigateByUrl(this.redirectPage !=undefined?this.redirectPage:this.store.navicateUrl, { replaceUrl: true })
      }
    });
    if(this.PLATFORMID){   
      const $this = this;
      $(document).on('click', '.actonTg', function () {
        const action = $(this).data('action');
        $this.zone.run(() => {
          if (action == 'log_in') {
            $this.emailL = $this.email;
            $this.login();
          } else if (action == 'resend_confirmation_link') {
            $this.resendConfirmLink();
          }
        });
      });
      let count=1;
      document.onkeydown = (e) => {
        if (e.key === 'Tab') {
          if(count == 1) {
            e.preventDefault(); // Prevent default tab behavior (focus shifting)
            $(document).find('.autofocus').find('input').focus(); // Set focus on the last input
          }
          count++;
        }
      };
    }
    platform.ready().then(() => {
      this.screenWidth = platform.width()
    });

  }
  ngOnDestroy(): void {
    this.store.getParameter('Plan', '',true)
  }
  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    const newWidth = event.target.innerWidth;
    this.store.windowWidth =newWidth;
    this.store.windowHight = window.innerHeight;
    this.screenWidth = newWidth;
  }
  hideShowPassword() {
    if (this.pageType == 'login') {
      this.passwordTypeL = this.passwordTypeL === 'text' ? 'password' : 'text';
      this.passwordIconL = this.passwordIconL === 'eye-off' ? 'eye' : 'eye-off';
    } else {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }
  }
  ionViewWillEnter() {
    if(this.PLATFORMID){
      if (localStorage.getItem('lEmail') != undefined && localStorage.getItem('lEmail')) {
        this.emailL = localStorage.getItem('lEmail')
        localStorage.removeItem('lEmail')
      }
    }
    this.selectPlanDetail = (this.store.getFilterFromUrl('Plan', undefined) != undefined && this.store.getFilterFromUrl('Plan', undefined) !='') ? parseInt(this.store.getFilterFromUrl('Plan', undefined).length):undefined
    this.setTitle();
  }
  setTitle() {
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined) {
      let sDesc= this.store.getVal('to_pi2life_and_make_a_positive_impact_to_life_everyday');
      this.store.updateMetaData('',{ pTitle:obj.label, ShortDescription:sDesc, EnablerLogo:environment.social_logo})
      this.store.titleCntWithPage(obj.label);
    }
  }

  ionViewWillLeave() {
    this.email = ''
    this.password = ''
    this.emailErr = ''
    this.fname = ''
    this.lname = ''
    this.fnameErr = ''
    this.loadMsgSignup = ''

    this.emailL = ''
    this.passwordL = ''
    this.emailErr = ''
    this.loadMsgLogin = ''

  }
  ionViewDidEnter(): void {
    if(this.emailLogin != undefined)
    this.emailLogin.nativeElement.focus();
    if(this.emailLoginM != undefined)
    this.emailLoginM.nativeElement.focus();
  }
  ngAfterViewChecked(){
   
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  generateAddress(addressObj) {
    return addressObj.subLocality + ' ' + addressObj.subAdministrativeArea + ' ' + addressObj.postalCode + ' ' + addressObj.locality + ',' + addressObj.countryCode + '';
  }
  async ngOnInit() {
    if(this.cookieService.check(environment.cookiesKey)){
      this.router.navigateByUrl(this.store.navicateUrl, { replaceUrl: true })
    }
    this.getCountryList()
    this.extraVal=undefined;
    if(this.PLATFORMID){
      if (localStorage.getItem('PageEmail') != undefined) {
        this.isDisabled=true
        this.email = localStorage.getItem('IsSignup') !=undefined?localStorage.getItem('PageEmail'):'';
        this.emailL = localStorage.getItem('IsSignin') !=undefined?localStorage.getItem('PageEmail'):'';
        this.extraVal = localStorage.getItem('PageName');
  
        this.inviteMsg = this.store.getVal('sign_up_with_page_invitation')+' <b>'+(this.store.getVal(localStorage.getItem('IsPageOwner') =='1'?'page_owner':'page_admin'))+'</b> '+this.store.getVal('permission_on') +' <b>'+this.extraVal+'</b> '+this.store.getVal('page')
  
        this.store.removeItem('PageEmail')
        this.store.removeItem('PageName')
        this.store.removeItem('PageType')
        this.store.removeItem('IsPageOwner')
        this.store.removeItem('IsPageAdmin')
      }else{      
        this.isDisabled=false
      }
      if (localStorage.getItem('InvitationKey') != null) {
        this.InvitationKey = localStorage.getItem('InvitationKey');
        this.store.removeItem('InvitationKey')
        this.pageType = localStorage.getItem('IsSignup') !=undefined?'signup':'login'
        this.store.removeItem('IsSignup')
        this.store.removeItem('IsSignin')
      }
      if(localStorage.getItem('inviteMsg') != undefined){
        this.inviteMsg = localStorage.getItem('inviteMsg')
        localStorage.removeItem('inviteMsg')
        this.inviteFromConfrom=true
        this.emailL = localStorage.getItem('PageEmail') !=undefined?localStorage.getItem('PageEmail'):'';
        localStorage.removeItem('PageEmail')
      }
    }
    this.selectedSegment = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : this.pageType;
    this.pageType = this.selectedSegment;
    this.isView = true;
    setTimeout(() => {
      if(this.pageType =='login'){
        if(this.emailLoginM != undefined)
        this.emailLoginM.nativeElement.focus();
      }else{
        if(this.emailLogin != undefined)
        this.emailLogin.nativeElement.focus();
      }
    }, 50);
  }
  getCountryList() {
    this.apiService.signupInfo().subscribe(async response => {
      let res: any = response;
      if (res.success && res.data != undefined) {
       this.countryList = res.data.country_list;        
       this.PlanList = res.data.plan_list;
       let check = this.PlanList.findIndex(c => c.PlanID == this.selectPlanDetail)   
       if(check == -1){
        this.selectPlanDetail = undefined
       } 
      }
    });
  }
  onClickSegment(event) {
    this.pageType = event;
    this.setTitle()
    setTimeout(() => {
      if(this.pageType =='login'){
        if(this.emailLoginM != undefined)
        this.emailLoginM.nativeElement.focus();
      }else{
        if(this.emailLogin != undefined)
        this.emailLogin.nativeElement.focus();
      }
    }, 50);
  }

  callEnter(type) {
    this.submit(type)
  }
  onKeydownEvent($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.callEnter(0)
    }
  }
  customSelect(event){
    if(event.modalName !=undefined){
      this['' + event.modalName] = event.modal
      if(event.modalName =='selectPlanDetail'){
        this.store.getParameter('Plan', '',(event.modal == undefined))
      }
    }
  }
  planScrinPath(){
    return 'plans-and-pricing';
  }
  openPlanAndPricing(){
    this.router.navigate([this.planScrinPath()]);  
  }
  async callAction(event, type) {
    if (event == 1) {
      this.submit(type)
    } else {
      this.location.back()
      // this.store.backPage();
    }
  }
  changeIsRegister(event){
    if(event.target.value){
      this.CompanyRegistryRecord=''
      this.RegistrationNo=''
    }
  }

  goToPage(tye?) {
    let url =''
    if(this.redirectPage !=undefined)
    url = this.redirectPage
    else if(this.store.navSavePage !=undefined){
      url = JSON.parse(JSON.stringify({page:this.store.navSavePage})).page;  
    }else
      url = this.store.appType =='admin'?(tye!=undefined?'/admin#full-report' :'/admin#dashboard'):'/user'+this.store.getSeprater('user')+'full-report';
      let val =(url).split('#')
      this.store.navSavePage = undefined
      this.store.navigatePage([val.length>0?val[0]:''],val.length>1?val[1]:'',undefined,undefined,true)
    }
    async submit(type) {
    if (type == '1') {
      this.isPasswordUn = false
      this.isFnameUn = false
      this.isLnameUn = false
      this.isCompanyNameUn = false
      this.isRegistrationNoUn = false
      this.isCopmanyRegistryRecord = false
      this.isCountry = false
      if (this.store.checkMail(this.email)) {
        this.emailErr = this.store.getVal('please_enter_valid_email')
      }
      if (this.password.trim() == '') {
        this.isPasswordUn = true
        this.passErr = this.store.getVal('please_enter_password')
      }
      if (this.password.trim().length < 6 || this.store.hasWhiteSpace(this.password)) {
        this.isPasswordUn = true
        this.passErr = this.store.getVal('password_must_be_require_minimum_five_character')
      }
      if (this.fname.trim() == '') {
        this.isFnameUn = true
        this.fnameErr = this.store.getVal('first_name_must_be_require_minimum_one_character')
      }
      if(this.store.appType =='admin' && this.InvitationKey ==''){
        if (this.CompanyName.trim() == '') {
          this.isCompanyNameUn = true
          // this.fnameErr = this.store.getVal('first_name_must_be_require_minimum_one_character')
        }
        // if (this.RegistrationNo.trim() == '') {
        //   this.isRegistrationNoUn = true
        //   // this.fnameErr = this.store.getVal('first_name_must_be_require_minimum_one_character')
        // }
        // if (this.RegistrationNo.trim() == '') {
        //   this.isRegistrationNoUn = true
        //   // this.fnameErr = this.store.getVal('first_name_must_be_require_minimum_one_character')
        // }
        if (this.CountriesOfIncorporation == undefined || this.CountriesOfIncorporation =='' ) {
          this.isCountry = true
        }
        if (this.CompanyRegistryRecord != undefined && (this.CompanyRegistryRecord.trim() != '' && this.store.checkWeb(this.CompanyRegistryRecord))) {
          this.isCopmanyRegistryRecord = true

        }
      }
      if (this.store.checkMail(this.email) || this.isPasswordUn || this.fname.trim().length < 1|| this.isCompanyNameUn || this.isRegistrationNoUn || this.isCountry || this.isCopmanyRegistryRecord) {

      }
      else {
        let postData = new FormData();
        postData.append("Email", this.email);
        postData.append("Password", this.password);

        postData.append("IsDisclaimer", '1');
        postData.append("FirstName", this.fname != undefined ? this.fname.trim() : '');
        postData.append("LastName", this.lname != undefined ? this.lname.trim() : '');

        if(this.store.appType =='admin' &&this.InvitationKey ==''){
          postData.append("CompanyName", this.CompanyName != undefined ? this.CompanyName.trim() : '');
          postData.append("RegistrationNo", this.RegistrationNo != undefined ? this.RegistrationNo.trim() : '');
          // postData.append("CompanyNotRegisterd", this.CompanyNotRegisterd?'1':'0');
          postData.append("CountriesOfIncorporation", this.CountriesOfIncorporation != undefined ? this.CountriesOfIncorporation: '');
          postData.append("CompanyRegistryRecord", this.CompanyRegistryRecord != undefined ? this.CompanyRegistryRecord: '');
        }
        if (this.selectPlanDetail)
        postData.append("PlanID", this.selectPlanDetail);
        postData.append("Gender", this.gender);
        postData.append("PlayerID", localStorage.getItem('PlayerID') != undefined ? localStorage.getItem('PlayerID') : '');
        postData.append("SocketID", localStorage.getItem('SocketId') != undefined ? localStorage.getItem('SocketId') : '');

        if (this.Latitude)
          postData.append("Latitude", this.Latitude);
        if (this.Longitude)
          postData.append("Longitude", this.Longitude);
        if (this.Address)
          postData.append("Address", this.Address);
        if (this.InvitationKey)
          postData.append("InvitationKey", this.InvitationKey);
        if (this.City)
          postData.append("City", this.City);
        if (this.State)
          postData.append("State", this.State);
        if (this.Country)
          postData.append("Country", this.Country);
        if (this.ZipCode)
          postData.append("ZipCode", this.ZipCode);
        if (this.NavigatePage != undefined && this.NavigatePage != '') {
          postData.append("NavigatePage", this.NavigatePage);
        }

          this.apiService.signUp(postData).subscribe(async response => {
            let res: any = response;
            if (res.success) {
              this.CompanyName = ''
              this.RegistrationNo = ''
              this.CountriesOfIncorporation =undefined
              this.selectPlanDetail =undefined
              this.fname = ''
              this.lname = ''
              this.email = ''
              this.password = ''
              this.fnameErr = ''
              this.emailErr = ''
              this.passErr = ''
              this.loadMsgSignup = '';
              
              if (this.InvitationKey != undefined && this.InvitationKey != '') {
                this.store.showToast(res.message, 4000);
                this.store.removeItem('InvitationKey')
                this.store.setDataStore(response,'login')
                this.eventService.publishFormRefresh(res.data.token.token);
                if (res.data.Url != undefined && res.data.Url != '') {
                  this.router.navigateByUrl(res.data.Url, { replaceUrl: true })
                } else {
                  this.goToPage()
                }
              } else {
                this.store.saveData('altMsg', res, true)
                 this.router.navigateByUrl('/message/signup');
              }
            } else {
              localStorage.setItem('ResendEmail', this.email);
              this.loadMsgSignup = res.message.replace(/\+/g, ' ')
              if (res.data.Actions != undefined)
                this.dataAction = res.data.Actions
            }
          });
      }
    } else {
      this.isPasswordUnL = false
      if (this.store.checkMail(this.emailL)) {
        this.emailErrL = this.store.getVal('please_enter_valid_email')
      }
      if (this.passwordL.length < 6) {
        this.isPasswordUnL = true
        this.passErrL = this.store.getVal('password_must_be_require_minimum_five_character')
      }
      if (this.store.checkMail(this.emailL) || this.isPasswordUnL) {

      }
      else {
        let postData = new FormData();
        postData.append("Email", this.emailL);
        postData.append("Password", this.passwordL);
        // postData.append("PlayerID", localStorage.getItem('PlayerID') != undefined ? localStorage.getItem('PlayerID') : '');
        // postData.append("SocketID", localStorage.getItem('SocketId') != undefined ? localStorage.getItem('SocketId') : '');
        postData.append("RememberMe", this.isRemember ? '1' : '0');
        if (this.InvitationKey)
          postData.append("InvitationKey", this.InvitationKey);
          this.apiService.login(postData).subscribe(async response => {
            let res: any = response
            if (res.success) {
              this.emailL = ''
              this.passwordL = ''
              this.store.setDataStore(response,'login') 
              this.store.isApiCalled = 1000;
              this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
              this.store.name = res.data.UserData.FirstName + ' ' + res.data.UserData.LastName
              this.store.email = res.data.UserData?.Email

              if (this.store.lng != res.data.UserData.LanguageCode) {
                this.store.lng = res.data.UserData.LanguageCode != undefined ? res.data.UserData.LanguageCode : 'en'
                // this.eventService.publishUpdateLng(res.data.UserData.LanguageCode)
              }

              this.eventService.publishFormRefresh(res.data.token.token);
              this.store.showToast(res.message, 4000);
              if (this.InvitationKey != undefined && this.InvitationKey != '') {
                this.store.removeItem('InvitationKey')
                this.eventService.publishFormRefresh(res.data.token.token);
                if (res.data.Url != undefined && res.data.Url != '') {
                  this.router.navigateByUrl(res.data.Url, { replaceUrl: true })
                } else {
                  this.goToPage('login')
                }
              }else if (this.NavigatePage != undefined && this.NavigatePage != '') {
                this.router.navigateByUrl('/navigate/' + this.NavigatePage + '/admin#enabler');
              } else {
                this.goToPage('login')
              }
            } else {
              localStorage.setItem('ResendEmail', this.emailL);
              this.loadMsgLogin = res.message.replace(/\+/g, ' ')
              if (res.data.Actions != undefined)
                this.dataAction = res.data.Actions
            }
          });
      }
    }
  }
  openPage(page) {
    this.router.navigateByUrl('/page/' + page);
  }

  signUp() {
    this.pageType = 'signup'
    this.selectedSegment = this.pageType
  }
  login() {
    this.pageType = 'login'
    this.selectedSegment = this.pageType
  }
  forgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
  resendConfirmLink() {
    this.router.navigateByUrl('/confirm-link');
  }
  resendLink() {
    let postData = new FormData();
    if (this.pageType == 'login')
      postData.append("Email", this.emailL);
    else
      postData.append("Email", this.email);
    this.apiService.resendConfirmationEmail(postData).subscribe(response => {
      let res: any = response;
      this.loadMsgSignup = res.message.replace(/\+/g, ' ')
      if (res.data.Actions != undefined)
        this.dataAction = res.data.Actions
      if (res.success) {
        if (this.pageType == 'login') {
          this.emailL = ''
          this.passwordL = ''
        } else {
          this.email = ""
          this.password = ""
          this.fname = ""
          this.lname = ""
          this.gender = ""
          this.CompanyName=''
          this.RegistrationNo=''
          this.CountriesOfIncorporation=undefined
          this.selectPlanDetail=undefined
        }
      }
    });
  }
}