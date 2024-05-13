import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, TemplateRef, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { permission } from 'src/shared/app.constants';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'enabler-items',
  templateUrl: './enabler-items.component.html',
  styleUrls: ['./enabler-items.component.scss'],
})
export class EnablerItemsComponent implements OnInit, OnDestroy {

  @Input()
  apiEnd: any = 'enabler/valid_explorer_list'

  @Input()
  extraTitle: any = false;
  @Input()
  EnablerSlug: any = ''
  @Input()
  FundraiseUID: any = ''
  @Input()
  ProfileSlug: any = ''
  @Input()
  FundraiseSlug: any = ''
  @Input()
  FundingProfileUID: any = ''
  @Input()
  updateTime: any=0


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
  IsProfile: any
  @Input()
  IsSubmittedEnabler: any


  keyword: string = '';
  sort: string = 'recent';
  SdgIDs: any = ''
  EsgKeys: any = ''
  countryOfEnabler: any = []
  ImpactThemesAndAreasKey: any = []



  @Input()
  apiAction: string = 'enabler';

  isShowMsg = false;
  EnablerList = [];
  PermissionTextKey = [];
  limit = 20;
  EnablerTotal = 0;

  // private updateData: any;
  // private enablerRel: any;
  

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public router: Router,public store: StorageService, private eventService: EventService, public apiService: ApiService,) {
    
    // this.updateData = this.eventService.updateData$.subscribe((item: any) => {
    //   if ((item.segment == 'enablers'|| item.segment =='matching-enablers') && item.reload)
    //     this.callApi();
    // });

    // this.enablerRel = this.eventService.enablerRel$.subscribe(async (item: any) => {
    //   if (item.pageFrom != undefined && item.pageFrom == 'Top')
    //   this.getAdminEnablerList(false, "");
    //   else
    //     this.itemUpdate(item)
    // });

  }
  getParamData() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', this.sort);
    this.countryOfEnabler = this.store.getFilterFromUrl('countryOfEnabler',[]);
    this.ImpactThemesAndAreasKey = this.store.getFilterFromUrl('ImpactThemesAndAreasKey',[]);
    this.SdgIDs = this.store.getFilterFromUrl('SdgIDs',[]);
    this.EsgKeys = this.store.getFilterFromUrl('EsgKeys',[]);
  
    // this.from = (item.segment == 'enablers'|| item.segment =='matching-enablers')?this.from:item.pageFrom
  }
  itemUpdate(item: any) {
    const pos = this.EnablerList.findIndex(x => x.EnablerID === item.EnablerID);
    if (pos != -1) {
      this.EnablerList[pos].IsActive = item.IsActive;
      this.EnablerList[pos].IsFeatured = item.IsFeatured;
      this.EnablerList[pos].IsEnable = item.IsEnable;
      this.EnablerList[pos].IsPublish = item.IsPublish;
    }
  }

  ngOnDestroy() {
    // this.enablerRel.unsubscribe();
    // this.updateData.unsubscribe();
  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    this.callApi();
  }
  callAction(event) {
    if(event != undefined && event.companyFilter){
      let cId:any=[]
      cId.push(''+event.item.CountryID)
      this.eventService.publishApplyFilter({countryOfEnabler:cId,sort:this.sort,segment:'enablers',pageFrom:this.from})
    }else if(event != undefined && event.action =='full-report'){
      this.change.emit({ event: event})
    }
  }
  callApi() {
    setTimeout(() => {
      if (this.from != 'admin' && this.from !='profile') {
        this.getEnablerList(false, "");
      } else {
        this.getAdminEnablerList(false, "");
      }
    }, this.store.isApiCalled);
  }
  getAdminEnablerList(isFirstLoad, event, isSkip?) {
    if(this.pageFrom !='details'){
      this.apiService.adminEnablerList(this.apiEnd,(this.apiAction == 'enabler' || this.apiAction == 'enablers') ? this.ProfileSlug : '',this.EnablerSlug, this.SdgIDs,this.EsgKeys, this.countryOfEnabler, this.ImpactThemesAndAreasKey, this.keyword, this.sort, isFirstLoad ? this.EnablerList.length : 0, this.limit, permission.add_download_transfer_ownership, this.apiAction, isSkip).subscribe(response => { 
        let res: any = response;
        this.setData(isFirstLoad,event,res)
      });
    }else{
      this.apiService.getEnablerViewList(this.apiEnd,((this.type == 'fundraise-need')?'FundraiseSlug':'ProfileSlug'),(this.ProfileSlug !=''?this.ProfileSlug:this.FundraiseSlug) , this.keyword, this.sort, isFirstLoad ? this.EnablerList.length : 0, this.limit, isSkip,this.apiAction).subscribe(response => {
        let res: any = response;
        this.setData(isFirstLoad,event,res)
      });
    }
  }
  setData(isFirstLoad,event,res: any) {
    if (res.success) {
      if (!isFirstLoad) {
        this.EnablerList = [];
        this.EnablerTotal = res.data.totalData;
        this.PermissionTextKey = res.data.PermissionTextKey;
      }
      if (res.data.list != undefined) {
        for (let i = 0; i < res.data.list.length; i++) {
          let element = res.data.list[i];
          element.FundingProfileUID=this.FundingProfileUID;
          element.FundraiseUID=this.FundraiseUID;
          this.EnablerList.push(element);
        }
      }
      if (isFirstLoad) {
        if (event != undefined && event.target != undefined)
          event.target.complete();
      }
      if (this.EnablerList.length == this.EnablerTotal) {
        if (event != undefined && event.target != undefined)
          event.target.disabled = true;
      }
    } else {
      if (event != undefined && event.target != undefined) event.target.disabled = true;
      this.store.presentAlert('', res.message, this.store.getVal('okay'));
    }
    this.change.emit({ count: this.EnablerTotal, permissions: this.PermissionTextKey, pageType: this.apiAction })
    this.isShowMsg = this.store.msgDisplay(this.EnablerList.length == 0);
  }
  onCheckboxClick(selectCheckBoxArr) { 
    // alert(JSON.stringify(selectCheckBoxArr));
}
  getEnablerList(isFirstLoad, event, isSkip?) {
    this.apiService.getEnablerList(this.apiEnd,this.apiAction == 'enablers' ? this.ProfileSlug : '',this.EnablerSlug, this.SdgIDs,this.EsgKeys, this.countryOfEnabler, this.ImpactThemesAndAreasKey, this.keyword, this.sort, isFirstLoad ? this.EnablerList.length : 0, this.limit, permission.add_download, this.apiAction, isSkip,this.IsProfile,this.IsSubmittedEnabler).subscribe(response => { 
        let res: any = response;
        if (res.success) {
          if(this.pageFrom =='list'){
            let sTitle= this.store.getVal('enablers_list_social_title') 
            let sDesc = this.store.getVal('enablers_list_social_description') 
            this.store.updateMetaData(this.pageType,{
              EnablerName:sTitle, ShortDescription:sDesc,
              EnablerLogo:environment.social_logo
            })
          }
          if (!isFirstLoad) {
            this.EnablerList = [];
            this.EnablerTotal = res.data.totalData;
            this.PermissionTextKey = res.data.PermissionTextKey;
          }
          if (res.data.list != undefined) {
            for (let i = 0; i < res.data.list.length; i++) {
              let element = res.data.list[i];
              element.FundingProfileUID=this.FundingProfileUID;
              element.FundraiseUID=this.FundraiseUID;
              this.EnablerList.push(element);
           
            }
          }
          if (isFirstLoad) {
            if (event != undefined && event.target != undefined)
              event.target.complete();
          }
          if (this.EnablerList.length == this.EnablerTotal) {
            if (event != undefined && event.target != undefined)
              event.target.disabled = true;
          }
        } else {
          if (event != undefined && event.target != undefined) event.target.disabled = true;
          this.store.presentAlert('', res.message, this.store.getVal('okay'));
        }
        this.change.emit({ count: this.EnablerTotal, permissions: this.PermissionTextKey, pageType: this.apiAction })
        this.isShowMsg = this.store.msgDisplay(this.EnablerList.length == 0);
      });
  }
  doInfinitePage(event) {
    if (this.from != 'admin' && this.from !='profile') {
      this.getEnablerList(true, event);
    } else {
      this.getAdminEnablerList(true, event);
    }
  }
}
