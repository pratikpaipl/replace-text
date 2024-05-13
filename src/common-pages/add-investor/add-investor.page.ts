import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { EventService } from '../../shared/EventService';
import { StorageService } from '../../shared/StorageService';
import { Location, isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
declare const getActionsFromMessage

@Component({
  selector: 'add-investor',
  templateUrl: 'add-investor.page.html',
  styleUrls: ['add-investor.page.scss'],
})
export class AddInvestor implements OnInit,AfterViewChecked {


  matchEveryThing:any = false
  matchImpactTheme:any = false
  matchSdgs:any = false
  matchEsgs:any = false
  matchFundingType:any = false

  private subscription: any;
  private subLabel: any;
  ValidData = true
  // isFirst = true
  isEnabler = false
  isSkip = false
  // isSecond = false
  isView = false
  isFromUser = false
  isTreePrepare = false
  checkAll: any
  loadMsg = ''
  errMsg = ''
  ReferenceCode:any
  emailRestrict:any=false
  dataAction: any = [];
  storeRes:any;
  breadCrumpData:any;
  EnablerSlug:any;
  FP_EnablerSlug:any = '';
  type:any = '';
  page:any = '';
  EnablerDisabled:any = false;
  enablerData:any;
  notFoundText : any = '';
  IsFundingProviderType = false;
  IsEnablerCurrency = false;
  IsImpactTheme = false;
  IsFundingTypeAndFundRaiseType = false;
  IsFundingStage = false;
  IsSGD = false;
  IsESG = false;
  IsFirstName = false;
  IsEmail = false;
  IsRepresentingForEmail = false;
  IsProfileName = false;
  ConfirmAuthorised = false
  IsConfirmInvestor = false
  
  FirstName: any = ''
  LastName: any = ''
  Email: any = ''
  About: any = ''
  Website: any = ''

  isWebsite=false

  RepresentingForEmail:any=''
  RepresentingForFirstName:any=''
  RepresentingForLastName:any=''
 

  AdditionalNotes: any = ''
  ProfileName: any = ''
  suggestionList: any = []
  SourceOrReferral: any = ''
  InternalReferenceNumber: any = ''
  // Tags: any = ''
  // tags: any = []
  selectedCompanyName: any
  selectedTags: any
  selectedTagsTag: any = []

  InternalNotes: any = ''
  ConfirmInvestor = false
  ConfirmAuthorisedUn = false


  TotalDomicileNationalityCountry = 0;
  TotalIncorporationCountry = 0;
  TotalThemesAreas = 0;
  TotalFundingType = 0;
  selectedFundingProviderType: any;
  selectedEnablerCurrency: any;
  selectedCountriesOfDomicileNationality: any = []
  
  DefFPMinimumTicketSizePerFunding:any=1
  DefFPMaximumTicketSizePerFunding:any=99999999999
  DefFPMinimumTotalRaiseAmount:any=1
  DefFPMaximumTotalRaiseAmount:any=99999999999

  // DefFPMinimumTotalRaiseAmount:any=1
  DefCumulativeRevenueAmount:any=1
  DefMaxCumulativeRevenueAmount:any=99999999999

  FPMaximumTicketSizePerFunding:any
  FPMinimumTicketSizePerFunding:any
  FPMinimumTicketSizePerFundingError:any=''
  FPMaximumTicketSizePerFundingError:any=''
  IsFPMaximumTicketSizePerFundingUn=false
  IsFPMinimumTicketSizePerFundingUn=false

  FPMinTotalRaiseAmount:any
  FPMaxTotalRaiseAmount:any  
  FPMaxTotalRaiseAmountError:any=''
  FPMinTotalRaiseAmountError:any=''
  IsFPMinTotalRaiseAmountUn=false
  IsFPMaxTotalRaiseAmountUn=false
  IsCumulativeRevenueUn=false

  FPCumulativeRevenue:any

  selectedImpactTheme: any = []
  selectedEsg: any = []
  respObj:any ={};
  selectedFundingTypeAndFundRaiseType: any = []
  selectedImpactFundingEnabler: any;
  selectedImpactFundingEnablerOld: any;
  AdditionalImpactThemesOrAreas: any = ''
  selectedSDGs: any = ''
  selectedGenderLens: any = ''
  selectedFundingType: any;
  selectedFundingStage: any
  selectedCountriesOfIncorporation: any = []
  selectedIndustrySectors: any = ''
  ScreeningStatus = undefined;
  ScreeningStatusTag = undefined;
  
  DataStatus = '1';
  IsEnable = '1'
  IsActive = '1'
  IsFeatured = '0'

  currency_list = []
  funding_provider_type_list = []

  investor_ticket_size_list = []
  enabler_list = []
  sdg_list = []
  funding_type_list = []
  gender_lens_list = []
  funding_stage_list = []
  industries_sectors_list = []
  investor_raise_amount_list = []
  screening_status_list=[]
  revenue_alert_list = []
  CompanyNameList = []
  ImpactThemesAreasList: any = []
  ImpactThemesAreasListTemp: any = []
  EsgListTemp: any = []
  // FundingTypeAndFundRaiseTypeListTemp = []
  // DomicileNationalityCountryList = []
  domicile_nationality_country_list= []
  IncorporationCountryList = []
  IncorporationCountryListTemp = []
  TagList = []

  from: any = 'home'
  title: any = 'Add Investor'
  titleCopy: any = 'Add Investor'
  titl: any = '';

  show:any =true;
  InvestorFile: any;
  InvestorLogoURl:any;
  InvestorLogoSrc:any = ""
  IsDeleteLogo:any = false
  isInvestorLogoUn:any = false
  isSizeExclude = false
  sizeExcludeErr = ''


  isUser =false;
  public PLATFORMID: any;

  aboutInvestor=true;
  representingFor=true;
  // desclaimerShow=true;
  // confidentialityShow=true;
  investmentCriteria=false;

  
  IsConfidentialityDisclaimer=false
  // IsDisclaimer=false
  // IsConfidentiality=false
  confidentiality='';
  disclaimer=''

  IsConfidentialityDisclaimerUn=false
  // IsDisclaimerUn=false
  // IsConfidentialityUn=false

  constructor(@Inject(PLATFORM_ID) platformId: any,public modalController: ModalController,private location: Location, private cookieService: CookieService, private route: ActivatedRoute, public eventService: EventService, public store: StorageService, public apiService: ApiService, public alertController: AlertController, public router: Router,private zone: NgZone,private cdref: ChangeDetectorRef) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.EnablerSlug = this.route.snapshot.paramMap.get('fslug') != undefined ? this.route.snapshot.paramMap.get('fslug') : '';

    this.FP_EnablerSlug = this.route.snapshot.paramMap.get('fpslug') != undefined ? this.route.snapshot.paramMap.get('fpslug') : '';
    
    this.type = this.route.snapshot.paramMap.get('type') != undefined ? this.route.snapshot.paramMap.get('type') : 'add';
    this.page = this.route.snapshot.paramMap.get('page') != undefined ? this.route.snapshot.paramMap.get('page') :this.page;
    this.from = this.route.snapshot.paramMap.get('from') != undefined ? this.route.snapshot.paramMap.get('from') : this.from;


    this.isUser = (this.PLATFORMID?(this.location.path().includes('/user') || (store.appType =='front' && store.isLogin) || (this.FP_EnablerSlug != '' && this.type == 'edit') || ( this.type == 'edit_fp')):false)
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.titl = this.store.getVal('pi2Life_funder') + ' | ' + this.store.getVal('funding_profile_form')
      this.setTitle()      
    });
    
    if(this.PLATFORMID){
      const $this = this;
      $(document).on('click', '.actonTg', function () {
        const action = $(this).data('action');
        $this.zone.run(() => {
          store.showToast(action, 3000)
          if (action == 'yes') {
            // $this.ConfirmData();
          }else if (action == 'log_in') {
            $this.store.login();
          }else if (action == 'no') {
            $this.dataAction = []
            $this.loadMsg = ''
          }
        });
      });
      $(document).on("click", "#deleteImg", function () {
        $('#upload').val('')
      });
    }
    this.title = (this.type == 'edit' || this.type == 'my_edit')?this.store.getVal('submit_funding_profile'):this.title
    this.titleCopy = (this.type == 'edit' || this.type == 'my_edit' || this.type =='edit_fp')?'Edit Investor':this.title

  }
  viewSH(varnm){
    this[varnm] = !this[varnm]
  }
  ionViewWillEnter() {
    if (this.isView)
      this.store.scrollTo('topRow');
  }
  setUserData() {
    this.store.isLogin =(this.cookieService.check(environment.cookiesKey))
    if(this.store.isLogin){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      this.store.userData = datas;
      if (datas != undefined && datas.UserData != undefined) {
        if(this.store.appType !='admin' && (this.type=='add' || this.type =='add_fp'|| this.type =='add-with-enabler')){
          this.Email = (this.Email == undefined || this.Email =='')?datas.UserData.Email:this.Email
          this.FirstName = (this.FirstName == undefined || this.FirstName =='')?datas.UserData.FirstName:this.FirstName
          this.LastName = (this.LastName == undefined || this.LastName =='')?datas.UserData.LastName:this.LastName
        }else{
          this.FirstName = ''
          this.LastName = ''
          this.Email = ''
        }
      }else{
        this.FirstName = ''
        this.LastName = ''
        this.Email = ''
      }
    } 
  }
   ngOnInit(){
    if(this.PLATFORMID)
    this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    this.EnablerDisabled = (this.EnablerSlug != undefined && this.EnablerSlug !='')?true:false;
    if(this.PLATFORMID){
      this.setUserData()
      // setTimeout(() => {
      //   $('#IsDisclaimer').first().focus();
      // }, 500);
    }
    this.eventService.formRefresh$.subscribe(async (item: any) => {
      if(this.PLATFORMID)
      this.setUserData()
    });
    this.getData(this.type);
   
  }
  ionViewDidEnter(): void {
    // if(this.PLATFORMID){
    //   setTimeout(() => {
    //     $('#IsDisclaimer').first().focus();
    //   }, 500);
    // }
  }
  goToEnaber(){    
    this.router.navigateByUrl((this.store.appType=='front'?'/explore/enablers':'admin#enablers'));
  }
  getData(type) {

    this.subscription = this.apiService.getData('investor', (type =='add-with-enabler'?'add':type), (type=='edit_fp'|| type=='add_fp' || type =='add-with-enabler')?'ProfileSlug':(type=='add') ?'EnablerSlug':'FP_EnablerSlug', (this.FP_EnablerSlug != undefined && this.FP_EnablerSlug != ''?this.FP_EnablerSlug:''),'EnablerSlug',this.EnablerSlug).subscribe(async response => {
      let res: any = response;
      // let res = this.store.decryptData(response,atob(environment.keyData))
      if (res.success && res.data != undefined) {
        this.storeRes = (this.type =='add-with-enabler' || this.type == 'clone' || this.type =='edit' || type =='edit_fp' || type =='my_edit')?res:undefined;
        this.enablerData = res.data.enabler_detail;
        if(this.enablerData != undefined){
          this.enablerData.OnCardPermissionData = undefined;
          this.selectedImpactFundingEnabler = this.enablerData.EnablerID;
        }
        this.isView = true
        // setTimeout(() => {
        //   $('#IsDisclaimer').first().focus();
        // }, 500);
        if (res.data.investor_ticket_size_list != undefined) {
          this.investor_ticket_size_list = res.data.investor_ticket_size_list
        } 
        if (res.data.company_list != undefined) {
          this.CompanyNameList = res.data.company_list
        }
        if (res.data.enabler_list != undefined) {
          this.enabler_list = res.data.enabler_list;
        }

        if (res.data.gender_lens_list != undefined) {
          this.gender_lens_list = res.data.gender_lens_list
        }
        if (res.data.investor_raise_amount_list != undefined) {
          this.investor_raise_amount_list = res.data.investor_raise_amount_list
        }
        if (res.data.revenue_alert_list != undefined) {
          this.revenue_alert_list = res.data.revenue_alert_list
        }
        if (res.data.screening_status_list != undefined) {
          this.screening_status_list = res.data.screening_status_list
        }
        this.setFacilatorWise(res,this.storeRes)
        this.title = (this.type == 'edit' || this.type == 'my_edit')?this.store.getVal('submit_funding_profile'):this.store.getVal('add_funding_profile') //this.title
        this.titleCopy = (this.type == 'edit' || this.type == 'my_edit' || this.type =='edit_fp')?this.store.getVal('edit_funding_profile') : this.store.getVal('add_funding_profile') //'Edit Funding Profile':this.title

        if (res.data.bread_crump_data != undefined && res.data.bread_crump_data.length > 0 && type !='my_edit' && (this.store.appType =='admin' && type=='edit' && this.page !='list')) {
          var ld = res.data.bread_crump_data;
          ld.push({
            PageName: this.title, PageSlug: this.EnablerSlug != undefined?this.EnablerSlug:'', PageType: "funding-profiles",action:'funding-profiles'
          })
          this.breadCrumpData = {
            list: ld, Page: 'add-investor'
          }
        }else if(this.enablerData != undefined){
          var ld = res.data.bread_crump_data;
          ld.push({
            PageName: this.title, PageSlug: this.EnablerSlug != undefined?this.EnablerSlug:'', PageType: "funding-profiles",extraType:'investors',action:'funding-profiles'
          })
          this.breadCrumpData = {
            list: ld, Page: 'add-investor'
          }
        }

        this.setTitle();
        let detailData={
          ContactName:this.enablerData !=undefined?(this.store.getVal('join_as_investor_at')+' '+this.enablerData.EnablerName):this.store.getVal('create_investor_profile_on_funder'),
          ShortDescription:this.store.getVal(this.enablerData !=undefined?'submit_investment_selection_criteria_to_get_access_to_curated_pre_matched_investees':'use_your_investor_profile_to_ioin_at_one_or_more_suitable_enablers'),
          EnablerLogo:this.enablerData !=undefined? this.enablerData.EnablerLogo:undefined
        }
        this.store.updateMetaData('add-investor',detailData,'details')

      }else{
        this.store.showToast(res.message,3000,'error')
      }
    });
  }
  setTitle(){
    if(this.enablerData != undefined){
      this.store.titleCntWithPage(this.enablerData.EnablerName,this.title,this.enablerData)
    }else{
      this.store.titleCntWithPage(this.breadCrumpData == undefined? this.titleCopy:this.title);
    }
  }
  async openDesModal(fronType,from){
    localStorage.setItem('titleKey',from)
    localStorage.setItem('fromVar',this[''+fronType])
    localStorage.setItem('fromUrl',this.router.url)
    if(this.selectedImpactFundingEnabler == undefined){      
      // this.router.navigateByUrl(((this.store.appType =='admin')?'admin/':'')+'/investor/'+fronType+'/'+this.type+'/'+fronType)
      let path = ((this.store.appType =='admin')?'admin/':'')+'investor/'+this.type+'/'+fronType
      console.log('path ',path)
      this.router.navigateByUrl(path);
    }
    else{
      let path = ((this.store.appType =='admin')?'admin/':'')+'enabler/'+this.EnablerSlug+'/investor/'+this.type+'/'+fronType
      console.log('path ',path)
      this.router.navigateByUrl(path);
    }
  }

  async updateInput(event, checkVar){
    if(event.value != undefined){
      this[''+checkVar] = false;
      let value = event.value.replace(/,/g, '');
      if(checkVar == 'IsFPMinimumTicketSizePerFundingUn' || checkVar =='IsFPMaximumTicketSizePerFundingUn'){
        this.IsFPMinimumTicketSizePerFundingUn = false;
        this.IsFPMaximumTicketSizePerFundingUn = false;
        this.FPMinimumTicketSizePerFundingError = '';

        if (value == undefined || value == '') 
        this[''+checkVar] = true;

        let FPMinimumTicketSizePerFunding = 0;
        let FPMaximumTicketSizePerFunding = 0;
        // Parsing and validation for FPMinimumTicketSizePerFunding
        FPMinimumTicketSizePerFunding = (checkVar == 'IsFPMinimumTicketSizePerFundingUn'?value:(this.FPMinimumTicketSizePerFunding !== undefined && this.FPMinimumTicketSizePerFunding !== '')?parseInt(this.FPMinimumTicketSizePerFunding.replace(/,/g, ''), 10):0);
        // Parsing and validation for FPMaximumTicketSizePerFunding
        FPMaximumTicketSizePerFunding = (checkVar == 'IsFPMaximumTicketSizePerFundingUn'?value:(this.FPMaximumTicketSizePerFunding !== undefined && this.FPMaximumTicketSizePerFunding !== '')?parseInt(this.FPMaximumTicketSizePerFunding.replace(/,/g, ''), 10):0);
        // Checking for invalid range
        if (FPMinimumTicketSizePerFunding > FPMaximumTicketSizePerFunding && FPMinimumTicketSizePerFunding > 0 && FPMaximumTicketSizePerFunding > 0) {
          this.IsFPMinimumTicketSizePerFundingUn = true;
          this.IsFPMaximumTicketSizePerFundingUn = true;
          this.FPMinimumTicketSizePerFundingError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount');
        } else if (FPMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding || FPMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding) {
          // Checking if either value is less than the default minimum
          this.IsFPMinimumTicketSizePerFundingUn = (FPMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding);
          this.IsFPMaximumTicketSizePerFundingUn = (FPMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding);
          this.FPMinimumTicketSizePerFundingError = '';
        } else if (FPMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding) {
          // Checking if either value is greater than the default maximum
          this.IsFPMinimumTicketSizePerFundingUn = (FPMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding);
          this.IsFPMaximumTicketSizePerFundingUn = (FPMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding);
          this.FPMinimumTicketSizePerFundingError = '';
        }
      }
      
      if(checkVar == 'IsFPMinTotalRaiseAmountUn' || checkVar =='IsFPMaxTotalRaiseAmountUn'){

        this.IsFPMinTotalRaiseAmountUn = false;
        this.IsFPMaxTotalRaiseAmountUn = false;
        this.FPMinTotalRaiseAmountError = '';
        
        let FPMinTotalRaiseAmount=0
        let FPMaxTotalRaiseAmount=0
        // Parsing and validation for FPMinimumTicketSizePerFunding
        FPMinTotalRaiseAmount = (checkVar == 'IsFPMinTotalRaiseAmountUn'?value:(this.FPMinTotalRaiseAmount !== undefined && this.FPMinTotalRaiseAmount !== '')?parseInt(this.FPMinTotalRaiseAmount.replace(/,/g, ''), 10):0);
        // Parsing and validation for FPMaximumTicketSizePerFunding
        FPMaxTotalRaiseAmount = (checkVar == 'IsFPMaxTotalRaiseAmountUn'?value:(this.FPMaxTotalRaiseAmount !== undefined && this.FPMaxTotalRaiseAmount !== '')?parseInt(this.FPMaxTotalRaiseAmount.replace(/,/g, ''), 10):0);
        if ((this.FPMinTotalRaiseAmount != undefined && this.FPMinTotalRaiseAmount != ''))
        FPMinTotalRaiseAmount = parseInt(this.FPMinTotalRaiseAmount != undefined && this.FPMinTotalRaiseAmount !=''? this.FPMinTotalRaiseAmount.replace(/,/g,''):0);
        if((this.FPMaxTotalRaiseAmount != undefined && this.FPMaxTotalRaiseAmount != ''))
        FPMaxTotalRaiseAmount = parseInt(this.FPMaxTotalRaiseAmount != undefined && this.FPMaxTotalRaiseAmount !=''? this.FPMaxTotalRaiseAmount.replace(/,/g,''):0);
        if(FPMinTotalRaiseAmount > FPMaxTotalRaiseAmount && FPMinTotalRaiseAmount>0 && FPMaxTotalRaiseAmount > 0) {
          this.IsFPMinTotalRaiseAmountUn=true
          this.IsFPMaxTotalRaiseAmountUn=true
          this.FPMinTotalRaiseAmountError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
        }
        if((FPMinTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount || FPMaxTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount) &&(FPMinTotalRaiseAmount>0 || FPMaxTotalRaiseAmount > 0) ){
          this.IsFPMinTotalRaiseAmountUn=(FPMinTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMinTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount)
          this.IsFPMaxTotalRaiseAmountUn=(FPMaxTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMaxTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount)
          this.FPMinTotalRaiseAmountError = ''
        }
        if((FPMinTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMaxTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount) &&(FPMinTotalRaiseAmount>0 || FPMaxTotalRaiseAmount > 0) ){
          this.IsFPMinTotalRaiseAmountUn=(FPMinTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMinTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount)
          this.IsFPMaxTotalRaiseAmountUn=(FPMaxTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMaxTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount)
          this.FPMinTotalRaiseAmountError =''
        }
      }

      if(checkVar == 'IsCumulativeRevenueUn'){
        if (value != undefined || value != '') {
          if((value < this.DefCumulativeRevenueAmount )){
            this.IsCumulativeRevenueUn=true
          }
        }
      }
    }
  }
  changeListener($event,type?): void {
  this.sizeExcludeErr = ''
  this.isSizeExclude=false
    if ($event.target.files && $event.target.files[0]) {
      let files =$event.target.files[0];
      if(type == 'logo') {
        if (files.size > this.store.logo_max_size) {
          this.isSizeExclude=true
          this.store.scrollTo('upload');
          this.sizeExcludeErr = this.store.getVal('maximum_size_allowed_is')+' ' + this.store.logo_max_size / 1000000 + this.store.getVal('mb');
        } else {          
          this.InvestorFile = files;
          let reader = new FileReader();
          reader.onload = (event: any) => {
            this.InvestorLogoSrc = event.target.result;
          }
          reader.readAsDataURL(this.InvestorFile);
        }
      }}
  }
  async changeMatch($event,selVar:any){
      // console.log('selVar ',selVar)
    
      if(selVar == 'matchEveryThing'){
        if(!this.matchEveryThing){
          const alert = await this.alertController.create({
            message: this.store.getVal('investor_match_everything_popup_msg'),
            animated: true,
            cssClass: 'alertCustomCssBtn',
            buttons: [
                {
                  text: this.store.getVal('yes'),
                  handler: () => {
                    this.matchEveryThing=true
                    this.matchImpactTheme=false
                    this.matchSdgs=false
                    this.matchEsgs=false
                    this.matchFundingType=false

                    this.selectedImpactTheme=[]
                    this.respObj.selectedImpactTheme = []
                    this.selectedSDGs=undefined
                    this.selectedEsg=[]
                    this.respObj.selectedEsg = []
                    this.selectedFundingTypeAndFundRaiseType=undefined

                    this.FPMinimumTicketSizePerFunding =undefined
                    this.FPMaximumTicketSizePerFunding =undefined
                    this.FPMinTotalRaiseAmount =undefined
                    this.FPMaxTotalRaiseAmount = undefined
                    this.FPCumulativeRevenue = undefined
                    this.selectedGenderLens = undefined
                    this.selectedIndustrySectors = undefined
                    this.selectedFundingStage=undefined

                    this.selectedCountriesOfDomicileNationality = []
                    this.respObj.selectedCountriesOfDomicileNationality=[]
                    this.selectedCountriesOfIncorporation = []
                    this.respObj.selectedCountriesOfIncorporation=[]
                    
                    
                  }
                },{
                  text: this.store.getVal('no'),
                  role:'cancel',
                  handler: () => {
                   
                  }
                }
              ], backdropDismiss: true
          });
          return await alert.present();
        }else{
          this.matchEveryThing=false
        }
      }else{
        // this[selVar] =!this[selVar]
      }
      
      if(this.matchEveryThing || selVar == 'matchImpactTheme'){
        this.selectedImpactTheme=[]
        this.respObj.selectedImpactTheme = []
      }
      if(this.matchEveryThing || selVar == 'matchSdgs'){
        this.selectedSDGs=undefined
      }
      if(this.matchEveryThing || selVar == 'matchEsgs'){
        this.selectedEsg=[]
        this.respObj.selectedEsg = []
      }
      if(this.matchEveryThing || selVar == 'matchFundingType'){
        this.selectedFundingTypeAndFundRaiseType=undefined
      }
      // console.log('selVar ', (this.matchImpactTheme && this.matchSdgs && this.matchEsgs && this.matchFundingType))
    //  this.matchEveryThing = (this.matchImpactTheme && this.matchSdgs && this.matchEsgs && this.matchFundingType)
      
  }
  onDeleteFile(from) {
    if(from == 'logo') {
      this.IsDeleteLogo = true
      this.InvestorLogoSrc = ""
      this.InvestorFile = undefined;
      this.InvestorLogoURl = undefined;
      $('#upload').val('')
    }
  }

  async callAction(event, type,isFirst) {
    this.resetVar()
      let isCall = false     
    if (isFirst && event == 1) {
      if (this.ProfileName == undefined || this.ProfileName.trim() == '') {
        this.IsProfileName = true;
          this.store.scrollTo('ProfileName');
        isCall = true
      }
      if (this.Email == undefined || this.store.checkMail(this.Email)) {
        this.IsEmail = true;
        if (!isCall)
          this.store.scrollTo('Email');
        isCall = true
      }
      if (isCall) {
        this.loadMsg = this.store.getVal('please_complete_required_field');
        this.dataAction = []
      } else {
        let postData = new FormData();

        if(this.type != 'clone')
        postData.append(this.type=='edit_fp'|| this.type=='add_fp' || this.type =='add-with-enabler'?'ProfileSlug':this.type=='add'?'EnablerSlug':'FP_EnablerSlug', (this.FP_EnablerSlug != undefined && this.FP_EnablerSlug != ''?this.FP_EnablerSlug:''));

        if(this.selectedImpactFundingEnabler !=undefined)
        postData.append("Enablers", (this.selectedImpactFundingEnabler == undefined || this.selectedImpactFundingEnabler == '')?'':this.selectedImpactFundingEnabler);
        postData.append("ProfileName", this.ProfileName);

        if(this.selectedCompanyName !=undefined)
        postData.append("CompanyName", this.selectedCompanyName != undefined? this.selectedCompanyName : '');
        postData.append("Email", this.Email!=undefined? this.Email.trim():'');

        this.apiService.validateFundingProfile(postData,(this.type=='edit' || this.type=='my_edit' ||this.type=='add' || this.type=='clone'|| this.type=='add-with-enabler'?'validate':'validate_fp')).subscribe(async response => {
          let res: any = response;
          if (res.success) {
            this.loadMsg = ''
            this.errMsg = ''
            this.suggestionList=[]
            this.dataAction = []
          } else {
            if(res.data.ProfileExist){
              this.loadMsg=''
              this.errMsg = res.message
              this.IsProfileName = true;
              this.store.scrollTo('ProfileName');
              this.suggestionList = res.data.ProfileNameSuggestionsList
            }else{                
                this.store.scrollTo('topRow');
                this.errMsg=''
                this.loadMsg = res.message
              }
              this.dataAction = res.data.Actions != undefined ? res.data.Actions : []
          }
        });
      }
    } else if (event == 1 && type ==3) {
        let postData = new FormData();
        postData.append(this.type=='edit_fp'|| this.type=='add_fp'?'ProfileSlug':this.type=='add'?'EnablerSlug':'FP_EnablerSlug', (this.FP_EnablerSlug != undefined && this.FP_EnablerSlug != ''?this.FP_EnablerSlug:''));
        // if(this.FP_EnablerSlug != undefined)
        // postData.append("FP_EnablerSlug", this.FP_EnablerSlug);
        if(this.selectedImpactFundingEnabler !=undefined)
        postData.append("Enablers", (this.selectedImpactFundingEnabler == undefined || this.selectedImpactFundingEnabler == '')?'':this.selectedImpactFundingEnabler);
        postData.append("ProfileName", this.ProfileName);
        postData.append("Email", this.Email!=undefined? this.Email.trim():'');
  
        this.apiService.validateFundingProfile(postData,(this.type=='edit' || this.type=='my_edit' || this.type=='add' || this.type=='clone'?'validate':'validate_fp')).subscribe(response => {
          let res: any = response;
          if (res.success) {
            this.loadMsg = ''
            this.errMsg = ''
            this.dataAction = []
          } else {
            this.store.scrollTo('topRow');
            this.loadMsg = res.message
            this.dataAction = res.data.Actions != undefined ? res.data.Actions : []
          }
        });
      
    } else if (event == 1) {
      if (this.selectedEnablerCurrency == undefined || this.selectedEnablerCurrency == '') {
        this.IsEnablerCurrency = true;
        if (!isCall)
          this.store.scrollTo('EnablerCurrency');
        isCall = true
      }
      if (this.selectedFundingProviderType == undefined || this.selectedFundingProviderType == '') {
        this.IsFundingProviderType = true;
        if (!isCall)
          this.store.scrollTo('selectedFundingProviderType');
        isCall = true
      }
      // if (this.FPMinimumTicketSizePerFunding == undefined || this.FPMinimumTicketSizePerFunding == '') {
      //   this.IsFPMinimumTicketSizePerFundingUn = true;
      //   if (!isCall)
      //   this.store.scrollTo('FPMinimumTicketSizePerFunding');
      //   isCall = true
      // }
      // if (this.FPMaximumTicketSizePerFunding == undefined || this.FPMaximumTicketSizePerFunding == '') {
      //   this.IsFPMaximumTicketSizePerFundingUn = true;
      //   if (!isCall)
      //   this.store.scrollTo('FPMaximumTicketSizePerFunding');
      //   isCall = true
      // }
      if((this.FPMinimumTicketSizePerFunding != undefined && this.FPMinimumTicketSizePerFunding != '') || (this.FPMaximumTicketSizePerFunding != undefined && this.FPMaximumTicketSizePerFunding != '')){
        
        let FPMinimumTicketSizePerFunding=0
        let FPMaximumTicketSizePerFunding=0
        if ((this.FPMinimumTicketSizePerFunding != undefined && this.FPMinimumTicketSizePerFunding != ''))
        FPMinimumTicketSizePerFunding = parseInt(this.FPMinimumTicketSizePerFunding != undefined && this.FPMinimumTicketSizePerFunding !=''? this.FPMinimumTicketSizePerFunding.replace(/,/g,''):0);
         if((this.FPMaximumTicketSizePerFunding != undefined && this.FPMaximumTicketSizePerFunding != ''))
         FPMaximumTicketSizePerFunding = parseInt(this.FPMaximumTicketSizePerFunding != undefined && this.FPMaximumTicketSizePerFunding !=''? this.FPMaximumTicketSizePerFunding.replace(/,/g,''):0);
         if (FPMinimumTicketSizePerFunding > FPMaximumTicketSizePerFunding && FPMinimumTicketSizePerFunding>0 && FPMaximumTicketSizePerFunding > 0) {
          this.IsFPMinimumTicketSizePerFundingUn=true
          this.IsFPMaximumTicketSizePerFundingUn=true
          this.FPMinimumTicketSizePerFundingError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
          if(!isCall)
          this.store.scrollTo('FPMinimumTicketSizePerFunding');
          isCall = true
        }
        if(FPMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding || FPMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding ){
          this.IsFPMinimumTicketSizePerFundingUn=(FPMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
          this.IsFPMaximumTicketSizePerFundingUn=(FPMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
          this.FPMinimumTicketSizePerFundingError = ''
          if(!isCall)
          this.store.scrollTo('FPMinimumTicketSizePerFunding');
          isCall = true
        }
        if(FPMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding ){
          this.IsFPMinimumTicketSizePerFundingUn=(FPMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
          this.IsFPMaximumTicketSizePerFundingUn=(FPMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FPMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
          this.FPMinimumTicketSizePerFundingError =''
          if(!isCall)
          this.store.scrollTo('FPMinimumTicketSizePerFunding');
          isCall = true
        }
      }
      if ((this.selectedImpactTheme == undefined || this.selectedImpactTheme.length == 0) && ((!this.matchEveryThing && !this.matchImpactTheme))) {
        this.IsImpactTheme = true;
        if (!isCall)
          this.store.scrollTo('ImpactThemeAndArea');
        isCall = true
      }
      if(((this.selectedSDGs == undefined || this.selectedSDGs.length == 0) && (!this.matchEveryThing &&!this.matchSdgs)) && ((this.selectedEsg == undefined || this.selectedEsg.length == 0) && (!this.matchEveryThing && !this.matchEsgs))){
        this.IsSGD = true;
        this.IsESG = true;
            if (!isCall)
            this.store.scrollTo('sdg_list');
          isCall = true
      }
      if ((this.selectedFundingTypeAndFundRaiseType == undefined || this.selectedFundingTypeAndFundRaiseType.length == 0) && (!this.matchEveryThing && !this.matchFundingType)) {
        this.IsFundingTypeAndFundRaiseType = true;
        if (!isCall)
          this.store.scrollTo('FundingTypeAndFundRaiseType');
        isCall = true
      }
      
      let FPMinTotalRaiseAmount=0
      let FPMaxTotalRaiseAmount=0
      if ((this.FPMinTotalRaiseAmount != undefined && this.FPMinTotalRaiseAmount != ''))
      FPMinTotalRaiseAmount = parseInt(this.FPMinTotalRaiseAmount != undefined && this.FPMinTotalRaiseAmount !=''? this.FPMinTotalRaiseAmount.replace(/,/g,''):0);
       if((this.FPMaxTotalRaiseAmount != undefined && this.FPMaxTotalRaiseAmount != ''))
       FPMaxTotalRaiseAmount = parseInt(this.FPMaxTotalRaiseAmount != undefined && this.FPMaxTotalRaiseAmount !=''? this.FPMaxTotalRaiseAmount.replace(/,/g,''):0);
       if (FPMinTotalRaiseAmount > FPMaxTotalRaiseAmount && FPMinTotalRaiseAmount>0 && FPMaxTotalRaiseAmount > 0) {
        this.IsFPMinTotalRaiseAmountUn=true
        this.IsFPMaxTotalRaiseAmountUn=true
        this.FPMinTotalRaiseAmountError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
        if(!isCall)
        this.store.scrollTo('FPMinTotalRaiseAmount');
        isCall = true
      }
      if((FPMinTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount || FPMaxTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount) &&(FPMinTotalRaiseAmount>0 || FPMaxTotalRaiseAmount > 0) ){
        this.IsFPMinTotalRaiseAmountUn=(FPMinTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMinTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount)
        this.IsFPMaxTotalRaiseAmountUn=(FPMaxTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMaxTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount)
        this.FPMinTotalRaiseAmountError = ''
        if(!isCall)
        this.store.scrollTo('FPMinTotalRaiseAmount');
        isCall = true
      }
      if((FPMinTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMaxTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount) &&(FPMinTotalRaiseAmount>0 || FPMaxTotalRaiseAmount > 0) ){
        this.IsFPMinTotalRaiseAmountUn=(FPMinTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMinTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount)
        this.IsFPMaxTotalRaiseAmountUn=(FPMaxTotalRaiseAmount > this.DefFPMaximumTotalRaiseAmount || FPMaxTotalRaiseAmount < this.DefFPMinimumTotalRaiseAmount)
        this.FPMinTotalRaiseAmountError =''
        if(!isCall)
        this.store.scrollTo('FPMinTotalRaiseAmount');
        isCall = true
      }

      if ((this.FPCumulativeRevenue != undefined && this.FPCumulativeRevenue != '')){
        let FPCumulativeRevenue=0
        FPCumulativeRevenue = parseInt(this.FPCumulativeRevenue != undefined && this.FPCumulativeRevenue !=''? this.FPCumulativeRevenue.replace(/,/g,''):0);
        if((FPCumulativeRevenue < this.DefCumulativeRevenueAmount )){
          this.IsCumulativeRevenueUn=true
          if(!isCall)
          this.store.scrollTo('FPCumulativeRevenue');
          isCall = true
        }
      }
      if (this.FirstName == undefined || this.FirstName.trim() == '') {
        this.IsFirstName = true;
        if (!isCall)
          this.store.scrollTo('FirstName');
        isCall = true
      }
      if (this.Email == undefined || this.store.checkMail(this.Email,true)) {
        this.IsEmail = true;
        if (!isCall)
          this.store.scrollTo('Email');
        isCall = true
      }
      if (this.RepresentingForEmail != undefined && this.RepresentingForEmail  !='' && this.store.checkMail(this.RepresentingForEmail,true)) {
        this.IsRepresentingForEmail = true;
        if (!isCall)
          this.store.scrollTo('RepresentingForEmail');
        isCall = true
      }
      if (this.Website == undefined || (this.Website.trim() != '' && this.store.checkWeb(this.Website))) {
        this.isWebsite = true
        if (!isCall)
        this.store.scrollTo('Website');
        isCall = true
      }
      if (this.ProfileName == undefined || this.ProfileName.trim() == '') {
        this.IsProfileName = true;
        if (!isCall)
          this.store.scrollTo('ProfileName');
        isCall = true
      }
      if (!this.ConfirmAuthorised) {
        this.ConfirmAuthorisedUn = true;
        if (!isCall)
          this.store.scrollTo('TermsPrivacy');
        isCall = true
      }
      if (!this.IsConfidentialityDisclaimer && this.enablerData != undefined) {
        this.IsConfidentialityDisclaimerUn = true;
        if (!isCall)
          this.store.scrollTo('IsConfidentialityDisclaimer');
        isCall = true
      }
      if (!this.ConfirmInvestor && this.enablerData != undefined) {
        this.IsConfirmInvestor = true;
        if (!isCall)
          this.store.scrollTo('ConfirmInvestor');
        isCall = true
      }
      if (isCall) {
        this.loadMsg = this.store.getVal('please_complete_required_field')
      } else {
        let postData = new FormData();
        if(this.EnablerSlug != undefined)
        postData.append("EnablerSlug", this.EnablerSlug);
        if(this.type == 'edit' || this.type == 'my_edit'){
          if(this.FP_EnablerSlug != undefined)
          postData.append("FP_EnablerSlug", this.FP_EnablerSlug);
        }
        if(this.type == 'edit_fp' || this.type =='add-with-enabler')
        postData.append("ProfileSlug", this.FP_EnablerSlug);
        if (this.type == 'clone')
        postData.append("ReferenceSlug", this.FP_EnablerSlug);

        if((this.selectedImpactFundingEnabler != undefined || this.selectedImpactFundingEnabler != '') && !this.isSkip)
        postData.append("ImpactFundingEnabler", (this.selectedImpactFundingEnabler == undefined || this.selectedImpactFundingEnabler == '')?'':this.selectedImpactFundingEnabler);
        postData.append("CurrencyID", (this.selectedEnablerCurrency == undefined)?'':this.selectedEnablerCurrency);
        postData.append("FundingProviderType", (this.selectedFundingProviderType == undefined)?'':this.selectedFundingProviderType);
        postData.append("CountriesOfDomicileNationality", ((this.selectedCountriesOfDomicileNationality != undefined && this.selectedCountriesOfDomicileNationality.length > 0) ? this.selectedCountriesOfDomicileNationality.toString() : ''));
        postData.append("ImpactThemesAndAreas", ((this.selectedImpactTheme != undefined && this.selectedImpactTheme.length > 0) ? this.selectedImpactTheme.toString() : ''));
        postData.append("AdditionalImpactThemesOrAreas", (this.AdditionalImpactThemesOrAreas != undefined && this.AdditionalImpactThemesOrAreas != '')?this.AdditionalImpactThemesOrAreas.trim():'');
        postData.append("SDGs", this.selectedSDGs != undefined?this.selectedSDGs:'');
        postData.append("ESG", ((this.selectedEsg != undefined && this.selectedEsg.length > 0) ? this.selectedEsg.toString() : ''));
        postData.append("GenderLens", ((this.selectedGenderLens != undefined && this.selectedGenderLens.length > 0) ? this.selectedGenderLens.toString() : ''));
        postData.append("FundingType", (this.selectedFundingTypeAndFundRaiseType == undefined)?'':this.selectedFundingTypeAndFundRaiseType);
        postData.append("FundingStage", this.selectedFundingStage != undefined ? this.selectedFundingStage : '');
        postData.append("CountriesOfIncorporation", ((this.selectedCountriesOfIncorporation != undefined && this.selectedCountriesOfIncorporation.length > 0) ? this.selectedCountriesOfIncorporation.toString() : ''));
        postData.append("IndustriesSectors", this.selectedIndustrySectors);
        
        postData.append("MinimumTotalRaiseAmount", this.FPMinTotalRaiseAmount != undefined?this.FPMinTotalRaiseAmount.replace(/,/g, ""):'');
        postData.append("MaximumTotalRaiseAmount",this.FPMaxTotalRaiseAmount != undefined? this.FPMaxTotalRaiseAmount.replace(/,/g, ""):'');

        postData.append("MinimumTicketSizePerFunding", this.FPMinimumTicketSizePerFunding != undefined?this.FPMinimumTicketSizePerFunding.replace(/,/g, ""):'');
        postData.append("MaximumTicketSizePerFunding", this.FPMaximumTicketSizePerFunding != undefined ?this.FPMaximumTicketSizePerFunding.replace(/,/g, ""):'');

        postData.append("CumulativeRevenue", this.FPCumulativeRevenue != undefined?this.FPCumulativeRevenue.replace(/,/g, ""):'');


        if (this.InvestorFile != undefined) {
          postData.append('Logo', this.InvestorFile, this.InvestorFile.name);
        }
        postData.append("IsDeleteLogo", this.IsDeleteLogo ? '1' : '0');
    
        postData.append("IsDisclaimer", this.IsConfidentialityDisclaimer ? '1' : '0');
        postData.append("IsConfidentiality", this.IsConfidentialityDisclaimer ? '1' : '0');


        postData.append("FirstName", this.FirstName.trim());
        postData.append("LastName", (this.LastName != undefined && this.LastName != ''?this.LastName.trim():''));
        postData.append("Email",this.Email!=undefined? this.Email.trim():'');

        postData.append("RepresentingForEmail", this.RepresentingForEmail != undefined?this.RepresentingForEmail.trim():'');
        postData.append("RepresentingForFirstName", this.RepresentingForFirstName);
        postData.append("RepresentingForLastName", this.RepresentingForLastName);



        postData.append("Website", (this.Website != undefined && this.Website != ''?this.Website.trim():''));
        postData.append("About", (this.About != undefined && this.About != ''?this.About.trim():''));

        postData.append("AdditionalNotes", (this.AdditionalNotes != undefined && this.AdditionalNotes != ''?this.AdditionalNotes.trim():''));
        postData.append("ProfileName", this.ProfileName.trim());
        postData.append("SourceOrReferral", (this.SourceOrReferral != undefined && this.SourceOrReferral != ''?this.SourceOrReferral.trim():''));
        postData.append("InternalReferenceNumber", (this.InternalReferenceNumber != undefined && this.InternalReferenceNumber != ''?this.InternalReferenceNumber.trim():''));
        if(this.selectedCompanyName !=undefined)
        postData.append("CompanyName", this.selectedCompanyName != undefined? this.selectedCompanyName : '');
        if(this.selectedTagsTag !=undefined)
        postData.append("Tags", this.selectedTagsTag != undefined? JSON.stringify(this.selectedTagsTag) : '');

        postData.append("InternalNotes",this.InternalNotes);
        postData.append("ConfirmAuthorised", this.ConfirmAuthorised ? '1' : '0');

        postData.append("ConfirmInvestor", this.ConfirmInvestor ? '1' : '0');
        if(!this.isUser){
          postData.append("IsActive",this.IsActive != undefined ? this.IsActive : '0');
          postData.append("IsFeatured", this.IsFeatured != undefined ? this.IsFeatured : '0');
          postData.append("IsEnable",  this.IsEnable != undefined ? this.IsEnable : '0');
          postData.append("DataStatus", this.DataStatus != undefined ? this.DataStatus : '');
        }

        postData.append("MatchEverything",this.matchEveryThing?'1':'0');
        postData.append("ImpactMatchEverything", this.matchImpactTheme?'1':'0');
        postData.append("SDGsMatchEverything",  this.matchSdgs?'1':'0');
        postData.append("ESGMatchEverything", this.matchEsgs?'1':'0');
        postData.append("FundingTypeMatchEverything", this.matchFundingType?'1':'0');


        postData.append("ScreeningStatus", this.ScreeningStatus != undefined ? this.ScreeningStatus : '');
        let scsN
        for (let l = 0; l < this.screening_status_list.length; l++) {
          const element = this.screening_status_list[l];
          if(element.isNew && element.ReferenceKey == this.ScreeningStatus){
            scsN= element.ReferenceName
            break;
          }
        }
        postData.append("ScreeningStatusAdd", scsN != undefined ?  scsN : '');

        postData.append("Link", window.location.href);
        this.apiService.addData('funding_profile', postData, (this.type == 'clone' || this.type =='add-with-enabler')?'add':this.type).subscribe(async response => {
          let res: any = response;

          let message=res.message;
          this.dataAction = res.data.Actions != undefined?res.data.Actions:[]
          let messageAction = [];
          if (message != undefined && message.length > 0) {
            message = !message.includes('@')?message.replace(/\+/g, ' '):message
            for (let i = 0; i < getActionsFromMessage(message).length; i++) {
              const element = getActionsFromMessage(message)[i];
              messageAction.push(element.replace(/[{}]/g, ''))
            }
            for (let i = 0; i < messageAction.length; i++) {
              const element = messageAction[i];
              var dataApos = 0;
              for (let j = 0; j < this.dataAction.length; j++) {
                if (element == this.dataAction[j].ActionKey) {
                  dataApos = j
                  break
                }
              }
              message = this.store.highlight(message, element,this.dataAction.length>0?this.dataAction[dataApos].Text:'', this.dataAction.length>0?this.dataAction[dataApos].FunctionName:'')
            }
          }
          if (res.success) {
            this.clearData();
            this.loadMsg = ''
            this.errMsg = ''
              res.pageUrl = (this.EnablerSlug != undefined && this.EnablerSlug != '' && this.store.appType == 'front')?'/enabler/'+this.EnablerSlug+'#overview':'';
              this.eventService.publishEnablerUpdate({});
              if( this.type =='add-with-enabler'){
                this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)});
                this.store.showToast(message,5000);
                this.store.backPage();
              }else{
                if(res.data.ProfileSlug != undefined && this.selectedImpactFundingEnabler == undefined){
                  if(this.store.isLogin){
                    this.router.navigateByUrl('user/funding-profile/'+res.data.ProfileSlug+'#matching-enablers',{replaceUrl:true});
                  }else{
                    this.router.navigateByUrl('user/enabler/funding-profile/'+res.data.ProfileSlug,{replaceUrl:true});
                  }
                }else if(this.type == 'add_fp'){
                  this.router.navigateByUrl('/user#my-funding-profiles');
                }
                else {
                  if(!(this.store.isLogin)){
                    this.store.saveData('altMsg', res, true);
                    this.store.scrollTo('topRow');
                    this.router.navigateByUrl('/message/funding-profile');
                  }else{
                    if(this.type == 'add'){                      
                      const alert = await this.alertController.create({
                        message: message,
                        animated: true,
                        cssClass: 'alertCustomCssBtn',
                        buttons: [
                            {
                              text: this.store.getVal('okay'),
                              handler: () => {
                                if(this.type == 'add' && this.EnablerSlug != undefined){
                                  this.store.backPage()
                                }
                              }
                            }
                          ], backdropDismiss: true
                        });
                        return await alert.present();
                    }else{
                      this.store.showToast(message,5000)
                      if(this.type == 'add' && this.EnablerSlug != undefined){
                        this.store.backPage()
                      }
                    }
                    this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
                  }
                }
              }
              
          } else {
            if(res.data.ProfileExist){
              this.loadMsg=''
              this.errMsg = res.message
              this.IsProfileName = true;
              this.store.scrollTo('ProfileName');
              this.suggestionList = res.data.ProfileNameSuggestionsList
            }else if(res.data.CallPaymentGateway != undefined && res.data.CallPaymentGateway){
              window.open(res.data.SessionUrl,'_self');
            }else if(res.data.IsPopup != undefined && res.data.IsPopup){
              const alert = await this.alertController.create({
                header:  this.store.getVal('error'),
                message: message,
                animated: true,
                cssClass: 'alertCustomCssBtn',
                buttons: [
                  {
                    text: this.store.getVal('okay'),
                    handler: () => {
                      
                      if(this.enablerData != undefined){
                        this.store.openPage('admin?EnablerID='+this.enablerData.EnablerID+'#subscripions','1')
                      }else{
                        this.store.openPage('admin#subscripions','1')
                      }
                    }
                  }
                ], backdropDismiss: false
              });
              return await alert.present();
            }else{
              this.store.scrollTo('topRow');
              this.loadMsg = message
            }
            }
          });
        }
    } else {
      if (event == 2 && type == 3) {
        // this.isFirst = true
        this.isEnabler = false
      }else if (type == 2 && event == 2) {
        // this.isFirst = true
        this.isEnabler = false
        // this.isSecond = false
          if(this.type != 'add_fp' && this.type != 'edit_fp')
          this.clearDataSecData()
      }else if (event == 0 && type == 3 && this.store.appType !='admin') {
          this.isSkip=true
          this.DefFPMinimumTicketSizePerFunding = 1
          this.DefFPMaximumTicketSizePerFunding =99999999999
          this.DefFPMinimumTotalRaiseAmount = 1
          this.DefFPMaximumTotalRaiseAmount =99999999999
          this.DefCumulativeRevenueAmount =1
      }
      else {
          const alert = await this.alertController.create({
            message: this.store.getVal('unsaved_changes'),
            animated: true,
            cssClass: 'alertCustomCssBtn',
            buttons: [
              {
                text: this.store.getVal('yes'),
                handler: () => {
                  this.clearData()
                  setTimeout(() => {
                    this.store.scrollTo('topRow');
                  }, 300);
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
    }
  }
  addNewTags = (term) => ({ ReferenceKey: term, ReferenceName: term });
  selectDataStatus(event) {
    this.DataStatus = event
  }
  resetVar() {

      this.FPMinTotalRaiseAmountError=''
      this.FPMaxTotalRaiseAmountError=''
      this.FPMinimumTicketSizePerFundingError=''
      this.FPMaximumTicketSizePerFundingError=''
      this.FPMaximumTicketSizePerFundingError=''
  

      this.IsFundingProviderType = false;
      this.IsFPMinTotalRaiseAmountUn = false
      this.IsFPMaxTotalRaiseAmountUn = false
      this.IsCumulativeRevenueUn = false
      this.IsFPMinimumTicketSizePerFundingUn = false
      this.IsFPMaximumTicketSizePerFundingUn = false
      this.IsImpactTheme = false;
      this.IsFundingTypeAndFundRaiseType = false;
      this.IsSGD = false;
      this.IsESG = false;
      this.IsFundingStage = false;
      // this.IsCountriesOfIncorporation = false;
      this.IsFirstName = false;
      this.IsEmail = false;
      this.IsRepresentingForEmail = false;
      this.isWebsite = false;
      this.IsProfileName = false;
      this.ConfirmAuthorisedUn = false
      this.IsConfirmInvestor = false
  }

  clearDataSecData() {
    this.selectedEnablerCurrency = undefined;
    this.selectedFundingProviderType = undefined;
    this.funding_provider_type_list = [];
    this.currency_list = [];
    
    this.TotalDomicileNationalityCountry = 0
    this.selectedCountriesOfDomicileNationality = [];
    this.domicile_nationality_country_list= [];
    
    this.TotalThemesAreas = 0
    this.selectedImpactTheme = [];
    this.ImpactThemesAreasList = [];
    
    this.selectedSDGs = '';
    this.sdg_list = [];
    this.selectedEsg = [];

    this.TotalFundingType = 0
    this.selectedFundingTypeAndFundRaiseType = [];

    this.selectedFundingStage = undefined;
    this.funding_stage_list = []
    
    this.TotalIncorporationCountry = 0
    this.selectedCountriesOfIncorporation = [];
    this.IncorporationCountryList = [];

    this.selectedIndustrySectors = '';
    this.industries_sectors_list = [];

    this.FPMinimumTicketSizePerFunding=''
    this.FPMaximumTicketSizePerFunding=''
    
    this.AdditionalImpactThemesOrAreas = ''
    this.selectedGenderLens = ''
    this.selectedIndustrySectors = ''
    // this.selectedInvestorRaiseAmount = undefined
    // this.selectedCumulativeRevenue = undefined
    this.ScreeningStatus = undefined
    this.AdditionalNotes = ''
    this.SourceOrReferral = ''
    this.InternalReferenceNumber = ''
    this.selectedTagsTag = []
    this.InternalNotes = ''
    this.ConfirmAuthorisedUn = false
    this.ConfirmInvestor = false

  }
  clearData(from?) {
    this.resetVar();
    // this.isFirst = true
    // this.isSecond = false

    this.clearDataSecData()

    if (!this.store.isLogin)
      this.Email = ''
    this.AdditionalNotes = ''
    this.ProfileName = ''

    for (let k = 0; k < this.IncorporationCountryList.length; k++) {
      this.IncorporationCountryList[k].checked = false;
      for (let l = 0; l < this.IncorporationCountryList[k].Children.length; l++) {
        this.IncorporationCountryList[k].Children[l].checked = false;
        if (this.IncorporationCountryList[k].Children[l].Children != undefined) {
          for (let i = 0; i < this.IncorporationCountryList[k].Children[l].Children.length; i++) {
            this.IncorporationCountryList[k].Children[l].Children[i].checked = false;
          }
        }
      }
    }

    // for now if enabler slug will found then redirect to back page
    // assuming that coming from enabler list
    if(this.FP_EnablerSlug != undefined && this.FP_EnablerSlug != '') {
      // this.eventService.publishRefreshData({segment:'funding-profiles', reload: true })
      if(from == 'cancel') {
        this.store.backPage()
      } else {
        if(this.type != 'edit' && this.type != 'my_edit' && this.type != 'edit_fp' && this.type != 'clone'){
          this.router.navigateByUrl('/admin/enabler/'+this.EnablerSlug+'#funding-profiles');
        } else if(this.type == 'clone') {
          this.router.navigateByUrl('/user#funding-profile-submissions');
        }else{
          this.store.backPage()
        }
      }
    }
  }
  changeTreeData(event){
     if(event != undefined){
      if(event.modalName != undefined){
        this[event.modalName]= event.modal
      }
    if(event.modalName =='selectedEsg'){
      this.respObj.selectedEsg=event.modal
    }
    }
  }
  selectSuggestionItem(item) {
    this.errMsg=''
    this.ProfileName = item.SuggestionName;
    this.suggestionList = [];
    this.IsProfileName = false;
  }
  ngOnDestroy() {
    if(this.PLATFORMID)
    $(".tox-toolbar__group").hide();
    this.subLabel.unsubscribe();
    this.subscription.unsubscribe();
  }
  ngAfterViewChecked(): void {
    this.cdref.detectChanges();
  }
  async setFacilatorWise(res: any,details: any) {
    if (res.data.currency_list != undefined) {
      this.currency_list = res.data.currency_list
    }
    if (res.data.funding_provider_type_list != undefined) {
      this.funding_provider_type_list = res.data.funding_provider_type_list
    }
    if (res.data.investor_ticket_size_list != undefined) {
      this.investor_ticket_size_list = res.data.investor_ticket_size_list
    }
    if (res.data.gender_lens_list != undefined) {
      this.gender_lens_list = res.data.gender_lens_list
    }
    if (res.data.investor_raise_amount_list != undefined) {
      this.investor_raise_amount_list = res.data.investor_raise_amount_list
    }
    if (res.data.revenue_alert_list != undefined) {
      this.revenue_alert_list = res.data.revenue_alert_list
    }
    
    if (res.data.screening_status_list != undefined) {
      this.screening_status_list = res.data.screening_status_list
    }
    
    if (res.data.sdg_list != undefined) {
      this.sdg_list = res.data.sdg_list
    }
    if (res.data.funding_type_list != undefined) {
      this.funding_type_list = res.data.funding_type_list
    }
    if (res.data.funding_stage_list != undefined) {
      this.funding_stage_list = res.data.funding_stage_list
    }
    if (res.data.industries_sectors_list != undefined) {
      this.industries_sectors_list = res.data.industries_sectors_list
    }
    if (res.data.tag_list != undefined) {
      this.TagList = res.data.tag_list
    }
   
    if(res.data.domicile_nationality_country_list != undefined) {
      this.domicile_nationality_country_list = res.data.domicile_nationality_country_list;      
    }
    
    if ((res.data.incorporation_country_list != undefined && res.data.incorporation_country_list.length > 0 && !this.isFromUser) || (res.data.region_tree_list != undefined && res.data.region_tree_list.length > 0 && this.isFromUser)) {
      let incorporation_country_list = this.isFromUser?res.data.region_tree_list :res.data.incorporation_country_list;
      this.IncorporationCountryListTemp = incorporation_country_list
    }
    if (res.data.impact_themes_areas_list != undefined && res.data.impact_themes_areas_list.length > 0) {
      this.ImpactThemesAreasListTemp =res.data.impact_themes_areas_list;
    }
    if (res.data.esg_list != undefined && res.data.esg_list.length > 0) {
      this.EsgListTemp =res.data.esg_list;
    }
    if (res.data.sdg_list != undefined) {
      this.sdg_list = res.data.sdg_list
    }
    if (res.data.funding_type_list != undefined) {
      this.funding_type_list = res.data.funding_type_list
    }
    this.selectedEnablerCurrency = (res.data.enabler_currency != undefined && res.data.enabler_currency != '' ? parseInt(res.data.enabler_currency):undefined) 

    let mData =res.data;

    this.confidentiality = mData.confidentiality != undefined?mData.confidentiality:(this.store.getVal('investor_confidentiality_text'))
    this.disclaimer = mData.disclaimer != undefined?mData.disclaimer:(this.store.getVal('investor_disclaimer_text'))

    this.DefFPMinimumTicketSizePerFunding = mData.minimum_ticket != undefined && mData.minimum_ticket !=''? parseInt(mData.minimum_ticket):this.DefFPMinimumTicketSizePerFunding
    this.DefFPMaximumTicketSizePerFunding = mData.maximum_ticket != undefined && mData.maximum_ticket !='' ? parseInt(mData.maximum_ticket):this.DefFPMaximumTicketSizePerFunding

    this.DefFPMinimumTotalRaiseAmount = mData.minimum_raise_amount != undefined && mData.minimum_raise_amount !=''? parseInt(mData.minimum_raise_amount):this.DefFPMinimumTotalRaiseAmount
    this.DefFPMaximumTotalRaiseAmount = mData.maximum_raise_amount != undefined && mData.maximum_raise_amount  !='' ? parseInt(mData.maximum_raise_amount):this.DefFPMaximumTotalRaiseAmount

    this.DefCumulativeRevenueAmount = mData.minimum_cumulative_revenue != undefined && mData.minimum_cumulative_revenue  !='' ? parseInt(mData.minimum_cumulative_revenue):this.DefCumulativeRevenueAmount
    this.DefMaxCumulativeRevenueAmount = mData.maximum_cumulative_revenue != undefined && mData.maximum_cumulative_revenue  !='' ? parseInt(mData.maximum_cumulative_revenue):this.DefCumulativeRevenueAmount
    
    //this.store.getList(this.funding_provider_type_list,detail.FundingProviderType);

    if(details !=undefined) {
       this.setDetailsData(details);
    } else {
      this.isTreePrepare=true
    }
  }
  setDetailsData(res: any) {
    // throw new Error('Method not implemented.');
    if(res.data != undefined && res.data.detail != undefined) {
      let detail = res.data.detail

      this.matchEveryThing = (detail.MatchEverything ==1 || detail.MatchEverything =='1')
      this.matchImpactTheme = (detail.ImpactMatchEverything==1 || detail.ImpactMatchEverything =='1')
      this.matchSdgs = (detail.SDGsMatchEverything==1 || detail.SDGsMatchEverything =='1')
      this.matchEsgs = (detail.ESGMatchEverything==1 || detail.ESGMatchEverything =='1')
      this.matchFundingType = (detail.FundingTypeMatchEverything==1 || detail.FundingTypeMatchEverything =='1')
 

      if(detail.Logo != undefined && detail.Logo !=''){
        this.InvestorLogoURl = detail.Logo
      }

      this.selectedEnablerCurrency = this.selectedEnablerCurrency == undefined? (detail.CurrencyID != undefined && this.type != 'add-with-enabler'? parseInt(detail.CurrencyID):undefined):this.selectedEnablerCurrency 
      this.emailRestrict = (res.data.email_restrict == 1)
      this.ReferenceCode = detail.ReferenceCode
      this.selectedFundingProviderType =detail.FundingProviderType
      if(!this.matchEveryThing)
      this.selectedCountriesOfDomicileNationality = detail.CountriesOfDomicileNationality !=null? detail.CountriesOfDomicileNationality.split(',').map(Number):[]    
      if(this.type !='add-with-enabler'){
        if(!this.matchEveryThing){
          this.FPMinimumTicketSizePerFunding =this.store.format(undefined,detail.MinimumTicketSizePerFunding) 
          this.FPMaximumTicketSizePerFunding = this.store.format(undefined,detail.MaximumTicketSizePerFunding)
          this.FPMinTotalRaiseAmount =  this.store.format(undefined,detail.MinimumTotalRaiseAmount)
          this.FPMaxTotalRaiseAmount =  this.store.format(undefined,detail.MaximumTotalRaiseAmount)    
          this.FPCumulativeRevenue =  this.store.format(undefined,detail.CumulativeRevenue)
        }
      }  

      if(!this.matchEveryThing && !this.matchImpactTheme)
      this.respObj.selectedImpactTheme=detail.ImpactThemesAndAreas;
     
      if(!this.matchEveryThing && !this.matchEsgs)
      this.respObj.selectedEsg=detail.ESG;

      this.AdditionalImpactThemesOrAreas =detail.AdditionalImpactThemesOrAreas != undefined?this.store.nl2br2(detail.AdditionalImpactThemesOrAreas):'';
      if(!this.matchEveryThing && !this.matchSdgs)
      this.selectedSDGs =this.store.getList(this.sdg_list,detail.SDGs);
      if(!this.matchEveryThing && !this.matchFundingType){
        this.selectedFundingTypeAndFundRaiseType =this.store.getList(this.funding_type_list,detail.FundingType);
        this.respObj.selectedFundingTypeAndFundRaiseType=detail.FundingType;
      }
    
      if(!this.matchEveryThing)
      this.selectedGenderLens =this.store.getList(this.gender_lens_list,detail.GenderLens);

      if(!this.matchEveryThing)
      this.selectedFundingStage =this.store.getList(this.funding_stage_list,detail.FundingStage);

      if(!this.matchEveryThing)
      this.respObj.selectedCountriesOfIncorporation=detail.CountriesOfIncorporation;

      this.selectedIndustrySectors= this.store.getList(this.industries_sectors_list,detail.IndustriesSectors);
      this.FirstName= detail.FirstName;
      this.LastName= (detail.LastName != undefined && detail.LastName != null)?detail.LastName:'';
      this.Email = (this.Email == undefined || this.Email =='')? detail.Email:this.Email
      this.Website = detail.Website != undefined && detail.Website != null ? detail.Website : ''
      this.About = detail.About != undefined && detail.About != null ? this.store.nl2br2(detail.About) : ''

      this.RepresentingForEmail = (detail.RepresentingForEmail != undefined && detail.RepresentingForEmail != null)?detail.RepresentingForEmail:''
      this.RepresentingForFirstName = (detail.RepresentingForFirstName != undefined && detail.RepresentingForFirstName != null)?detail.RepresentingForFirstName:''
      this.RepresentingForLastName = (detail.RepresentingForLastName != undefined && detail.RepresentingForLastName != null)?detail.RepresentingForLastName:''

      this.AdditionalNotes= detail.AdditionalNotes != undefined? this.store.nl2br2(detail.AdditionalNotes):'';
      this.ProfileName= this.ProfileName == ''? detail.ProfileName != undefined ?detail.ProfileName:this.ProfileName:this.ProfileName;
      this.InternalNotes= detail.InternalNotes != undefined? this.store.nl2br2(detail.InternalNotes):'';
      this.SourceOrReferral= detail.SourceOrReferral;
      this.InternalReferenceNumber= detail.InternalReferenceNumber;

      if(this.selectedCompanyName != undefined && this.selectedCompanyName !=''){
        let check = this.CompanyNameList.findIndex(c => c.CompanyName == this.selectedCompanyName)
        if(check == -1)
        this.CompanyNameList.push({CompanyName:this.selectedCompanyName})
      }
      this.selectedCompanyName= this.selectedCompanyName !=undefined?this.selectedCompanyName:detail.CompanyName != undefined ?detail.CompanyName:this.selectedCompanyName;

      if(detail.Tags != undefined && detail.Tags != '') {
        this.selectedTags = detail.Tags.split(',')
        this.selectedTagsTag=[]
          for (let i = 0; i < this.selectedTags.length; i++) {
            const element = this.selectedTags[i];
            var idx = this.TagList.findIndex(p => p.ReferenceKey == element);
            this.selectedTagsTag.push(this.TagList[idx])
          }  
      }

      this.ScreeningStatus= detail.ScreeningStatus != undefined && detail.ScreeningStatus != ''?detail.ScreeningStatus:this.ScreeningStatus;
      this.IsFeatured= detail.IsFeatured != undefined?detail.IsFeatured:this.IsFeatured;
      this.IsActive= detail.IsActive != undefined?detail.IsActive:this.IsActive;
      this.IsEnable= detail.IsEnable != undefined?detail.IsEnable:this.IsEnable;
      this.DataStatus= detail.DataStatus != undefined?''+detail.DataStatus:this.DataStatus;
      
      this.ConfirmAuthorised = detail.ConfirmAuthorised==1;

      this.ConfirmInvestor = detail.ConfirmInvestor==1;
      this.IsConfidentialityDisclaimer = detail.IsDisclaimer == 1
      this.IsConfidentialityDisclaimer = detail.IsConfidentiality == 1    
      this.isTreePrepare=true
    }
  }
  statusSwitch(event) {
    if (event.DataStatus != undefined) {
      this.DataStatus = event.DataStatus
    }
    if (event.IsActive != undefined) {
      this.IsActive = event.IsActive
    }
    if (event.IsEnable != undefined) {
      this.IsEnable = event.IsEnable
    }
    if (event.IsFeatured != undefined) {
      this.IsFeatured = event.IsFeatured
    }
  }
  customSelect(event){
    setTimeout(() => {
      if(event.modalName !=undefined){
        this['' + event.modalName] = event.modal
      }
      if(event.modalName == 'selectedCompanyName'){
        if(this.selectedCompanyName != undefined && this.selectedCompanyName !=''){
          let check = this.CompanyNameList.findIndex(c => c.CompanyName == this.selectedCompanyName)
          if(check == -1)
          this.CompanyNameList.push({CompanyName:this.selectedCompanyName})
        }
      }
      if(event.select !=undefined){
        if(event.modalName == 'ScreeningStatus' || event.modalName == 'selectedTags'){
          let nList=[]
            if(event.select.itemsList._selectionModel !=undefined  && event.isNewTag){    
              let lst = event.list
              let ncList = JSON.parse(JSON.stringify(lst)) 
              let key = event.select.bindValue
              let lbl = event.select.bindLabel
              for (let i = 0; i < event.select.itemsList._selectionModel._selected.length; i++) {
                const element = event.select.itemsList._selectionModel._selected[i].value;
                var idx = lst.findIndex(p => p.ReferenceKey == element.ReferenceKey);
                let isNew=idx !=-1?lst[idx].isNew !=undefined?lst[idx].isNew :true:true
                nList.push({'ReferenceKey':(idx!= -1 ?element.ReferenceKey:'') ,'ReferenceName':element.ReferenceName,isNew:isNew })
                if(idx == -1)
                ncList.push({[key]:element.ReferenceKey ,[lbl]:element.ReferenceName,isNew:isNew})
              }  
              this[event.listName] = JSON.parse(JSON.stringify(ncList))
            }          
            this['' + event.modalName+'Tag'] = nList
            this['' + event.modalName] = event.modal
        }
      }
  }, 100);
  }
  customEditor(event){
    if(event !=undefined && event.varnm !=undefined){
      this[event.varnm] = event.val
    }
  }

}
