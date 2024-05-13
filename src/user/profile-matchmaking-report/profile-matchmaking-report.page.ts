import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { actType, appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'profile-matchmaking-report',
  templateUrl: './profile-matchmaking-report.page.html',
  styleUrls: ['./profile-matchmaking-report.page.scss'],
})
export class ProfileMatchmakingReportPage implements OnInit, OnDestroy {

  filteCnt = 0
  @Input()
  updateTime = 0
  @Input()
  pageTitle:any=''
  @Input()
  selItem: any;
  @Input()
  pageType = '';
  @Input()
  openFront:any = '0';
  isShow = false;
  permissions = []
  allTotal = 0;
  keyword = '';
  sort = 'recent';
  @ViewChild('content') content: any;
  EnablerSlug=''
  
  isShowMsg = false;
  isShowField = false;
  fullreport = [];
  PermissionTextKey = [];
  limit = 20;
  EnablerTotal = 0;

  @Input()
  FN_EnablerSlug:any=''
  @Input()
  FP_EnablerSlug:any=''
  @Input()
  pageFrom:any='profile'

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {

  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime =new Date().getTime()
    }
  }
  ngOnInit() {
    this.FN_EnablerSlug = (this.selItem !=undefined && this.selItem.itemData.FN_EnablerSlug !=undefined)?this.selItem.itemData.FN_EnablerSlug:''
    this.FP_EnablerSlug = (this.selItem !=undefined && this.selItem.itemData.FP_EnablerSlug !=undefined)?this.selItem.itemData.FP_EnablerSlug:''
    // this.getReport(false, "");
  }
  ngOnDestroy(): void {
  }
  setFilterCnt() {
    
  }
  openFilter(event) {
    if (event != undefined) {
      this.openFilterView()
    }
  }
  async openFilterView() {
   
  }
  callBrandFilter(event) {
    if (event.filter != undefined && event.filter == '1') {
      this.openFilterView();
    } else if (event.keyword != undefined) {
      this.keyword = event.keyword
      this.updateTime = new Date().getTime()
    }
  }
  getParamData() {
    return { keyword: this.keyword, sort: this.sort, segment: this.pageType }
  }
  download(event) {
    this.apiService.callDownload(appApi.myFPMatchReportExcel, 'FN_EnablerSlug',this.FN_EnablerSlug != undefined?this.FN_EnablerSlug:'', this.keyword, this.sort, actType.funding_profile_enabler);
  }

  selectSort(event) {
    if (event != undefined) {
      this.sort = event;
      this.updateTime = new Date().getTime()
    }
  }
  async removeFilter(event) {
    this.selItem = event.selItem
    if (event != undefined) {
      this.FN_EnablerSlug=''
      this.FP_EnablerSlug=''
      this.eventService.publishRemoveData({FN_EnablerSlug:'',FP_EnablerSlug:''});
    }
  }
  updateCount(event) {
    if(event !=undefined && event.event !=undefined) {
      this.change.emit({ itemData: event.event,action:'full-report' })
    }
    if (event.count != undefined) {
      this.allTotal = event.count
    }
  }
}
