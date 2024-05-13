import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'permissions-items',
  templateUrl: './permission-item.component.html',
  styleUrls: ['./permission-item.component.scss'],
})
export class PermissionItemComponent implements OnInit, OnDestroy {

  @Input()
  EnablerSlug: any = ''
  @Input()
  ActionType: any = ''
  @Input()
  type: string = '';
  @Input()
  pageType: string = '';
  @Input()
  updateTime: any = 0;


  keyword: string = '';
  sort: string = 'recent';

  @Input()
  pageFrom: string = '';
  @Input()
  from: string = '';
  
  isShowMsg = false;
  limit = 20;
  start = 0;
  labelsTotal = 0;

  labelsList = [];
  PermissionTextKey = [];

  private delete: any;
  // private updateData: any;
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor( public store: StorageService, private eventService: EventService, public apiService: ApiService,) {    
    this.delete = this.eventService.deleteData$.subscribe((item: any) => {
      const index: number = this.labelsList.indexOf(item);
      if (index > -1) {
        this.labelsList.splice(index, 1);
        this.labelsTotal = this.labelsTotal - 1;
        this.change.emit({ count: this.labelsTotal, permissions: this.PermissionTextKey })
      }
      this.isShowMsg = this.store.msgDisplay(this.labelsList.length == 0);
    });

    // this.updateData = this.eventService.updateData$.subscribe((item: any) => {
    //   if (item.segment == 'permission' && item.reload)
    //     this.callApi();
    // });
  }
  callApi() {
    this.getPermissionList(false, "");
  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    setTimeout(() => {
      this.callApi();
    }, this.store.isApiCalled);    
  }
  getParamData() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', this.sort);
  }
  ngOnDestroy() {
    this.delete.unsubscribe();
    // this.updateData.unsubscribe();
  }

  getPermissionList(isFirstLoad, event) {
      this.apiService.getPageUserList(isFirstLoad ? this.labelsList.length : 0, this.limit, (this.type == 'enablers' ? this.EnablerSlug : ''), (this.type == 'enablers'?'enabler':this.type) + '_permission').subscribe(response => {
        let res = response
        if (res.success) {
          if (!isFirstLoad) {
            this.labelsList = [];
            this.labelsTotal = res.data.totalData;
            this.PermissionTextKey = res.data.PermissionTextKey;
          }
          for (let i = 0; i < res.data.list.length; i++) {
            this.labelsList.push(res.data.list[i]);
          }
          if (isFirstLoad) {
            if (event != undefined && event.target != undefined)
              event.target.complete();
          }

          if (this.labelsList.length == this.labelsTotal) {
            if (event != undefined && event.target != undefined)
              event.target.disabled = true;
          }
        } else {
          if (event != undefined && event.target != undefined) event.target.disabled = true;
        }
        this.change.emit({ count: this.labelsTotal, permissions: this.PermissionTextKey })
        this.isShowMsg = this.store.msgDisplay(this.labelsList.length == 0);
      });
  }
  doInfiniteLabels(event) {
    this.getPermissionList(true, event);
  }
}
