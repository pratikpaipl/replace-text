import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { actType, appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { FilterViewComponent } from 'src/widget/filter-view/filter-view.component';

@Component({
  selector: 'suggested-enabler',
  templateUrl: './suggested-enabler.page.html',
  styleUrls: ['./suggested-enabler.page.scss'],
})
export class SuggestedEnablerPage implements OnInit, OnDestroy {

  filteCnt = 0
  @Input()
  updateTime = 0
  @Input()
  extraTitle: any=false;
  @Input()
  apiEnd: any;
  @Input()
  UserSlug: any='';
  @Input()
  EnablerFilterType: any;

  isShow = false;
  permissions = []
  allTotal = 0;
  keyword = '';
  sort = 'recent';
  pageType = '';
  @Input()
  titleType = 'funding_profiles';
  sdgShow = true;
  countryShow = true;
  impactThemeAreaShow = true;

  from='admin'
  // private subSelectSegment: any;
  
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {


    // this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
    //   if (item.pageFrom == "admin" && item.filterItem != undefined) {
    //     this.updateTime = new Date().getTime();       
    //   }
    // });
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime =new Date().getTime()
    }
  }
  async ngOnInit() {
    this.pageType = 'enabler'    
  }
  ngOnChanges(): void {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', this.sort);
    this.EnablerFilterType = this.store.getFilterFromUrl('EnablerFilterType','')
    this.UserSlug = this.store.getFilterFromUrl('UserSlug','')
  }
  ngOnDestroy() {
    // this.subSelectSegment.unsubscribe();
  }
  setFilterCnt() {
    this.filteCnt = this.store.calculateFilter(true, this.store.getFilterFromUrl('SdgIDs', []),true, this.store.getFilterFromUrl('EsgKeys', []), true,this.store.getFilterFromUrl('countryOfEnabler', []), true, this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []))
  }
  openFilter(event) {
    if (event != undefined) {
      this.openFilterView()
    }
  }
  async openFilterView() {
    const modal = await this.modalController.create({
      component: FilterViewComponent,
      cssClass: 'modal-save-filter',
      componentProps: { sdgShow: true, esgShow:true, countryShow: false, impactThemeAreaShow : true,pageFrom: 'admin', segment: this.pageType },
      // backdropDismiss: false,
      // showBackdrop:true,
      // swipeToClose:true,
      // canDismiss:true
    },);
    
    await modal.present();
    await modal.onDidDismiss().then((data) => {
    });
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
  download(event) {
    this.apiService.callDownload(appApi.FPListAdminExcel, 'UserSlug', this.UserSlug, this.keyword, this.sort,actType.funding_profile);
  }

  selectSort(event) {
    if (event != undefined) {
      this.sort = event;
      this.updateTime =new Date().getTime()
    }
  }

  updateCount(event) {
    if (event.count != undefined) {
      this.allTotal = event.count
    }
    if (event.permissions != undefined) {
      this.permissions = event.permissions
    }
    if(event !=undefined && event.event !=undefined) {
      localStorage.setItem('state',JSON.stringify(event.event.itemData))
      this.store.navigatePage(['user'], event.event.action)
    }
    
    this.setFilterCnt()
  }

  
}
