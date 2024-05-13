import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, TemplateRef, ViewChild, HostListener, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { Router } from '@angular/router';
import { Page } from '../model/page.class';
import { ResponseTbl } from '../model/response-tbl.class';

@Component({
  selector: 'funding-profiles-match-report-items',
  templateUrl: './funding-profiles-match-report-items.component.html',
  styleUrls: ['./funding-profiles-match-report-items.component.scss'],
})
export class FundingProfilesMatchReportItemsComponent implements OnInit, OnDestroy {

  @ViewChild('fundingProfileMatch') table: any;

  optionsWithCheckbox = {}
  // dataWithCheckbox = [];
  columnsWithCheckbox: any = [];


  @Input()
  FundingProfileUID: any = ''
  @Input()
  EnablerSlug: any = ''
  @Input()
  ProfileSlug: any = ''
  @Input()
  apiEnd: any = ''
  @Input()
  FN_EnablerSlug: any = ''

  @Input()
  displayMode: any=1;
  @Input()
  FilterType: any='';
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
  updateTime: any = 0;

  keyword: string = '';
  sort: string = 'recent';
  SdgIDs: any = []
  countryOfEnabler: any = []
  ImpactThemesAndAreasKey: any = []


  @Input()
  apiAction: string = '';

  isShowMsg = false;
  isShowField = false;
  summaryList = [];
  PermissionTextKey = [];
  limit = 10;
  EnablerTotal = 0;
  isLoading=false
  isResize=false
  isMobile=false
  private refreshData: any;

