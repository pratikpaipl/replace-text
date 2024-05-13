import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { actType } from 'src/shared/app.constants';
import { permission } from 'src/shared/app.constants';
import * as moment from 'moment';

@Component({
  selector: 'fundraise-needs-details',
  templateUrl: 'fundraise-needs-details.page.html',
  styleUrls: ['fundraise-needs-details.page.scss'],
})
export class FundraiseNeedsDetailsPage implements OnInit, OnDestroy {

  filteCnt = 0
  updateTime = 0

  slug: any = "";
  FundraiseData: any;
  IsIgnore = true;
  AdminList = [];

  fundraiseForm = []
  permissionsList = []
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
  pageType: any;
  pageTypeMeg: any;
  ReferenceValueJsonData: any = [];
  FundraiseNeedsCriteriaJsonData: any = [];
  FundingProfilesCriteriaJsonData: any = [];
  FundraiseUID = ''
  type: any = ''
  public applyFilter: any;
  public subscription: any;
  public subLabel: any;
  public subUpdate: any;
  public subSelectSegment: any;
  public delete: any;
  ClickFrom: any;
  selItem: any;
  callFromListner = false
  constructor(public alertController: AlertController, public modalController: ModalController, private route: ActivatedRoute, public store: StorageService, public activatedRoute: ActivatedRoute, public router: Router, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController, public apiService: ApiService, private cdref: ChangeDetectorRef) {
    this.slug = this.activatedRoute.snapshot.paramMap.get('slug')
    this.type = 'fundraise'
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
      for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].label = this.store.updateSegmentName(this.segments[i].label,this.segments[i].key)
      }
      this.setTitle()
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
      if(this.FundraiseData !=undefined && item.details != undefined){
        this.FundraiseData.EnablerValid = item.details != undefined? item.details.EnablerValid:0
        this.FundraiseData.IsOperative = item.details != undefined? item.details.IsOperative:0
      }

      this.filteCnt = item.filteCnt
    });
  }

  getParamData() {
    return {
      address: this.address, keyword: this.keyword, sort: this.sort, pageFrom: 'admin', segment: this.pageType, FundraiseUID : this.FundraiseUID, IsIgnore: this.IsIgnore, type: "savelbl"
    }
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
    
  }
  onAction(type) {
    if (type == '1') {
      this.router.navigateByUrl('/admin/enabler/' + this.slug + '/permission/add');
    } else {
      this.router.navigateByUrl('/admin/enabler/' + this.slug + '/permission/transfer-ownership');
    }
  }
  async removeFilter(event) {
    if (event != undefined) {
      if (this.selItem != undefined) {
        this.selItem = await event.selItem;
      }
    }
  }
  getDetails() {
    setTimeout(() => {
      this.apiService.getAdminFundraiseDetails(this.slug,'','',this.sort, 0,1,permission.add_download_transfer_ownership,actType.fundraise).subscribe(async response => {
        let res: any = response;
        // let res = this.store.getReponseData(response)
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
            
            this.FundraiseNeedsCriteriaJsonData = (this.FundraiseData.FundraiseNeedsCriteriaJsonData != undefined?JSON.parse(this.FundraiseData.FundraiseNeedsCriteriaJsonData):[]);
            this.FundingProfilesCriteriaJsonData = (this.FundraiseData.FundingProfilesCriteriaJsonData != undefined?JSON.parse(this.FundraiseData.FundingProfilesCriteriaJsonData):[]);
            if (!this.callFromListner) {
              this.segments.push({ key: 'fundraise-form', label:this.store.getVal('fundraise_form'),icon:'fa-brands fa-space-awesome'})
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

    if (this.ClickFrom == undefined)
      this.removeFilter({ isCall: false, rmType: 'all' })
    this.ClickFrom = undefined
    
  }
  setTitle() {
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined && this.FundraiseData != undefined) {
        this.store.titleCntWithPage(this.store.getVal(this.type)+'-'+this.FundraiseData.CompanyName, obj.label,this.FundraiseData);
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