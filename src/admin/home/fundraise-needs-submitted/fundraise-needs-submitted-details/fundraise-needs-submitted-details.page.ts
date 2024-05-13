import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { actType, appApi, permission } from 'src/shared/app.constants';

@Component({
  selector: 'fundraise-needs-submitted-details',
  templateUrl: 'fundraise-needs-submitted-details.page.html',
  styleUrls: ['fundraise-needs-submitted-details.page.scss'],
})
export class FundraiseNeedsSubmittedDetailsPage implements OnInit, OnDestroy {

  filteCnt = 0
  updateTime = 0

  slug: any = "";
  FundraiseData: any;
  AdminList = [];
  permissionsList = []
  fundraiseForm = []
  ReferenceValueJsonData: any = [];
  FundraiseNeedsCriteriaJsonData: any = [];
  FundingProfilesCriteriaJsonData: any = [];
  FundraiseUID = ''
  message = '';
  sort = 'recent';
  allTotal = 0;
  ImpactThemesAndAreas: any = []
  FundingType: any = []
  Sdgs: any = []
  Esg: any = []
  

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
  public subSelectSegment: any;
  public delete: any;
  ClickFrom: any;
  selItem: any;
  FilterType: any='';
  displayMode: any=1;
  callFromListner = false
  
  constructor(public alertController: AlertController, public modalController: ModalController, private route: ActivatedRoute, public store: StorageService,public router: Router, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController, public apiService: ApiService, private cdref: ChangeDetectorRef) {
    this.slug = this.route.snapshot.paramMap.get('slug')
    this.type = 'fundraise-needs-submitted'
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
  initEvent() {
    this.subUpdate = this.eventService.updateData$.subscribe((item: any) => {
      this.updateTime=new Date().getTime()
    });
    this.changeRel = this.eventService.fundingProfileRel$.subscribe(async (item: any) => {     
      if(item !=undefined){
        this.callFromListner = false;
        this.getDetails();
      }          
    });
    this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
      this.ClickFrom = item.ClickFrom;
      this.selItem = item.item;
      this.pageType = item.action;
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
      this.setTitle()
    });
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {     
      this.address = item.address != undefined ? item.address : this.address;
      // this.keyword = (item.keyword != undefined) ? item.keyword : this.keyword     
      this.sort = (item.sort != undefined) ? item.sort : this.sort  
      if(this.FundraiseData !=undefined && item.details != undefined){
        this.FundraiseData.EnablerValid = item.details != undefined? item.details.EnablerValid:0
        this.FundraiseData.IsOperative = item.details != undefined? item.details.IsOperative:0
        this.FundraiseData.TotalReceivedInterest = item .details.TotalReceivedInterest != undefined? item.details.TotalReceivedInterest:0
        
        this.FundraiseData.TotalIntroductionsWithInvestors = item .details.TotalIntroductionsWithInvestors != undefined? item.details.TotalIntroductionsWithInvestors:0


        this.FundraiseData.TotalExpressedInterest = item.details.TotalExpressedInterest != undefined? item.details.TotalExpressedInterest:0
        this.FundraiseData.TotalFundingProfile = item.details.TotalFundingProfile != undefined? item.details.TotalFundingProfile:0
        this.FundraiseData.TotalMatchingFundingProfiles = item.details.TotalMatchingFundingProfiles != undefined? item.details.TotalMatchingFundingProfiles:0
        this.FundraiseData.IsPaid = item.details.IsPaid != undefined? item.details.IsPaid:this.FundraiseData.IsPaid
      }
      this.updateTime = item.updateTime
      this.filteCnt = item.filteCnt
    });
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.callFromListner = true;
      this.getDetails()
      this.updateTime = this.store.getCurrentTime();
    }
  }
  ngOnInit() {
    this.initEvent()
   }
  ionViewWillEnter() {
    this.keyword = this.store.getFilterFromUrl('keyword', '');
    this.sort =this.store.getFilterFromUrl('sort', this.sort);
  
    this.getDetails();
  }
  ionViewWillLeave(){    
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
    
    if( this.subSelectSegment !=undefined)
    this.subSelectSegment.unsubscribe();
    if( this.delete !=undefined)
    this.delete.unsubscribe();
  }
   
  download($event) {
    if (this.pageType == 'funding-profile-match-report') {
      this.apiService.callDownload(appApi.fundingProfileReportListAdminExcel, 'FN_EnablerSlug', this.FundraiseData.FN_EnablerSlug, this.keyword, this.sort, actType.fundraise_funding_profile,'FilterType',this.FilterType);
    }
  }
  sendMatchmakingReport(){
    if(this.allTotal>0){
      let url = ('match-report/'+this.FundraiseData.EnablerSlug+'/'+((this.FundraiseData.FN_EnablerSlug != undefined && this.FundraiseData.FN_EnablerSlug !='')?this.FundraiseData.FN_EnablerSlug:(this.FundraiseData.FP_EnablerSlug != undefined && this.FundraiseData.FP_EnablerSlug !='')?this.FundraiseData.FP_EnablerSlug:'')+'/fundraise-needs-submitted/details/'+this.pageType)
      this.router.navigateByUrl(url);
    }else{
      this.store.showToast(this.store.getVal('send_matchmaking_report_error_msg'),3000,'error')
    }
  }
  onPitchDownload(path){
    this.apiService.pitchDownload(path);
  }
  onAdd() {
    
  }
  onAction(type) {
    if (type == '1') {
      this.router.navigateByUrl('/admin/enabler/' + this.slug + '/permission/add');
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
      this.apiService.getAdminFundraiseSubmittedDetails(this.slug,'',this.sort, 0,1,permission.add_download_transfer_ownership,actType.fundraise_enabler).subscribe(async response => {
        let res: any = response;
        if (res.success) {
          this.updateTime = new Date().getTime()
          if (!this.callFromListner)
            this.segments = [];
          if (res.data.detail == undefined) {
            this.message = res.message
            this.pageType = ''
          } else {
            this.FundraiseData = res.data.detail;
            this.FundraiseData.FundraiseSlug = this.slug
            this.FundraiseUID = this.FundraiseData.FundraiseUID;

            this.ImpactThemesAndAreas = this.FundraiseData.ImpactThemesAndAreasJson != undefined && this.FundraiseData.ImpactThemesAndAreasJson != ''?JSON.parse(this.FundraiseData.ImpactThemesAndAreasJson):[]
            this.Esg = this.FundraiseData.EsgJson != undefined && this.FundraiseData.EsgJson != ''?JSON.parse(this.FundraiseData.EsgJson):[]
            
            this.FundingType = this.FundraiseData.FundingTypeJson != undefined && this.FundraiseData.FundingTypeJson != ''?JSON.parse(this.FundraiseData.FundingTypeJson):[]
            this.Sdgs = this.FundraiseData.SdgsJson != undefined && this.FundraiseData.SdgsJson != ''?JSON.parse(this.FundraiseData.SdgsJson):[]
            //  this.fundraiseForm.push({ title: this.clmTitle[31].title, class:this.clmTitle[31].class,value:this.FundraiseData.InternalNotes})

            // this.ReferenceValueJsonData = (this.enablerData.ReferenceValueJsonData != undefined?JSON.parse(this.enablerData.ReferenceValueJsonData):[]);
            this.FundraiseNeedsCriteriaJsonData = (this.FundraiseData.FundraiseNeedsCriteriaJsonData != undefined?JSON.parse(this.FundraiseData.FundraiseNeedsCriteriaJsonData):[]);
            this.FundingProfilesCriteriaJsonData = (this.FundraiseData.FundingProfilesCriteriaJsonData != undefined?JSON.parse(this.FundraiseData.FundingProfilesCriteriaJsonData):[]);
            if (!this.callFromListner) {
              this.segments.push({ key: 'fundraise-form', label:this.store.getVal('fundraise_form'),icon:'fa-rocket fa-solid'})
              this.segments.push({ key: 'funding-profile-match-report', label:this.store.getVal('matching_funding_profiles'),icon:'fa-infinity fa-solid' })
              this.segments.push({ key: 'settings', label: this.store.getVal('visbility_settings'),icon:'fa-solid fa-gear'  })
              this.pageType = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : 'fundraise-form';
              this.callFromListner = false
              this.setTitle()
            }
            setTimeout(() => {
              if(this.pageType != 'overview' && this.pageType != 'fundraise-form' && this.FundraiseData != undefined)
              this.store.scrollToEnd('#tabblings')
            }, 2000);
          }
          setTimeout(() => {     
            if((this.pageType == 'overview' || this.pageType =='fundraise-form') && localStorage.getItem('scroll') != undefined){
              localStorage.removeItem('scroll')
              this.store.scrollToEnd('#tabs_contents');
            }
          }, 500);
          this.setFilterCnt()
        } else {
          this.message = res.message
        }
      });
    }, this.store.isApiCalled);
  }
  callEnablerFilter(event) {
    if (event.filter != undefined && event.filter == '1') {
      this.openFilterView();
    } else if (event.keyword != undefined) {
      this.keyword = event.keyword
      // this.updateTime =new Date().getTime()
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    }
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
    this.setTitle()
    if(event != 'funding-profile-match-report'){      
        this.removeFilter({ isCall: false, rmType: this.FilterType })
    }
    // if (this.ClickFrom == undefined)
    this.ClickFrom = undefined
  }
  setTitle() {
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined  && this.FundraiseData !=undefined) {
      this.store.titleCntWithPage(this.FundraiseData.CompanyName,obj.label,this.FundraiseData)
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
      this.FundraiseData.TotalExpressedInterest = event.TotalExpressedInterest
    }
    this.setFilterCnt()
  }
  clikCount(event) {
    if(event !=undefined && event.action !=undefined){
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