  page = new Page();
  rows:any = Array<ResponseTbl>();
  rowsMobile:any = Array<ResponseTbl>();

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(public store: StorageService,public router: Router, private eventService: EventService, public apiService: ApiService) {

    this.page.pageNumber = 0;
    this.page.size = 10;
    
    this.refreshData = this.eventService.applyRefreshData$.subscribe((item: any) => {
      if ((item.segment == 'funding-profile-match-report') && item.reload)
        this.callApi();
    });
    const $this = this
   $(window).resize(function() {
    if(window.innerWidth <= 820){
      if(!$this.isResize && $this.displayMode == 2){
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
    this.keyword = this.pageFrom =='details'?this.store.getFilterFromUrl('keyword',''):'';
    this.sort = this.store.getFilterFromUrl('sort', this.sort);
  }
  itemUpdate(item: any) {
    const index = this.summaryList.findIndex(x => x.FundingProfileID === item.FundingProfileID);
    if (index != -1) {
      this.summaryList[index].IsActive = item.IsActive;
      this.summaryList[index].IsFeatured = item.IsFeatured;
      this.summaryList[index].IsEnable = item.IsEnable;
    }
  }
  ngOnDestroy() {
    this.refreshData.unsubscribe();
  }
  

  ngOnInit() {
    this.optionsWithCheckbox = {
      checkboxes: false,
    }
    this.setColumns()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData();
    this.callApi();

  }
  getFromPath() {
    // return this.pageFrom=='profile'?'matched-fundraise-needs':'fundraise-need-match-report';
    return 'fundraise-need-match-report';
  }
  toggleExpandRow(row,rowIndex) {
    this.rows[rowIndex].expanded= this.rows[rowIndex].expanded !=undefined ? !this.rows[rowIndex].expanded:true
  }
  openMatching(item){
    this.openPage((this.store.appType =='admin'?'admin/full-report/':'user/full-report/') +item.FP_EnablerSlug+'/'+this.FN_EnablerSlug+'/detail')
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

  changeStatus(type,endPoint,rType,row,value,rowIndex?) {
    let postData = new FormData();
    postData.append("ReactionType", rType);
    postData.append("ReactionValue", value);
    postData.append("FN_EnablerSlug", this.FN_EnablerSlug);
    postData.append("FP_EnablerSlug", row.FP_EnablerSlug);
    this.apiService.update(type, endPoint, postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        if(res.data != undefined) {
          row.ReactionValue = value
          if(type =='funding_profile'){
            row.FPReactionValueKey = value
            this.rows[rowIndex].FPReactionValueKey = value
          }else{            
            row.FNReactionValueKey = value
            this.rows[rowIndex].FNReactionValueKey = value
          }

          this.change.emit({ TotalExpressedInterest: res.data.TotalExpressedInterest,item: row })

          // this.change.emit({ TotalExpressedInterest: res.data.TotalExpressedInterest })
        }
        this.store.showToast(res.message, 2000);
      }
    });
  }
  changePitchStatus(type,endPoint,row) {
    // row.cassette1Bill = '22';
    let postData = new FormData();
    postData.append("RequestStatus", row.PitchRequestStatus);
    postData.append("FN_EnablerSlug", this.FN_EnablerSlug);
    postData.append("FP_EnablerSlug", row.FP_EnablerSlug);
    this.apiService.update(type, endPoint, postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        this.store.showToast(res.message, 2000);
      }
    });

  }
  callAction(event,Index?) {
    if(event != undefined){
      if(event.FunctionName =='changeStatus'){
        this[''+event.FunctionName](event.type,event.endPoint,event.rType,event.row,event.value,Index)
      }else  if(event.FunctionName =='callIntroduce'){
        this[''+event.FunctionName](event.type,event.row)
      }
      else if( event.FunctionName =='changePitchStatus'){
        this[''+event.FunctionName]('fundraise',event.endPoint,event.Item)
      }else if(event.FunctionName =='onClick' && event.route == 'full-report'){
        this[''+event.FunctionName](event.Item,event.route,event.extraPath,event.FilterType)
      }
      else if(event.FunctionName =='onClick'){
        if(event.route == 'profile-form')
        this[''+event.FunctionName](event.Item,event.route,event.extraPath,event.FilterType)
        else
        this[''+event.FunctionName](event.Item,this.getFromPath(),event.extraPath,event.FilterType)
      }else if(event.item != undefined){
        
        this.rowsMobile[Index].FPExpressedInterestKey = event.item.FPExpressedInterestKey=='remove'?undefined:event.item.FPExpressedInterestKey
        this.rowsMobile[Index].FPReactionValueKey=event.item.FPReactionValueKey=='remove'?undefined:event.item.FPReactionValueKey
  
        this.rowsMobile[Index].FNExpressedInterestKey = event.item.FNExpressedInterestKey=='remove'?undefined:event.item.FNExpressedInterestKey
        this.rowsMobile[Index].FNReactionValueKey = event.item.FNReactionValueKey=='remove'?undefined:event.item.FNReactionValueKey
      }
      else{
        this.change.emit({ event: event.row})
      }
    }
  }
  onSelect(row){
  }
  callApi() {
    this.setPage(false,{offset:0})
  }
  getTitle(item){
    let titl=''
    let fp =(item.FPReferenceCode != undefined?item.FPReferenceCode:item.ReferenceCode)
    let fn =(item.FNReferenceCode != undefined?item.FNReferenceCode:item.ReferenceCode)
    titl= fp + (fp != fn?' < > '+fn:'')

    return titl
  }
  setColumns() {
   if (this.pageFrom == 'details'){
      this.columnsWithCheckbox.push({name:'matching_parameters',frozenLeft:true,sortable:false,showExp:false,click:true,route:'match-report',width:'180',resisable:false,color:'investore-profile',order:0})
      this.columnsWithCheckbox.push({name:'see_matchmaking_report',frozenLeft:true,sortable:false,showExp:false,click:true,route:'full-report',width:'130',resisable:true,color:'investore-profile'})
      this.columnsWithCheckbox.push({name:'enabler',prop:'EnablerName',frozenLeft:true,sortable:false,showExp:true,click:true,route:'enablers',width:'230',resisable:true,color:'enabler',isFaci:true})
      this.columnsWithCheckbox.push({name:'matchmaking_result_match_with_investment_raise',prop:'FNPercentage', frozenLeft:false,sortable:false,isPer:true,showExp:false,width:'180',resisable:true,color:'matched'})
      this.columnsWithCheckbox.push({name:'matchmaking_result_match_with_investor_profile',prop:'FPPercentage', frozenLeft:false,sortable:false,isPer:true,showExp:false,width:'180',resisable:true,color:'matched'}) //,hidden:true
      this.columnsWithCheckbox.push({ prop: 'LastIntroduceDate', name: 'last_introduce_date', frozenLeft:false, sortable: false, showExp: false,click:false,route:'fundraise-form', width: '250',isDate:true, resisable: true,icon:'fa-regular fa-handshake' ,color:'enabler',isLastIntroduce:'var(--ion-color-dark-green)',apiType:'fundraise_funding_profile' });//,hidden:true 
      
      this.columnsWithCheckbox.push({name:'investor_profile_reference_number',prop:'ReferenceCode', frozenLeft:false,sortable:false,showExp:false,click:true,isUser:true,route:'profile-form',width:'200',resisable:true,color:'investore-profile',icon:'fa-money-bills fa-solid',isPublic:this.store.appType=='admin'})//,hidden:true
      this.columnsWithCheckbox.push({ prop: 'ProfileName', name: 'investor_profile_display_name', frozenLeft:false, sortable: false, showExp: false,click:false,route:'profile-form', width: '160', resisable: true ,color:'investore-profile'});//,hidden:true
      this.columnsWithCheckbox.push({ prop: 'ContactName', name: 'investor_profile_contact_name', frozenLeft:false, sortable: false, showExp: false,click:false,route:'profile-form', width: '160', resisable: true ,color:'investore-profile'});//,hidden:true
      if(this.store.appType =='admin')
      this.columnsWithCheckbox.push({ prop:'ContactEmail', name: 'investor_profile_contact_email', frozenLeft:false, sortable: false, showExp: false,isMail:true, click:false, width: '230', resisable: true ,color:'investore-profile'});//,hidden:true

      this.columnsWithCheckbox.push({ prop: 'ImpactThemesAndAreas', name: 'matchmaking_result_matching_impact_themes_and_areas', frozenLeft:false, sortable: false, showExp: true,click:false,route:'fundraise-form',isImpact:true,  width: '300', resisable: true ,color:'matched',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'SDGs', name: 'matchmaking_result_matching_sdgs', frozenLeft:false,isSDG:true, sortable: false, showExp: true,click:false,route:'fundraise-form', width: '250', resisable: true ,color:'matched',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'ESG', name: 'matchmaking_result_matching_esg', frozenLeft:false, sortable: false, showExp: true,click:false,route:'fundraise-form',isImpact:true,  width: '300', resisable: true ,color:'matched',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'GenderLens', name: 'matchmaking_result_matching_gender_lens', frozenLeft:false,isGenderLenc:true, sortable: false, showExp: true,click:false,route:'fundraise-form', width: '250', resisable: true ,color:'matched',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'FundingType', name: 'matchmaking_result_matching_investment_type', frozenLeft:false, sortable: false, showExp: false,click:false,route:'fundraise-form', width: '200', resisable: true ,color:'matched',hidden:true});

      // if(this.store.appType == 'admin')
      this.columnsWithCheckbox.push({name:'investor_profile_expressed_interest',prop:'FPReactionValueKey', frozenLeft:false,sortable:false,showExp:false,isDrop:true,width:'180',resisable:true,color:'investore-profile',appType:'funding_profile'})//,hidden:true
      this.columnsWithCheckbox.push({name:'investment_raise_expressed_interest',prop:'FNReactionValueKey', frozenLeft:false,sortable:false,isPer:false,showExp:false,isDrop:true,width:'180',resisable:true,color:'investment-raise',appType:'fundraise'})//,hidden:true
      
      this.columnsWithCheckbox.push({name:'investor_profile_matchmaking_result_total_matching_investees_for_investor_profile',prop:'TotalMatchingFundraise',sortable:false,showExp:false,click:true,route:'profile-form',extraPath:this.getFromPath(),width:'265',resisable:true,color:'matched'})//,hidden:true
      this.columnsWithCheckbox.push({name:'matchmaking_result_total_introductions_with_investors_for_investment_raise',prop:'TotalIntroductionsWithInvestees',sortable:false,showExp:false,click:true,route:'profile-form',extraPath:this.getFromPath(),FilterType:'introductions',width:'200',resisable:true,color:'matched'})//,hidden:true

      this.columnsWithCheckbox.push({name:'matchmaking_result_total_matching_raise_amount_for_investor_profile_eur',prop:'TotalFundraiseAmount',sortable:false,showExp:false,width:'200',resisable:true,color:'matched'})//,hidden:true

      this.columnsWithCheckbox.push({name:'investor_profile_ticket_size_per_investment_eur',prop:'TicketSizePerFunding',sortable:false,showExp:false,width:'200',resisable:true,color:'investore-profile',hidden:true})

      this.columnsWithCheckbox.push({name: 'investor_profile_access_to_pitch',prop:'PitchRequestStatus',sortable:false,showExp:false,click:false,isPitch:true,isInvestor:true,width:'200',resisable:true,hidden:true})
      
      this.columnsWithCheckbox.push({name: 'access_to_pitch',prop:'PitchRequestStatus',sortable:false,showExp:false,click:false,isPitch:true,isInvestee:true,width:'200',resisable:true,hidden:true})


    }

    if(this.pageFrom == 'list' || this.pageFrom =='profile'){
      this.columnsWithCheckbox.push({name:'see_matchmaking_report',frozenLeft:true,sortable:false,showExp:false,click:true,route:'full-report',width:'130',resisable:true,color:'investore-profile'})
      this.columnsWithCheckbox.push({ name:'enabler', prop:'EnablerName', frozenLeft:true,sortable:false,showExp:true,click:true,route:'enablers',width:'230',resisable:true,color:'enabler',isFaci:true})
      this.columnsWithCheckbox.push({name:'investor_profile_reference_number',prop:'ReferenceCode', frozenLeft:true,sortable:false,showExp:false,click:true,isUser:true,route:'profile-form',width:'200',resisable:true,color:'investore-profile',icon:'fa-money-bills fa-solid',isPublic:this.store.appType=='admin'})
      //(Investor Profile)Profile Name
      this.columnsWithCheckbox.push({ prop: 'ProfileName', name: 'investor_profile_display_name', frozenLeft:false, sortable: false, showExp: false,click:false,route:'profile-form', width: '160', resisable: true ,color:'investore-profile'});
      //(Investor Profile)Contact Name
      this.columnsWithCheckbox.push({ prop:'ContactEmail', name: 'investor_profile_contact_email', frozenLeft:false, sortable: false, showExp: false,click:false,isMail:true, width: '230', resisable: true ,color:'investore-profile'});
      this.columnsWithCheckbox.push({ prop: 'ContactName', name: 'investor_profile_contact_name', frozenLeft:false, sortable: false, showExp: false,click:false,route:'profile-form', width: '180', resisable: true ,color:'investore-profile'});
      this.columnsWithCheckbox.push({ prop: 'CompanyName', name: 'investor_profile_company', frozenLeft:false, sortable: false, showExp: false,click:false, width: '160', resisable: true ,color:'investore-profile',hidden:true});

      this.columnsWithCheckbox.push({ prop: 'ImpactThemesAndAreas', name: 'investor_profile_impact_themes_and_areas', frozenLeft:false, sortable: false, showExp: true,click:false,route:'profile-form',isImpact:true,  width: '300', resisable: true ,color:'investore-profile',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'SDGs', name: 'investor_profile_sdgs', frozenLeft:false,isSDG:true, sortable: false, showExp: true,click:false,route:'profile-form', width: '250', resisable: true ,color:'investore-profile',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'ESG', name: 'investor_profile_esg', frozenLeft:false, sortable: false, showExp: true,click:false,route:'profile-form',isImpact:true,  width: '300', resisable: true ,color:'investore-profile',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'GenderLens', name: 'investor_profile_gender_lens', frozenLeft:false,isGenderLenc:true, sortable: false, showExp: true,click:false,route:'profile-form', width: '250', resisable: true ,color:'investore-profile',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'FundingType', name: 'investor_profile_investment_type', frozenLeft:false, sortable: false, showExp: true,click:false,route:'profile-form', width: '200', resisable: true ,color:'investore-profile',hidden:true});
      this.columnsWithCheckbox.push({prop:'TicketSizePerFunding', name:'investor_profile_ticket_size_per_investment_eur',sortable:false,showExp:false,resisable:true,width:'200',hidden:true })
      // this.columnsWithCheckbox.push({name:'investor_profile_investee_raise_amount_eur',prop:'TotalRaiseAmount',sortable:false,showExp:false,width:'150',resisable:true,color:'investore-profile'})
      this.columnsWithCheckbox.push({name:'matchmaking_result_total_matching_raise_amount_for_investor_profile_eur',prop:'TotalFundraiseAmount',sortable:false,showExp:false,width:'200',resisable:true,color:'matched',hidden:true})
      this.columnsWithCheckbox.push({name:'investor_profile_matchmaking_result_total_matching_investees_for_investor_profile',prop:'TotalMatchingFundraise',sortable:false,showExp:false,click:true,route:'profile-form',extraPath:this.getFromPath(),width:'265',resisable:true,color:'matched'}) //,hidden:true
      this.columnsWithCheckbox.push({name:'total_expressed_interest',prop:'TotalExpressedInterest',FilterType:'introduction_requested',sortable:false,showExp:false,click:true,route:'profile-form',extraPath:this.getFromPath(),width:'150',resisable:true,color:'matched'}) //,hidden:true
      this.columnsWithCheckbox.push({name:'matchmaking_result_total_introductions_with_investees_for_investor_profile',prop:'TotalIntroductionsWithInvestees',FilterType:'introductions',sortable:false,showExp:false,click:true,route:'profile-form',extraPath:this.getFromPath(),width:'200',resisable:true,color:'matched'}) //,hidden:true

    }
    

  }
  setPage(isFirstLoad,pageInfo, event?) {
    let parms='?Keyword='+(this.keyword !=''?encodeURIComponent(this.keyword):'') +'&FN_EnablerSlug='+this.FN_EnablerSlug+'&SortBy='+this.sort+'&PageType='+this.apiAction+"&FilterType="+this.FilterType
    this.page.pageNumber = pageInfo.offset;
    this.isLoading=true
    this.apiService.getResults(this.apiEnd,this.page,parms).subscribe(pagedData => {
      this.isLoading=false
      this.isResize = false;
      this.page = pagedData.page;
      if(pageInfo.offset == 0){
        this.rows =[]
        this.rowsMobile =[]
      }
      this.rows = pagedData[`results`];
      for (let i = 0; i <  this.rows.length; i++) {
        const element =  this.rows[i];
        element.hidden=true
        this.rowsMobile.push(element)        
      }
      this.rowsMobile = this.rowsMobile.reduce((unique, o) => {
        if(!unique.some(obj => obj.FP_EnablerSlug === o.FP_EnablerSlug)) {
          unique.push(o);
        }
        return unique;
    },[]);
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

  getLbl(item,type){
    return item != undefined && item[''+type] !=undefined?item[''+type]:undefined
  }
  trimString(string, length) {
    return string.length > length ? string.substring(0, length) + '...' : string;
  }
  viewMore(row,rowIndex) {
    if (row.moreItem == 2) {
      this.rows[rowIndex].moreItem = row.ImpactThemesAndAreas.length
    } else {
      this.rows[rowIndex].moreItem = 2
    }
  }
  openFullreport(row, actionName,extraPath?,FilterType?){
    let state = {ProfileName:row.ProfileName,ReferenceCode:row.ReferenceCode,FP_EnablerSlug:row.FP_EnablerSlug,action:'full-report'}   
    if(this.pageFrom !='details'){
      this.change.emit({ event: state})
    }
    else{
      let path = this.routePath(row, actionName,extraPath,FilterType)
      this.store.openPage(path,this.openFront)
    }
  }
  routePath(event, actionName,extraPath?,FilterType?) {
    let appendPath=''
    // appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
    if(event.ProfileName != undefined){
      apPath = apPath+'ProfileName='+ this.store.getSetParmsVal(event.ProfileName)
      apPath = apPath+'&FP_EnablerSlug='+ event.FP_EnablerSlug
      apPath = apPath+'&ReferenceCode='+ event.ReferenceCode
    }
    if(FilterType !=undefined){
      apPath = (apPath+'&FilterType='+ FilterType)
      apPath = apPath+'&chipLbl='+(FilterType == 'introductions'?'total_'+FilterType:FilterType)
    }
    let path;
    if(actionName =='enablers')
    path=((this.store.appType=='admin'?'admin':'user')+'/enabler/' + event.EnablerSlug +this.store.getSeprater('user')+ 'overview')
    else if(actionName=='full-report'){      
      if(this.store.appType =='admin'){
        path=('/admin'+this.store.getSeprater(undefined,apPath)+'full-report')
      }
      else{
        path=('/user'+this.store.getSeprater('user',apPath)+'full-report')
      }
    }else if(actionName =='match-report')
    path=((this.store.appType =='admin'?'admin/full-report/':'user/full-report/') +event.FP_EnablerSlug+'/'+this.FN_EnablerSlug+'/detail')
    else{
      let endPoint = actionName
      if(extraPath != undefined){
        endPoint = extraPath
      }
      if(this.store.appType =='admin'){
        if(actionName == 'fundraise-form'){
          path=('admin/'+(actionName=='profile-form'?'funding-profiles':'fundraise-needs')+'-submitted/'+(actionName =='profile-form'?event.FP_EnablerSlug:event.FN_EnablerSlug)+this.store.getSeprater(undefined,apPath)+endPoint)
        }else{
          path=('admin/funding-profiles-submitted/'+(event.FP_EnablerSlug)+this.store.getSeprater(undefined,apPath)+endPoint)
        }
      }
      else{
        if(this.pageFrom == 'details'){
          if(event.IsMyFundingProfile == 1) {
            path = ('user/funding-profile/submissions/'+event.FP_EnablerSlug +this.store.getSeprater('user',apPath)+endPoint);
          }else{
            path = "user/fundraise-need/details/"+this.pageType+"/"+this.FN_EnablerSlug+"/"+event.FP_EnablerSlug+"/fundraise_funding_profile"+this.store.getSeprater('user',apPath)+"profile-form"
          }
        }else{
          path=((event.IsMyFundingProfile==0?'funding-profile/':'user/funding-profile/'+(this.pageFrom =='profile'?'match-report/':'submissions/'))+ event.FP_EnablerSlug + this.store.getSeprater(event.IsMyFundingProfile==0?'':'user',apPath) + endPoint)
        }
      }
    }
    
    return path
  }
  onClick(event, actionName,extraPath?,FilterType?) {
    if(actionName =='match-report'){
      this.openMatching(event)
    }else if(actionName=='full-report'){
      // this.openFullreport(event, actionName,extraPath,FilterType)
      this.store.openPage(this.routePath(event, actionName,extraPath,FilterType),this.openFront)
    }else{      
      this.store.openPage(this.routePath(event, actionName,extraPath,FilterType),undefined,FilterType)
    }
  }
  openPage(url,state?,FilterType?){
    this.store.openPage(url,this.openFront)
  }
  changeAction(event){
    if(event != undefined)
    this.change.emit({ event: event})
  }
  doInfinitePage(event) {
    this.setPage(true,{offset:(this.rowsMobile.length / 10)},event)
  }
  callIntroduce(type,row){

    let eslug = row.EnablerSlug;
    let pslug = ((row.FP_EnablerSlug != undefined && row.FP_EnablerSlug !='')?row.FP_EnablerSlug:'');
    let fslug = ((row.FN_EnablerSlug != undefined && row.FN_EnablerSlug !='')?row.FN_EnablerSlug:this.FN_EnablerSlug);
    ((row.FP_EnablerSlug != undefined && row.FP_EnablerSlug !='')?row.FP_EnablerSlug:'')

    this.apiService.getIntroduceInfo(eslug,pslug,fslug,type).subscribe(async response => {
      let res: any = response;
      if(!res.success){
        this.store.showToast(res.message,5000,'error','middle')
      }else{
        let url = ('introduce/'+eslug+'/'+pslug+'/'+fslug+'/matching-funding-profiles/'+(this.pageFrom == undefined || this.pageFrom == ''?'list':this.pageFrom.toLowerCase())+'/'+type)
        this.router.navigateByUrl(url);
        // this.store.openPage(url,'1')
      }
      return res.success
    });
  }
  callRequest(item,isView?){
    //PitchRequestStatus
    let apiEnd='fundraise/'
    let type='view'
    let postData = new FormData();
    postData.append("FN_EnablerSlug", item.FN_EnablerSlug);
    if(item.PitchRequestStatus == undefined || item.PitchRequestStatus =='' || item.PitchRequestStatus =='blank'){
      apiEnd=apiEnd+'add_pitch_request'
      type='add'
      postData.append("FP_EnablerSlug", item.FP_EnablerSlug);
    }else{
      apiEnd=apiEnd+'view_pitch'
      postData.append("RequestStatus", 'approved');      
    }
    if(item.PitchRequestStatus != 'approved' && !isView){
      this.apiService.pitchCall(type, apiEnd, postData).subscribe(response => {
        let res: any = response;
        if (res.success) {
          this.setPage(false,{offset:0})
        }
        if(type =='add')
        this.store.showToast(res.message, 2000,!res.success?'error':undefined);        
      });
    }else{
      this.openPage('user/'+item.FP_EnablerSlug+'/'+item.FN_EnablerSlug+'/funding-profile-match-report/pitch-view')   
    }
  }
}
