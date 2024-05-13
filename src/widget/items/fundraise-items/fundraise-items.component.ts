import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { permission } from 'src/shared/app.constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fundraise-items',
  templateUrl: './fundraise-items.component.html',
  styleUrls: ['./fundraise-items.component.scss'],
})
export class FundraiseItemsComponent implements OnInit, OnDestroy {
  
  @Input()
  apiEnd: any="fundraise/valid_submitted_at_enablers_list"
  @Input()
  EnablerSlug: any 
  @Input()
  FP_EnablerSlug: any 
  @Input()
  FundraiseSlug: any 
  @Input()
  FN_EnablerSlug: any 
  @Input()
  ActionType: any = ''
  @Input()
  FilterType: any = ''

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

  @Input()
  IsProfile: any
  @Input()
  IsSubmittedEnabler: any

  keyword: string = '';
  sort: string = 'recent';
  SdgIDs: any = ''
  EsgKeys: any = ''
  ImpactThemesAndAreasKey: any = []
  GenderLens: string = '';

  @Input()
  apiAction: string = '';

  isShowMsg = false;
  FundraiseList = [];
  PermissionTextKey = [];
  limit = 20;
  FundraiseTotal = 0;

  private removeData: any;
  private delete: any;
  // private updateData: any;
  private changeRel: any;
  // private refreshData: any;
 
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public store: StorageService, private eventService: EventService, public apiService: ApiService,) {

    // this.updateData = this.eventService.updateData$.subscribe((item: any) => {
    //   if ((item.segment == 'fundraise'|| item.segment == 'fundraise-need') && item.reload)
    //     this.callApi();
    // });
    this.delete = this.eventService.deleteData$.subscribe((item: any) => {
      // const index: number = this.FundraiseList.indexOf(item);
      // if(index == -1)
      this.callApi();
      // else
      // this.FundraiseList.splice(index, 1);
    });
    this.changeRel = this.eventService.fundingProfileRel$.subscribe(async (item: any) => {
      if (item.pageFrom != undefined && item.pageFrom == 'Top')
      this.callApi();
      else
      this.itemUpdate(item)
    });

    this.removeData = this.eventService.removeData$.subscribe(async (item: any) => {
      if(item.EnablerSlug != undefined ){
        this.EnablerSlug=item.EnablerSlug
        this.callApi();
      }
    });
  }
  getParamData() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', this.sort);
    this.ImpactThemesAndAreasKey = this.store.getFilterFromUrl('ImpactThemesAndAreasKey',[]);
    this.SdgIDs = this.store.getFilterFromUrl('SdgIDs',[]); 
    this.EsgKeys = this.store.getFilterFromUrl('EsgKeys',[]); 
    // this.from = item.pageFrom
  }
  itemUpdate(item: any) {
    const index = this.FundraiseList.findIndex(x => x.FN_EnablerSlug === item.FN_EnablerSlug);
    if (index != -1) {
      this.FundraiseList[index].IsActive = item.IsActive;
      this.FundraiseList[index].IsEnable = item.IsEnable;
      this.FundraiseList[index].IsFeatured = item.IsFeatured;
      this.FundraiseList[index].DataStatus = item.DataStatus;
      this.FundraiseList[index].TotalMatchingFundingProfiles = item.TotalMatchingFundingProfiles;
      this.FundraiseList[index].TotalReceivedInterest = item.TotalReceivedInterest;
      this.FundraiseList[index].TotalExpressedInterest = item.TotalExpressedInterest;

      if( this.FundraiseList[index].FNExpressedInterestKey !=undefined&& item.rType != undefined)
      this.FundraiseList[index].FNExpressedInterestKey = item.rType;
      if( this.FundraiseList[index].FNReactionValueKey !=undefined && item.rType != undefined)
      this.FundraiseList[index].FNReactionValueKey = item.rType;

    }
  }

  ngOnDestroy() {
    // this.updateData.unsubscribe();
    this.changeRel.unsubscribe();
    this.removeData.unsubscribe()
    // this.refreshData.unsubscribe()
    this.changeRel.unsubscribe()
    this.delete.unsubscribe();
  }
  ngOnInit() {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    this.callApi();    
  }

  callAction(event) {
    if(event.TotalExpressedInterest !=undefined){
      this.change.emit(event)
    }
  }
  callApi() {
    setTimeout(() => {
      if (this.from == 'admin') {
        this.getAdminFundraiseSubmittedList(false, "");
      } else {
        this.getFundraiseSubmittedList(false, "");
      }
    }, this.store.isApiCalled);
  }
  getAdminFundraiseSubmittedList(isFirstLoad, event, isSkip?) {

    let parmNm='EnablerSlug'
      let parmVal=(this.EnablerSlug != undefined)?this.EnablerSlug:''
      if(this.apiEnd == 'funding_profile/valid_fundraise_report_admin'){
        parmNm='FP_EnablerSlug'
        parmVal=(this.FP_EnablerSlug != undefined)?this.FP_EnablerSlug:''
      }else{
        parmNm='EnablerSlug'
        parmVal=(this.EnablerSlug != undefined)?this.EnablerSlug:''
      }

      this.apiService.adminFundraiseSubmittedList(this.apiEnd,parmNm,this.keyword, this.ImpactThemesAndAreasKey,this.SdgIDs,this.EsgKeys, this.sort, isFirstLoad ? this.FundraiseList.length : 0, this.limit, permission.add_download, parmVal, this.apiAction, isSkip,this.FilterType).subscribe(response => {
        let res: any = response;
        this.setData(isFirstLoad,event,res)
      });
  }
  getFundraiseSubmittedList(isFirstLoad, event, isSkip?) {
    let param =this.EnablerSlug != undefined?'EnablerSlug':this.FP_EnablerSlug !=undefined?'FP_EnablerSlug':'FundraiseSlug'
    let slug =this.EnablerSlug != undefined?this.EnablerSlug :this.FP_EnablerSlug!=undefined?this.FP_EnablerSlug:this.FundraiseSlug !=undefined?this.FundraiseSlug:''; this.apiService.FundraiseSubmittedList(this.apiEnd,this.keyword,this.ImpactThemesAndAreasKey,this.SdgIDs,this.EsgKeys, this.sort, isFirstLoad ? this.FundraiseList.length : 0, this.limit,permission.add_download,param,slug,this.apiAction, isSkip,this.FilterType,this.IsProfile,this.IsSubmittedEnabler).subscribe(response => {
        let res: any = response;
        // let res = this.store.getReponseData(response)
        if (res.success) {
          if(this.pageFrom =='list'){
            let sTitle= this.store.getVal('fundraise_need_list_social_title') 
            let sDesc = this.store.getVal('fundraise_need_list_social_description') 
            this.store.updateMetaData(this.pageType,{
              EnablerName:sTitle, ShortDescription:sDesc,
              EnablerLogo:environment.social_logo
            })
          }else{
            var titl = ''
            var desc = this.parentDesc
            if(this.type =='enabler' || this.type =='enablers'){
              titl = this.Name+this.store.getVal('investment_raise_by_curated_companies')
            }
            this.store.updateMetaData(this.pageType,{
              EnablerName:titl,
              ShortDescription:desc,
              EnablerLogo: this.parentLogo
            })
          }
          if (!isFirstLoad) {
            this.FundraiseList = [];
            this.FundraiseTotal = res.data.totalData;
            this.PermissionTextKey = res.data.PermissionTextKey;
          }
          if (res.data.list != undefined) {
            for (let i = 0; i < res.data.list.length; i++) {
              let element = res.data.list[i];
              this.FundraiseList.push(element);
            }
          }
          if (isFirstLoad) {
            if (event != undefined && event.target != undefined)
              event.target.complete();
          }
          if (this.FundraiseList.length == this.FundraiseTotal) {
            if (event != undefined && event.target != undefined)
              event.target.disabled = true;
          }
        } else {
          if (event != undefined && event.target != undefined) event.target.disabled = true;
          this.store.presentAlert('', res.message, this.store.getVal('okay'));
        }
        this.change.emit({ count: this.FundraiseTotal, permissions: this.PermissionTextKey, pageType: this.apiAction })
        this.isShowMsg = this.store.msgDisplay(this.FundraiseList.length == 0);
      });
  }

  setData(isFirstLoad,event,res: any) {
    if (res.success) {
      if (!isFirstLoad) {
        this.FundraiseList = [];
        this.FundraiseTotal = res.data.totalData;
        this.PermissionTextKey = res.data.PermissionTextKey;
      }
        if (res.data.list != undefined) {
          for (let i = 0; i < res.data.list.length; i++) {
            let element = res.data.list[i];
            this.FundraiseList.push(element);
          }
        }
      if (isFirstLoad) {
        if (event != undefined && event.target != undefined)
          event.target.complete();
      }
      if (this.FundraiseList.length == this.FundraiseTotal) {
        if (event != undefined && event.target != undefined)
          event.target.disabled = true;
      }
    } else {
      if (event != undefined && event.target != undefined) event.target.disabled = true;
      this.store.presentAlert('', res.message, this.store.getVal('okay'));
    }
    this.change.emit({ count: this.FundraiseTotal, permissions: this.PermissionTextKey, pageType: this.apiAction })
    this.isShowMsg = this.store.msgDisplay(this.FundraiseList.length == 0);
  }

  doInfinitePage(event) {
    if (this.from != 'admin') {
      this.getFundraiseSubmittedList(true, event);
    } else {
      this.getAdminFundraiseSubmittedList(true, event);
    }
  }
}
