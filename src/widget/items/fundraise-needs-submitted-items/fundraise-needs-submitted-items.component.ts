import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, TemplateRef, ViewChild, HostListener, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { permission } from 'src/shared/app.constants';
import { Router } from '@angular/router';
import { Page } from '../model/page.class';
import { ResponseTbl } from '../model/response-tbl.class';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'fundraise-needs-submitted-items',
  templateUrl: './fundraise-needs-submitted-items.component.html',
  styleUrls: ['./fundraise-needs-submitted-items.component.scss'],
})
export class FundraiseNeedsSubmittedItemsComponent implements OnInit, OnDestroy {

  // expanded=false

  optionsWithCheckbox = {}
  columnsWithCheckbox: any = {};

  @Input()
  apiEnd: any = "fundraise/valid_submitted_at_enablers_list_admin"

  @Input()
  updateTime: any = 0
  @Input()
  FundingProfileUID: any = ''
  @Input()
  EnablerSlug: any = ''
  @Input()
  ProfileSlug: any = ''
  @Input()
  UserSlug: any = ''

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
  subtype: string = '';

  keyword: string = '';
  sort: string = 'recent';
  SdgIDs: any = []
  EsgKeys: any = []
  countryOfEnabler: any =[]
  ImpactThemesAndAreasKey: any = []


  @Input()
  apiAction: string = '';

  isShowMsg = false;
  isShowField = false;
  PermissionTextKey = [];
  limit = 10;
  EnablerTotal = 0;
  isLoading = false;
  isResize=false
  isMobile=false

  private reload: any;
  private changeRel: any;
  private delete: any;
  // private updateData: any;
  private subLabel: any;

  
  page = new Page();
  PitchSubmitted = false;
  rows: any = Array<ResponseTbl>();
  rowsMobile:any = Array<ResponseTbl>();
  
