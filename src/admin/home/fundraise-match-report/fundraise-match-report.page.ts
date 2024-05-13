import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { actType, appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'fundraise-match-report',
  templateUrl: './fundraise-match-report.page.html',
  styleUrls: ['./fundraise-match-report.page.scss'],
})
export class FundraiseMatchReportPage implements OnInit, OnDestroy {

  filteCnt = 0
  @Input()
  updateTime = 0
  @Input()
  from: any='dashboard';
  @Input()
  pageTitle: any='';

  @Input()
  FilterType: any='';
  @Input()
  selItem: any;
  @Input()
  apiEnd: any='report/fundraise_match_report';
  @Input()
  FP_EnablerSlug: any='';

  ImpactThemesAndAreasKey: any = []
  SdgIDs: any = []

  CompanyIDs = ''
  isShow = false;
  permissions = []
  summaryList = []
  keyword = '';
  sort = 'recent';
  allTotal = 0;
  pageType = 'fundraise-match-report-admin';


  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('content') content: any;
  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {

  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime = this.store.getCurrentTime();
    }
  }
  ngOnInit() {
  }
  ngOnDestroy() {
  }

  updateCount(event){
    this.allTotal = (event.count != undefined)?event.count:0;
    if(event !=undefined && event.event !=undefined) {
      this.change.emit({ itemData: event.event,action:'full-report' })
    }
    if (event.permissions != undefined) {
      this.permissions = event.permissions
    }
  }

  selectSort(event) {
    if (event != undefined) {
      this.sort = event;
      this.updateTime =new Date().getTime()
    }
  }  

  download(event) {
    this.apiService.callDownload(appApi.fundraiseMatchReportAdminExcel, 'FP_EnablerSlug', this.FP_EnablerSlug, '',this.sort,actType.fundraise_enabler);
  }
}
