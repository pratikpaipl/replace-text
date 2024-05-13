import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { actType, appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { FilterViewComponent } from 'src/widget/filter-view/filter-view.component';

@Component({
  selector: 'enabler',
  templateUrl: './enabler.page.html',
  styleUrls: ['./enabler.page.scss'],
})
export class EnablerPage implements OnInit, OnDestroy {

  filteCnt = 0
  @Input()
  updateTime = 0
  @Input()
  apiEnd: any='enabler/valid_explorer_list_admin';
  @Input()
  selItem: any;
  isShow = false;
  permissions = []
  allTotal = 0;
  keyword = '';
  sort = 'recent';

  pageType = '';
  sdgShow = true;
  countryShow = true;
  impactThemeAreaShow = true;

  from='admin'
  private subSelectSegment: any;

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('content') content: any;
  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {

    this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
      if (item.pageFrom == "admin" && item.filterItem != undefined) {
        this.selItem = item;
        this.updateTime = new Date().getTime();
      }
  });
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime = this.store.getCurrentTime();
    }
  }
  async ngOnInit() {
    this.keyword = this.store.getFilterFromUrl('keyword', '');
    this.sort = this.store.getFilterFromUrl('sort', 'recent');
    this.pageType = 'enablers'
    this.setFilterCnt();
  }
  ionViewDidEnter(){
    
  }
  ionViewDidLeave(){

  }
  ngOnDestroy() {
    if( this.subSelectSegment != undefined)
    this.subSelectSegment.unsubscribe()
  }
  setFilterCnt() {
    this.filteCnt = this.store.calculateFilter(true, this.store.getFilterFromUrl('SdgIDs', []),true, this.store.getFilterFromUrl('EsgKeys', []),  true, this.store.getFilterFromUrl('countryOfEnabler',[]), true, this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []))
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
      componentProps: { sdgShow: true, esgShow:true, countryShow: true, impactThemeAreaShow : true, pageFrom: 'admin', segment: this.pageType }
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
    this.apiService.callDownload(appApi.EnablerListAdminExcel, '', '', this.keyword, this.store.getFilterFromUrl('sort', 'recent'), actType.enabler,'','','','',this.store.getFilterFromUrl('countryOfEnabler', []),this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []),this.store.getFilterFromUrl('SdgIDs', []),this.store.getFilterFromUrl('EsgKeys', []));
  }

  selectSort(event) {
    if (event != undefined) {
      this.sort = event
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
      this.change.emit({ itemData: event.event.itemData,action:event.event.action })
    }
    this.setFilterCnt();
  }
}
