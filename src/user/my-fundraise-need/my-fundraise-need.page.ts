import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
@Component({
  selector: 'my-fundraise-need',
  templateUrl: './my-fundraise-need.page.html',
  styleUrls: ['./my-fundraise-need.page.scss'],
})
export class MyFundraiseNeedPage implements OnInit {

  permissions = []
  loadMsg: any = "";
  dataAction: any = [];
  pageType = 'fundraise'
  pageTitle = 'My Fundraise Needs'
  allTotal = 0
  @Input()
  updateTime = 0

  keyword: any = '';

  constructor(public store: StorageService,  public router: Router, private eventService: EventService) {
   

  }

  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime =new Date().getTime()
    }
  }
  ngOnInit() {
      this.keyword = this.store.getFilterFromUrl('keyword','');
    }
    ngOnChanges(changes: SimpleChanges): void {
      this.keyword = this.store.getFilterFromUrl('keyword','');
    }
  ngOnDestroy(): void {
  }
  callEnablerFilter(event) {
    if (event.filter != undefined && event.filter == '1') {
      // this.openFilterView();
    } else if (event.keyword != undefined) {
      this.keyword = event.keyword
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
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
