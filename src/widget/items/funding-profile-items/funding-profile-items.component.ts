import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { permission } from 'src/shared/app.constants';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'funding-profile-items',
  templateUrl: './funding-profile-items.component.html',
  styleUrls: ['./funding-profile-items.component.scss'],
})
export class FundingProfileItemsComponent implements OnInit, OnDestroy {

  @Input()
  apiEnd: any='funding_profile/valid_submitted_at_enablers_list_admin' 

  @Input()
  List: any=[] 

  @Input()
  EnablerSlug: any 
  @Input()
  FN_EnablerSlug: any 
  @Input()
  FP_EnablerSlug: any 
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
  extraMenu: boolean = true;



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



  FundingProviderType: string = '';
  FundingType: string = '';
  FundingStage: string = '';
  MinimumTicketSize: string = '';
  keyword: string = '';
  sort: string = 'recent';
  ImpactThemesAndAreasKey: any = [];
  SdgIDs: any = [];
  EsgKeys: any = [];
  GenderLens: any = [];

  @Input()
  updateTime: any=0
  @Input()
  apiAction: string = '';

  @Input()
  IsProfile: any
  @Input()
  IsSubmittedEnabler: any


  isShowMsg = false;
  isShowField = false;
  fundingProfileList = [];
  PermissionTextKey = [];
  limit = 20;
  FundingProfileTotal = 0;
  

