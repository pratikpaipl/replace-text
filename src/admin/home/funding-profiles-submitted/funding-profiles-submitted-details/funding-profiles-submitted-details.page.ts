import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { actType, appApi, permission } from 'src/shared/app.constants';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'funding-profiles-submitted-details',
  templateUrl: 'funding-profiles-submitted-details.page.html',
  styleUrls: ['funding-profiles-submitted-details.page.scss'],
})
export class FundingProfileSubmittedDetailsPage implements OnInit, OnDestroy {
  
  filteCnt = 0
  
  slug: any = "";
  fundingProfileData: any;
  IsIgnore = true;
  AdminList = [];
  permissionsList = []
  permissionsOnCard = []
  fundingProfileForm = []
  message = '';
  sort = 'recent';
  allTotal = 0;
  ImpactThemesAndAreas: any = []
  FundingType: any = []
  Sdgs: any = []
  Esg: any = []
  
  updateTime: any = 0

  ImpactThemesAndAreasKey: any = []
  SdgIDs: any = []
  segments = [];
  keyword = ''
  address = ''
  pageType: any = 'funding-profile';
  pageTypeMeg: any;
  type: any = ''
  public applyFilter: any;
  public subscription: any;
  public subLabel: any;
  public subUpdate: any;
  public changeRel: any;
  public delete: any;
  ClickFrom: any;
  selItem: any;
  displayMode: any=1;
  FilterType: any='';
  callFromListner = false
  
