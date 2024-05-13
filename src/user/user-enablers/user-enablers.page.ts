import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { appApi, permission } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'user-enablers',
  templateUrl: './user-enablers.page.html',
  styleUrls: ['./user-enablers.page.scss'],
})
export class UserEnablers implements OnInit, OnDestroy {

  filteCnt = 0
  displayMode = 1
  @Input()
  updateTime: any=0;
  @Input()
  selItem: any;
  @Input()
  EnablerFilterType: any;
  @Input()
  pageType = '';
  @Input()
  openFront:any = '0';
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
  EnablerSlug=''
  @Input()
  FN_EnablerSlug:any=''
  @Input()
  FP_EnablerSlug:any=''
  @Input()
  pageFrom:any='profile'


  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {
   

    this.delete = this.eventService.deleteData$.subscribe((item: any) => {
      this.updateTime = new Date().getTime();
    });
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime =new Date().getTime()
    }
  }
  ngOnInit() {
    this.FN_EnablerSlug = (this.selItem !=undefined && this.selItem.itemData.FN_EnablerSlug !=undefined)?this.selItem.itemData.FN_EnablerSlug:''
    this.FP_EnablerSlug = (this.selItem !=undefined && this.selItem.itemData.FP_EnablerSlug !=undefined)?this.selItem.itemData.FP_EnablerSlug:''
    this.EnablerSlug = (this.selItem !=undefined && this.selItem.itemData.EnablerSlug !=undefined)?this.selItem.itemData.EnablerSlug:''
    this.EnablerFilterType = (this.selItem !=undefined && this.selItem.itemData.EnablerFilterType !=undefined)?this.selItem.itemData.EnablerFilterType:''    
  }
  ionViewWillEnter() {
  }

  ngOnChanges(): void {
    this.EnablerFilterType =this.store.getFilterFromUrl('FilterType','')
    this.EnablerSlug = this.store.getFilterFromUrl('EnablerSlug','')
    this.FN_EnablerSlug =this.store.getFilterFromUrl('FN_EnablerSlug','')
    this.FP_EnablerSlug =this.store.getFilterFromUrl('FP_EnablerSlug','')
    this.displayMode = parseInt(this.store.getFilterFromUrl('displayMode',this.displayMode))
    this.selItem =  {
      itemData : {
        chipLbl:this.store.getFilterFromUrl('chipLbl',''),
        ProfileName:this.store.getFilterFromUrl('ProfileName',''),
        CompanyName:this.store.getFilterFromUrl('CompanyName',''),
        ReferenceCode:this.store.getFilterFromUrl('ReferenceCode',''),
        EnablerSlug:this.EnablerSlug!= undefined && this.EnablerSlug != ''?this.EnablerSlug:undefined,
        EnablerName: this.EnablerSlug!= undefined && this.EnablerSlug != ''?this.store.getFilterFromUrl('EnablerName',''):undefined,
        extraType:'full-report',
        FP_EnablerSlug:this.FP_EnablerSlug!= undefined && this.FP_EnablerSlug != ''?this.FP_EnablerSlug:undefined,
        FN_EnablerSlug:this.FN_EnablerSlug != undefined && this.FN_EnablerSlug != ''?this.FN_EnablerSlug:undefined,
        displayMode:this.displayMode,
        EnablerFilterType:this.EnablerFilterType,
       }
      }
  }

  ngOnDestroy() {
    this.delete.unsubscribe();
  }
  setFilterCnt() {
    
  }

  download(event) {
    this.apiService.callDownload(appApi.myFullMatchReportExcel, 'FN_EnablerSlug', this.FN_EnablerSlug, '', this.sort, '','FP_EnablerSlug',this.FP_EnablerSlug,'EnablerSlug',this.EnablerSlug,'','','','',permission.add_download);
  }

  async removeFilter(event) {
    this.selItem = event.selItem
    if (event != undefined) {
      if(event.rmType == 'introduction_requested' || event.rmType == 'introduction_requests_received' || event.rmType == 'sent_introduction_requested' || event.rmType == 'receive_introduction_requested'|| event.rmType == 'matched' || event.rmType == 'introductions'){
        this.EnablerFilterType=''
      }else if(event.rmType == 'enablers'){
        this.EnablerSlug =''
      }
      else{
        this.FN_EnablerSlug=''
        this.FP_EnablerSlug=''
      }
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
