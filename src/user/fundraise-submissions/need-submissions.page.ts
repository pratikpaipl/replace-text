import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { actType, appApi } from 'src/shared/app.constants';
@Component({
  selector: 'need-submissions',
  templateUrl: './need-submissions.page.html',
  styleUrls: ['./need-submissions.page.scss'],
})
export class NeedSubmissionsPage implements OnInit,OnDestroy {

  @Input()
  selItem: any;
  @Input()
  updateTime: any = 0

  @Input()
  sort: any = 'recent';

  EnablerSlug: any = ''
  permissions = []
  loadMsg: any = "";
  dataAction: any = [];
  pageType = 'fundraise'
  pageTitle = ''
  keyword = ''
  allTotal: any = 0

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime =new Date().getTime()
    }
  }
   ngOnInit() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.store.titleCntWithPage(this.store.getVal('fundraise_need_submissions'));
  }
  ngOnChanges(): void {
    this.EnablerSlug = this.store.getFilterFromUrl('EnablerSlug','')
      this.selItem = {
        itemData :
        {
          EnablerName: this.EnablerSlug !=undefined && this.EnablerSlug!=''?this.store.getFilterFromUrl('EnablerName',''):undefined,
          EnablerSlug:this.EnablerSlug !=undefined && this.EnablerSlug!=''?this.EnablerSlug:undefined,
          chipLbl:this.store.getFilterFromUrl('chipLbl',''),
          displayMode:this.store.getFilterFromUrl('displayMode',''),
          EnablerFilterType:this.store.getFilterFromUrl('FilterType',''),
        }
      }
  }
  ngOnDestroy(): void {
  }
  callEnablerFilter(event) {
    if (event.filter != undefined && event.filter == '1') {
      // this.openFilterView();
    } else if (event.keyword != undefined) {
      this.keyword = event.keyword
      // this.updateTime = (new Date().getTime())
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    }
  }
  updateCount(event) {
    if (event != undefined && event.event != undefined)
      this.change.emit({ itemData: event.event, action: event.action })

    if (event.count != undefined) {
      this.allTotal = event.count
    }
    if (event.permissions != undefined) {
      this.permissions = event.permissions
    }

  }

  async removeFilter(event) {
    this.selItem = event.selItem
    if (event != undefined) {
      this.EnablerSlug = ''
      this.eventService.publishRemoveData({ EnablerSlug: '' });
    }
  }

  download($event) {
    this.apiService.callDownload(appApi.myFNSubmittedAtEnablersListExcel, '', '', '', this.sort, actType.fundraise_enabler);
  }
}