  constructor(public alertController: AlertController, public sanitizer: DomSanitizer, public modalController: ModalController, private route: ActivatedRoute, public store: StorageService,public router: Router, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController, public apiService: ApiService, private cdref: ChangeDetectorRef) {
    this.slug = this.route.snapshot.paramMap.get('slug')
    this.type = 'funding-profiles-submitted'

    // this.UserSlug = this.store.getFilterFromUrl('UserSlug','')
    this.FilterType =this.store.getFilterFromUrl('FilterType','')
    this.selItem = this.FilterType != undefined && this.FilterType !=''? {
      itemData :
      {
        chipLbl:this.store.getFilterFromUrl('chipLbl',''),
        displayMode:this.store.getFilterFromUrl('displayMode',''),
        EnablerFilterType:this.FilterType,
      }
    }:undefined
  }
 
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ngOnInit() {
    this.initEvent()
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.callFromListner = true;
      this.getDetails()
      this.updateTime = this.store.getCurrentTime();
    }
  }
  ionViewWillEnter() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort =this.store.getFilterFromUrl('sort', this.sort);
   
    this.getDetails();    
  }
  ngOnDestroy(): void {
    if( this.applyFilter !=undefined)
    this.applyFilter.unsubscribe();
    if( this.subLabel !=undefined)
    this.subLabel.unsubscribe();
    if( this.subUpdate !=undefined)
    this.subUpdate.unsubscribe();
    if( this.changeRel !=undefined)
    this.changeRel.unsubscribe();
    
    if( this.delete !=undefined)
    this.delete.unsubscribe();
  }
  initEvent() {
    this.subUpdate = this.eventService.updateData$.subscribe((item: any) => {
      this.updateTime=new Date().getTime()
    });
    this.changeRel = this.eventService.fundingProfileRel$.subscribe(async (item: any) => {
      if(item !=undefined){
        this.callFromListner = true;
        this.getDetails();
      }          
    });
    this.delete = this.eventService.deleteData$.subscribe((item: any) => {
      this.callFromListner = true;
      if (item.pageFrom != 'Top')
      this.getDetails();
      
    });
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].label = this.store.updateSegmentName(this.segments[i].label,this.segments[i].key,'detail')
      }
      this.setTitle();
    });
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
      // this.keyword = this.store.getFilterFromUrl('keyword', '');
      this.sort =this.store.getFilterFromUrl('sort', this.sort);
      if(this.fundingProfileData !=undefined && item.details != undefined){
      this.fundingProfileData.IsOperative = item.details != undefined? item.details.IsOperative:0
      this.fundingProfileData.EnablerValid = item.details != undefined? item.details.EnablerValid:0
      this.fundingProfileData.TotalReceivedInterest = item.details.TotalReceivedInterest != undefined? item.details.TotalReceivedInterest:0
      this.fundingProfileData.TotalExpressedInterest = item.details.TotalExpressedInterest != undefined? item.details.TotalExpressedInterest:0
      this.fundingProfileData.TotalFundraiseNeed = item.details.TotalFundraiseNeed != undefined? item.details.TotalFundraiseNeed:0
      this.fundingProfileData.TotalIntroductionsWithInvestees = item .details.TotalIntroductionsWithInvestees != undefined? item.details.TotalIntroductionsWithInvestees:0
      this.fundingProfileData.TotalMatchingFundraiseNeeds = item.details.TotalMatchingFundraiseNeeds != undefined? item.details.TotalMatchingFundraiseNeeds:0
      this.fundingProfileData.IsPaid = item.details.IsPaid != undefined? item.details.IsPaid: this.fundingProfileData.IsPaid
    }
    this.updateTime = item.updateTime
    });
  }
  ionViewWillLeave(){
   
  }
  // getParamData() {
  //   return { keyword: this.keyword, sort: this.sort, segment: this.pageType }
  // }
  
  callEnablerFilter(event) {
    if (event.filter != undefined && event.filter == '1') {
      this.openFilterView();
    } else if (event.keyword != undefined) {
      this.keyword = event.keyword
      // this.updateTime = (new Date().getTime())
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    }
  }
  download($event) {
    if (this.pageType == 'fundraise-need-match-report') {
      this.apiService.callDownload(appApi.fundraiseReportListAdminExcel, 'FP_EnablerSlug', this.fundingProfileData.FP_EnablerSlug, this.keyword, this.sort, actType.funding_profile_fundraise,'FilterType',this.FilterType);
    }
  }
  sendMatchmakingReport(){

    if(this.allTotal>0){
      let url = ('match-report/'+this.fundingProfileData.EnablerSlug+'/'+((this.fundingProfileData.FN_EnablerSlug != undefined && this.fundingProfileData.FN_EnablerSlug !='')?this.fundingProfileData.FN_EnablerSlug:(this.fundingProfileData.FP_EnablerSlug != undefined && this.fundingProfileData.FP_EnablerSlug !='')?this.fundingProfileData.FP_EnablerSlug:'')+'/funding-profiles-submitted/details/'+this.pageType)
      this.router.navigateByUrl(url);
    }else{
      this.store.showToast(this.store.getVal('send_matchmaking_report_error_msg'),3000,'error')
    }    
  }
  onAdd() {
    
  }
  onAction(type) {
    if (type == '1') {
      this.router.navigateByUrl('/admin/enabler/' + this.slug + '/permission/add');
      // } else if (type == '2') {
      // this.router.navigateByUrl('/admin/' + this.fundingProfileData.EnablerSlug + '/import-location');
    } else {
      this.router.navigateByUrl('/admin/enabler/' + this.slug + '/permission/transfer-ownership');
    }
  }
  async removeFilter(event) {
    this.selItem = event.selItem
    if (event != undefined) {
      if(event.rmType == 'introduction_requested' || event.rmType == 'introduction_requests_received' || event.rmType == 'sent_introduction_requested' || event.rmType == 'receive_introduction_requested'|| event.rmType == 'matched' || event.rmType == 'introductions')
      this.FilterType=''
    }
  }
  getDetails() {
    setTimeout(() => {
      this.apiService.adminFundingProfileSubmittedDetails(this.slug, '', this.sort, 0, 1, permission.add_download_transfer_ownership, actType.funding_profile_enabler).subscribe(async response => {
        let res: any = response;
        if (res.success) {
          this.updateTime = new Date().getTime()
          if (!this.callFromListner)
          this.segments = [];
          if (res.data.detail == undefined) {
            this.message = res.message
            this.pageType = ''
          } else {
            
            this.fundingProfileData = res.data.detail;
            this.fundingProfileData = res.data.detail;
            
            this.ImpactThemesAndAreas = this.fundingProfileData.ImpactThemesAndAreasJson != undefined && this.fundingProfileData.ImpactThemesAndAreasJson != ''?JSON.parse(this.fundingProfileData.ImpactThemesAndAreasJson):[]
            
            this.Esg = this.fundingProfileData.EsgJson != undefined && this.fundingProfileData.EsgJson != ''?JSON.parse(this.fundingProfileData.EsgJson):[]

            this.FundingType = this.fundingProfileData.FundingTypeJson != undefined && this.fundingProfileData.FundingTypeJson != ''?JSON.parse(this.fundingProfileData.FundingTypeJson):[]
            this.Sdgs = this.fundingProfileData.SdgsJson != undefined && this.fundingProfileData.SdgsJson != ''?JSON.parse(this.fundingProfileData.SdgsJson):[]
            this.fundingProfileData.CreatedTs = (this.fundingProfileData.CreatedTs != undefined && this.fundingProfileData.CreatedTs != '')?moment(this.fundingProfileData.CreatedTs).format('DD MMM yyyy'):''
            this.fundingProfileData.ModifiedTs = (this.fundingProfileData.ModifiedTs != undefined && this.fundingProfileData.ModifiedTs != '')?moment(this.fundingProfileData.ModifiedTs).format('DD MMM yyyy'):''
            
            if (!this.callFromListner) {
              this.segments.push({ key: 'profile-form', label: this.store.getVal('profile_form'),icon:'fa-money-bill-transfer fa-solid' })
              this.segments.push({ key: 'fundraise-need-match-report', label: this.store.getVal('matched_fundraise_needs'),icon:'fa-infinity fa-solid' })
              this.segments.push({ key: 'settings', label: this.store.getVal('visbility_settings'),icon:'fa-solid fa-gear' })
              this.pageType = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : 'profile-form';
              this.callFromListner = false              
            }
            setTimeout(() => {
              if(this.pageType != 'overview' && this.pageType != 'profile-form')
              this.store.scrollToEnd('#tabblings')
            }, 2000);
          }
          setTimeout(() => {     
            if((this.pageType == 'overview' || this.pageType =='profile-form') && localStorage.getItem('scroll') != undefined){
              localStorage.removeItem('scroll')
              this.store.scrollToEnd('#tabs_contents');
            }
          }, 500);
          this.setTitle();
          this.setFilterCnt()
        } else {
          this.message = res.message
        }
      });
    }, this.store.isApiCalled);
  }
  selectSort(event) {
    if (event != undefined) {
      this.sort = event;
      this.updateTime =new Date().getTime()
    }
  }
  onClickSegment(event): void {
    this.allTotal = 0;
    this.pageType = event;
    this.setTitle();
  if(event != 'fundraise-need-match-report')  
    this.removeFilter({ isCall: false, rmType: this.FilterType })
    this.ClickFrom = undefined    
  }
  setTitle() {
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined && this.fundingProfileData !=undefined) {
      this.store.titleCntWithPage(this.fundingProfileData.ProfileName,obj.label,this.fundingProfileData)
    }
  }
  openFilter(event) {
    if (event != undefined) {
      this.openFilterView()
    }
  }
  async openFilterView() {
  }
  setFilterCnt() {
    
  }
  updateCount(event) {
    if (event.action != undefined) {
      this.eventService.publishChangeSegment(event);
      this.store.backPage();
    }
    if (event.count != undefined) {
      this.allTotal = event.count
    }
    if (event.permissions != undefined) {
      this.permissionsList = event.permissions
    }
    if (event.pageType != undefined) {
      this.pageTypeMeg = event.pageType
    }
    if (event.TotalExpressedInterest != undefined) {
      this.fundingProfileData.TotalExpressedInterest = event.TotalExpressedInterest
    }
    this.setFilterCnt()
  }
  clikCount(event) {
    if (event != undefined && event.action != undefined) {
      this.pageType = event.action
      this.FilterType =this.store.getFilterFromUrl('FilterType','')
      this.selItem = this.FilterType != undefined && this.FilterType !=''? {
        itemData :
        {
          chipLbl:this.store.getFilterFromUrl('chipLbl',''),
          displayMode:this.store.getFilterFromUrl('displayMode',''),
          EnablerFilterType:this.FilterType,
        }
      }:undefined

    }
  }
}