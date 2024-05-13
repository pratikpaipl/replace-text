import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { actType, appApi, permission } from 'src/shared/app.constants';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'profile-submissions-details',
  templateUrl: 'profile-submissions-details.page.html',
  styleUrls: ['profile-submissions-details.page.scss'],
})
export class ProfileSubmissionDetailsPage implements OnInit, OnDestroy {

  filteCnt = 0
  updateTime = 0
  parent:any=''
  slug: any = "";
  fundingProfileData: any;
  AdminList = [];
  permissionsList = []
  fundingProfileForm = []
  message = '';
  sort = 'recent';
  allTotal = 0;
  ImpactThemesAndAreas: any = []
  FundingType: any = []
  Sdgs: any = []
  Esg: any = []

  ImpactThemesAndAreasKey: any = []
  SdgIDs: any = []

  segments = [];
  keyword = ''
  FilterType = ''
  // address = ''
  pageType: any = 'funding-profile';
  pageTypeMeg: any;
  type: any = ''
  public applyFilter: any;
  public changeRel: any;
  public subscription: any;
  public subLabel: any;
  public subUpdate: any;
  public subSelectSegment: any;
  public delete: any;
  ClickFrom: any;
  selItem: any;
  displayMode: any=1;
  callFromListner = false
  constructor(public alertController: AlertController,public modalController: ModalController, private route: ActivatedRoute, public store: StorageService, public router: Router, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController,private cookieService: CookieService, public apiService: ApiService, private cdref: ChangeDetectorRef) {
    this.parent = this.route.snapshot.paramMap.get('parent')
    this.slug = this.route.snapshot.paramMap.get('slug')
    this.type = 'funding-profile'
    this.subUpdate = this.eventService.updateData$.subscribe((item: any) => {
      this.updateTime=new Date().getTime()
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

    this.changeRel = this.eventService.fundingProfileRel$.subscribe(async (item: any) => {
      if(item !=undefined){
        this.callFromListner = false;
        this.getDetails();
      }          
    });
  }
  ngOnDestroy(): void {
    this.changeRel.unsubscribe();
    this.applyFilter.unsubscribe();
    this.subLabel.unsubscribe();
    this.subUpdate.unsubscribe();
    this.delete.unsubscribe();
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ionViewWillEnter() {
    this.keyword = this.store.getFilterFromUrl('keyword', '');
    this.sort =  this.store.getFilterFromUrl('sort', this.sort)
    this.setParamDatas()
    this.getDetails();
  }
  setParamDatas() {
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
  async ngOnInit() {
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
      // this.keyword = this.store.getFilterFromUrl('keyword', '');
      this.sort =  this.store.getFilterFromUrl('sort', this.sort)
      if(this.fundingProfileData !=undefined && item.details != undefined){        
        this.fundingProfileData.IsOperative = item.details != undefined? item.details.IsOperative:0
        this.fundingProfileData.EnablerValid = item.details != undefined? item.details.EnablerValid:0
        this.fundingProfileData.TotalReceivedInterest = item.details.TotalReceivedInterest != undefined? item.details.TotalReceivedInterest:0
        this.fundingProfileData.TotalExpressedInterest = item.details.TotalExpressedInterest != undefined? item.details.TotalExpressedInterest:0
        this.fundingProfileData.TotalFundraiseNeed = item.details.TotalFundraiseNeed != undefined? item.details.TotalFundraiseNeed:0
        this.fundingProfileData.TotalMatchingFundraiseNeeds = item.details.TotalMatchingFundraiseNeeds != undefined? item.details.TotalMatchingFundraiseNeeds:0
      }
      
      this.filteCnt = item.filteCnt
      this.updateTime = item.updateTime
    });
    this.store.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.store.isLogin){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      this.store.userData = datas;
    }
  }
  setTitle(){
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined && this.fundingProfileData != undefined) {
      this.store.titleCntWithPage(this.store.getVal('submitted_funding_profiles')+'-'+this.fundingProfileData.ReferenceCode, obj.label,this.fundingProfileData);
    }
  }
  download($event) {
    this.apiService.callDownload(appApi.fundraiseReportListAdminExcel, 'FP_EnablerSlug', this.fundingProfileData.FP_EnablerSlug, this.keyword, this.sort, actType.funding_profile_fundraise,'FilterType',this.FilterType);    
  }
  onAdd(){}
  onAction(type) {
    if (type == '1') {
      this.router.navigateByUrl('/admin/enabler/' + this.slug + '/permission/add');
    } else {
      this.router.navigateByUrl('/admin/enabler/' + this.slug + '/permission/transfer-ownership');
    }
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.callFromListner = true;
      this.getDetails()
      this.updateTime = this.store.getCurrentTime();
    }
  }
  async removeFilter(event) {
    this.selItem = event.selItem
    if (event != undefined) {
      if(event.rmType == 'introduction_requested' || event.rmType == 'introduction_requests_received' || event.rmType == 'sent_introduction_requested' || event.rmType == 'receive_introduction_requested'|| event.rmType == 'matched' || event.rmType == 'introductions')
      this.FilterType=''
      // this.updateTime =new Date().getTime()
    }
  }
  getDetails() {
    setTimeout(() => {
      let path = window.location.href.replace(window.location.origin,'')
      if(this.cookieService.check(environment.cookiesKey)){
        this.apiService.myFundingProfileSubmittedDetails(this.slug,'',this.sort, 0,1,permission.add_download_transfer_ownership,actType.funding_profile_enabler).subscribe(async response => {
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
              
              this.ImpactThemesAndAreas = this.fundingProfileData.ImpactThemesAndAreasJson != undefined && this.fundingProfileData.ImpactThemesAndAreasJson != ''?JSON.parse(this.fundingProfileData.ImpactThemesAndAreasJson):[]

              this.Esg = this.fundingProfileData.EsgJson != undefined && this.fundingProfileData.EsgJson != ''?JSON.parse(this.fundingProfileData.EsgJson):[]

              this.FundingType = this.fundingProfileData.FundingTypeJson != undefined && this.fundingProfileData.FundingTypeJson != ''?JSON.parse(this.fundingProfileData.FundingTypeJson):[]
              this.Sdgs = this.fundingProfileData.SdgsJson != undefined && this.fundingProfileData.SdgsJson != ''?JSON.parse(this.fundingProfileData.SdgsJson):[]
              
              this.fundingProfileData.CreatedTs = (this.fundingProfileData.CreatedTs != undefined && this.fundingProfileData.CreatedTs != '')?moment(this.fundingProfileData.CreatedTs).format('DD MMM yyyy'):''
              this.fundingProfileData.ModifiedTs = (this.fundingProfileData.ModifiedTs != undefined && this.fundingProfileData.ModifiedTs != '')?moment(this.fundingProfileData.ModifiedTs).format('DD MMM yyyy'):''
              
              if (!this.callFromListner) {
                this.segments.push({ key: 'profile-form', label:this.store.getVal('investment_criteria'),icon:'fa-money-bill-transfer fa-solid'})

                this.segments.push({ key: 'fundraise-need-match-report', label:this.store.getVal('matched_fundraise_needs'),icon:'fa-infinity fa-solid'})
                // this.segments.push({ key: 'matched-fundraise-needs', label:this.store.getVal('matched_fundraise_needs'),icon:'fa-infinity fa-solid'})
                this.pageType = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : 'profile-form';
                this.callFromListner = false
              }
              setTimeout(() => {
                if(this.pageType != 'overview' && this.pageType != 'profile-form')
                this.store.scrollToEnd('#tabblings')
              }, 2000);
              setTimeout(() => {     
                if((this.pageType == 'overview' || this.pageType =='profile-form') && localStorage.getItem('scroll') != undefined){
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
    if(event != 'fundraise-need-match-report' && event != 'matched-fundraise-needs')  
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
      this.fundingProfileData.TotalExpressedInterest = event.TotalExpressedInterest
    }
    this.setFilterCnt()
  }
  clikCount(event) {
    if(event !=undefined && event.action !=undefined){
      this.pageType = event.action
      // this.setParamDatas()
      if(event.selItem != undefined){
        this.FilterType = event.FilterType
        let subData = JSON.parse(JSON.stringify(event.selItem)) 
        subData.chipLbl=(event.FilterType == 'introductions'?'total_'+event.FilterType:event.FilterType)
        subData.FP_EnablerSlug =null
        this.selItem = {itemData:subData}
      }
    }
  }


}