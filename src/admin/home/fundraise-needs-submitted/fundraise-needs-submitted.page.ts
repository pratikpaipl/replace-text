import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { actType, appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { FilterViewComponent } from 'src/widget/filter-view/filter-view.component';

@Component({
  selector: 'fundraise-needs-submitted',
  templateUrl: './fundraise-needs-submitted.page.html',
  styleUrls: ['./fundraise-needs-submitted.page.scss'],
})
export class FundraiseNeedsSubmittedPage implements OnInit, OnDestroy {

  filteCnt = 0
  @Input()
  updateTime = 0
  @Input()
  selItem: any;
  @Input()
  UserSlug: any='';

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
  @ViewChild('content') content: any;
  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {
    this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
      if (item.pageFrom == "admin" && item.filterItem != undefined) {
        this.selItem = item;
      }
  });
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime = this.store.getCurrentTime();
    }
  }
  async ngOnInit() {
    this.sort = await this.store.getFilterFromUrl('sort', this.sort);
    this.keyword = await this.store.getFilterFromUrl('keyword', '');
    this.pageType = 'fundraise-need'
  }
  ngOnChanges(): void {
      this.UserSlug = this.store.getFilterFromUrl('UserSlug','')
      this.selItem = {
        itemData :
        {
          UserName: this.UserSlug !=undefined && this.UserSlug!=''?this.store.getFilterFromUrl('ContactName',''):undefined,
          UserSlug: this.UserSlug !=undefined && this.UserSlug!=''?this.UserSlug:undefined,
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
    this.subSelectSegment.unsubscribe();
  }

  setFilterCnt() {
    this.filteCnt = this.store.calculateFilter(true, this.store.getFilterFromUrl('SdgIDs', []),true, this.store.getFilterFromUrl('EsgKeys', []), false, [], true, this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []))
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
      componentProps: { sdgShow: true, esgShow:true, countryShow: false , impactThemeAreaShow : true,pageFrom: 'admin', segment: this.pageType },   
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
      if(event.rmType == 'users'){
        this.UserSlug=''
      }
      if(event.rmType == 'introduction_requested' || event.rmType == 'introduction_requests_received' || event.rmType == 'sent_introduction_requested' || event.rmType == 'receive_introduction_requested'|| event.rmType == 'matched' || event.rmType == 'introductions')
      this.updateTime =new Date().getTime()
    }
  }

  download(event) {
    let keyword = this.store.getFilterFromUrl('keyword', '')
    let sort = this.store.getFilterFromUrl('sort', 'recent')
    let countryOfEnabler = this.pageType == 'enablers'? this.store.getFilterFromUrl('countryOfEnabler',[]):'';
    let ImpactThemesAndAreasKey = this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []);
    let SdgIDs = this.store.getFilterFromUrl('SdgIDs',[]);
    let EsgKeys = this.store.getFilterFromUrl('EsgKeys',[]);
    this.apiService.callDownload(appApi.FNsubmittedAtEnablersListAdminExcel, '', '', keyword,sort, actType.fundraise_enabler,undefined,undefined,undefined,undefined,undefined,ImpactThemesAndAreasKey,SdgIDs,EsgKeys);
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
