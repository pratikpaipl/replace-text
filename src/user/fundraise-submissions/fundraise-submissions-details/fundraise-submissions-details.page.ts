import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { actType, appApi, permission } from 'src/shared/app.constants';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fundraise-submissions-details',
  templateUrl: 'fundraise-submissions-details.page.html',
  styleUrls: ['fundraise-submissions-details.page.scss'],
})
export class FundraiseSubmissionDetailsPage implements OnInit, OnDestroy {

  filteCnt = 0
  updateTime = 0

  slug: any = "";
  parent: any = "";
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
  pageType: any = 'fundraise';
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
  displayMode: any=1;
  FilterType: any='';

  callFromListner = false

  constructor(public alertController: AlertController, public modalController: ModalController, private route: ActivatedRoute, public store: StorageService, public activatedRoute: ActivatedRoute, public router: Router, private cookieService: CookieService, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController, public apiService: ApiService, private cdref: ChangeDetectorRef) {
    this.slug = this.activatedRoute.snapshot.paramMap.get('slug')
    this.parent = this.activatedRoute.snapshot.paramMap.get('parent')
    this.type = 'fundraise-need'
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

  }
  setTitle(){
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined) {
      if(this.FundraiseData != undefined && this.FundraiseData !='')
      this.store.titleCntWithPage(this.store.getVal('submitted_fundraise_needs')+'-'+this.FundraiseData.ReferenceCode, obj.label,this.FundraiseData);
    }
  }
  ngOnDestroy(): void {
    this.applyFilter.unsubscribe();
    this.subLabel.unsubscribe();
    this.subUpdate.unsubscribe();
    this.changeRel.unsubscribe();
   
    this.subSelectSegment.unsubscribe();
    this.delete.unsubscribe();
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ionViewWillEnter() {
    this.keyword = this.store.getFilterFromUrl('keyword', '');
    this.sort =  this.store.getFilterFromUrl('sort', this.sort)
    this.FilterType =this.store.getFilterFromUrl('FilterType','')
    this.selItem = this.FilterType != undefined && this.FilterType !=''? {
      itemData :
      {
        chipLbl:this.store.getFilterFromUrl('chipLbl',''),
        displayMode:this.store.getFilterFromUrl('displayMode',''),
        EnablerFilterType:this.FilterType,
      }
    }:undefined
    this.getDetails();
  }
  ngOnInit() {
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
      // this.keyword = this.store.getFilterFromUrl('keyword', '');
      this.sort =  this.store.getFilterFromUrl('sort', this.sort)
      if(this.FundraiseData !=undefined && item.details != undefined){
      this.FundraiseData.IsOperative = item.details != undefined? item.details.IsOperative:0
      this.FundraiseData.EnablerValid = item.details != undefined? item.details.EnablerValid:0
      this.FundraiseData.TotalReceivedInterest = item.details.TotalReceivedInterest != undefined? item.details.TotalReceivedInterest:0
      this.FundraiseData.TotalExpressedInterest = item.details.TotalExpressedInterest != undefined? item.details.TotalExpressedInterest:0
      this.FundraiseData.TotalFundingProfile = item.details.TotalFundingProfile != undefined? item.details.TotalFundingProfile:0
      this.FundraiseData.TotalMatchingFundingProfiles = item.details.TotalMatchingFundingProfiles != undefined? item.details.TotalMatchingFundingProfiles:0
      }
      this.updateTime = item.updateTime;
    });
  }

  download($event) {
    this.apiService.callDownload(appApi.fundingProfileReportListAdminExcel, 'FN_EnablerSlug', this.FundraiseData.FN_EnablerSlug, this.keyword, this.sort, actType.fundraise_funding_profile,'FilterType',this.FilterType);
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
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.callFromListner = true;
      this.getDetails()
      this.updateTime = this.store.getCurrentTime();
    }
  }
  getDetails() {
    setTimeout(() => {
      let path = window.location.href.replace(window.location.origin,'')
      if(this.cookieService.check(environment.cookiesKey)){
        this.apiService.myFundraiseSubmittedDetails(this.slug,'','recent', 0,1,permission.add_download_transfer_ownership,actType.fundraise_enabler).subscribe(async response => {
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
              this.FundraiseData.CreatedTs = (this.FundraiseData.CreatedTs != undefined && this.FundraiseData.CreatedTs != '')?moment(this.FundraiseData.CreatedTs).format('DD MMM yyyy'):''
              this.FundraiseData.ModifiedTs = (this.FundraiseData.ModifiedTs != undefined && this.FundraiseData.ModifiedTs != '')?moment(this.FundraiseData.ModifiedTs).format('DD MMM yyyy'):''
              this.FundingProfilesCriteriaJsonData = (this.FundraiseData.FundingProfilesCriteriaJsonData != undefined?JSON.parse(this.FundraiseData.FundingProfilesCriteriaJsonData):[]);
              if (!this.callFromListner) {
                this.segments.push({ key: 'fundraise-form', label:this.store.getVal('fundraise_form'),icon:'fa-rocket fa-solid'})
                // this.segments.push({ key: 'funding-profile-match-report', label:this.store.getVal('funding_profile_match_report'),icon:'fa-infinity fa-solid'})
                // this.segments.push({ key: 'fundraise-needs', label: this.store.getVal('investees'), icon: 'fa-rocket fa-solid' });

                this.segments.push({ key: 'funding-profile-match-report', label:this.store.getVal('matching_funding_profiles'),icon:'fa-infinity fa-solid'})
                // this.segments.push({ key: 'matching-funding-profiles', label:this.store.getVal('matching_funding_profiles'),icon:'fa-infinity fa-solid'})
                
                this.pageType = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : 'fundraise-form';
                this.callFromListner = false
              }
              setTimeout(() => {
                if(this.pageType != 'overview' && this.pageType != 'fundraise-form')
                this.store.scrollToEnd('#tabblings')
              }, 2000);
              setTimeout(() => {     
              if((this.pageType == 'overview' || this.pageType =='fundraise-form') && localStorage.getItem('scroll') != undefined){
                localStorage.removeItem('scroll')
                this.store.scrollToEnd('#tabs_contents');
              }
            }, 500);
              this.setTitle()
            }
          } else {
            this.message = res.message
          }
        });
      }else{
        this.store.navigatePage(['/auth'],'login',{url:path},undefined,true)
      }
    }, this.store.isApiCalled);
  }
  callEnablerFilter(event) {
    if (event.keyword != undefined) {
      this.keyword = event.keyword
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
    if(event != 'funding-profile-match-report' && event !='matching-funding-profiles')  
    this.removeFilter({ isCall: false, rmType: this.FilterType })
    this.ClickFrom = undefined    
      this.setTitle()
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
        if(event.selItem != undefined){
          this.FilterType = event.FilterType
          let subData = JSON.parse(JSON.stringify(event.selItem)) 
          subData.chipLbl=(event.FilterType == 'introductions'?'total_'+event.FilterType:event.FilterType)
          subData.FN_EnablerSlug =null
          this.selItem = {itemData:subData}
        }
      }
    }
  }