import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { permission } from 'src/shared/app.constants';

@Component({
  selector: 'funding-items',
  templateUrl: './funding-items.component.html',
  styleUrls: ['./funding-items.component.scss'],
})
export class FundingItemsComponent implements OnInit, OnDestroy {

  @Input()
  apiEnd: any = ''

  @Input()
  ProfileSlug: any = ''
  @Input()
  FundraiseSlug: any = ''
  @Input()
  FundraiseUID: any = ''

  @Input()
  ActionType: any = ''

  @Input()
  pageType: string = '';
  @Input()
  from: string = '';
  @Input()
  openFront: string = '0';
  @Input()
  Name: string = '';

  @Input()
  pageFrom: string = '';
  @Input()
  type: string = '';

  @Input()
  updateTime: any = 0

  keyword: string = '';
  sort: string = 'recent';

  @Input()
  apiAction: string = '';

  isShowMsg = false;
  FundingProfileList = [];
  PermissionTextKey = [];
  limit = 20;
  EnablerTotal = 0;

  // private updateData: any;
  private enablerRel: any;
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public store: StorageService, private eventService: EventService, public apiService: ApiService,) {   
    // this.updateData = this.eventService.updateData$.subscribe((item: any) => {
    //   if ((item.segment == 'enablers') && item.reload)
    //     this.callApi();
    // });

    // this.enablerRel = this.eventService.enablerRel$.subscribe(async (item: any) => {
    //   if (item.pageFrom != undefined && item.pageFrom == 'Top')
    //   this.getAdminFundingProfileList(false, "");
    //   else
    //     this.itemUpdate(item)
    // });

  }
  getParamData() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', this.sort);
    // this.from = item.pageFrom
  }
  itemUpdate(item: any) {
    const index = this.FundingProfileList.findIndex(x => x.EnablerID === item.EnablerID);
    if (index != -1) {
      this.FundingProfileList[index].IsActive = item.IsActive;
      this.FundingProfileList[index].IsFeatured = item.IsFeatured;
      this.FundingProfileList[index].IsEnable = item.IsEnable;
    }
  }

  ngOnDestroy() {
    // this.updateData.unsubscribe();
    // this.enablerRel.unsubscribe();
  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    this.callApi();   
  }
  callAction(event) {
  }
  callApi() {
    setTimeout(() => {
      if (this.from != 'admin') {
        this.getFundingProfileList(false, "");
      } else if (this.from == 'admin') {
        this.getAdminFundingProfileList(false, "");
      }
    }, this.store.isApiCalled);
  }
  getAdminFundingProfileList(isFirstLoad, event, isSkip?) {
    this.apiService.getFundraiseFundingProfile(this.FundraiseSlug ,this.keyword, this.sort, isFirstLoad ? this.FundingProfileList.length : 0, this.limit, permission.add_download_transfer_ownership, this.apiAction, isSkip).subscribe(response => { 
      let res: any = response;
      this.setData(isFirstLoad,event,res)
    });
  }
  setData(isFirstLoad,event,res: any) {
    if (res.success) {
      if (!isFirstLoad) {
        this.FundingProfileList = [];
        this.EnablerTotal = res.data.totalData;
        this.PermissionTextKey = res.data.PermissionTextKey;
      }
        if (res.data.list != undefined) {
          for (let i = 0; i < res.data.list.length; i++) {
            let element = res.data.list[i];
            element.FundraiseUID=this.FundraiseUID;
            this.FundingProfileList.push(element);
            
          }
        }
      if (isFirstLoad) {
        if (event != undefined && event.target != undefined)
          event.target.complete();
      }
      if (this.FundingProfileList.length == this.EnablerTotal) {
        if (event != undefined && event.target != undefined)
          event.target.disabled = true;
      }
    } else {
      if (event != undefined && event.target != undefined) event.target.disabled = true;
      this.store.presentAlert('', res.message, this.store.getVal('okay'));
    }
    this.change.emit({ count: this.EnablerTotal, permissions: this.PermissionTextKey, pageType: this.apiAction })
    this.isShowMsg = this.store.msgDisplay(this.FundingProfileList.length == 0);
  }
  getFundingProfileList(isFirstLoad, event, isSkip?) {
    this.apiService.getEnablerViewList(this.apiEnd,(this.type == 'fundraise'?'FundraiseSlug':'ProfileSlug'),this.FundraiseSlug , this.keyword, this.sort, isFirstLoad ? this.FundingProfileList.length : 0, this.limit, isSkip,this.apiAction).subscribe(response => {
      let res: any = response;
      // let res = this.store.getReponseData(response)
      if (res.success) {
        if (!isFirstLoad) {
          this.FundingProfileList = [];
          this.EnablerTotal = res.data.totalData;
          this.PermissionTextKey = res.data.PermissionTextKey;
        }
        if (res.data.list != undefined) {
          for (let i = 0; i < res.data.list.length; i++) {
            let element = res.data.list[i];
            element.FundraiseUID=this.FundraiseUID;
            this.FundingProfileList.push(element);
          }
        }
        if (isFirstLoad) {
          if (event != undefined && event.target != undefined)
            event.target.complete();
        }
        if (this.FundingProfileList.length == this.EnablerTotal) {
          if (event != undefined && event.target != undefined)
            event.target.disabled = true;
        }
      } else {
        if (event != undefined && event.target != undefined) event.target.disabled = true;
        this.store.presentAlert('', res.message, this.store.getVal('okay'));
      }
      this.change.emit({ count: this.EnablerTotal, permissions: this.PermissionTextKey, pageType: this.apiAction })
      this.isShowMsg = this.store.msgDisplay(this.FundingProfileList.length == 0);
    });
  }
  doInfinitePage(event) {
    if (this.from != 'admin') {
      this.getFundingProfileList(true, event);
    } else {
      this.getAdminFundingProfileList(true, event);
    }
  }
}