  // private updateData: any;
  private delete: any;
  private changeRel: any;
  // private refreshData: any;
  private removeData: any;

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public store: StorageService, private eventService: EventService, public apiService: ApiService,private router:Router) {

    // this.updateData = this.eventService.updateData$.subscribe((item: any) => {
    //   if ((item.segment == 'funding-profile') && item.reload)
    //     this.callApi();
    // });

    this.delete = this.eventService.deleteData$.subscribe((item: any) => {
      // const index: number = this.fundingProfileList.indexOf(item);
      // if(index == -1)
      this.callApi();
      // else
      // this.fundingProfileList.splice(index, 1);
    });

    this.changeRel = this.eventService.fundingProfileRel$.subscribe(async (item: any) => {
      if (item.pageFrom != undefined && item.pageFrom == 'Top')
      this.callApi();
      else
      this.itemUpdate(item)
    });
    
    this.removeData = this.eventService.removeData$.subscribe(async (item: any) => {
      if(item.EnablerSlug !=undefined){
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
    // this.EnablerSlug = item.EnablerSlug != undefined ? item.EnablerSlug : this.EnablerSlug;
    this.FundingProviderType = this.store.getFilterFromUrl('FundingProviderType',[]);
    this.FundingType = this.store.getFilterFromUrl('FundingType',[]);
    this.FundingStage = this.store.getFilterFromUrl('FundingStage',[]);
    this.MinimumTicketSize = this.store.getFilterFromUrl('MinimumTicketSize',[]);
    this.GenderLens = this.store.getFilterFromUrl('GenderLens',[]); 
    // this.from = item.from !=undefined && item.from !=''?item.from:item.pageFrom
  }

  itemUpdate(item: any) {
    const index = this.fundingProfileList.findIndex(x => x.FP_EnablerSlug === item.FP_EnablerSlug);    
    if (index != -1) {
      this.fundingProfileList[index].IsActive = item.IsActive;
      this.fundingProfileList[index].IsEnable = item.IsEnable;
      this.fundingProfileList[index].IsFeatured = item.IsFeatured;
      this.fundingProfileList[index].DataStatus = item.DataStatus;
      this.fundingProfileList[index].TotalMatchingFundraiseNeeds = item.TotalMatchingFundraiseNeeds;
      this.fundingProfileList[index].TotalReceivedInterest = item.TotalReceivedInterest;
      this.fundingProfileList[index].TotalExpressedInterest = item.TotalExpressedInterest;
      if(this.fundingProfileList[index].FPExpressedInterestKey !=undefined&& item.rType != undefined)
      this.fundingProfileList[index].FPExpressedInterestKey = item.rType;
      if(this.fundingProfileList[index].FPReactionValueKey !=undefined&& item.rType != undefined)
      this.fundingProfileList[index].FPReactionValueKey = item.rType;
    }
  }

  ngOnDestroy() {
    // this.updateData.unsubscribe();
    this.delete.unsubscribe();
    // this.refreshData.unsubscribe();
    this.changeRel.unsubscribe();
    this.removeData.unsubscribe()
  }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData();
    // if(this.List != undefined && this.fundingProfileList.length == 0){
    //   this.fundingProfileList =JSON.parse(JSON.stringify({list:this.List})).list;
    //   this.List=[]
    // }else{
    //   this.callApi();    
    // }
    this.callApi();    
  }

  
  callAction(event) {
    if(event != undefined && event.Type != undefined && event.Filter){
      let cId:any=[]
      let itId:any=[]
      let fId:any=[]
      let fptId:any=[]
      let ftId:any=[]
      let fsId:any=[]
      let gId:any=[]
      let sId:any=[]
      let mId:any=[]
      if(event.Type =='country')
      cId.push(event.item.CountryID)
      if(event.Type =='enablers')
      fId.push(event.item.EnablerSlug)
      if(event.Type =='proidertype')
      fptId = event.item.FundingProviderTypeKeys.split(',')
      if(event.Type =='fundingtype')
      ftId = event.item.FundingTypeKeys.split(',')
      if(event.Type =='fundingstage')
      fsId = event.item.FundingStageKeys.split(',')
      if(event.Type =='genderlens'){
        let genderlence = event.item.GenderLensJson !=undefined?JSON.parse(event.item.GenderLensJson):[]
        // gId = this.store.getList(genderlence,'')
        gId = genderlence.map((obj) => obj.ReferenceKey);
      }
      if(event.Type =='sdgs'){
        let sdgs = event.item.SdgsJson !=undefined?JSON.parse(event.item.SdgsJson):[]
        sId = sdgs.map((obj) => obj.ReferenceKey);
        // sId = this.store.getList(sdgs,'')
      }
      if(event.Type =='impacttheme'){
        let imacttheme = event.item.ImpactThemesAndAreasJson !=undefined?JSON.parse(event.item.ImpactThemesAndAreasJson):[]
        // itId = this.store.getList(imacttheme,'')
        // itId = imacttheme.map((obj) => obj.ReferenceKey);

        for (let k = 0; k < imacttheme.length; k++) {
          const elementArray = imacttheme[k].ReferenceKey.split(',');
            for (let l = 0; l < elementArray.length; l++) {
              itId.push(elementArray[l])
            }
        }
      }

      if(event.Type =='ticketsize')
      mId =event.item.MinimumTicketSizePerFundingKeys.split(',')
    }
    if(event.TotalExpressedInterest !=undefined){
      this.change.emit(event)
    }
  }
 
  callApi() {
    setTimeout(() => {
      if (this.from == 'admin') {
        this.getAdminFundingProfileSubmittedList(false, "");
      } else {
        this.getFundingProfileSubmittedList(false, "");
      }
    }, this.store.isApiCalled);
  }

  getAdminFundingProfileSubmittedList(isFirstLoad, event, isSkip?) {
    let parmNm='EnablerSlug'
    let parmVal=(this.EnablerSlug != undefined)?this.EnablerSlug:''
    if(this.apiEnd == 'fundraise/valid_funding_profile_report_admin'){
      parmNm='FN_EnablerSlug'
      parmVal=(this.FN_EnablerSlug != undefined)?this.FN_EnablerSlug:''
    }else{
      parmNm='EnablerSlug'
      parmVal=(this.EnablerSlug != undefined)?this.EnablerSlug:''
    }
    this.apiService.adminFundingProfileSubmittedList(this.apiEnd,parmNm,parmVal,this.keyword,this.sort,this.ImpactThemesAndAreasKey,this.SdgIDs,this.EsgKeys,this.FundingProviderType,this.GenderLens,this.MinimumTicketSize,isFirstLoad ? this.fundingProfileList.length : 0,100,permission.add_download,this.apiAction, isSkip,this.FilterType).subscribe(response => {
      let res: any = response;
      if (res.success) {
        let res: any = response;
        this.setData(isFirstLoad,event,res)
      }
      this.change.emit({ count: this.FundingProfileTotal, permissions: this.PermissionTextKey, pageType: this.apiAction })
      this.isShowMsg = this.store.msgDisplay(this.fundingProfileList.length == 0);
    });
  }
  getFundingProfileSubmittedList(isFirstLoad, event, isSkip?) {
    this.apiService.FundingProfileSubmittedList(this.apiEnd,(this.FN_EnablerSlug !=undefined ?'FN_EnablerSlug':'EnablerSlug'),(this.EnablerSlug != undefined?this.EnablerSlug:this.FN_EnablerSlug !=undefined?this.FN_EnablerSlug:'') ,this.keyword, this.sort,this.ImpactThemesAndAreasKey,this.SdgIDs,this.EsgKeys, this.FundingProviderType,this.FundingType,this.FundingStage,this.MinimumTicketSize,this.GenderLens, isFirstLoad ? this.fundingProfileList.length : 0, 20,permission.add_download,this.apiAction, isSkip,this.FilterType,this.IsProfile,this.IsSubmittedEnabler).subscribe(response => {
      let res: any = response;
      // let res = this.store.getReponseData(response)
      if (res.success) {
        if(this.pageFrom =='list'){
          let sTitle= this.store.getVal('funding_profile_list_social_title') 
          let sDesc = this.store.getVal('funding_profile_list_social_description') 
          this.store.updateMetaData(this.pageType,{
            EnablerName:sTitle, ShortDescription:sDesc,
            EnablerLogo:environment.social_logo
          })
        }else{
          var titl = ''
          var desc = this.parentDesc
          if(this.type =='enabler' || this.type =='enablers'){
            titl = this.Name+this.store.getVal('crieria_by_curated_investors')
          }
          this.store.updateMetaData(this.pageType,{
            EnablerName:titl,
            ShortDescription:desc,
            EnablerLogo: this.parentLogo
          })
        }
        if (!isFirstLoad) {
          this.fundingProfileList = [];
          this.FundingProfileTotal = res.data.totalData;
          this.PermissionTextKey = res.data.PermissionTextKey;
        }
        if (res.data.list != undefined) {
          for (let i = 0; i < res.data.list.length; i++) {
            let element = res.data.list[i];
            this.fundingProfileList.push(element);
          }
        }
        if (isFirstLoad) {
          if (event != undefined && event.target != undefined)
            event.target.complete();
        }
        if (this.fundingProfileList.length == this.FundingProfileTotal) {
          if (event != undefined && event.target != undefined)
            event.target.disabled = true;
        }
      } else {
        if (event != undefined && event.target != undefined) event.target.disabled = true;
        this.store.presentAlert('', res.message, this.store.getVal('okay'));
      }
      this.change.emit({ count: this.FundingProfileTotal, permissions: this.PermissionTextKey, pageType: this.apiAction })
      this.isShowMsg = this.store.msgDisplay(this.fundingProfileList.length == 0);
    });
  }

  
  setData(isFirstLoad,event,res: any) {
    if (res.success) {
      if (!isFirstLoad) {
        this.fundingProfileList = [];
        this.FundingProfileTotal = res.data.totalData;
        this.PermissionTextKey = res.data.PermissionTextKey;
      }
        if (res.data.list != undefined) {
          for (let i = 0; i < res.data.list.length; i++) {
            let element = res.data.list[i];
            this.fundingProfileList.push(element);
          }
        }
      if (isFirstLoad) {
        if (event != undefined && event.target != undefined)
          event.target.complete();
      }
      if (this.fundingProfileList.length == this.FundingProfileTotal) {
        if (event != undefined && event.target != undefined)
          event.target.disabled = true;
      }
    } else {
      if (event != undefined && event.target != undefined) event.target.disabled = true;
      this.store.presentAlert('', res.message,this.store.getVal('okay'));
    }
    this.change.emit({ count: this.FundingProfileTotal, permissions: this.PermissionTextKey, pageType: this.apiAction })
    this.isShowMsg = this.store.msgDisplay(this.fundingProfileList.length == 0);
  }
  changeStatus(row,status) {
    // row.cassette1Bill = '22';
  }
  onSelect(row){
  }
  onClick(event,index){
    this.router.navigateByUrl('admin/funding-profile/'+event.ProfileSlug+this.store.getSeprater()+((index==5)?'enablers':(index==6)?'fundraise-view':(index==0)?'profile-form':'profile-form'))
  }
  doInfinitePage(event) {
    if (this.from != 'admin') {
      this.getFundingProfileSubmittedList(true, event);
    } else {
      this.getAdminFundingProfileSubmittedList(true, event);
    }
  }
}
