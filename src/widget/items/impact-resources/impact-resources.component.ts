import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'impact-resources',
  templateUrl: './impact-resources.component.html',
  styleUrls: ['./impact-resources.component.scss'],
})
export class ImpactResourcesItemsComponent implements OnInit, OnDestroy {

  @Input()
  apiEnd: any="user/impact_funding_resources_list"

  @Input()
  ImpactFundingResourcesSlug: any 
  @Input()
  pageType: string = '';
  @Input()
  from: string = '';
  @Input()
  openFront: string = '0';

  @Input()
  Name: string = '';
  @Input()
  parentDesc: string = '';
  @Input()
  parentLogo: string = '';


  @Input()
  pageFrom: string = '';
  @Input()
  type: string = '';

  @Input()
  updateTime: any=0
  @Input()
  extraMenu: any=true

  keyword: string = '';
  sort: string = 'recent';

  @Input()
  apiAction: string = '';

  isShowMsg = false;
  DataList = [];
  PermissionTextKey = [];
  limit = 20;
  DataTotal = 0;


  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  private applyFilter: any;
  constructor(public store: StorageService, private eventService: EventService, public apiService: ApiService,) {

  }
  getParamData() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', this.sort);
    // this.from = item.pageFrom
  }
  ngOnInit() {
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
      this.getParamData()
      this.updateTime=item.updateTime
      this.callApi();  
    });
  }
  ionViewDidEnter(){
   
  }
  ionViewDidLeave(){
  
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    this.callApi();    
  }

  ngOnDestroy() {
    if( this.applyFilter != undefined)
    this.applyFilter.unsubscribe()
  }

  callAction(event) {
  }
  callApi() {
    setTimeout(() => {
      this.getFundraiseSubmittedList(false, "");
    }, this.store.isApiCalled);
  }

  getFundraiseSubmittedList(isFirstLoad, event, isSkip?) {
    this.apiService.ImpactFundingResourcesList(this.apiEnd,this.keyword,this.sort, isFirstLoad ? this.DataList.length : 0, this.limit,'',this.apiAction, isSkip).subscribe(response => {
        let res: any = response;
        // let res = this.store.getReponseData(response)
        if (res.success) {          
          if (!isFirstLoad) {
            this.DataList = [];
            this.DataTotal = res.data.totalData;
          }
          if (res.data.list != undefined) {
            for (let i = 0; i < res.data.list.length; i++) {
              let element = res.data.list[i];
              this.DataList.push(element);
            }
          }
          if (isFirstLoad) {
            if (event != undefined && event.target != undefined)
              event.target.complete();
          }
          if (this.DataList.length == this.DataTotal) {
            if (event != undefined && event.target != undefined)
              event.target.disabled = true;
          }
        } else {
          if (event != undefined && event.target != undefined) event.target.disabled = true;
          this.store.presentAlert('', res.message, this.store.getVal('okay'));
        }
        this.change.emit({ count: this.DataTotal, pageType: this.apiAction })
        this.isShowMsg = this.store.msgDisplay(this.DataList.length == 0);
      });
  }

  setData(isFirstLoad,event,res: any) {
    if (res.success) {
      if (!isFirstLoad) {
        this.DataList = [];
        this.DataTotal = res.data.totalData;
      }
        if (res.data.list != undefined) {
          for (let i = 0; i < res.data.list.length; i++) {
            let element = res.data.list[i];
            this.DataList.push(element);
          }
        }
      if (isFirstLoad) {
        if (event != undefined && event.target != undefined)
          event.target.complete();
      }
      if (this.DataList.length == this.DataTotal) {
        if (event != undefined && event.target != undefined)
          event.target.disabled = true;
      }
    } else {
      if (event != undefined && event.target != undefined) event.target.disabled = true;
      this.store.presentAlert('', res.message, this.store.getVal('okay'));
    }
    this.change.emit({ count: this.DataTotal,  pageType: this.apiAction })
    this.isShowMsg = this.store.msgDisplay(this.DataList.length == 0);
  }

  doInfinitePage(event) {
    this.getFundraiseSubmittedList(true, event);
  }
}
