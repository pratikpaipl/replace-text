import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { actType, appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'funding-profile-match-report',
  templateUrl: './funding-profile-match-report.page.html',
  styleUrls: ['./funding-profile-match-report.page.scss'],
})
export class FundingProfileMatchReportPage implements OnInit, OnDestroy {

  filteCnt = 0
  @Input()
  from: any='dashboard';
  @Input()
  pageTitle: any='';
  @Input()
  apiEnd: any='report/funding_profile_match_report';
  @Input()
  FN_EnablerSlug: any='';
  @Input()
  updateTime = 0;
  
  pageType = 'funding-profile-match-report-admin';

  keyword = '';
  sort = 'recent';

  CompanyIDs = ''
  isShow = false;
  permissions = []
  allTotal = 0;

  
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
  ionViewWillEnter() {    
    this.updateTime = new Date().getTime()
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
  ngOnDestroy() {
  }

  download(event) {
    this.apiService.callDownload(appApi.fundingProfileMatchReportAdminExcel, 'FN_EnablerSlug', this.FN_EnablerSlug, '',this.sort,actType.funding_profile_enabler);
  }

}
