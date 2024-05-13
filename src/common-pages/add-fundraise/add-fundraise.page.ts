import { ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { Location, isPlatformBrowser } from '@angular/common';
import { EventService } from '../../shared/EventService';
import { StorageService } from '../../shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
declare const getActionsFromMessage
declare var $: any;

@Component({
  selector: 'add-fundraise',
  templateUrl: 'add-fundraise.page.html',
  styleUrls: ['add-fundraise.page.scss'],
})


export class AddFundraisePage implements OnInit {
  ;
  number1:any

  isFromUser = false
  dataAction: any = [];
  bsConfig: Partial<BsDatepickerConfig>;
  minMode: BsDatepickerViewMode = 'day';

  storeRes: any;
  breadCrumpData: any;
  notFoundText: any = '';
  loadMsg: any = ''
  ReferenceCode: any;
  emailRestrict: any=false;
  RevenueUsdError: any;
  // MinTicketError: any;
  ValidData = true
  isFirst = true
  isEnabler = false
  isSkip = false
  isSecond = false
  NoteTotalRaiseAmount: any = ''

  DefFPMinimumTicketSizePerFunding:any=1
  DefFPMaximumTicketSizePerFunding:any=99999999999

  DefFPMinCumulativeRevenue:any=1
  DefFPMaxCumulativeRevenue:any=99999999999


  EnablerSlug: any ;
  FN_EnablerSlug:any = '';
  type: any = '';
  page: any = '';

  isProvider = false
  isSizeExclude = false
  sizeExcludeErr = ''
 
  isInvesteeLogoUn=false
  isCompanyName = false
  isShortDescription = false
  isRNumber = false
  isCopmanyRegistryRecord = false
  isCountry = false
  IsEnablerCurrency = false
  isRevenueUsd = false
  isIndustries = false
  IsImpactTheme = false
  isSDG = false
  IsEsg = false
  isImpactStatement = false
  IsFundingTypeAndFundRaiseType = false
  isFundingStage = false
  isRaiseStartDate = false
  isRaiseEndDate = false

  IsFNMinTotalRaiseAmountUn = false
  IsFNMaxTotalRaiseAmountUn = false
  
  isInvestorType = false
  // isMinTicket = false
  isFname = false
  isEmail = false
  isRepresentingForEmail = false
  isWebsite = false
  isConfirm1 = false
  isConfirm2 = false
  EnablerDisabled = false;
  enablerData:any;

  isNewCompany =false
  isCompanyUn =false

  CompanyName: any = ''
  ShortDescription: any = ''
  RegistrationNumber: any = ''
  CompanyNotRegisterd: any=false
  CompanyRegistryRecord: any = ''
  CumulativeRevenue: any = ''

  selectedCompany:any;
  existCompany:any;
  selectedEnabler: any;
  selectedEnablerCurrency: any;
  selectedEnabler2: any;
  selectedEnablerOld: any;
  selectedCountry: any;
  selectedCountryError: any;
  selectedSDGs: any = '';
  selectedGenderLens: any = '';
  ImpactSustainabilityStatement: any = '';
  selectedImpactTheme: any = [];
  selectedEsg: any = [];
  selectedFundingTypeAndFundRaiseType: any;
  selectedIndustriesSectors: any = '';
  selectedFundingStage: any
  selectedFundingProviderType: any = '';
  selectedCountriesOfDomicileNationality: any = [];

  // TotalRaise: any;

  FNMinTotalRaiseAmount:any
  FNMaxTotalRaiseAmount:any  

  FNMinTotalRaiseAmountError:any=''

  // MinTicket: any;

  FNMaximumTicketSizePerFunding:any
  FNMinimumTicketSizePerFunding:any
  FNMinimumTicketSizePerFundingError:any=''
  IsFNMaximumTicketSizePerFundingUn=false
  IsFNMinimumTicketSizePerFundingUn=false



  maximum_raise_amount:any=99999999999
  minimum_raise_amount:any=1

  enabler_minimum_ticket:any=''
  enabler_maximum_ticket:any=''
  ALastName: any = ''
  AFirstName: any = ''
  Email: any = ''
  Website: any = ''

  RepresentingForEmail:any=''
  RepresentingForFirstName:any=''
  RepresentingForLastName:any=''

  
  SourceOrReferral: any = ''
  InternalReferenceNumber: any = ''
  tags: any = []
  selectedTags: any
  InternalNotes: any = ''

  selectedTagsTag: any = []

  isConfirmation1 = false
  isConfirmation2 = false

  totalCountry = 0;
  totalThemesAreas = 0;
  TotalFundingType = 0;
  incorporation_country_list = []

  currency_list = []
  enabler_list = []
  gender_lens_list = []
  CompanyList = []
  funding_stage_list = []
  screening_status_list = []
  industries_sectors_list = []
  funding_provider_type_list = []
  sdg_list = []
  TagList = []

  respObj:any ={};

  ScreeningStatus: any;
  ScreeningStatusTag: any;
  DataStatus = '1';
  IsEnable = true
  IsActive = true
  IsFeatured = false

  from: any = 'home'
  title: any = 'Add Investee'
  titleCopy: any = 'Add Investee'
  raiseStartDate: Date;// = new Date();
  raiseEndDate: Date;// =new Date();
  // raisenStartDate= new Date();
  // raisenEndDate =new Date();
  checkAll: any

  bsValue = new Date();
  minDate: any;
  maxDate: any;

  startMinDate: Date;
  startMaxDate: Date;

  endMinDate: Date;
  endMaxDate: Date;
  
  fileUrl: any;
  fileName: any;
  pdfFile: any;
  LogoURl:any;
  LogoSrc:any = ""
  IsDeletePitch:any = false


  private subLabel: any;
  private subscription: any;
  isView = false;
  isTreePrepare = false
  titl: any = '';
  alertConfirm: any;
  DomicileNationalityCountryListTemp: any = []
  ImpactThemesAreasListTemp: any = []
  EsgListTemp: any = []
  FundingTypeAndFundRaiseTypeList: any = []
  config = {
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500
  }

  InvesteeFile: any;
  InvesteeLogoURl:any;
  InvesteeLogoSrc:any = ""
  IsDeleteLogo:any = false


  isUser =false;
  public PLATFORMID: any;

  // @ViewChild('CompanyName')  companyElement: Input;

  @ViewChild('CompanyNameM') CompanyNameM : ElementRef;
  @ViewChild('CompanyUn') CompanyUn :ElementRef;
  @ViewChild('select') select :ElementRef;


  constructor(@Inject(PLATFORM_ID) platformId: any,private cdRef : ChangeDetectorRef, private cookieService: CookieService, private location: Location,private route: ActivatedRoute, public eventService: EventService, public store: StorageService, public apiService: ApiService, public alertController: AlertController, public router: Router, private zone: NgZone) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.EnablerSlug = this.route.snapshot.paramMap.get('fslug') != undefined ? this.route.snapshot.paramMap.get('fslug') : '';
    this.FN_EnablerSlug = this.route.snapshot.paramMap.get('fnslug') != undefined ? this.route.snapshot.paramMap.get('fnslug') : '';
    this.type = this.route.snapshot.paramMap.get('type') != undefined ? this.route.snapshot.paramMap.get('type') : 'add';
    this.page = this.route.snapshot.paramMap.get('page') != undefined ? this.route.snapshot.paramMap.get('page') :this.page;
    this.from = this.route.snapshot.paramMap.get('from') != undefined ? this.route.snapshot.paramMap.get('from') : this.from;
    this.isUser =(this.PLATFORMID? this.location.path().includes('/user') || (store.appType =='front' && store.isLogin) || (this.FN_EnablerSlug != '' && this.type == 'edit') || ( this.type == 'edit_fn'):false)

    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD MMM YYYY',
      dateFormat: 'DD MMM YYYY',
      format: 'DD MMM YYYY',
      placement:'auto',
      showWeekNumbers: false,
      containerClass: 'theme-default',
      minMode: this.minMode
    });
    this.startMinDate = new Date();
    this.startMaxDate = new Date();
    this.endMinDate = new Date();
    this.endMaxDate = new Date();
    
    this.startMinDate.setMonth(this.startMinDate.getMonth() - 3);
    this.startMaxDate.setMonth(this.startMaxDate.getMonth() + 3);
    
    this.endMinDate.setDate(this.endMinDate.getDate() );
    this.endMaxDate.setMonth(this.endMaxDate.getMonth() + 12);

    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.titl = this.store.getVal('pi2Life_funder') + ' | ' + this.store.getVal('submit_fundraise_need')
      this.setTitle()
    });
    if(this.PLATFORMID){
      const $this = this;
      $(document).on('click', '.actonTg', function () {
        const action = $(this).data('action');
        $this.zone.run(() => {
          // store.showToast(action, 2000)
          if (action == 'yes') {
            $this.ConfirmData();
          } else if (action == 'log_in') {
            $this.store.login();
          } else if (action == 'no') {
            $this.dataAction = []
            $this.loadMsg = ''
          }
        });
      });
      $(document).on("click", "#deletePdf", function () {
        $('#pitchUpload').val('')
      });
      $(document).on("click", "#deleteImg", function () {
        $('#upload').val('')
      });
    }
    this.title = (this.type == 'edit' || this.type == 'my_edit')?this.store.getVal('submit_fundraise_need'):this.title
    this.titleCopy = (this.type == 'edit' || this.type == 'my_edit'|| this.type =='edit_fn')?'Edit Fundraise Need':this.title
  }
  
  toggleChildren(node: any) {
    node.visible = !node.visible;
  }
  changeTreeData(event){
    if(event != undefined){
      if(event.modalName != undefined){
        this[event.modalName]= event.modal
      }
      if(event.modalName =='selectedEsg'){
        this.respObj.selectedEsg = event.modal
      }
    }
  }
  changeIsRegister(event){
    if(this.CompanyNotRegisterd){
      this.CompanyRegistryRecord=''
      this.RegistrationNumber=''
    }
  }
  ConfirmData() {
    let postData = new FormData();
    postData.append("Enablers", this.selectedEnabler);
    postData.append("CompanyName", this.CompanyName);
    postData.append("CompanyRegistryRecord", this.CompanyRegistryRecord != undefined?this.CompanyRegistryRecord:'');
    postData.append("RegistrationNo", this.RegistrationNumber != undefined?this.RegistrationNumber:'');
    postData.append("CompanyNotRegisterd", this.CompanyNotRegisterd?'1':'0');
    postData.append("Country", this.selectedCountry);
    postData.append("Link", window.location.href);
    this.apiService.confirmYes(postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        this.alertConfirm.dismiss()
        this.clearData();
        this.loadMsg = ''
        this.dataAction = []
        this.store.saveData('altMsg', res, true);
        this.store.scrollTo('topRow');
        this.router.navigateByUrl('/message/fundraise');
      } else {
        this.store.scrollTo('topRow');
        this.loadMsg = res.message
        this.dataAction = res.data.Actions
      }
    });
  }
  maxDateCal() {
    if (this.raiseStartDate != undefined) {
      var dNext = new Date(this.raiseStartDate);
      dNext.setMonth(dNext.getMonth() + 12);
      return dNext;
    }
  }
  maxDateStartCal() {
    if (this.raiseEndDate != undefined ) {
      var dNext = new Date(this.raiseEndDate);
      return dNext;
    } else {
      var dNext = new Date();
      dNext.setMonth(dNext.getMonth() + 3);
      return dNext;
    }
  }
  changeMonth(dp, type) {
    if (this.raiseStartDate != undefined ) {
      let StartDate = new Date(this.raiseStartDate);
      let Date1 = new Date(this.raiseStartDate);
      let Date2 = new Date(this.raiseStartDate);
      this.endMinDate = new Date(Date1.setDate(Date1.getDate() + 1));
      this.endMaxDate = new Date(Date2.setMonth(Date2.getMonth() + 12));
      if (this.raiseEndDate != undefined) {
        let EndDate = new Date(this.raiseEndDate);
        if ((this.endMaxDate.valueOf() < EndDate.valueOf()) || (StartDate.valueOf() > EndDate.valueOf())) {
            this.raiseEndDate = undefined;
        }
      }
    }
  }
  ionViewWillEnter() {
    if (this.isView)
      this.store.scrollTo('topRow');
  }
  setUserData() {
    this.store.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.store.isLogin){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      this.store.userData = datas;
      if (datas != undefined && datas.UserData != undefined) {
        if(this.store.appType !='admin' && (this.type=='add' || this.type =='add_fn'|| this.type =='add-with-enabler')){
          this.Email = (this.Email == undefined || this.Email =='')?datas.UserData.Email:this.Email
          this.AFirstName = (this.AFirstName == undefined || this.AFirstName =='')?datas.UserData.FirstName:this.AFirstName
          this.ALastName = (this.ALastName == undefined || this.ALastName =='')?datas.UserData.LastName:this.ALastName
        }
      }else{
        this.AFirstName = ''
        this.ALastName = ''
        this.Email = ''
      }
    } 
  }
  ngOnInit(){
    this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    this.EnablerDisabled = (this.EnablerSlug != undefined && this.EnablerSlug != '') ? true : false;
    if(this.PLATFORMID)
    this.setUserData()
    this.eventService.formRefresh$.subscribe(async (item: any) => {
      if(this.PLATFORMID)
      this.setUserData()
   });
   setTimeout(() => {
    if(this.CompanyNameM != undefined)
    this.CompanyNameM.nativeElement.focus();
  }, 150);
 
  this.getData(this.type);
  if(this.PLATFORMID)
    $('#pitchUpload').val('')
  
  }
  ngAfterViewChecked() {
    if(this.cdRef !=undefined)
    this.cdRef.detectChanges();
  }
  ionViewDidEnter(): void {
    setTimeout(() => {
      if(this.CompanyNameM != undefined)
      this.CompanyNameM.nativeElement.focus();
    }, 150);
  }
  addNewTags = (term) => ({ ReferenceKey: term, ReferenceName: term });
  
  async clikCount(event){
    const alert = await this.alertController.create({
      message: this.store.getVal('unsaved_changes'),
      animated: true,
      cssClass: 'alertCustomCssBtn',
      buttons: [
        {
          text: this.store.getVal('yes'),
          handler: () => {this.store.backPage();}
        },
        {
          text: this.store.getVal('no'),
          role: 'cancel',
          handler: () => {}
        }
      ], backdropDismiss: true
    });
    return await alert.present();
  }
  getData(type) {
    this.subscription = this.apiService.getData('fundraise', (type =='clone'?'my_edit':type =='add-with-enabler'?'add':type), (type=='edit_fn'|| type=='add_fn'|| type =='add-with-enabler'?'FundraiseSlug':type=='add'?'EnablerSlug':'FN_EnablerSlug'), (this.FN_EnablerSlug != undefined && this.FN_EnablerSlug != ''?this.FN_EnablerSlug:''),'EnablerSlug',this.EnablerSlug).subscribe(async response => {
      let res: any = response;
      if (res.success && res.data != undefined) {
        this.storeRes = (this.type =='add-with-enabler' || this.type == 'clone' || this.type =='edit' || type =='edit_fn' || type =='my_edit')?res:undefined;
        this.enablerData =  res.data.enabler_detail;
        if(this.enablerData != undefined)
        this.enablerData.OnCardPermissionData = undefined;

        this.isView = true
        if (res.data.company_list != undefined) {
          this.CompanyList = res.data.company_list
        }

        if (res.data.currency_list != undefined)
        this.currency_list = res.data.currency_list
        if (res.data.gender_lens_list != undefined)
        this.gender_lens_list = res.data.gender_lens_list
        if (res.data.enabler_list != undefined)
        this.enabler_list = res.data.enabler_list;
        if(res.data.country_list != undefined && res.data.country_list.length > 0 ){
          this.incorporation_country_list =res.data.country_list
        }
        if (this.EnablerSlug != undefined && this.EnablerSlug != '' && type != 'edit' && type != 'edit_fn' && type != 'add_fn' && type != 'my_edit' && type !='add-with-enabler' ) {
          let list  = this.enabler_list.filter(item => item.EnablerSlug === this.EnablerSlug)
          this.selectedEnabler=list.length>0? list[0].EnablerID:'';
          if(type !='add' && type != 'clone'){
            this.isTreePrepare = true
            this.EnablerDisabled =true
            this.onChangeEnabler({ EnablerID: this.selectedEnabler })
          }
          if(type == 'clone') {
            this.isFirst = true;
            this.isEnabler = false;
            this.isSecond = false;
            this.setDatas(res, res)
          }
        } else if (type == 'edit' || type == 'my_edit'|| type =='add-with-enabler') {
          this.isFirst = true;
          this.isEnabler = false;
          this.isSecond = false;
          if(type !='add-with-enabler')
          this.selectedEnabler = res.data.detail.EnablerID;
          else
          this.selectedEnabler = res.data.enabler_detail.EnablerID;
          this.onChangeEnabler({ EnablerID: this.selectedEnabler }, res)
        } else if (type == 'edit_fn' ) {
          this.isFirst = true;
          this.isEnabler = false;
          this.isSecond = false;
          this.isFromUser = true
          
          await this.setDatas(res, res)

        }else if (type == 'add_fn' ) {
          this.isFirst = true;
          this.isEnabler = false;
          this.isSecond = false;
          this.isFromUser = true
          await this.setDatas(res, res)
          this.isTreePrepare = true
        }
        else {
          this.isTreePrepare=true
        }
        this.title = (this.type == 'edit' || this.type == 'my_edit')?this.store.getVal('submit_fundraise_need'):this.store.getVal('add_fundraise_need') //this.title
        this.titleCopy = (this.type == 'edit' || this.type == 'my_edit'|| this.type =='edit_fn')?this.store.getVal('edit_fundraise_need'):this.store.getVal('add_fundraise_need') //'Edit Fundraise Need':this.title
        if (res.data.bread_crump_data != undefined && res.data.bread_crump_data.length > 0 && this.type != 'my_edit'&& (this.store.appType =='admin' && type=='edit' && this.page !='list')) {
          var ld = res.data.bread_crump_data;
          this.title = await (this.type == 'edit')?this.store.getVal('submit_fundraise_need'):this.title
          ld.push({
            PageName: this.title, PageSlug: this.EnablerSlug != undefined?this.EnablerSlug:'', PageType: "fundraise-needs",action:"fundraise-needs"
          })
          this.breadCrumpData = {
            list: ld, Page: 'add-fundraise'
          }
        }else if(this.enablerData != undefined){
          var ld = res.data.bread_crump_data;
          ld.push({
            PageName: this.title, PageSlug: this.EnablerSlug != undefined?this.EnablerSlug:'', PageType: "fundraise-needs",extraType:'investees',action:"fundraise-needs"
          })
          this.breadCrumpData = {
            list: ld, Page: 'add-fundraise'
          }
        }
        this.setTitle();

        let detailData={
          ContactName:this.enablerData !=undefined?(this.store.getVal('apply_as_investee_at')+' '+this.enablerData.EnablerName):this.store.getVal('create_investment_raise_on_funder'),
          ShortDescription:this.store.getVal(this.enablerData !=undefined?'submit_investment_raise_requirements_to_get_access_to_curated_pre_matched_investors':'use_your_investment_raise_to_apply_at_one_or_more_suitable_enablers'),
          EnablerLogo:this.enablerData !=undefined? this.enablerData.EnablerLogo:undefined
        }
        this.store.updateMetaData('add-investees',detailData,'details')

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
  checkDate(){
    var date1 = new Date(this.raiseEndDate);
    return !(new Date().setHours(0, 0, 0, 0) <= date1.setHours(0, 0, 0, 0))
  }
  async updateInput(event, checkVar){
    if(event.value != undefined){
      this[''+checkVar] = false;
      let value = event.value
      if(checkVar == 'IsFNMinTotalRaiseAmountUn' || checkVar =='IsFNMaxTotalRaiseAmountUn'){
        this.IsFNMinTotalRaiseAmountUn = false;
        this.IsFNMaxTotalRaiseAmountUn = false;
        this.FNMinTotalRaiseAmountError = '';
        if (value == undefined || value == '') {
          this[''+checkVar] = true;
        }
        else {
          this.checkMinRaise(checkVar, value)
        }
      }else if(checkVar =='isRevenueUsd'){
        if ((value != undefined && value != '')){
          let CumulativeRevenue = 0
          CumulativeRevenue = parseInt(value.replace(/,/g,''));
          if(CumulativeRevenue < this.DefFPMinCumulativeRevenue){
            this.isRevenueUsd=true
          }
        }
      }else if(checkVar == 'IsFNMinimumTicketSizePerFundingUn' || checkVar =='IsFNMaximumTicketSizePerFundingUn'){
        this.IsFNMinimumTicketSizePerFundingUn = false;
        this.IsFNMaximumTicketSizePerFundingUn = false;
        this.FNMinimumTicketSizePerFundingError = '';

        if (value == undefined || value == '') {
          this[''+checkVar] = true;
        }
        else {
          let FNMinimumTicketSizePerFunding=0
          let FNMaximumTicketSizePerFunding=0
          FNMinimumTicketSizePerFunding = (checkVar == 'IsFNMinimumTicketSizePerFundingUn'?value:(this.FNMinimumTicketSizePerFunding !== undefined && this.FNMinimumTicketSizePerFunding !== '')?parseInt(this.FNMinimumTicketSizePerFunding.replace(/,/g, ''), 10):0);
          FNMaximumTicketSizePerFunding = (checkVar == 'IsFNMaximumTicketSizePerFundingUn'?value:(this.FNMaximumTicketSizePerFunding !== undefined && this.FNMaximumTicketSizePerFunding !== '')?parseInt(this.FNMaximumTicketSizePerFunding.replace(/,/g, ''), 10):0);
          if(this.FNMinimumTicketSizePerFunding != undefined && this.FNMinimumTicketSizePerFunding != '')
          FNMinimumTicketSizePerFunding = parseInt(this.FNMinimumTicketSizePerFunding != undefined && this.FNMinimumTicketSizePerFunding !=''? this.FNMinimumTicketSizePerFunding.replace(/,/g,''):0);
        
          if(this.FNMaximumTicketSizePerFunding != undefined && this.FNMaximumTicketSizePerFunding != '')
          FNMaximumTicketSizePerFunding = parseInt(this.FNMaximumTicketSizePerFunding != undefined && this.FNMaximumTicketSizePerFunding !=''? this.FNMaximumTicketSizePerFunding.replace(/,/g,''):0);

          // if(FNMinimumTicketSizePerFunding > 0 && FNMaximumTicketSizePerFunding>0){
            if(FNMinimumTicketSizePerFunding == 0 && FNMaximumTicketSizePerFunding == 0){
              this.IsFNMinimumTicketSizePerFundingUn=true
              this.IsFNMaximumTicketSizePerFundingUn=true
            }else{
              if(FNMinimumTicketSizePerFunding > FNMaximumTicketSizePerFunding && FNMinimumTicketSizePerFunding>0 && FNMaximumTicketSizePerFunding > 0) {
                this.IsFNMinimumTicketSizePerFundingUn=true
                this.IsFNMaximumTicketSizePerFundingUn=true
                this.FNMinimumTicketSizePerFundingError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
              }
              if((FNMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding || FNMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding) &&(FNMinimumTicketSizePerFunding>0 || FNMaximumTicketSizePerFunding > 0)){
                this.IsFNMinimumTicketSizePerFundingUn=(FNMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
                this.IsFNMaximumTicketSizePerFundingUn=(FNMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
                this.FNMinimumTicketSizePerFundingError = ''
              }
              if((FNMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding) &&(FNMinimumTicketSizePerFunding>0 || FNMaximumTicketSizePerFunding > 0)){
                this.IsFNMinimumTicketSizePerFundingUn=(FNMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
                this.IsFNMaximumTicketSizePerFundingUn=(FNMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
                this.FNMinimumTicketSizePerFundingError =''
              }
            }
          // }else if(FNMinimumTicketSizePerFunding > 0){
          //   if((FNMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)){
          //     this.IsFNMinimumTicketSizePerFundingUn=true
          //     this.FNMinimumTicketSizePerFundingError = ''
          //   }else if(FNMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding){
          //     this.IsFNMinimumTicketSizePerFundingUn=true
          //     this.FNMinimumTicketSizePerFundingError = ''
          //   }
          // }else if(FNMaximumTicketSizePerFunding > 0){
          //   if(FNMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding){
          //     this.IsFNMaximumTicketSizePerFundingUn=true
          //     this.FNMinimumTicketSizePerFundingError = ''
          //   }else if(FNMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding){
          //     this.IsFNMaximumTicketSizePerFundingUn=true
          //     this.FNMinimumTicketSizePerFundingError = ''
          //   }
          // }else if(FNMinimumTicketSizePerFunding == 0 && FNMaximumTicketSizePerFunding == 0){
          //   this.IsFNMinimumTicketSizePerFundingUn=true
          //   this.IsFNMaximumTicketSizePerFundingUn=true
          // }
        }
      }
    }

  }
  checkMinRaise(checkVar:any,value: any) {
    let FNMinTotalRaiseAmount=0
    let FNMaxTotalRaiseAmount=0
    FNMinTotalRaiseAmount = (checkVar == 'IsFNMinTotalRaiseAmountUn'?value:(this.FNMinTotalRaiseAmount !== undefined && this.FNMinTotalRaiseAmount !== '')?parseInt(this.FNMinTotalRaiseAmount.replace(/,/g, ''), 10):0);

    FNMaxTotalRaiseAmount = (checkVar == 'IsFNMaxTotalRaiseAmountUn'?value:(this.FNMaxTotalRaiseAmount !== undefined && this.FNMaxTotalRaiseAmount !== '')?parseInt(this.FNMaxTotalRaiseAmount.replace(/,/g, ''), 10):0);
  
    if ((this.FNMinTotalRaiseAmount != undefined && this.FNMinTotalRaiseAmount != ''))
    FNMinTotalRaiseAmount = parseInt(this.FNMinTotalRaiseAmount != undefined && this.FNMinTotalRaiseAmount !=''? this.FNMinTotalRaiseAmount.replace(/,/g,''):0);
  
    if((this.FNMaxTotalRaiseAmount != undefined && this.FNMaxTotalRaiseAmount != ''))
    FNMaxTotalRaiseAmount = parseInt(this.FNMaxTotalRaiseAmount != undefined && this.FNMaxTotalRaiseAmount !=''? this.FNMaxTotalRaiseAmount.replace(/,/g,''):0);                
  
    // if(FNMinTotalRaiseAmount > 0 && FNMaxTotalRaiseAmount>0){
      if(FNMinTotalRaiseAmount == 0 && FNMaxTotalRaiseAmount == 0){
        this.IsFNMinTotalRaiseAmountUn=true
        this.IsFNMaxTotalRaiseAmountUn=true
      }else{
        if(FNMinTotalRaiseAmount > FNMaxTotalRaiseAmount && FNMinTotalRaiseAmount>0 && FNMaxTotalRaiseAmount > 0){
          this.IsFNMinTotalRaiseAmountUn=true
          this.IsFNMaxTotalRaiseAmountUn=true
          this.FNMinTotalRaiseAmountError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
        }
        if((FNMinTotalRaiseAmount < this.minimum_raise_amount || FNMaxTotalRaiseAmount < this.minimum_raise_amount) && (FNMinTotalRaiseAmount>0 || FNMaxTotalRaiseAmount > 0)){
          this.IsFNMinTotalRaiseAmountUn=(FNMinTotalRaiseAmount > this.maximum_raise_amount || FNMinTotalRaiseAmount < this.minimum_raise_amount)
          this.IsFNMaxTotalRaiseAmountUn=(FNMaxTotalRaiseAmount > this.maximum_raise_amount || FNMaxTotalRaiseAmount < this.minimum_raise_amount)
          this.FNMinTotalRaiseAmountError = ''
        }
        if((FNMinTotalRaiseAmount > this.maximum_raise_amount || FNMaxTotalRaiseAmount > this.maximum_raise_amount) &&(FNMinTotalRaiseAmount>0 || FNMaxTotalRaiseAmount > 0)){
          this.IsFNMinTotalRaiseAmountUn=(FNMinTotalRaiseAmount > this.maximum_raise_amount || FNMinTotalRaiseAmount < this.minimum_raise_amount)
          this.IsFNMaxTotalRaiseAmountUn=(FNMaxTotalRaiseAmount > this.maximum_raise_amount || FNMaxTotalRaiseAmount < this.minimum_raise_amount)
          this.FNMinTotalRaiseAmountError =''
        }
      }
    // }else if(FNMinTotalRaiseAmount > 0){
    //   if((FNMinTotalRaiseAmount < this.minimum_raise_amount)){
    //     this.IsFNMinTotalRaiseAmountUn=true
    //     this.FNMinTotalRaiseAmountError = ''
    //   }else if(FNMinTotalRaiseAmount > this.maximum_raise_amount){
    //     this.IsFNMinTotalRaiseAmountUn=true
    //     this.FNMinTotalRaiseAmountError = ''
    //   }
    // }else if(FNMaxTotalRaiseAmount > 0){
    //   if(FNMaxTotalRaiseAmount < this.minimum_raise_amount){
    //     this.IsFNMaxTotalRaiseAmountUn=true
    //     this.FNMinTotalRaiseAmount = ''
    //   }else if(FNMaxTotalRaiseAmount > this.maximum_raise_amount){
    //     this.IsFNMaxTotalRaiseAmountUn=true
    //     this.FNMinTotalRaiseAmount = ''
    //   }
    // }
    // else if(FNMinTotalRaiseAmount == 0 && FNMaxTotalRaiseAmount == 0){
    //   this.IsFNMinTotalRaiseAmountUn=true
    //   this.IsFNMaxTotalRaiseAmountUn=true
    // }
  }
  async callAction(event, type, isFirst?) {
    this.resetVar()
    let isCall = false
    if (isFirst && event == 1) {
      if((!this.store.isLogin  || this.isNewCompany)&& (this.CompanyName == undefined || this.CompanyName == '')) {
        this.isCompanyName = true;
        if (!isCall)
        this.store.scrollTo('topRow');
        isCall = true
      }
      if((this.store.isLogin && !this.isNewCompany) && (this.existCompany == undefined)) {
        this.isCompanyUn = true;
        if (!isCall)
        this.store.scrollTo('topRow');
        isCall = true
      }
      // if(this.RegistrationNumber == undefined || this.RegistrationNumber == '') {
      //   this.isRNumber = true;
      //   if (!isCall)
      //   this.store.scrollTo('RegistrationNumber');
      //   isCall = true
      // }
      if (this.CompanyRegistryRecord != undefined && (this.CompanyRegistryRecord.trim() != '' && this.store.checkWeb(this.CompanyRegistryRecord))) {
        this.isCopmanyRegistryRecord = true;
        if (!isCall)
        this.store.scrollTo('CompanyRegistryRecord');
        isCall = true
      }
      if(this.selectedCountry == undefined || this.selectedCountry == '') {
        this.isCountry = true;
        if(!isCall)
        this.store.scrollTo('topRow');
        isCall = true
      }
      if (this.Email == undefined || this.store.checkMail(this.Email,true)) {
        this.isEmail = true;
        if (!isCall)
        this.store.scrollTo('Email');
        isCall = true
      }
      if (isCall) {
        this.loadMsg = (this.selectedCountryError !=undefined?this.selectedCountryError:this.store.getVal('please_complete_required_field'));//this.store.getVal('please_complete_required_field');
        this.dataAction = []
      } else {
        let postData = new FormData();
        if(this.type != 'clone')
        postData.append(this.type=='edit_fn'|| this.type=='add_fn' || this.type =='add-with-enabler'?'FundraiseSlug':this.type=='add'?'EnablerSlug':'FN_EnablerSlug', (this.FN_EnablerSlug != undefined && this.FN_EnablerSlug != ''?this.FN_EnablerSlug:''));
        if(this.selectedEnabler !=undefined)
        postData.append("Enablers", this.selectedEnabler);
        if (this.existCompany == undefined){
          postData.append("CompanyID", "");
        } else {
          postData.append("CompanyID", this.existCompany);
        }
        postData.append("CompanyName", this.CompanyName);
        postData.append("CompanyRegistryRecord", this.CompanyRegistryRecord != undefined?this.CompanyRegistryRecord:'');
        postData.append("CountriesOfIncorporation", this.selectedCountry != undefined ?this.selectedCountry:'');
        postData.append("RegistrationNo", this.RegistrationNumber != undefined?this.RegistrationNumber:'');
        postData.append("CompanyNotRegisterd", this.CompanyNotRegisterd?'1':'0');
        postData.append("Email", this.Email!=undefined? this.Email.trim():'');
        this.apiService.validateFundraise(postData,(this.type=='edit' || this.type=='my_edit' || this.type=='add' || this.type=='clone'|| this.type=='add-with-enabler')?'validate':'validate_fn').subscribe(response => {
          let res: any = response;
          if (res.success) {
            this.isFirst = false;
            if (res.data.enabler_list != undefined)
            this.enabler_list = res.data.enabler_list;
            this.selectedCompany = res.data.CompanyID != undefined?parseInt(res.data.CompanyID):undefined;
            this.existCompany  =  res.data.CompanyID != undefined?parseInt(res.data.CompanyID):undefined;
            let check = this.CompanyList.findIndex(c => c.CompanyID == this.existCompany)
            if(check == -1 ){
              this.selectedCompany = undefined
            }else{
              this.isNewCompany=false
            }
            if(!this.isFromUser && this.type !='clone' && this.EnablerSlug =='')
            this.isEnabler = true;
            else
            this.isSecond = true;
            setTimeout(() => {
              if(this.isSecond)
              this.store.scrollTo('secondStp');
            }, 100);
            if(this.type =='clone' || this.EnablerSlug !=''){  
                this.isTreePrepare = false
                this.updateEnablerDataOnChange({EnablerID:this.selectedEnabler},this.storeRes)
              }else {
                this.setDetailsData(res);
              }
            } else {
              if (res.data.AskConfirmation != undefined && res.data.AskConfirmation != undefined){
                this.callConfirmPopup(res.message);
              } else {
                this.store.scrollTo('topRow');
                this.loadMsg = res.message
                this.dataAction = res.data.Actions != undefined ? res.data.Actions : []
              }
            }
          });
        }
      } else if (event == 1 && type ==3) {
        if (!this.isFromUser && this.EnablerSlug =='' && this.type !='clone' && (this.selectedEnabler == undefined || this.selectedEnabler == '')) {
          this.isProvider = true;
          this.store.scrollTo('enabler_list');
          isCall = true
        }
        else{
          let postData = new FormData();
            if(this.FN_EnablerSlug != undefined)
            postData.append("FN_EnablerSlug", this.FN_EnablerSlug);
          if(this.selectedEnabler !=undefined)
          postData.append("Enablers", this.selectedEnabler);
         if (this.existCompany == undefined){
          postData.append("CompanyID", "");
        } else {
          postData.append("CompanyID", this.existCompany);
        }
          postData.append("CompanyName", this.CompanyName);
          postData.append("CompanyRegistryRecord", this.CompanyRegistryRecord != undefined?this.CompanyRegistryRecord:'');
          postData.append("CountriesOfIncorporation", this.selectedCountry != undefined ? this.selectedCountry : '');
          postData.append("RegistrationNo", this.RegistrationNumber != undefined?this.RegistrationNumber:'');
          postData.append("CompanyNotRegisterd", this.CompanyNotRegisterd?'1':'0');
           postData.append("Email", this.Email!=undefined? this.Email.trim():'');
          this.apiService.validateFundraise(postData,(this.type=='edit' || this.type=='my_edit' || this.type=='add' || this.type=='clone'|| this.type=='add-with-enabler')?'validate':'validate_fn').subscribe(response => {
            let res: any = response;
            if (res.success) {
              this.loadMsg = ''
              this.dataAction = []
              this.updateEnablerDataOnChange({EnablerID:this.selectedEnabler},undefined)
            } else {
              this.store.scrollTo('topRow');
              this.loadMsg = res.message
              this.dataAction = res.data.Actions != undefined ? res.data.Actions : []
            }
          });
        }
      } else if (event == 1) {
        if (this.selectedEnablerCurrency == undefined || this.selectedEnablerCurrency == '') {
          this.IsEnablerCurrency = true;
          if (!isCall)
          this.store.scrollTo('EnablerCurrency');
          isCall = true
        }
        if (this.CompanyName == undefined || this.CompanyName == '') {
          this.isCompanyName = true;
          if (!isCall)
          this.store.scrollTo('CompanyName');
          isCall = true
        }
        if (this.ShortDescription == undefined || this.ShortDescription == '') {
          this.isShortDescription = true;
          if (!isCall)
          this.store.scrollTo('ShortDescription');
          isCall = true
        }
        // if (this.RegistrationNumber == undefined || this.RegistrationNumber == '') {
        //   this.isRNumber = true;
        //   if (!isCall)
        //   this.store.scrollTo('RegistrationNumber');
        //   isCall = true
        // }
        if (this.CompanyRegistryRecord != undefined && (this.CompanyRegistryRecord.trim() != '' && this.store.checkWeb(this.CompanyRegistryRecord))) {
          this.isCopmanyRegistryRecord = true;
          if (!isCall)
          this.store.scrollTo('CompanyRegistryRecord');
          isCall = true
        }
        if (this.selectedCountry == undefined || this.selectedCountry == '') {
          this.isCountry = true;
          if (!isCall)
          this.store.scrollTo('Country');
          isCall = true
        }
        if (this.selectedImpactTheme == undefined || this.selectedImpactTheme.length == 0) {
          this.IsImpactTheme = true;
          if (!isCall)
          this.store.scrollTo('impact_themes_areas_list');
          isCall = true
        }
        if((this.selectedSDGs == undefined || this.selectedSDGs.length == 0) && (this.selectedEsg == undefined || this.selectedEsg.length == 0)){
          this.isSDG = true;
          this.IsEsg = true;
              if (!isCall)
              this.store.scrollTo('sdg_list');
            isCall = true
        }

        if (this.ImpactSustainabilityStatement == undefined || this.ImpactSustainabilityStatement == '') {
          this.isImpactStatement = true;
          if (!isCall)
          this.store.scrollTo('ImpactSustainabilityStatement');
          isCall = true
        }
        if (this.selectedFundingTypeAndFundRaiseType == undefined || this.selectedFundingTypeAndFundRaiseType == '') {
          this.IsFundingTypeAndFundRaiseType = true;
          if (!isCall)
          this.store.scrollTo('FundingType');
          isCall = true
        }
          let FNMinTotalRaiseAmount=0
          let FNMaxTotalRaiseAmount=0
          if ((this.FNMinTotalRaiseAmount != undefined && this.FNMinTotalRaiseAmount != ''))
          FNMinTotalRaiseAmount = parseInt(this.FNMinTotalRaiseAmount != undefined && this.FNMinTotalRaiseAmount !=''? this.FNMinTotalRaiseAmount.replace(/,/g,''):0);
          if((this.FNMaxTotalRaiseAmount != undefined && this.FNMaxTotalRaiseAmount != ''))
            FNMaxTotalRaiseAmount = parseInt(this.FNMaxTotalRaiseAmount != undefined && this.FNMaxTotalRaiseAmount !=''? this.FNMaxTotalRaiseAmount.replace(/,/g,''):0);
          
          // if(FNMinTotalRaiseAmount > 0 && FNMaxTotalRaiseAmount>0){
            if(FNMinTotalRaiseAmount == 0 && FNMaxTotalRaiseAmount == 0){
              this.store.scrollTo('FNMinTotalRaiseAmount');
              isCall = true
              this.IsFNMinTotalRaiseAmountUn=true
              this.IsFNMaxTotalRaiseAmountUn=true
            }else{
              if(FNMinTotalRaiseAmount > FNMaxTotalRaiseAmount && FNMinTotalRaiseAmount>0 && FNMaxTotalRaiseAmount > 0) {
                this.IsFNMinTotalRaiseAmountUn=true
                this.IsFNMaxTotalRaiseAmountUn=true
                this.FNMinTotalRaiseAmountError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
                  if(!isCall)
                  this.store.scrollTo('FNMinTotalRaiseAmount');
                  isCall = true
              }
              if((FNMinTotalRaiseAmount < this.minimum_raise_amount || FNMaxTotalRaiseAmount < this.minimum_raise_amount) &&(FNMinTotalRaiseAmount>0 || FNMaxTotalRaiseAmount > 0) ){
                  this.IsFNMinTotalRaiseAmountUn=(FNMinTotalRaiseAmount > this.maximum_raise_amount || FNMinTotalRaiseAmount < this.minimum_raise_amount)
                  this.IsFNMaxTotalRaiseAmountUn=(FNMaxTotalRaiseAmount > this.maximum_raise_amount || FNMaxTotalRaiseAmount < this.minimum_raise_amount)
                  this.FNMinTotalRaiseAmountError = ''
                  if(!isCall)
                  this.store.scrollTo('FNMinTotalRaiseAmount');
                  isCall = true
              }
              if((FNMinTotalRaiseAmount > this.maximum_raise_amount || FNMaxTotalRaiseAmount > this.maximum_raise_amount) &&(FNMinTotalRaiseAmount>0 || FNMaxTotalRaiseAmount > 0) ){
                  this.IsFNMinTotalRaiseAmountUn=(FNMinTotalRaiseAmount > this.maximum_raise_amount || FNMinTotalRaiseAmount < this.minimum_raise_amount)
                  this.IsFNMaxTotalRaiseAmountUn=(FNMaxTotalRaiseAmount > this.maximum_raise_amount || FNMaxTotalRaiseAmount < this.minimum_raise_amount)
                  this.FNMinTotalRaiseAmountError =''
                  if(!isCall)
                  this.store.scrollTo('FNMinTotalRaiseAmount');
                  isCall = true
              }
            }
          // }else if(FNMinTotalRaiseAmount > 0){
          //   if((FNMinTotalRaiseAmount < this.minimum_raise_amount)){
          //     this.IsFNMinTotalRaiseAmountUn=true
          //     isCall = true
          //     this.store.scrollTo('FNMinTotalRaiseAmount');
          //     this.FNMinTotalRaiseAmountError = ''
          //   }else if(FNMinTotalRaiseAmount > this.maximum_raise_amount){
          //     this.IsFNMinTotalRaiseAmountUn=true
          //     isCall = true
          //     this.store.scrollTo('FNMinTotalRaiseAmount');
          //     this.FNMinTotalRaiseAmountError = ''
          //   }
          // }else if(FNMaxTotalRaiseAmount > 0){
          //   if(FNMaxTotalRaiseAmount < this.minimum_raise_amount){
          //     this.IsFNMaxTotalRaiseAmountUn=true
          //     isCall = true
          //     this.store.scrollTo('FNMaxTotalRaiseAmount');
          //     this.FNMinTotalRaiseAmount = ''
          //   }else if(FNMaxTotalRaiseAmount > this.maximum_raise_amount){
          //     this.IsFNMaxTotalRaiseAmountUn=true
          //     isCall = true
          //     this.store.scrollTo('FNMaxTotalRaiseAmount');
          //     this.FNMinTotalRaiseAmount = ''
          //   }
          // }
          // else if(FNMinTotalRaiseAmount == 0 && FNMaxTotalRaiseAmount == 0){
          //   if(!isCall)
          //   this.store.scrollTo('FNMinTotalRaiseAmount');
          //   isCall = true
          //   this.IsFNMinTotalRaiseAmountUn=true
          //   this.IsFNMaxTotalRaiseAmountUn=true
          // }
        
        if ((this.CumulativeRevenue != undefined && this.CumulativeRevenue != '')){
          let CumulativeRevenue=0
          CumulativeRevenue = parseInt(this.CumulativeRevenue != undefined && this.CumulativeRevenue !=''? this.CumulativeRevenue.replace(/,/g,''):0);
          if((CumulativeRevenue < this.DefFPMinCumulativeRevenue )){
            this.isRevenueUsd=true
            if(!isCall)
            this.store.scrollTo('CumulativeRevenue');
            isCall = true
          }
        }
        if (this.raiseStartDate == undefined) {
          this.isRaiseStartDate = true
          if (!isCall)
          this.store.scrollTo('raiseStartDate');
          isCall = true
        }
        if (this.raiseEndDate == undefined) {
          this.isRaiseEndDate = true
          if (!isCall)
          this.store.scrollTo('raiseEndDate');
          isCall = true
        }
        if (this.checkDate()) {
          this.isRaiseEndDate = true
          if (!isCall)
          this.store.scrollTo('raiseEndDate');
          isCall = true
        }
        if (this.selectedFundingProviderType == undefined || this.selectedFundingProviderType == '') {
          this.isInvestorType = true;
          if (!isCall)
          this.store.scrollTo('FundingProviderType');
          isCall = true
        }

        let FNMinimumTicketSizePerFunding=0
        let FNMaximumTicketSizePerFunding=0

        if ((this.FNMinimumTicketSizePerFunding != undefined && this.FNMinimumTicketSizePerFunding != ''))
        FNMinimumTicketSizePerFunding = parseInt(this.FNMinimumTicketSizePerFunding != undefined && this.FNMinimumTicketSizePerFunding !=''? this.FNMinimumTicketSizePerFunding.replace(/,/g,''):0);
        if((this.FNMaximumTicketSizePerFunding != undefined && this.FNMaximumTicketSizePerFunding != ''))
        FNMaximumTicketSizePerFunding = parseInt(this.FNMaximumTicketSizePerFunding != undefined && this.FNMaximumTicketSizePerFunding !=''? this.FNMaximumTicketSizePerFunding.replace(/,/g,''):0);

          // if(FNMinimumTicketSizePerFunding > 0 && FNMaximumTicketSizePerFunding>0){
            if(FNMinimumTicketSizePerFunding == 0 && FNMaximumTicketSizePerFunding == 0){      
              if(!isCall)
              this.store.scrollTo('FNMaximumTicketSizePerFunding');
              isCall = true
              this.IsFNMinimumTicketSizePerFundingUn=true
              this.IsFNMaximumTicketSizePerFundingUn=true
            }else{
              if(FNMinimumTicketSizePerFunding > FNMaximumTicketSizePerFunding && FNMinimumTicketSizePerFunding > 0 && FNMaximumTicketSizePerFunding > 0) {
                this.IsFNMinimumTicketSizePerFundingUn=true
                this.IsFNMaximumTicketSizePerFundingUn=true
                isCall = true
                this.store.scrollTo('FNMinimumTicketSizePerFunding');
                this.FNMinimumTicketSizePerFundingError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
              }
              if((FNMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding || FNMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding) &&(FNMinimumTicketSizePerFunding>0 || FNMaximumTicketSizePerFunding > 0) ){
                this.IsFNMinimumTicketSizePerFundingUn=(FNMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
                this.IsFNMaximumTicketSizePerFundingUn=(FNMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
                isCall = true
                this.store.scrollTo('FNMinimumTicketSizePerFunding');
                this.FNMinimumTicketSizePerFundingError = ''
              }
              if((FNMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding) &&(FNMinimumTicketSizePerFunding>0 || FNMaximumTicketSizePerFunding > 0) ){
                this.IsFNMinimumTicketSizePerFundingUn=(FNMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
                this.IsFNMaximumTicketSizePerFundingUn=(FNMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding || FNMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)
                isCall = true
                this.store.scrollTo('FNMinimumTicketSizePerFunding');
                this.FNMinimumTicketSizePerFundingError =''
              }
            }
          // }else if(FNMinimumTicketSizePerFunding > 0){
          //   if((FNMinimumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding)){
          //     this.IsFNMinimumTicketSizePerFundingUn=true
          //     isCall = true
          //     this.store.scrollTo('FNMinimumTicketSizePerFunding');
          //     this.FNMinimumTicketSizePerFundingError = ''
          //   }else if(FNMinimumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding){
          //     this.IsFNMinimumTicketSizePerFundingUn=true
          //     isCall = true
          //     this.store.scrollTo('FNMinimumTicketSizePerFunding');
          //     this.FNMinimumTicketSizePerFundingError = ''
          //   }
          // }else if(FNMaximumTicketSizePerFunding > 0){
          //   if(FNMaximumTicketSizePerFunding < this.DefFPMinimumTicketSizePerFunding){
          //     this.IsFNMaximumTicketSizePerFundingUn=true
          //     isCall = true
          //     this.store.scrollTo('FNMaximumTicketSizePerFunding');
          //     this.FNMinimumTicketSizePerFundingError = ''
          //   }else if(FNMaximumTicketSizePerFunding > this.DefFPMaximumTicketSizePerFunding){
          //     this.IsFNMaximumTicketSizePerFundingUn=true
          //     isCall = true
          //     this.store.scrollTo('FNMaximumTicketSizePerFunding');
          //     this.FNMinimumTicketSizePerFundingError = ''
          //   }
          // }else if(FNMinimumTicketSizePerFunding == 0 && FNMaximumTicketSizePerFunding == 0){      
          //   if(!isCall)
          //   this.store.scrollTo('FNMaximumTicketSizePerFunding');
          //   isCall = true
          //   this.IsFNMinimumTicketSizePerFundingUn=true
          //   this.IsFNMaximumTicketSizePerFundingUn=true
          // }
    
      if (this.AFirstName == undefined || this.AFirstName == '') {
        this.isFname = true;
        if (!isCall)
        this.store.scrollTo('FirstName');
        isCall = true
      }
      if (this.Website == undefined || (this.Website.trim() != '' && this.store.checkWeb(this.Website))) {
        this.isWebsite = true
        if (!isCall)
        this.store.scrollTo('Website');
        isCall = true
      }
      if (this.RepresentingForEmail != undefined && this.RepresentingForEmail  !='' && this.store.checkMail(this.RepresentingForEmail,true)) {
        this.isRepresentingForEmail = true;
        if (!isCall)
        this.store.scrollTo('RepresentingForEmail');
        isCall = true
      }
      // if (this.isSizeExclude) {
      //   if (!isCall)
      //   this.store.scrollTo('docFile');
      //   // isCall = true
      // }
      if (!this.isConfirmation1) {
        this.isConfirm1 = true;
        isCall = true
      }
      let loadM = this.store.getVal('please_complete_required_field');
      if (isCall) {
        this.loadMsg = loadM;
        this.dataAction = []

      } else {
        let postData = new FormData();
        if(this.EnablerSlug != undefined)
        postData.append("EnablerSlug", this.EnablerSlug);
        
        if(this.type == 'edit' || this.type == 'my_edit'){
          if(this.FN_EnablerSlug != undefined)
          postData.append("FN_EnablerSlug", this.FN_EnablerSlug);
        }
        if (this.type == 'edit_fn' || this.type =='add-with-enabler')
          postData.append("FundraiseSlug", this.FN_EnablerSlug);

        if (this.type == 'clone')
          postData.append("ReferenceSlug", this.FN_EnablerSlug);

        if (this.selectedEnabler != undefined && !this.isSkip) {
          postData.append("Enablers", this.selectedEnabler);
        }
        postData.append("CurrencyID", (this.selectedEnablerCurrency == undefined)?'':this.selectedEnablerCurrency);

        if (this.existCompany == undefined){
          postData.append("CompanyID", "");
        } else {
          postData.append("CompanyID", this.existCompany);
        }
        postData.append("CompanyName", this.CompanyName);
        postData.append("CountriesOfIncorporation", this.selectedCountry != undefined ? this.selectedCountry : '');
        postData.append("RegistrationNo", this.RegistrationNumber != undefined?this.RegistrationNumber:'');
        postData.append("CompanyNotRegisterd", this.CompanyNotRegisterd?'1':'0');
        postData.append("CompanyRegistryRecord", this.CompanyRegistryRecord != undefined?this.CompanyRegistryRecord:'');
        postData.append("ShortDescription", this.ShortDescription);
        postData.append("IndustriesSectors", this.selectedIndustriesSectors);
        if (this.CumulativeRevenue != undefined && this.CumulativeRevenue != '') {
          postData.append("CumulativeRevenue", this.CumulativeRevenue.replace(/,/g, ""));
        }
        postData.append("ImpactThemesAndAreas", ((this.selectedImpactTheme != undefined && this.selectedImpactTheme.length > 0) ? this.selectedImpactTheme.toString() : ''));
        postData.append("SDGs", this.selectedSDGs);
        postData.append("ESG", ((this.selectedEsg != undefined && this.selectedEsg.length > 0) ? this.selectedEsg.toString() : ''));
        postData.append("GenderLens",((this.selectedGenderLens != undefined && this.selectedGenderLens.length > 0) ? this.selectedGenderLens.toString() : ''));
        postData.append("ImpactSustainabilityStatement", this.ImpactSustainabilityStatement);
        postData.append("FundingType", this.selectedFundingTypeAndFundRaiseType);
        postData.append("FundingStage", this.selectedFundingStage !=undefined?this.selectedFundingStage:'');
        if(this.FNMinTotalRaiseAmount != undefined)
        postData.append("MinimumTotalRaise", this.FNMinTotalRaiseAmount.replace(/,/g, ""));
        if(this.FNMaxTotalRaiseAmount != undefined)
        postData.append("MaximumTotalRaise", this.FNMaxTotalRaiseAmount.replace(/,/g, ""));
        postData.append("RaiseStartDate", moment(this.raiseStartDate).format('YYYY-MM-DD'));
        postData.append("RaiseEndDate", moment(this.raiseEndDate).format('YYYY-MM-DD'));
        postData.append("FundingProviderType", this.selectedFundingProviderType);
       
        if(this.FNMinimumTicketSizePerFunding != undefined)
        postData.append("MinTicketSizePerInvestor", this.FNMinimumTicketSizePerFunding.replace(/,/g, ""));
        if(this.FNMaximumTicketSizePerFunding != undefined)
        postData.append("MaxTicketSizePerInvestor", this.FNMaximumTicketSizePerFunding.replace(/,/g, ""));
        
        postData.append("CountriesOfDomicileNationality", ((this.selectedCountriesOfDomicileNationality != undefined && this.selectedCountriesOfDomicileNationality.length > 0) ? this.selectedCountriesOfDomicileNationality.toString() : ''));
        postData.append("FirstName", this.AFirstName);
        postData.append("LastName", (this.ALastName != undefined && this.ALastName != ''?this.ALastName.trim():''));
        postData.append("Email", this.Email!=undefined? this.Email.trim():'');
        postData.append("Website", this.Website);
        
        postData.append("RepresentingForEmail", this.RepresentingForEmail !=undefined? this.RepresentingForEmail.trim():'');
        postData.append("RepresentingForFirstName", this.RepresentingForFirstName);
        postData.append("RepresentingForLastName", this.RepresentingForLastName);    
        postData.append("SubmitType", this.type);

        postData.append("SourceOrReferral", (this.SourceOrReferral != undefined && this.SourceOrReferral != '' ? this.SourceOrReferral.trim() : ''));
        postData.append("InternalReferenceNumber", (this.InternalReferenceNumber != undefined && this.InternalReferenceNumber != '' ? this.InternalReferenceNumber.trim() : ''));
        if(this.selectedTagsTag !=undefined)
        postData.append("Tags", this.selectedTagsTag != undefined? JSON.stringify(this.selectedTagsTag) : '');
        postData.append("InternalNotes",this.InternalNotes);
        if(!this.isUser){
        postData.append("IsActive", this.IsActive ? '1' : '0');
        postData.append("IsFeatured", this.IsFeatured ? '1' : '0');
        postData.append("IsEnable", this.IsEnable ? '1' : '0');
        postData.append("DataStatus", this.DataStatus != undefined ? this.DataStatus : '');
        }
        postData.append("ScreeningStatus", this.ScreeningStatus != undefined ? this.ScreeningStatus : '');
        let scsN
        for (let l = 0; l < this.screening_status_list.length; l++) {
          const element = this.screening_status_list[l];
          if(element.isNew && element.ReferenceKey == this.ScreeningStatus){
            scsN= element.ReferenceName
            break
          }
        }
        postData.append("ScreeningStatusAdd", scsN != undefined ?  scsN : '');
 
        postData.append("ConfirmAuthorised", this.isConfirmation1 ? '1' : '0');
        if(this.pdfFile !=undefined)
        postData.append("Pitch", this.pdfFile, this.pdfFile.name);
        // if(this.IsDeletePitch)
        postData.append("IsDeletePitch", this.IsDeletePitch ? '1' : '0');

        if (this.InvesteeFile != undefined) {
          postData.append('Logo', this.InvesteeFile, this.InvesteeFile.name);
        }
        postData.append("IsDeleteLogo", this.IsDeleteLogo ? '1' : '0');
    

        postData.append("Link", window.location.href);
        this.apiService.addData('fundraise', postData, (this.type == 'clone'||this.type =='add-with-enabler')?'add':this.type).subscribe(async response => {
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
            this.isSizeExclude = false
            this.loadMsg = ''
            res.pageUrl = (this.EnablerSlug != undefined && this.EnablerSlug != '' && this.store.appType == 'front') ? '/enabler/' + this.EnablerSlug + '#overview' : '';
            if( this.type =='add-with-enabler'){
              this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)});
              this.store.backPage();
              this.store.showToast(message,5000)
            }else{
              if(this.isSkip){
                if(this.store.isLogin){
                  this.router.navigateByUrl('user/fundraise-need/'+res.data.FundraiseSlug+'#matching-enablers',{replaceUrl:true});
                }else{
                  this.router.navigateByUrl('user/enabler/fundraise-need/'+res.data.FundraiseSlug,{replaceUrl:true});
                }
              }else if(this.type == 'add_fn'){
                this.router.navigateByUrl('/user#my-fundraise-needs',{replaceUrl:true});
              }
              else {
                if(!this.store.isLogin){
                  this.store.saveData('altMsg', res, true);
                  this.store.scrollTo('topRow');
                  this.router.navigateByUrl('/message/fundraise');
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
              if(res.data.CallPaymentGateway != undefined && res.data.CallPaymentGateway){
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
        this.isFirst = true
        this.isEnabler = false
        this.existCompany = (this.selectedCompany != undefined?JSON.parse(JSON.stringify({CompanyID:this.selectedCompany})).CompanyID:undefined )  
        if((this.EnablerSlug == undefined || this.EnablerSlug == '')){
          this.selectedEnabler=undefined
        }
      }else if (type == 2 && event == 2) {
        this.isSkip=false
        this.isSecond = false
        this.existCompany = (this.selectedCompany != undefined?JSON.parse(JSON.stringify({CompanyID:this.selectedCompany})).CompanyID:undefined )
        if(this.type != 'add_fn' && this.type != 'edit_fn')
        this.clearDataSecData()
        if(!this.isFromUser && this.type !='clone'&& this.EnablerSlug ==''){
          this.isEnabler = true
        }else{
          this.isFirst = true
          if((this.EnablerSlug == undefined || this.EnablerSlug == '')){
            this.selectedEnabler=undefined
          }
        }
      }else if (event == 0 && type == 3 && this.store.appType !='admin') {
        this.isSkip=true
        this.selectedEnabler=undefined
        this.updateEnablerDataOnChange({EnablerID:''},undefined)
      } else {
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
    selectDataStatus(event) {
      this.DataStatus = event
    }
     setDetailsData(res: any) {
      if (res.data != undefined && res.data.detail != undefined) {
        let detail = res.data.detail
        this.selectedEnablerCurrency = detail.CurrencyID != undefined && this.type != 'add-with-enabler'? parseInt(detail.CurrencyID):this.selectedEnablerCurrency
        this.emailRestrict = (res.data.email_restrict == 1)
        this.ReferenceCode = detail.ReferenceCode
        this.selectedEnabler = detail.EnablerID != undefined ? detail.EnablerID : this.selectedEnabler
       
        this.selectedCompany = (this.selectedCompany == null? detail.CompanyID != undefined ? detail.CompanyID : this.selectedCompany: this.selectedCompany)
        this.existCompany = (this.selectedCompany != undefined) ? JSON.parse(JSON.stringify({CompanyID:this.selectedCompany})).CompanyID:undefined
        let check = this.CompanyList.findIndex(c => c.CompanyID == this.selectedCompany)
        if(check== -1 ){
          this.selectedCompany = undefined
          this.existCompany = undefined
        }else{
          this.CompanyNotRegisterd = detail.CompanyNotRegisterd != undefined?detail.CompanyNotRegisterd:false
          this.CompanyName = this.CompanyName ==''? detail.CompanyName != undefined ? detail.CompanyName : this.CompanyName: this.CompanyName
          this.RegistrationNumber =this.RegistrationNumber ==''? detail.RegistrationNo != undefined ? detail.RegistrationNo : this.RegistrationNumber:this.RegistrationNumber
          this.CompanyRegistryRecord = detail.CompanyRegistryRecord != undefined ? detail.CompanyRegistryRecord:''

          this.selectedCountry = this.selectedCountry ==undefined? detail.CountriesOfIncorporation != undefined ? detail.CountriesOfIncorporation : this.selectedCountry: this.selectedCountry
        }
        let ix = this.incorporation_country_list.findIndex(p => p.CountryID == this.selectedCountry);
        if(ix== -1){
          this.selectedCountry =undefined
          this.selectedCountryError = this.store.getVal('investee_companys_country_of_incorporation_error_msg')
        }
        this.ShortDescription = (detail.ShortDescription != undefined && detail.ShortDescription != '') ? detail.ShortDescription : ''
        this.selectedSDGs = this.store.getList(this.sdg_list, detail.SDGs)
        this.selectedGenderLens = detail.GenderLens != undefined ? detail.GenderLens.split(',') : ''
        this.ImpactSustainabilityStatement = detail.ImpactSustainabilityStatement !=undefined?detail.ImpactSustainabilityStatement :this.ImpactSustainabilityStatement
        this.respObj.selectedImpactTheme=detail.ImpactThemesAndAreas;
        this.respObj.selectedEsg = detail.ESG;
        this.selectedFundingTypeAndFundRaiseType = detail.FundingType;
        this.selectedIndustriesSectors = this.store.getList(this.industries_sectors_list, detail.IndustriesSectors);
        this.selectedFundingStage = detail.FundingStage//this.store.getList(this.funding_stage_list,detail.FundingStage);
        this.ScreeningStatus= detail.ScreeningStatus != undefined && detail.ScreeningStatus != ''?detail.ScreeningStatus:this.ScreeningStatus;
        this.IsFeatured = detail.IsFeatured != undefined ? detail.IsFeatured : this.IsFeatured;
        this.IsActive = detail.IsActive != undefined ? detail.IsActive : this.IsActive;
        this.IsEnable = detail.IsEnable != undefined ? detail.IsEnable : this.IsEnable;
        this.DataStatus = detail.DataStatus != undefined ? ('' + detail.DataStatus) : this.DataStatus;
        this.selectedFundingProviderType = this.store.getList(this.funding_provider_type_list, detail.FundingProviderType);
        this.respObj.selectedCountriesOfDomicileNationality=detail.CountriesOfDomicileNationality;
        if(this.type !='add-with-enabler'){
          this.FNMinTotalRaiseAmount =detail.MinimumTotalRaise!=undefined?this.store.format(undefined, detail.MinimumTotalRaise):undefined
          this.FNMaxTotalRaiseAmount = detail.MaximumTotalRaise!=undefined?this.store.format(undefined, detail.MaximumTotalRaise):undefined
          
          this.FNMinimumTicketSizePerFunding =detail.MinTicketSizePerInvestor!=undefined?this.store.format(undefined, detail.MinTicketSizePerInvestor):undefined
          this.FNMaximumTicketSizePerFunding = detail.MaxTicketSizePerInvestor!=undefined?this.store.format(undefined, detail.MaxTicketSizePerInvestor):undefined

          this.CumulativeRevenue = this.store.format(undefined, detail.CumulativeRevenue)
        }
        if(detail.Pitch != undefined && detail.Pitch !=''){
          this.fileUrl = detail.Pitch
        }
        if(detail.Logo != undefined && detail.Logo !=''){
          this.InvesteeLogoURl = detail.Logo
        }
        if(detail.PitchOriginalName != undefined && detail.PitchOriginalName !=''){
          this.fileUrl = detail.PitchOriginalName
        }
        let sDate =  (detail.RaiseStartDate != undefined ?moment(detail.RaiseStartDate).format('DD MMM yyyy') : this.raiseStartDate)
        this.raiseStartDate = sDate != undefined?new Date(sDate):this.raiseStartDate;
        // this.raisenStartDate = new Date(sDate).toISOString();

        let eDate =  (detail.RaiseEndDate != undefined ?moment(detail.RaiseEndDate).format('DD MMM yyyy') : this.raiseStartDate)
        this.raiseEndDate = eDate != undefined?new Date(eDate):this.raiseEndDate;
        // this.raisenEndDate = new Date(eDate).toISOString();

        
        this.ALastName = (detail.LastName != undefined && detail.LastName != null)?detail.LastName:''
        this.AFirstName = (detail.FirstName != undefined && detail.FirstName != null)?detail.FirstName:''
        this.Email = (this.Email == undefined || this.Email =='')? detail.Email:this.Email
        this.RepresentingForEmail = (detail.RepresentingForEmail != undefined && detail.RepresentingForEmail != null)?detail.RepresentingForEmail:''
        this.RepresentingForFirstName = (detail.RepresentingForFirstName != undefined && detail.RepresentingForFirstName != null)?detail.RepresentingForFirstName:''
        this.RepresentingForLastName = (detail.RepresentingForLastName != undefined && detail.RepresentingForLastName != null)?detail.RepresentingForLastName:''
        this.Website = detail.Website != undefined && detail.Website != null ? detail.Website : ''
        this.SourceOrReferral = detail.SourceOrReferral !=undefined?detail.SourceOrReferral:''
        this.InternalReferenceNumber = detail.InternalReferenceNumber != undefined?detail.InternalReferenceNumber:''
        
        
        if(detail.Tags != undefined && detail.Tags != '') {
          this.selectedTags = detail.Tags.split(',')
          this.selectedTagsTag=[]
          for (let i = 0; i < this.selectedTags.length; i++) {
            const element = this.selectedTags[i];
            var idx = this.TagList.findIndex(p => p.ReferenceKey == element);
            this.selectedTagsTag.push(this.TagList[idx])
          }
        }
        this.InternalNotes = detail.InternalNotes !=undefined?this.store.nl2br2(detail.InternalNotes):''
        this.isConfirmation1 = detail.ConfirmAuthorised == 1
        this.isTreePrepare = true
      }
    }
    changeListener($event,type?): void {
      this.sizeExcludeErr = ''
      this.isSizeExclude=false
      if ($event.target.files && $event.target.files[0]) {
        let files =$event.target.files[0];
        if(type == 'logo') {
          this.InvesteeFile = files;
          let reader = new FileReader();
          reader.onload = (event: any) => {
            this.InvesteeLogoSrc = event.target.result;
          }
          // reader.readAsDataURL(this.LogoFile);
          reader.readAsDataURL(this.InvesteeFile);
        }else{
          if (files.size > this.store.max_size) {
            this.isSizeExclude=true
            this.store.scrollTo('docFile');
            this.sizeExcludeErr = this.store.getVal('maximum_size_allowed_is')+' ' + this.store.max_size / 1000000 + this.store.getVal('mb');
          } else {
            this.pdfFile = files;
            this.fileName = files.name
            let reader = new FileReader();
            reader.onload = (event: any) => {
              // this.img1 = event.target.result;
            }
            reader.readAsDataURL(this.pdfFile);
          }
        }
      }
    }
    onDeletePdf(){
      this.IsDeletePitch=true
      this.fileUrl=undefined
      this.pdfFile = undefined;
      this.isSizeExclude = false
      this.fileName=''
    }
    onDeleteFile(from) {
      if(from == 'logo') {
        this.IsDeleteLogo = true
        this.InvesteeLogoSrc = ""
        this.InvesteeFile = undefined;
        this.InvesteeLogoURl = undefined;
        $('#upload').val('')
      }
    }
    statusSwitch(event) {
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
    async callConfirmPopup(message: any) {
      this.alertConfirm = await this.alertController.create({
        message: message,
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: this.store.getVal('yes'),
            handler: () => {
              this.ConfirmData();
            }
          },
          {
            text: this.store.getVal('no'),
            role: 'cancel',
            handler: () => {
              this.alertConfirm.dismiss()
            }
          }
        ], backdropDismiss: false
      });
      return await this.alertConfirm.present();
    }
    resetVar() {
      this.loadMsg = ''
      this.FNMinTotalRaiseAmountError = '';
      this.FNMinimumTicketSizePerFundingError = '';
      this.dataAction = []
      this.isProvider = false
      this.isCompanyName = false
      this.isShortDescription = false
      this.isRNumber = false
      this.isCopmanyRegistryRecord = false
      this.IsEnablerCurrency = false
      this.isCountry = false
      this.isIndustries = false
      this.IsImpactTheme = false
      this.isSDG = false
      this.IsEsg = false
      this.isImpactStatement = false
      this.IsFundingTypeAndFundRaiseType = false
      this.isFundingStage = false
      this.IsFNMinTotalRaiseAmountUn = false
      this.IsFNMaxTotalRaiseAmountUn = false
      this.isRevenueUsd = false
      this.isInvestorType = false
      this.isRaiseStartDate = false
      this.isRaiseEndDate = false
      // this.isMinTicket = false
      this.IsFNMaximumTicketSizePerFundingUn=false
      this.IsFNMinimumTicketSizePerFundingUn=false
      // this.isNewCompany = false;
      this.isFname = false
      this.isEmail = false
      this.isRepresentingForEmail = false

      this.isConfirm1 = false;
      this.isConfirm2 = false;
    }
    
    async presentAlert(title, msg, btnOk, isBack?) {
      const alert = await this.alertController.create({
        message: msg,
        animated: true,
        cssClass: 'alertCustomCssBtn',
        backdropDismiss: false,
        buttons: [
          {
            text: btnOk,
            handler: () => {
              if (isBack) {
                this.loadMsg = ''
                this.dataAction = []
                this.store.scrollTo('topRow');
                this.clearData();
              }
            }
          }
        ]
      });
      await alert.present();
    }
    clearDataSecData() {
      this.selectedIndustriesSectors = ''
      this.selectedImpactTheme = []
      this.selectedSDGs = ''
      this.selectedEsg = []
      this.selectedGenderLens = ''
      this.ImpactSustainabilityStatement = ''
      this.selectedFundingTypeAndFundRaiseType =undefined
      this.selectedFundingStage = undefined
      this.FNMinTotalRaiseAmount = ''
      this.FNMaxTotalRaiseAmount = ''
      this.ShortDescription = ''
      this.CumulativeRevenue = ''
      this.raiseStartDate = undefined
      this.raiseEndDate = undefined
      this.selectedCountriesOfDomicileNationality = []
      this.selectedFundingProviderType = ''

      this.FNMinimumTicketSizePerFunding = ''
      this.FNMaximumTicketSizePerFunding = ''
      this.Website = ''
      this.isConfirmation1 = false
      this.isConfirmation2 = false
      this.SourceOrReferral = ''
      this.InternalReferenceNumber = ''
      this.selectedTags = []
      this.InternalNotes = ''
    }
    clearData(from?) {
      this.resetVar();
      this.isFirst = true
      this.isSecond = false

      // this.selectedEnabler = undefined;
      // this.selectedEnabler2 = undefined;
      this.selectedEnablerOld = undefined;
      this.CompanyName = ''
      this.RegistrationNumber = ''
      this.CompanyNotRegisterd=false
      this.CompanyRegistryRecord = ''
      this.isCompanyName = undefined
      this.selectedCountry = undefined
      this.selectedIndustriesSectors = ''
      this.selectedImpactTheme = []
      this.selectedSDGs = ''
      this.selectedEsg = []
      this.selectedGenderLens = ''
      this.ImpactSustainabilityStatement = ''
      this.selectedFundingTypeAndFundRaiseType =undefined
      this.selectedFundingStage = undefined
      this.FNMinTotalRaiseAmount = ''
      this.FNMaxTotalRaiseAmount = ''
      this.ShortDescription = ''
      this.CumulativeRevenue = ''
      this.raiseStartDate = undefined
      this.raiseEndDate = undefined
      this.selectedCountriesOfDomicileNationality = []
      this.selectedFundingProviderType = ''

      this.FNMinimumTicketSizePerFunding = ''
      this.FNMaximumTicketSizePerFunding = ''
      
      this.AFirstName = ''
      this.ALastName = ''
      this.Email = ''

      this.RepresentingForEmail = ''
      this.RepresentingForFirstName = ''
      this.RepresentingForLastName = ''
      
      this.Website = ''
      this.isConfirmation1 = false
      this.isConfirmation2 = false
      this.SourceOrReferral = ''
      this.InternalReferenceNumber = ''
      this.selectedTags = []
      this.InternalNotes = ''
      if(this.FN_EnablerSlug != undefined && this.FN_EnablerSlug != '') {
        if(from == 'cancel') {
          this.store.backPage()
        } else {
            if (this.type != 'edit' && this.type != 'my_edit' && this.type != 'edit_fn' && this.type != 'clone') {
              this.router.navigateByUrl('/admin/enabler/' + this.EnablerSlug + '#fundraise-needs');
            } else if(this.type == 'clone') {
              this.router.navigateByUrl('/user#fundraise-need-submissions');
            } else {
              this.store.backPage()
        }
      }
    }
    }
    ngOnDestroy() {
      if(this.PLATFORMID)
      $(".tox-toolbar__group").hide();
      this.subLabel.unsubscribe();
      this.subscription.unsubscribe();
    }
    CreateNew(select: NgSelectComponent) {
      select.close();
      this.RegistrationNumber=''
      this.CompanyNotRegisterd=false
      this.CompanyRegistryRecord=''
      this.selectedCountry=null
      this.selectedCompany = null
      this.existCompany = null
      this.CompanyName=''
      this.isNewCompany = true;
      this.isCompanyUn = false
      // this.companyElement.focus();
      setTimeout(() => {      
        document.getElementById("CompanyName").focus();
      }, 30);
    }
    customSelect(event){
      setTimeout(() => {
        if(event.modalName !=undefined){
          this['' + event.modalName] = event.modal
          if(event.modalName =='selectedCompany'){
            this.existCompany = event.modal
            this.selectedCountryError =undefined
            if(event != undefined && event.select != undefined && event.select.itemsList._selectionModel._selected != undefined && event.select.itemsList._selectionModel._selected.length>0){
              let selData =event.select.itemsList._selectionModel._selected[0].value
              let ix = this.incorporation_country_list.findIndex(p => p.CountryID == selData.CountryID);
              this.selectedCountry = ix!=-1?selData.CountryID:undefined
              if(ix== -1){
                this.selectedCountry =undefined
                this.selectedCountryError = this.store.getVal('investee_companys_country_of_incorporation_error_msg')
              }else{
                this.selectedCountry = selData.CountryID
              }
              this.CompanyNotRegisterd = selData.CompanyNotRegisterd
              this.RegistrationNumber = selData.RegistrationNo  
              this.CompanyRegistryRecord = selData.CompanyRegistryRecord  
              this.CompanyName = selData.CompanyName
            }else{
              this.CompanyNotRegisterd = false
              this.isNewCompany = false
              this.selectedCountry = null
              this.RegistrationNumber = ''
              this.CompanyRegistryRecord = ''
            }
          }
        }
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
        if(event.isCreate && event.modal == undefined && event.createNew){
          this.CreateNew(event.select)
        }else if(event.isCreate && event.modal != undefined){
          this.isNewCompany = false;
        }
      }, 100);
    }
    customEditor(event){
      if(event !=undefined && event.varnm !=undefined){
        this[event.varnm] = event.val
      }
    }
    async onChangeEnabler(event, detail?) {
      this.selectedEnabler2 = this.selectedEnabler;
      if (this.selectedEnablerOld != undefined && this.selectedEnablerOld != '') {
        const alert = await this.alertController.create({
          message: this.store.getVal('reset_enabler_data'),
          animated: true,
          cssClass: 'alertCustomCssBtn',
          buttons: [
            {
              text: this.store.getVal('yes'),
              handler: () => {
                this.selectedEnablerOld = this.selectedEnabler
                this.updateEnablerDataOnChange(event, detail)
              }
            },
            {
              text: this.store.getVal('no'),
              role: 'cancel',
              handler: () => {
                this.selectedEnabler = this.selectedEnablerOld
              }
            }
          ], backdropDismiss: true
        });
        return await alert.present();
      } else {
        this.selectedEnablerOld = this.selectedEnabler;
        this.updateEnablerDataOnChange(event, detail)
      }
    }

  updateEnablerDataOnChange(event, details) {
    this.selectedFundingProviderType = '';
    this.minimum_raise_amount = '';
    this.maximum_raise_amount = '';
    this.FNMinTotalRaiseAmount = ''
    this.FNMaxTotalRaiseAmount = ''
    this.CumulativeRevenue = '';
    this.totalCountry = 0
    this.totalThemesAreas = 0
    this.selectedSDGs = '';
    this.TotalFundingType = 0
    this.selectedFundingTypeAndFundRaiseType = undefined;
    this.selectedFundingStage = undefined;
    this.selectedIndustriesSectors = '';
    this.selectedGenderLens = undefined;
    this.enabler_minimum_ticket = '';
    this.enabler_maximum_ticket = '';

    this.NoteTotalRaiseAmount = '';

    this.RevenueUsdError = '';
    this.FNMinTotalRaiseAmountError = '';
  
      
    this.currency_list = [];
    this.gender_lens_list = [];
    this.funding_provider_type_list = [];
    this.selectedCountriesOfDomicileNationality = [];
    this.selectedImpactTheme = [];
    this.sdg_list = [];
    this.selectedEsg = [];
    this.FundingTypeAndFundRaiseTypeList = [];
    this.funding_stage_list = []
    this.screening_status_list = []
    this.industries_sectors_list = [];
    if (event == undefined) {

    } else {
      this.apiService.getEnablerReferenceData(event.EnablerID, 'fundraise').subscribe(async response => {
        let res: any = response;
        this.notFoundText = this.store.getVal('no_items_found');
        if ((res.success) && (res.data != undefined)) {
          if(this.type == 'add'){
            this.isFirst = false;
            this.isEnabler = false;
            this.isSecond = true;
          }
          this.setDatas(res, details)
        }
      });
    }
  }
  setDatas(res: any, details: any) {
    this.minimum_raise_amount = (res.data.minimum_raise_amount != undefined && res.data.minimum_raise_amount != '') ? res.data.minimum_raise_amount : 1;
    this.maximum_raise_amount = (res.data.maximum_raise_amount != undefined && res.data.maximum_raise_amount != '') ? res.data.maximum_raise_amount : 99999999999;

    this.enabler_minimum_ticket = (res.data.minimum_ticket != undefined && res.data.minimum_ticket != '') ? res.data.minimum_ticket : '';
    this.enabler_maximum_ticket = (res.data.maximum_ticket != undefined && res.data.maximum_ticket != '') ? res.data.maximum_ticket : '';

    this.DefFPMinimumTicketSizePerFunding = (this.enabler_minimum_ticket != undefined && this.enabler_minimum_ticket != '')? this.enabler_minimum_ticket:this.DefFPMinimumTicketSizePerFunding
    
    this.DefFPMaximumTicketSizePerFunding = (this.enabler_maximum_ticket != undefined && this.enabler_minimum_ticket != '')? this.enabler_maximum_ticket:this.DefFPMaximumTicketSizePerFunding

    this.NoteTotalRaiseAmount = this.store.getVal('between') + ' ' + this.store.format(undefined, this.minimum_raise_amount) + ' - ' + this.store.format(undefined, this.maximum_raise_amount);

    this.DefFPMinCumulativeRevenue =(res.data.cumulative_revenue != undefined && res.data.cumulative_revenue != '') ? res.data.cumulative_revenue : 1


    if (res.data.funding_provider_type_list != undefined) {
      this.funding_provider_type_list = res.data.funding_provider_type_list
    }
    if (res.data.tags != undefined) {
      this.tags = res.data.tags
    }
    if (res.data.sdg_list != undefined) {
      this.sdg_list = res.data.sdg_list
    }
    if (res.data.gender_lens_list != undefined) {
      this.gender_lens_list = res.data.gender_lens_list
    }
    if (res.data.currency_list != undefined) {
      this.currency_list = res.data.currency_list
    }
    if (res.data.funding_stage_list != undefined) {
      this.funding_stage_list = res.data.funding_stage_list
    }
    if (res.data.screening_status_list != undefined) {
      this.screening_status_list = res.data.screening_status_list
    }
    if (res.data.industries_sectors_list != undefined) {
      this.industries_sectors_list = res.data.industries_sectors_list
    }
    if (res.data.tag_list != undefined) {
      this.TagList = res.data.tag_list
    }
    if ((res.data.domicile_nationality_country_list != undefined && res.data.domicile_nationality_country_list.length > 0 && !this.isFromUser) || (res.data.region_tree_list != undefined && res.data.region_tree_list.length > 0 && this.isFromUser)) {
      let domicile_nationality_country_list = this.isFromUser ? res.data.region_tree_list
        : res.data.domicile_nationality_country_list;
      this.DomicileNationalityCountryListTemp =domicile_nationality_country_list
    }
    if (res.data.impact_themes_areas_list != undefined && res.data.impact_themes_areas_list.length > 0) {
      this.ImpactThemesAreasListTemp =res.data.impact_themes_areas_list;
    }
    if (res.data.esg_list != undefined && res.data.esg_list.length > 0) {
      this.EsgListTemp =res.data.esg_list;
    }
    if (res.data.funding_type_without_tree_list
      != undefined && res.data.funding_type_without_tree_list
      .length > 0) {
      this.FundingTypeAndFundRaiseTypeList = res.data.funding_type_without_tree_list;
    }
    this.selectedEnablerCurrency =res.data.enabler_currency != undefined && res.data.enabler_currency != ''? parseInt(res.data.enabler_currency):undefined //this.store.getList(this.funding_provider_type_list,detail.FundingProviderType);

    if (details != undefined) {
      this.setDetailsData(details);
    } else {
      this.isTreePrepare = true
    }
  }
}
