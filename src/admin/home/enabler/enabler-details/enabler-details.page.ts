import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { actType, appApi } from 'src/shared/app.constants';
import { permission } from 'src/shared/app.constants';
import { FilterViewComponent } from 'src/widget/filter-view/filter-view.component';

@Component({
  selector: 'enabler-details',
  templateUrl: 'enabler-details.page.html',
  styleUrls: ['enabler-details.page.scss'],
})
export class EnablerDetailsPage implements OnInit, OnDestroy {

  filteCnt = 0
  updateTime  = 0

  slug: any = "";
  enablerData: any;
  IsIgnore = true;
  AdminList = [];
  permissionsList = []
  message = '';
  sort = 'recent';
  allTotal = 0;

  segments = [];
  keyword = ''

  pageType: any;
  pageTypeMeg: any;
  EnablerIDs = ''
  type: any = ''
  FNImpactThemesAndAreas: any = []
  FPImpactThemesAndAreas: any = []
  FNFundingType: any = []
  FPFundingType: any = []
  FNSdgs: any = []
  FPSdgs: any = []
  FNEsg: any = []
  FPEsg: any = []

  public applyFilter: any;
  // public applyTabReload: any;
  public enablerUpdate: any;
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
    this.type = 'enablers' 
    this.subUpdate = this.eventService.updateData$.subscribe((item: any) => {
      this.updateTime=new Date().getTime()
      if(item.enabler != undefined){
       this.enablerData = item.enabler
      }
   });
   this.enablerUpdate = this.eventService.enablerUpdate$.subscribe((item: any) => {
     this.callFromListner =true;
     this.getDetails();
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
       let key = this.segments[i].key=='fundraise-needs'?'investees':this.segments[i].key=='funding-profiles'?'investors':this.segments[i].key
       this.segments[i].label = this.store.updateSegmentName(this.segments[i].label,key)
     }
   });
  }

  ionViewDidEnter(){
   this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
     this.updateTime = item.updateTime
     if(this.enablerData !=undefined && item.details != undefined)
       this.enablerData.IsOperative = item.details != undefined? item.details.IsOperative:0
   });
  }
  ionViewDidLeave(){
    if( this.applyFilter != undefined)
    this.applyFilter.unsubscribe()
  }

  ngOnDestroy(): void {
    if(this.enablerUpdate != undefined)
    this.enablerUpdate.unsubscribe()
    if(this.subLabel != undefined)
    this.subLabel.unsubscribe()
    if( this.subUpdate != undefined)
    this.subUpdate.unsubscribe()
    if(this.subSelectSegment != undefined)
    this.subSelectSegment.unsubscribe()
    if( this.delete != undefined)
    this.delete.unsubscribe()
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ionViewWillEnter() {
    this.keyword = this.store.getFilterFromUrl('keyword', '');
    this.sort =this.store.getFilterFromUrl('sort', this.sort);
    // console.log('fromUrl ',localStorage.getItem('fromUrl'))    
  
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.callFromListner = true;
      this.getDetails()
      this.updateTime = this.store.getCurrentTime();
    }
  }
  ngOnInit() {
    this.getDetails();
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
  download($event) {
    let keyword =this.store.getFilterFromUrl('keyword', '');
    let sort =this.store.getFilterFromUrl('sort', this.sort);
    
    if(this.pageType == 'fundraise-needs') {
      this.apiService.callDownload(appApi.EnablerFundraiseListAdminExcel, 'EnablerSlug', this.slug, keyword,sort, actType.fundraise_enabler,undefined,undefined,undefined,undefined,undefined,this.store.getFilterFromUrl('ImpactThemesAndAreasKey',[]),this.store.getFilterFromUrl('SdgIDs',[]),this.store.getFilterFromUrl('EsgKeys', []));
    } else if(this.pageType == 'funding-profiles') {
      this.apiService.callDownload(appApi.EnablerFundingProfileListAdminExcel, 'EnablerSlug', this.slug, keyword,this.sort, actType.funding_profile_enabler,undefined,undefined,undefined,undefined,undefined,this.store.getFilterFromUrl('ImpactThemesAndAreasKey',[]),this.store.getFilterFromUrl('SdgIDs',[]),this.store.getFilterFromUrl('EsgKeys', []));
    } else if(this.pageType == 'permissions') {
      this.apiService.callDownload(appApi.permissionListExcel, 'PageSlug', this.slug, keyword, sort, actType.enabler_permission,'','','','','','','','','transfer_ownership,add_page_user,download_page_user');
    }
    
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
      this.router.navigateByUrl('/admin/' + this.enablerData.BrandSlug + '/import-location');
    }
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
        this.EnablerIDs = await (event.EnablerIDs != undefined || event.EnablerIDs == '' ? event.EnablerIDs : this.EnablerIDs)
        this.selItem = await event.selItem;
        if (event.isCall) {
          this.updateTime = new Date().getTime();
        }
      }
    }
  }
  getDetails() {
    setTimeout(() => {
      this.apiService.getAdminEnablerDetails(this.slug,'','',this.sort, 0,1,permission.add_download_transfer_ownership,actType.enabler).subscribe(async response => {
        let res: any = response;
        // let res = this.store.getReponseData(response)
        if (res.success) {
          if(!this.callFromListner)
          this.updateTime = new Date().getTime()
          if (!this.callFromListner)
            this.segments = [];
          if (res.data.detail == undefined) {
            this.message = res.message
            this.pageType = ''
          } else {
            this.enablerData = res.data.detail;
            this.EnablerIDs = this.enablerData.EnablerID;
            this.FNImpactThemesAndAreas = this.enablerData.FNImpactThemesAndAreas != undefined && this.enablerData.FNImpactThemesAndAreas != ''?JSON.parse(this.enablerData.FNImpactThemesAndAreas):[]
            this.FNEsg = this.enablerData.FNEsg != undefined && this.enablerData.FNEsg != ''?JSON.parse(this.enablerData.FNEsg):[]
            this.FPImpactThemesAndAreas = this.enablerData.FPImpactThemesAndAreas != undefined && this.enablerData.FPImpactThemesAndAreas != ''?JSON.parse(this.enablerData.FPImpactThemesAndAreas):[]
            this.FPEsg = this.enablerData.FPEsg != undefined && this.enablerData.FPEsg != ''?JSON.parse(this.enablerData.FPEsg):[]

            this.FNFundingType = this.enablerData.FNFundingType != undefined && this.enablerData.FNFundingType != ''?JSON.parse(this.enablerData.FNFundingType):[]
            this.FPFundingType = this.enablerData.FPFundingType != undefined && this.enablerData.FPFundingType != ''?JSON.parse(this.enablerData.FPFundingType):[]

            this.FNSdgs = this.enablerData.FNSdgs !=undefined && this.enablerData.FNSdgs != ''?JSON.parse(this.enablerData.FNSdgs):[]
            this.FPSdgs = this.enablerData.FPSdgs !=undefined && this.enablerData.FPSdgs != ''?JSON.parse(this.enablerData.FPSdgs):[]
            if (!this.callFromListner) {
              
              this.segments.push({ key: 'overview', label: this.store.getVal('overview'), icon: 'fa-solid fa-vector-square' })
              this.segments.push({ key: 'funding-profiles', label: this.store.getVal('investors'), icon: 'fa-rocket fa-solid' })
              this.segments.push({ key: 'fundraise-needs', label: this.store.getVal('investees'), icon: 'fa-money-bill-transfer fa-solid' })
              this.segments.push({ key: 'settings', label: this.store.getVal('visbility_settings'), icon: 'fa-solid fa-gear' })
              this.segments.push({ key: 'data-setup', label: this.store.getVal('data_setup'), icon: 'fa-solid fa-list-check' })
              this.segments.push({ key: 'form-configuration', label: this.store.getVal('form_configuration'), icon: 'fa-solid fa-sliders' })
              this.segments.push({ key: 'permissions', label: this.store.getVal('permissions'), icon: 'fa-solid fa-user-shield' })
              this.pageType = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : 'overview';
              this.callFromListner = false
            }
            
            this.setTitle()
          }
          if(localStorage.getItem('fromUrl') != undefined){
            localStorage.removeItem('fromUrl')
          }else{
            setTimeout(() => {
              if(this.pageType != 'overview')
              this.store.scrollToEnd('#tabblings')            
            }, 2000);
            setTimeout(() => { 
              if(this.pageType == 'overview' && localStorage.getItem('scroll') != undefined){
                localStorage.removeItem('scroll')
                this.store.scrollToEnd('#tabs_contents');
              }
            }, 500);
          }
        } else {
          this.message = res.message
        }
      });
    }, this.store.isApiCalled);
  }
  setTitle() {
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined && this.enablerData != undefined) {
      this.store.titleCntWithPage(this.enablerData.EnablerName,obj.label,this.enablerData)
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

    if (this.ClickFrom == undefined)
      this.removeFilter({ isCall: false, rmType: 'all' })
    this.ClickFrom = undefined
    this.setTitle();
  }
  openFilter(event) {
    if (event != undefined) {
      this.openFilterView()
    }
  }
  async openFilterView() {
    let data = { sdgShow: true,esgShow:true,countryShow: false, impactThemeAreaShow : true,
      FundingProviderTypeShow:false,MinimumTicketSizeShow:false,FundingTypeShow:false,FundingStageShow:false,EnablerShow:false, GenderLensShow:false,pageFrom: 'admin',from:'admin', segment: this.pageType  };
    const modal = await this.modalController.create({
      component: FilterViewComponent,
      cssClass: "modal-save-filter",
      componentProps: data,
    });
    await modal.present();
    await modal.onDidDismiss().then((data) => {
    });
  }
  setFilterCnt() {
    this.filteCnt = this.store.calculateFilter(true, this.store.getFilterFromUrl('SdgIDs', []),true, this.store.getFilterFromUrl('EsgKeys', []), false, [], true, this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []))
  }
  updateCount(event) {
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
  updateSettings(event){    
    if(event != undefined && event.IsPublish != undefined){
      this.enablerData.IsPublish = event.IsPublish?'1':'0'
    }
  }
  clikCount(event) {
     if(event.itemData!=undefined && event.itemData.EnablerFilterType !=undefined){
      let subData = {chipLbl:event.itemData.chipLbl,EnablerFilterType:event.itemData.EnablerFilterType,EnablerSlug:event.itemData.EnablerSlug,EnablerName:event.itemData.EnablerName,extraType:event.action}
      localStorage.setItem('state',JSON.stringify(subData))
      this.store.navigatePage(['admin'],event.itemData.extraType)
    }else if(event !=undefined && event.action !=undefined)
    this.pageType = event.action
  }

}