  rowsDup: any = Array<ResponseTbl>();


  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(public store: StorageService,public alertController: AlertController, private eventService: EventService, public apiService: ApiService, private router: Router) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.setColumns();
    });
    this.reload = this.eventService.applyRefreshData$.subscribe(async (item: any) => {
      if (item != undefined && (item.page == 'fundraise' || item.segment == 'fundraise')) {
        this.callApi();
      }
    });
    this.changeRel = this.eventService.fundingProfileRel$.subscribe(async (item: any) => {
      this.callApi();
    });
    this.delete = this.eventService.deleteData$.subscribe((item: any) => {
      this.callApi();
    });
    const $this = this
   $(window).resize(function() {
    if(window.innerWidth <= 820){
      if(!$this.isResize){
        $this.isResize = true;
        if(!$this.isMobile){
          $this.callApi();
          $this.isMobile = true;
        }
      }
    }else{
      $this.isMobile=false
    }
  });
  }
  getParamData() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', this.sort);
    this.countryOfEnabler = this.store.getFilterFromUrl('countryOfEnabler',[]);
    this.ImpactThemesAndAreasKey = this.store.getFilterFromUrl('ImpactThemesAndAreasKey',[]);
    this.SdgIDs = this.store.getFilterFromUrl('SdgIDs',[]);
    this.EsgKeys = this.store.getFilterFromUrl('EsgKeys',[]);
    // this.from = item.from !=undefined && item.from !=''?item.from:item.pageFrom
  }

  itemUpdate(item: any) {
    // const index = this.fundraiseList.findIndex(x => x.FundingProfileID === item.FundingProfileID);
    // if (index != -1) {
    //   this.fundraiseList[index].IsActive = item.IsActive;
    //   this.fundraiseList[index].IsFeatured = item.IsFeatured;
    //   this.fundraiseList[index].IsEnable = item.IsEnable;
    // }
  }

  ngOnDestroy() {
  
    this.reload.unsubscribe();
    this.changeRel.unsubscribe();
    this.delete.unsubscribe();
    this.subLabel.unsubscribe();
    // this.updateData.unsubscribe();
  }

  
  async ngOnInit() {
    this.optionsWithCheckbox = {
      checkboxes: false,
    }
    await this.setColumns();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    this.callApi()
  }
  toggleExpandRow(row, rowIndex) {
    this.rows[rowIndex].expanded = this.rows[rowIndex].expanded != undefined ? !this.rows[rowIndex].expanded : true
  }
  getRowHeight(row) {
    if (!row.expanded) {
      return 58;
    }
    if (row.expanded) {
      return 'auto';
    }
    return row.height;
  }
  onDetailToggle(event) {
  }

  async changeStatus(endPoint, parmName, value, row,rowIndex,isConfig?) {
    let postData = new FormData();
    postData.append(parmName, value);
    if (row.EnablerSlug != undefined)
      postData.append("EnablerSlug", row.EnablerSlug);
    postData.append("FN_EnablerSlug", row.FN_EnablerSlug);
    postData.append("Link", window.location.href);
    if(isConfig){
      const alert = await this.alertController.create({
        message: this.store.getVal('fp_fn_enabler_confirmation'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              postData.append("EmailSend",'1')
              this.callStatusUpdate(endPoint, parmName,row, rowIndex,postData,isConfig)
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => { 
              postData.append("EmailSend",'0')
              this.callStatusUpdate(endPoint, parmName,row, rowIndex,postData,isConfig)
            }
          }
        ], backdropDismiss: false
      });
      return await alert.present();
    
    }else{
      this.callStatusUpdate(endPoint, parmName,row, rowIndex,postData,isConfig)
    }
    
   
    
  }
  callStatusUpdate(endPoint, parmName,row, rowIndex,postData: FormData,isConfig?) {
   
    this.apiService.update('fundraise', 'update_' + endPoint, postData).subscribe(async response => {
      let res: any = response;
      if (!res.success) {
        if(rowIndex < this.rows.length-1){
          if(rowIndex != undefined && rowIndex != -1 && this.rows[rowIndex][parmName] != undefined && this.rowsDup[rowIndex][parmName] != undefined)
          this.rows[rowIndex][parmName] = this.rowsDup[rowIndex][parmName]
        }else{
          this.rowsMobile[rowIndex][parmName] = this.rowsDup[rowIndex][parmName]
        }
        if(isConfig){
          let postData = new FormData();
          if(row.FN_EnablerSlug !=undefined){
            postData.append("FN_EnablerSlug",  row.FN_EnablerSlug);
          }
          postData.append('TransactionLogID',res.data.TransactionLogID)
          if(res.data.CallPaymentGateway != undefined && res.data.CallPaymentGateway){
            window.open(res.data.SessionUrl,'_self');
          }else{
            // if(rowIndex != undefined && rowIndex != -1 && this.rows[rowIndex][parmName] != undefined && this.rowsDup[rowIndex][parmName] != undefined)
            // this.rows[rowIndex][parmName] = this.rowsDup[rowIndex][parmName]

            const alert = await this.alertController.create({
              header: this.store.getVal('error'),
              message: res.message,
              animated: true,
              cssClass: 'alertCustomCssBtn',
              buttons: [
                {
                  text: this.store.getVal('okay'),
                  handler: () => {
                    if(row.IsOperative != 0){
                      if(row.PlanID != undefined){
                        this.store.openPage('admin?EnablerID='+row.EnablerID+'&PlanID='+row.PlanID+'#subscripions','1')
                      }else{
                        this.store.openPage('admin?EnablerID='+row.EnablerID+'#subscripions','1')
                      }
                    }
                  }
                }
              ], backdropDismiss: false
            });
            return await alert.present();
          }
        }else{
          // if(rowIndex != undefined && rowIndex != -1 && this.rows[rowIndex][parmName] != undefined && this.rowsDup[rowIndex][parmName] != undefined)
          // this.rows[rowIndex][parmName] = this.rowsDup[rowIndex][parmName]

          this.store.showToast(res.message, 2000, 'error');
        }
      }else{
        if(res.data.detail !=undefined){
          this.eventService.publishUpdateData({ segment: 'fundraise-needs', reload: true,enabler:res.data.enabler_detail });
          this.rows[rowIndex].TotalExpressedInterest= res.data.detail.TotalExpressedInterest 
          this.rows[rowIndex].TotalReceivedInterest= res.data.detail.TotalReceivedInterest 
          this.rows[rowIndex].TotalMatchingFundingProfiles= res.data.detail.TotalMatchingFundingProfiles
          this.rows[rowIndex].TotalIntroductionsWithInvestors= res.data.detail.TotalIntroductionsWithInvestors
          this.rows[rowIndex].IsPaid = res.data.detail.IsPaid
          this.rows[rowIndex].IsOperative= res.data.detail.IsOperative
          this.rows = [...this.rows]

          let idx = this.rowsMobile.findIndex(c => c.FN_EnablerSlug == res.data.detail.FN_EnablerSlug)
          if(idx != -1){

            this.rowsMobile[idx].TotalExpressedInterest= res.data.detail.TotalExpressedInterest 
            this.rowsMobile[idx].TotalReceivedInterest= res.data.detail.TotalReceivedInterest 
            this.rowsMobile[idx].TotalMatchingFundingProfiles= res.data.detail.TotalMatchingFundingProfiles
            this.rowsMobile[idx].TotalIntroductionsWithInvestors= res.data.detail.TotalIntroductionsWithInvestors
            this.rowsMobile[idx].IsPaid = res.data.detail.IsPaid
            this.rowsMobile[idx].IsOperative= res.data.detail.IsOperative
          }
        }
        this.store.showToast(res.message, 2000);
      }
    });
  }

  callAction(event,Index?) {
    // endPoint,parmName,value,row,rowIndex,isConfig?
    // callAction({FunctionName:'changeStatus',endPoint:'active',parmName:'IsActive',value:prod.IsActive, row:prod})
    if(event !=undefined){
      if(event.FunctionName =='changeStatus'){
        this[''+event.FunctionName](event.endPoint,event.parmName,event.value,event.row,Index,event.isConfig)
      }else if(event.route != undefined){
        if(event.route == 'fundraise-form')
        this[''+event.FunctionName](event.Item,event.route,event.FilterType)
        else
        this[''+event.FunctionName](event.Item,this.getFromPath(),event.FilterType)
      }
    }
  }
  getFromPath() {
    // return this.pageFrom=='profile'?'matching-funding-profiles':'funding-profile-match-report';
    return 'funding-profile-match-report';
  }
  onSelect(row) {
  }
   callApi() {    
    this.setPage(false,{offset:0})
  }
  setColumns() {
    this.columnsWithCheckbox=[]
    if (this.pageFrom != 'explore' && this.subtype !='enabler')
    this.columnsWithCheckbox.push({ prop: 'EnablerName', name:'enabler_name', sortable: false, showExp: true, click: true, route: 'enablers', frozenLeft: true, resisable: true, width: '230',isFaci:true })
    this.columnsWithCheckbox.push({ prop: 'ReferenceCode', name: 'fundraise_need_reference_number', frozenLeft: true, sortable: false, showExp: false, click: true, route: 'fundraise-form', resisable: true, width: '200',isColor:true ,isIndicat:true,icon:'fa-rocket fa-solid',isPublic:this.store.appType=='admin' })
    if(this.store.appType =='admin'){
      this.columnsWithCheckbox.push({ prop: 'ContactName', cname: true, name: 'contact_name_for_fundraise_need', sortable: false, showExp: false, resisable: true, width: '200',isColor:true })
      this.columnsWithCheckbox.push({ prop: 'Email', name: 'contact_email_for_fundraise_need', sortable: false, showExp: false, click: false, isMail: true, resisable: true, width: '230',isColor:true })
    }
    this.columnsWithCheckbox.push({ prop: 'CompanyName', name: 'fundraise_need_for_company_name', sortable: false, showExp: false, resisable: true, width: '200',isColor:true })
    if (this.pageFrom != 'explore') {
      this.columnsWithCheckbox.push({ prop: 'TotalMatchingFundingProfiles', name: 'total_matching_funding_profiles', sortable: false, showExp: false, click: true, route: 'funding-profile-match-report',resisable: true, width: '150',hidden:true })
      this.columnsWithCheckbox.push({ prop: 'TotalExpressedInterest', name: 'total_expressed_interest', sortable: false, showExp: false, click: true, route: 'funding-profile-match-report',FilterType:'introduction_requested', resisable: true, width: '150',hidden:true })
      this.columnsWithCheckbox.push({ prop: 'TotalReceivedInterest', name: 'total_received_interest',FilterType:'introduction_requests_received', sortable: false, showExp: false, click: true, route: 'funding-profile-match-report', resisable: true, width: '150',hidden:true })
      this.columnsWithCheckbox.push({ prop: 'TotalIntroductionsWithInvestors', name: 'total_introductions', sortable: false, showExp: false, click: true, route: 'funding-profile-match-report',FilterType:'introductions', resisable: true, width: '150',hidden:true })
    }
    this.columnsWithCheckbox.push({ prop: 'FundingProviderType', name: 'funding_profile_type', sortable: false, showExp: true, resisable: true, width: '250',hidden:true })
    this.columnsWithCheckbox.push({ prop: 'CountriesOfDomicileNationality', name: 'countries_of_domicile_nationality', sortable: false, showExp: true, resisable: true, width: '250',hidden:true })
    this.columnsWithCheckbox.push({ prop: 'TicketSizePerInvestor', name: 'minimum_ticket_size_eur', sortable: false, showExp: false, resisable: true, width: '200',hidden:true})
    this.columnsWithCheckbox.push({ prop: 'ImpactThemesAndAreas', name:'impact_themes_and_areas', sortable: false, showExp: true, resisable: true, width: '300',hidden:true })
    this.columnsWithCheckbox.push({ prop: 'SDGs', name:'sdgs', sortable: false, showExp: true, resisable: true, width: '250',hidden:true })
    this.columnsWithCheckbox.push({prop:'ESG', name:'esg',sortable:false,showExp:true,resisable:true,width:'300',hidden:true})
    this.columnsWithCheckbox.push({ prop: 'GenderLens', name: 'gender_lens', sortable: false, showExp: true, resisable: true, width: '250',hidden:true })
    this.columnsWithCheckbox.push({ prop: 'FundingType', name: 'funding_type', sortable: false, showExp: false, resisable: true, width: '200',hidden:true })
    this.columnsWithCheckbox.push({ prop: 'FundingStage', name: 'funding_stage', sortable: false, showExp: true, resisable: true, width: '250',hidden:true })
    this.columnsWithCheckbox.push({ prop: 'CountriesOfIncorporation', name: 'country', sortable: false, showExp: false, resisable: true, width: '200',hidden:true })
    this.columnsWithCheckbox.push({ prop: 'IndustriesSectors', name: 'industries_sectors', sortable: false, showExp: true, resisable: true, width: '250',hidden:true })
    this.columnsWithCheckbox.push({ prop: 'TotalRaise', name: 'total_raise_amount_eur', sortable: false, showExp: false, resisable: true, width: '200',hidden:true})
    this.columnsWithCheckbox.push({ prop: 'CumulativeRevenue', name: 'revenue_alert', sortable: false, showExp: false, resisable: true, width: '200',hidden:true})
    if (this.pageFrom != 'explore') {
      this.columnsWithCheckbox.push({ prop: 'SourceOrReferral', name: 'source_of_referral', sortable: false, showExp: false, resisable: true, width: '200',hidden:true })
      this.columnsWithCheckbox.push({ prop: 'InternalReferenceNumber', name:'internal_reference_number', sortable: false, showExp: false, resisable: true, width: '200',hidden:true })
      this.columnsWithCheckbox.push({ prop: 'Tags', name: 'tags', sortable: false, showExp: true, resisable: true, width: '200',hidden:true })
    }
    this.columnsWithCheckbox.push({ prop: 'PitchSubmitted', name: 'pitch_submitted', frozenLeft:false, sortable: false, showExp: false,click:false, width: '140',hidden:true});
    this.columnsWithCheckbox.push({ prop: 'RaiseStartDate', name: 'raise_start_date', frozenLeft:false, sortable: false, showExp: false,click:false, width: '140',isDate:true,isRise:true,hidden:true });
    this.columnsWithCheckbox.push({ prop: 'RaiseEndDate', name: 'raise_end_date', frozenLeft:false, sortable: false, showExp: false,click:false, width: '140',isDate:true,isRise:true,hidden:true });
    this.columnsWithCheckbox.push({ prop: 'CreatedTs', name: 'created_on', frozenLeft:false, sortable: false, showExp: false,click:false, width: '220',isDate:true,hidden:true });
    this.columnsWithCheckbox.push({ prop: 'ModifiedTs', name: 'last_update', frozenLeft:false, sortable: false, showExp: false,click:false, width: '220',isDate:true,hidden:true });
    this.columnsWithCheckbox.push({ prop: 'CreatedBy', name: 'created_by', frozenLeft:false, sortable: false, showExp: false,click:false, width: '200',hidden:true});
    if(this.pageFrom !='explore'){
      this.columnsWithCheckbox.push({ prop: 'IsActive', name: 'active_status', frozenLeft:false, sortable: false, showExp: false,click:false, width: '140',isDrop:true,hidden:true});
      this.columnsWithCheckbox.push({ prop: 'IsEnable', name: 'system_status', frozenLeft:false, sortable: false, showExp: false,click:false, width: '140',isDrop:true,hidden:true});
      this.columnsWithCheckbox.push({ prop:'IsEmailVerified', name:'submitter_confirmation', frozenLeft:false, sortable: false, showExp: false,click:false, width: '130',isDrop:false,isStatus:'true',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'DataStatus', name: 'enablers_confirmation', frozenLeft:false, sortable: false, showExp: false,click:false, width: '160',isDrop:true,hidden:true});
      this.columnsWithCheckbox.push({ prop: 'IsPaid', name: 'payment_status', frozenLeft:false, sortable: false, showExp: false,click:false, width: '160',isDrop:false,hidden:true});
      this.columnsWithCheckbox.push({ prop: 'ScreeningStatus', name: 'screening_status', frozenLeft:false, sortable: false, showExp: false,click:false, width: '200',isDrop:true,hidden:true});
      this.columnsWithCheckbox.push({ prop: 'IsFeatured', name: 'featured', frozenLeft:false, sortable: false, showExp: false,click:false, width: '140',isDrop:true,hidden:true});
    }

  }
  getTitle(item){
    let titl=''
    titl=(item.FNReferenceCode != undefined?item.FNReferenceCode:item.ReferenceCode)
    return titl
  }
 
  setPage(isFirstLoad,pageInfo, event?) {
    var parms = ''
    if (this.from != 'admin') {
      parms = "?ProfileSlug=" + this.ProfileSlug + "&FundingProfileUID=" + this.FundingProfileUID + "&SdgIDsKey=" + this.SdgIDs+ "&EsgKey=" + this.EsgKeys + "&CountryOfEnabler=" + this.countryOfEnabler + "&ImpactThemesAndAreasKey=" + this.ImpactThemesAndAreasKey + "&Keyword=" +(this.keyword !=''?encodeURIComponent(this.keyword):'') + "&SortBy=" + this.sort + "&PermissionTextKey=" + permission.add_download + "&PageType=" + this.apiAction
      this.apiEnd = "funding_profile/valid_explorer_list"
    } else if (this.from == 'admin') {
      parms = "?UserSlug="+this.UserSlug+"&EnablerSlug=" + this.EnablerSlug +"&SdgIDsKey=" + this.SdgIDs +"&EsgKey=" + this.EsgKeys + "&CountryOfEnabler=" + this.countryOfEnabler + "&ImpactThemesAndAreasKey=" + this.ImpactThemesAndAreasKey + "&Keyword=" +(this.keyword !=''?encodeURIComponent(this.keyword):'') + "&SortBy=" + this.sort + "&PermissionTextKey=" + permission.add_download + "&PageType=" + this.apiAction
    }

    this.page.pageNumber = pageInfo.offset;
    this.isLoading = true
    this.apiService.getResults(this.apiEnd, this.page, parms).subscribe(pagedData => {
      this.isLoading=false
      this.isResize = false;
      this.page = pagedData.page;
      if(pageInfo.offset == 0){
        this.rows =[]
        this.rowsMobile =[]
      }
      this.PitchSubmitted = pagedData.PitchSubmitted;
      this.rows = pagedData[`results`];
      for (let i = 0; i <  this.rows.length; i++) {
        const element =  this.rows[i];
        element.hidden=true
        this.rowsMobile.push(element)        
      }
      this.rowsMobile = this.rowsMobile.reduce((unique, o) => {
        if(o.FundraiseSlug !=undefined){
          if(!unique.some(obj => (obj.FundraiseSlug === o.FundraiseSlug))) {
            unique.push(o);
          }
        }else if(o.FN_EnablerSlug !=undefined){
          if(!unique.some(obj => (obj.FN_EnablerSlug === o.FN_EnablerSlug))) {
            unique.push(o);
          }
        }
        return unique;
    },[]);
    this.rowsDup = JSON.parse(JSON.stringify(this.rowsMobile));
    this.EnablerTotal = (pagedData.page.totalElements != undefined?pagedData.page.totalElements:0)
    this.PermissionTextKey = pagedData.datas.PermissionTextKey
    this.change.emit({ count: (pagedData.page.totalElements != undefined?pagedData.page.totalElements:0), permissions: this.PermissionTextKey, pageType: this.apiAction })
    this.isShowMsg = this.store.msgDisplay(this.rows.length == 0 || this.rowsMobile.length == 0);
    if (isFirstLoad) {
      if (event != undefined && event.target != undefined)
        event.target.complete();
    }
    if (this.rowsMobile.length == this.EnablerTotal) {
      if (event != undefined && event.target != undefined)
        event.target.disabled = true;
    }
    });
  }
  routePath(event, actionName,FilterType?) {

    let appendPath=''
    // appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    if(FilterType != undefined){
      apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
      apPath = apPath+'FilterType='+ FilterType
      apPath= apPath+'&chipLbl='+ (FilterType == 'introductions'?'total_'+FilterType:FilterType)
    }

    let path;
    if (actionName == 'enablers' && this.pageFrom != 'explore')
      path = ('/admin/enabler/' + event.EnablerSlug +((apPath != undefined && apPath !='')?apPath:'')+'#overview')
    else if (this.pageFrom == 'explore')
      path = ('admin/fundraise-needs/' + event.FundraiseSlug + this.store.getSeprater(undefined,apPath) + actionName)
    else
      path = ('admin/fundraise-needs-submitted/' + event.FN_EnablerSlug + this.store.getSeprater(undefined,apPath)+ actionName)
    return path
  }
  onClick(event, actionName,FilterType?) {
    this.store.openPage(this.routePath(event, actionName,FilterType),this.openFront)
  }
  doInfinitePage(event) {
    this.setPage(true,{offset:(this.rowsMobile.length / 10)},event)
  }
}
