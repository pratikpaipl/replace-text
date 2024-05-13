import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { actType, appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { FilterViewComponent } from 'src/widget/filter-view/filter-view.component';

@Component({
  selector: 'fundraise-needs',
  templateUrl: './fundraise-needs.page.html',
  styleUrls: ['./fundraise-needs.page.scss'],
})
export class FundraiseNeedsPage implements OnInit, OnDestroy {

  filteCnt = 0
 
  @Input()
  updateTime = 0 
  @Input()
  selItem: any;
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
  sdgShow = true;
  countryShow = false;
  FundraiseSlug: any = '';
  
  // ImpactThemesAndAreasKey: any = [];
  // SdgIDs: any = '';


  from='admin'
  @ViewChild('content') content: any;
  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {

  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime = this.store.getCurrentTime();
    }
  }
  async ngOnInit() {
    this.keyword = this.store.getFilterFromUrl('keyword', '');
      this.sort =this.store.getFilterFromUrl('sort', this.sort);
      this.pageType = 'fundraise'
  }
  ngOnChanges(): void {

    this.UserSlug = this.store.getFilterFromUrl('UserSlug','')
     this.selItem = {
      itemData :
      {
        UserName:this.UserSlug !=undefined && this.UserSlug!=''?this.store.getFilterFromUrl('ContactName',''):undefined,
        UserSlug:this.UserSlug !=undefined && this.UserSlug!=''?this.UserSlug:undefined,
        chipLbl:this.store.getFilterFromUrl('chipLbl',''),
        displayMode:this.store.getFilterFromUrl('displayMode',''),
        EnablerFilterType:this.store.getFilterFromUrl('FilterType',''),
      }
    }   
  }
  ionViewWillEnter() {    
    this.updateTime = new Date().getTime()
  }

  ngOnDestroy() {
  }

  setFilterCnt() {
    this.filteCnt = this.store.calculateFilter(true,  this.store.getFilterFromUrl('SdgIDs',[]),true, this.store.getFilterFromUrl('EsgKeys',[]), false, [], true,  this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []))
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
      componentProps: { sdgShow: true, esgShow:true,countryShow: false,  impactThemeAreaShow : true, pageFrom: 'admin', segment: this.pageType },   
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
  async removeFilter(event) {
    this.selItem = event.selItem
    if (event != undefined) {
      if(event.rmType == 'users')
      this.UserSlug=''
      if(event.rmType == 'introduction_requested' || event.rmType == 'introduction_requests_received' || event.rmType == 'sent_introduction_requested' || event.rmType == 'receive_introduction_requested'|| event.rmType == 'matched' || event.rmType == 'introductions')
      this.updateTime =new Date().getTime()
    }
  }
  download(event) {
    this.apiService.callDownload(appApi.FNListAdminExcel, '', '',this.store.getFilterFromUrl('keyword',''), this.store.getFilterFromUrl('sort', this.sort),actType.fundraise);
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
    this.setFilterCnt()
  }

  
}
