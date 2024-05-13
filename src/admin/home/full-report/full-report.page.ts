import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'full-report',
  templateUrl: './full-report.page.html',
  styleUrls: ['./full-report.page.scss'],
})
export class FullReportPage implements OnInit, OnDestroy {

  filteCnt = 0
  @Input()
  updateTime: any;
  @Input()
  selItem: any;
  @Input()
  pageType = 'full_report';
  isShow = false;
  permissions = []
  allTotal = 0;
  keyword = '';
  sort = 'recent';
  private delete: any;
  @ViewChild('content') content: any;
  
  isShowMsg = false;
  isShowField = false;
  fullreport = [];
  PermissionTextKey = [];
  limit = 20;
  EnablerTotal = 0;
  
  @Input()
  UserSlug=''
  @Input()
  EnablerSlug=''
  @Input()
  FN_EnablerSlug:any=''
  @Input()
  FP_EnablerSlug:any=''
  @Input()
  EnablerFilterType:any=''
  
  displayMode:any=1
  isProfile:any=true

  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {
  
    this.router.events.subscribe((evt:any) => {
      if (evt instanceof NavigationEnd) {
        if(evt.url.includes(this.pageType)){
          this.dataChange()
          if( (new Date().getTime() - this.updateTime)>50){
            this.updateTime = new Date().getTime();
          }
        }
      }
    });
    this.delete = this.eventService.deleteData$.subscribe((item: any) => {
      this.updateTime = new Date().getTime();
    });
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime = new Date().getTime()
    }
  }
  ngOnInit() {
    this.FN_EnablerSlug = (this.selItem !=undefined && this.selItem.itemData.FN_EnablerSlug !=undefined)?this.selItem.itemData.FN_EnablerSlug:''
    this.FP_EnablerSlug = (this.selItem !=undefined && this.selItem.itemData.FP_EnablerSlug !=undefined)?this.selItem.itemData.FP_EnablerSlug:''
    this.EnablerSlug = (this.selItem !=undefined && this.selItem.itemData.EnablerSlug !=undefined)?this.selItem.itemData.EnablerSlug:''
    this.UserSlug = (this.selItem !=undefined && this.selItem.itemData.UserSlug !=undefined)?this.selItem.itemData.UserSlug:''
    this.EnablerFilterType = (this.selItem !=undefined && this.selItem.itemData.EnablerFilterType !=undefined)?this.selItem.itemData.EnablerFilterType:''
    this.updateTime = (this.updateTime == undefined || this.updateTime==0)?new Date().getTime():this.updateTime
  }
  ngOnChanges(): void {
    this.dataChange()
  }
  dataChange() {
    this.EnablerFilterType =this.store.getFilterFromUrl('FilterType','')
    this.EnablerSlug = this.store.getFilterFromUrl('EnablerSlug','')
    this.FN_EnablerSlug =this.store.getFilterFromUrl('FN_EnablerSlug','')
    this.FP_EnablerSlug =this.store.getFilterFromUrl('FP_EnablerSlug','')
    this.isProfile = this.store.getFilterFromUrl('isProfile',this.isProfile)==1
    this.displayMode = parseInt(this.store.getFilterFromUrl('displayMode',this.displayMode))

    this.UserSlug =this.store.getFilterFromUrl('UserSlug','')
     this.selItem =  {itemData : {
      UserName:this.UserSlug !=undefined && this.UserSlug!=''?this.store.getFilterFromUrl('ContactName',''):undefined,
      UserSlug:this.UserSlug !=undefined && this.UserSlug!=''?this.UserSlug:undefined,
      chipLbl:this.store.getFilterFromUrl('chipLbl',''),
      EnablerSlug:this.EnablerSlug!= undefined && this.EnablerSlug != ''?this.EnablerSlug:undefined,
      EnablerName: this.EnablerSlug!= undefined && this.EnablerSlug != ''? (this.store.getFilterFromUrl('EnablerName','')):undefined,
      ProfileName:this.store.getFilterFromUrl('ProfileName',''),
      CompanyName:this.store.getFilterFromUrl('CompanyName',''),
      ReferenceCode:this.store.getFilterFromUrl('ReferenceCode',''),
      FP_EnablerSlug:this.FP_EnablerSlug!= undefined && this.FP_EnablerSlug != ''?this.FP_EnablerSlug:undefined,
      FN_EnablerSlug:this.FN_EnablerSlug != undefined && this.FN_EnablerSlug != ''?this.FN_EnablerSlug:undefined,
      displayMode:this.displayMode,
      EnablerFilterType:this.EnablerFilterType,
     }
    }
  }
  ionViewDidEnter(){

  }
  ionViewDidLeave(){
   
  }
  ngOnDestroy() {
    if(this.delete != undefined)
    this.delete.unsubscribe()
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
  
  getParamData() {
    return { segment: this.pageType }
  }
  download(event) {    
    this.apiService.callDownload(appApi.fullReportAdminExcel, 'FP_EnablerSlug', this.FP_EnablerSlug, this.keyword,this.sort, '','FN_EnablerSlug',this.FN_EnablerSlug,'EnablerSlug',this.EnablerSlug,undefined,undefined,undefined,undefined,undefined,'UserSlug',this.UserSlug);
  }
  callBrandFilter(event) {
    if (event.filter != undefined && event.filter == '1') {
      this.openFilterView();
    } else if (event.keyword != undefined) {
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
  async removeFilter(event) {
    this.selItem = event.selItem
    if (event != undefined) {
      this.FN_EnablerSlug=''
      this.FP_EnablerSlug=''
      if(event.rmType == 'enablers'){
        this.EnablerSlug=''
      }
      if(event.rmType == 'users'){
        this.UserSlug=''        
      }
      if(event.rmType == 'introduction_requested' || event.rmType == 'sent_introduction_requested' || event.rmType == 'introduction_requests_received' || event.rmType == 'receive_introduction_requested' || event.rmType == 'matched' || event.rmType == 'introductions')
      this.EnablerFilterType=''
      this.updateTime =new Date().getTime()
      // this.eventService.publishRemoveData({FN_EnablerSlug:'',FP_EnablerSlug:''});
    }
  }
  updateCount(event) {
    if (event.count != undefined) {
      this.allTotal = event.count
    } 
    if (event.permissions != undefined) {
      this.permissions = event.permissions
    }
  }
}
