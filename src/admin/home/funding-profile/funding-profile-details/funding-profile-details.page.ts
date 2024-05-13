import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { actType, permission } from 'src/shared/app.constants';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'funding-profile-details',
  templateUrl: 'funding-profile-details.page.html',
  styleUrls: ['funding-profile-details.page.scss'],
})
export class FundingProfileDetailsPage implements OnInit, OnDestroy {
  
  filteCnt = 0
  updateTime = 0
  
  slug: any = "";
  fundingProfileData: any={EnablerName:'sample'};
  IsIgnore = true;
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
  
  segments = [];
  keyword = ''
  address = ''
  pageType: any = 'funding-profiles';
  pageTypeMeg: any;
  type: any = ''
  public applyFilter: any;
  public subLabel: any;
  public subUpdate: any;
  public subSelectSegment: any;
  public delete: any;
  ClickFrom: any;
  selItem: any;
  callFromListner = false
  
  
  
  
  constructor(public alertController: AlertController,public sanitizer:DomSanitizer, public modalController: ModalController, private route: ActivatedRoute, public store: StorageService, public activatedRoute: ActivatedRoute, public router: Router, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController, public apiService: ApiService, private cdref: ChangeDetectorRef) {
    this.slug = this.activatedRoute.snapshot.paramMap.get('slug')
    this.type = 'funding-profiles'
    this.subUpdate = this.eventService.updateData$.subscribe((item: any) => {
      this.updateTime=new Date().getTime()
   });
    this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
      this.ClickFrom = item.ClickFrom;
      this.selItem = item.item;
      if (this.selItem != undefined) {
      }
      this.pageType = item.action;
    });
    this.delete = this.eventService.deleteData$.subscribe((item: any) => {
      this.callFromListner = true;
      if (item.pageFrom != 'Top')
      this.getDetails();      
    });
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      for (let i = 0; i < this.segments.length; i++) {}
      this.setTitle();
    });
  }
  ngOnDestroy(): void {
    this.applyFilter.unsubscribe();
    this.subLabel.unsubscribe();
    this.subUpdate.unsubscribe();
    
    this.subSelectSegment.unsubscribe();
    this.delete.unsubscribe();
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ionViewWillEnter() {
    this.getDetails();    
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.callFromListner = true;
      this.getDetails()
      this.updateTime = this.store.getCurrentTime();
    }
  }
  async ngOnInit() {
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
      
      this.address = item.address != undefined ? item.address : this.address;
      this.keyword = (item.keyword != undefined) ? item.keyword : this.keyword
      
      this.IsIgnore = (item.IsIgnore != undefined) ? item.IsIgnore : this.IsIgnore
      this.sort = (item.sort != undefined) ? item.sort : this.sort
      this.updateTime = (item.segment != this.pageType) ? item.updateTime : this.updateTime
      
      this.filteCnt = item.filteCnt

      if(this.fundingProfileData !=undefined && item.details != undefined){
        this.fundingProfileData.EnablerValid = item.details != undefined? item.details.EnablerValid:0
        this.fundingProfileData.IsOperative = item.details != undefined? item.details.IsOperative:0
      }

    });

  }
  
  getParamData() {
    return { keyword: this.keyword, sort: this.sort, segment: this.pageType }
  }
  
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
    
  }
  onAdd() {
    if (this.pageType == 'product')
    this.router.navigateByUrl('/admin/brand/' + this.slug + '/product/add');
    if (this.pageType == 'shop-location')
    this.router.navigateByUrl('/admin/map-location/' + this.slug + '/brand/brand_shop_location');
    if (this.pageType == 'label') {
      this.router.navigateByUrl('/admin/map-label-score/' + this.pageType + '/add/brand/' + this.slug + '/brand_label');
    }
    if (this.pageType == 'import-shop-location') {
      this.router.navigateByUrl('/admin/' + this.fundingProfileData.BrandSlug + '/import-location');
    }
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
    if (event != undefined) {
      if (this.selItem != undefined) {
        // this.BrandIDs = await (event.BrandIDs!=undefined || event.BrandIDs ==''?event.BrandIDs:this.BrandIDs)
      }
    }
  }
  getDetails() {
    setTimeout(() => {
      this.apiService.getAdminFundingProfileDetails(this.slug,'','',this.sort, 0,1,permission.add_download_transfer_ownership,actType.funding_profile).subscribe(async response => {
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
            
            // if(this.fundingProfileData.TotalEnablers != undefined && this.fundingProfileData.TotalEnablers != '') 
            // this.fundingProfileForm.push({ title: this.store.getVal('enablers'), class:'',value:this.fundingProfileData.TotalEnablers})
            
            if (!this.callFromListner) {
              this.segments.push({ key: 'profile-form', label:this.store.getVal('profile_form') ,icon:'fa-money-bill-transfer fa-solid'})
              // this.segments.push({ key: 'enablers', label:'Enablers' /*this.store.getVal('settings')*/ })
              // this.segments.push({ key: 'enabler-view', label:'Matchmaking - Enabler View' /*this.store.getVal('settings')*/ })
              // this.segments.push({ key: 'fundraise-view', label:'Matchmaking - Fundraise View' /*this.store.getVal('settings')*/ })
              this.pageType = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : 'profile-form';
              this.callFromListner = false              
            }
            setTimeout(() => {
              if(this.pageType != 'overview' && this.pageType != 'profile-form')
              this.store.scrollToEnd('#tabblings')
            }, 2000);
            setTimeout(() => {     
              if(this.pageType == 'overview' && localStorage.getItem('scroll') != undefined){
                localStorage.removeItem('scroll')
                this.store.scrollToEnd('#tabs_contents');
              }
            }, 500);
            this.setTitle();
      
          }
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
    if (this.ClickFrom == undefined)
    this.removeFilter({ isCall: false, rmType: 'all' })
    this.ClickFrom = undefined
  }
  setTitle() {
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined && this.fundingProfileData !=undefined) {
      this.store.titleCntWithPage(this.store.getVal(this.type)+'-'+this.fundingProfileData.ProfileName, obj.label,this.fundingProfileData);    
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
    this.setFilterCnt()
  }
  clikCount(event) {
    this.pageType = event.action
    if (event.mAction == 'online' || event.mAction == 'shop-location')
    this.selectSort(this.sort)
  }
  
  
}