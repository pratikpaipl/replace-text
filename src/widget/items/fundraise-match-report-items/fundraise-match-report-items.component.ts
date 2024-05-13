import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, HostListener, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { Page } from '../model/page.class';
import { ResponseTbl } from '../model/response-tbl.class';
import { Router } from '@angular/router';

@Component({
  selector: 'fundraise-match-report-items',
  templateUrl: './fundraise-match-report-items.component.html',
  styleUrls: ['./fundraise-match-report-items.component.scss'],
})
export class FundraiseMatchReportItemsComponent implements OnInit, OnDestroy {

  // expanded=false

  @ViewChild('myTable') table: any;

  optionsWithCheckbox = {}
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
  FP_EnablerSlug: any = ''
  @Input()
  FilterType: any = ''

  @Input()
  displayMode:any=1
  @Input()
  itemActionType: any
  
  @Input()
  updateTime: any = 0

  keyword: string = '';
  sort: string = 'recent';

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
  apiAction: string = '';

  isShowMsg = false;
  isShowField = false;
  summaryList = [];
  PermissionTextKey = [];
  limit = 10;
  EnablerTotal = 0;

  private refreshData: any;

  page = new Page();
  rows:any = Array<ResponseTbl>();
  rowsMobile:any = Array<ResponseTbl>();

  isLoading=false;
  isResize=false
  isMobile=false

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public store: StorageService,public router: Router,  private eventService: EventService, public apiService: ApiService) {

    this.page.pageNumber = 0;
    this.page.size = 10;

    this.refreshData = this.eventService.applyRefreshData$.subscribe((item: any) => {
      if ((item.segment == 'fundraise-need-match-report') && item.reload)
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

  ngOnDestroy() {
    this.refreshData.unsubscribe();
  }

  ngOnInit() {
    this.optionsWithCheckbox = {
      checkboxes: false,
    }
    this.setColumns()
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
      this.columnsWithCheckbox.push({ prop: '',name:'matching_parameters',frozenLeft:true,sortable:false,showExp:false,click:true,route:'match-report',width:'180',resisable:true})
      this.columnsWithCheckbox.push({ prop: '',name:'see_matchmaking_report',frozenLeft:true,sortable:false,showExp:false,click:true,route:'full-report',width:'130',resisable:true})
      this.columnsWithCheckbox.push({name:'enabler',prop:'EnablerName',frozenLeft:true,sortable:false,showExp:true,click:true,route:'enablers',width:'230',resisable:true,color:'enabler',isFaci:true})
      
      this.columnsWithCheckbox.push({name:'matchmaking_result_match_with_investment_raise',prop:'FNPercentage', frozenLeft:false,sortable:false,isPer:true,showExp:false,width:'180',resisable:true,color:'matched'})
      this.columnsWithCheckbox.push({name:'matchmaking_result_match_with_investor_profile',prop:'FPPercentage', frozenLeft:false,sortable:false,isPer:true,showExp:false,width:'180',resisable:true,color:'matched'})
      
      this.columnsWithCheckbox.push({ prop: 'LastIntroduceDate', name: 'last_introduce_date', frozenLeft:false, sortable: false, showExp: false,click:false,route:'fundraise-form', width: '250',isDate:true, resisable: true ,icon:'fa-regular fa-handshake',color:'enabler',isLastIntroduce:'var(--ion-color-dark-green)',apiType:'funding_profile_fundraise'});

  
      this.columnsWithCheckbox.push({ prop: 'ReferenceCode', name: 'investment_raise_reference_number', frozenLeft: false, sortable: false, showExp: false,click:true,isUser:true,route:'fundraise-form', width: '200', resisable: true ,isColor:true,color:'investment-raise',icon:'fa-rocket fa-solid',isPublic:this.store.appType=='admin' });
      this.columnsWithCheckbox.push({ prop: 'CompanyName', name: 'investment_raise_company_name', sortable: false, showExp: false, width: '180', resisable: true ,isColor:true,color:'investment-raise'});//,hidden:true
      this.columnsWithCheckbox.push({ prop: 'ContactName', name: 'investment_raise_contact_name', sortable: false, showExp: false, width: '160', frozenLeft: false, resisable: true,isColor:true,color:'investment-raise', });//hidden:true
      if(this.store.appType =='admin')
      this.columnsWithCheckbox.push({ prop:'ContactEmail', name: 'investment_raise_contact_email', frozenLeft:false, sortable: false, showExp: false,isMail:true, click:false, width: '230', resisable: true ,color:'investment-raise',});//hidden:true
      
      this.columnsWithCheckbox.push({ prop: 'ImpactThemesAndAreas', name: 'matchmaking_result_matching_impact_themes_and_areas', frozenLeft:false, sortable: false, showExp: true,click:false,route:'fundraise-form',isImpact:true,  width: '300', resisable: true ,color:'matched',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'SDGs', name: 'matchmaking_result_matching_sdgs', frozenLeft:false,isSDG:true, sortable: false, showExp: true,click:false,route:'fundraise-form', width: '250', resisable: true ,color:'matched',hidden:true});

      this.columnsWithCheckbox.push({ prop: 'ESG', name: 'matchmaking_result_matching_esg', frozenLeft:false, sortable: false, showExp: true,click:false,route:'fundraise-form',isImpact:true,  width: '300', resisable: true ,color:'matched',hidden:true});

      this.columnsWithCheckbox.push({ prop: 'GenderLens', name: 'matchmaking_result_matching_gender_lens', frozenLeft:false,isGenderLenc:true, sortable: false, showExp: true,click:false,route:'fundraise-form', width: '250', resisable: true ,color:'matched',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'FundingType', name: 'matchmaking_result_matching_investment_type', frozenLeft:false, sortable: false, showExp: false,click:false,route:'fundraise-form', width: '200', resisable: true ,color:'matched',hidden:true});

      this.columnsWithCheckbox.push({name:'investor_profile_expressed_interest',prop:'FPReactionValueKey', frozenLeft:false,sortable:false,isPer:false,showExp:false,isDrop:true,width:'180',resisable:true,color:'investore-profile',appType:'funding_profile'})//hidden:true
      // if(this.store.appType == 'admin')
      this.columnsWithCheckbox.push({name:'investment_raise_expressed_interest',prop:'FNReactionValueKey', frozenLeft:false,sortable:false,showExp:false,isDrop:true,width:'230',resisable:true,isColor:true,color:'investment-raise',appType:'fundraise'})//hidden:true

      this.columnsWithCheckbox.push({name:'matchmaking_result_total_matching_investors_for_investment_raise',prop:'TotalMatchingFundingProfiles',sortable:false,showExp:false,click:true,route:'fundraise-form', extraPath:this.getFromPath(),width:'230',resisable:true,color:'matched',})//hidden:true
      this.columnsWithCheckbox.push({name:'matchmaking_result_total_introductions_with_investors_for_investment_raise',prop:'TotalIntroductionsWithInvestors',sortable:false,showExp:false,click:true,route:'fundraise-form', extraPath:this.getFromPath(),FilterType:'introductions',width:'200',resisable:true,color:'matched',})//hidden:true

      this.columnsWithCheckbox.push({ prop: 'TotalRaise', name: 'investment_raise_raise_amount_eur', sortable: false, showExp: false, width: '160', frozenLeft: false, resisable: true,isColor:true,color:'investment-raise',hidden:true });


      // if (this.store.appType =='front')
      this.columnsWithCheckbox.push({name: 'investor_profile_access_to_pitch',prop:'PitchRequestStatus',sortable:false,showExp:false,click:false,isPitch:true,isInvestor:true,width:'200',resisable:true,hidden:true})
      this.columnsWithCheckbox.push({name: 'access_to_pitch',prop:'PitchRequestStatus',sortable:false,showExp:false,click:false,isPitch:true,isInvestee:true,width:'200',resisable:true,hidden:true})

      // this.columnsWithCheckbox.push({name: 'pitch',prop:'PitchRequestStatus',sortable:false,showExp:false,click:false,isPitch:true,width:'180',resisable:true})
  
    }
    if (this.pageFrom == 'list' ||this.pageFrom == 'profile'){
      this.columnsWithCheckbox.push({ prop: '', name:'see_matchmaking_report',frozenLeft:true,sortable:false,showExp:false,click:true,route:'full-report',width:'130',resisable:true})
      this.columnsWithCheckbox.push({ prop:'EnablerName', name:'enabler',frozenLeft:true,sortable:false,showExp:true,click:true,route:'enablers',width:'230',resisable:true,color:'enabler',isFaci:true})
      this.columnsWithCheckbox.push({ prop: 'ReferenceCode', name: 'investment_raise_reference_number', frozenLeft: true, sortable: false, showExp: false,click:true,isUser:true,route:'fundraise-form', width: '200', resisable: true ,isColor:true,color:'investment-raise',icon:'fa-rocket fa-solid',isPublic:this.store.appType=='admin' });
      this.columnsWithCheckbox.push({ prop: 'CompanyName', name: 'investment_raise_company_name', sortable: false, showExp: false, width: '180', resisable: true ,isColor:true,color:'investment-raise'});
      this.columnsWithCheckbox.push({ prop: 'ContactName', name: 'investment_raise_contact_name', sortable: false, showExp: false, width: '160', frozenLeft: false, resisable: true,isColor:true,color:'investment-raise' });
      this.columnsWithCheckbox.push({ prop: 'ContactEmail', name: 'investment_raise_contact_email', frozenLeft:false, sortable: false, showExp: false,click:false, isMail:true, width: '230', resisable: true ,color:'investment-raise'});

      this.columnsWithCheckbox.push({ prop: 'ImpactThemesAndAreas', name: 'investment_raise_impact_themes_and_areas', frozenLeft:false, sortable: false, showExp: true,click:false,route:'fundraise-form',isImpact:true,  width: '300', resisable: true ,color:'investment-raise',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'SDGs', name: 'investment_raise_sdgs', frozenLeft:false,isSDG:true, sortable: false, showExp: true,click:false,route:'fundraise-form', width: '250', resisable: true ,color:'investment-raise',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'ESG', name: 'investment_raise_esg', frozenLeft:false, sortable: false, showExp: true,click:false,route:'fundraise-form',isImpact:true,  width: '300', resisable: true ,color:'investment-raise',hidden:true});

      this.columnsWithCheckbox.push({ prop: 'GenderLens', name: 'investment_raise_gender_lens', frozenLeft:false,isGenderLenc:true, sortable: false, showExp: true,click:false,route:'fundraise-form', width: '250', resisable: true ,color:'investment-raise',hidden:true});
      this.columnsWithCheckbox.push({ prop: 'FundingType', name: 'investment_raise_investment_type', frozenLeft:false, sortable: false, showExp: false,click:false,route:'fundraise-form', width: '200', resisable: true ,color:'investment-raise',hidden:true});

      this.columnsWithCheckbox.push({prop:'TotalRaise', name:'investment_raise_raise_amount_eur',sortable:false,showExp:false,resisable:true,width:'200',color:'investment-raise',hidden:true })
      this.columnsWithCheckbox.push({name:'investment_raise_minimum_ticket_size_per_investment_eur',prop:'TicketSizePerInvestor',sortable:false,showExp:false,width:'200',resisable:true,color:'investment-raise',hidden:true})

      this.columnsWithCheckbox.push({name:'matchmaking_result_total_matching_investors_for_investment_raise',prop:'TotalMatchingFundingProfiles',sortable:false,showExp:false,width:'200',resisable:true,click:true,route:'fundraise-form', extraPath:this.getFromPath(),color:'matched'})//,hidden:true
      this.columnsWithCheckbox.push({name:'total_expressed_interest',prop:'TotalExpressedInterest',FilterType:'introduction_requested',sortable:false,showExp:false,click:true,route:'fundraise-form', extraPath:this.getFromPath(),width:'160',resisable:true,color:'matched'})//,hidden:true
      this.columnsWithCheckbox.push({name:'matchmaking_result_total_introductions_with_investors_for_investment_raise',prop:'TotalIntroductionsWithInvestors',sortable:false,showExp:false,click:true,route:'fundraise-form', extraPath:this.getFromPath(),FilterType:'introductions',width:'230',resisable:true,color:'matched'}) //,hidden:true
      // TotalFundingProfileTicketSizePerFunding
      this.columnsWithCheckbox.push({name:'matchmaking_result_total_matching_investment_amount_eur_for_investment_raise',prop:'TotalFundingProfileTicketSize',sortable:false,showExp:false,click:false,width:'230',resisable:true,color:'matched'}) //,hidden:true

    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    this.callApi();
  }
  
  getFromPath() {
    // return this.pageFrom=='profile'?'matching-funding-profiles':'funding-profile-match-report';
    return 'funding-profile-match-report';
  }
  // return this.pageFrom=='profile'?'matched-fundraise-needs':'fundraise-need-match-report';
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
  openMatching(item) {
    this.openPage((this.store.appType =='admin'?'admin/full-report/':'user/full-report/') + this.FP_EnablerSlug + '/' + item.FN_EnablerSlug + '/detail')
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
      postData.append("FP_EnablerSlug", this.FP_EnablerSlug);
    }else{
      apiEnd=apiEnd+'view_pitch'
      postData.append("RequestStatus", 'approved');      
    }
    if(!isView){
    this.apiService.pitchCall(type, apiEnd, postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        this.setPage(false,{offset:0})
      }
      if(type =='add')
      this.store.showToast(res.message, 2000,!res.success?'error':undefined);
      else{
        this.openPage('user/'+this.FP_EnablerSlug+'/'+item.FN_EnablerSlug+'/funding-profile-match-report/pitch-view')
        
      }
    });
    }else{
      this.openPage('user/'+item.FP_EnablerSlug+'/'+item.FN_EnablerSlug+'/funding-profile-match-report/pitch-view')   
    }
  }
  changeStatus(type, endPoint, rType, row,value,rowIndex?) {
    // row.cassette1Bill = '22';
    let postData = new FormData();
    postData.append("ReactionType", rType);
    postData.append("ReactionValue", value);
    postData.append("FP_EnablerSlug", this.FP_EnablerSlug);
    postData.append("FN_EnablerSlug", row.FN_EnablerSlug);
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
        }
        this.store.showToast(res.message, 2000);
      }
    });

  }
  changePitchStatus(type,endPoint,row) {
    // row.cassette1Bill = '22';
    let postData = new FormData();
    postData.append("RequestStatus", row.PitchRequestStatus);
    postData.append("FN_EnablerSlug", row.FN_EnablerSlug);
    postData.append("FP_EnablerSlug", this.FP_EnablerSlug);
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
      }else if( event.FunctionName =='changePitchStatus'){
        this[''+event.FunctionName]('fundraise',event.endPoint,event.Item)
      }else if(event.FunctionName =='onClick' && event.route == 'full-report'){
        this[''+event.FunctionName](event.Item,event.route,event.extraPath,event.FilterType)
      }else if(event.FunctionName =='onClick'){
        if(event.route == 'fundraise-form')
        this[''+event.FunctionName](event.Item,event.route,event.extraPath,event.FilterType)
        else
        this[''+event.FunctionName](event.Item,this.getFromPath(),event.extraPath,event.FilterType)
        // this[''+event.FunctionName](event.Item,event.route)
      }
      else if(event.FunctionName =='callRequest'){
        this[''+event.FunctionName](event.Item,event.isView)
      }else if(event.item != undefined){
        this.rowsMobile[Index].FPExpressedInterestKey = event.item.FPExpressedInterestKey=='remove'?undefined:event.item.FPExpressedInterestKey
        this.rowsMobile[Index].FPReactionValueKey=event.item.FPReactionValueKey=='remove'?undefined:event.item.FPReactionValueKey
  
        this.rowsMobile[Index].FNExpressedInterestKey = event.item.FNExpressedInterestKey=='remove'?undefined:event.item.FNExpressedInterestKey
        this.rowsMobile[Index].FNReactionValueKey = event.item.FNReactionValueKey=='remove'?undefined:event.item.FNReactionValueKey
      }else{
        this.change.emit({ event: event.row})
      }
    }
  }
  
  onSelect(row) {
  }
  callApi() {
    this.setPage(false,{offset:0})
  }
  setPage(isFirstLoad,pageInfo, event?) {
    let parms='?Keyword='+(this.keyword !=''?encodeURIComponent(this.keyword):'') +'&FP_EnablerSlug='+this.FP_EnablerSlug+'&SortBy='+this.sort+'&PageType='+this.apiAction+"&FilterType="+this.FilterType
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
        if(!unique.some(obj => obj.FN_EnablerSlug === o.FN_EnablerSlug)) {
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
  openFullreport(row, actionName,extraPath?,FilterType?) {

    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
    // if(row.CompanyName != undefined){
      apPath = apPath+(row.CompanyName != undefined?'CompanyName='+ this.store.getSetParmsVal(row.CompanyName):'')
      apPath = apPath+'&FN_EnablerSlug='+ row.FN_EnablerSlug
      apPath = apPath+'&ReferenceCode='+ row.ReferenceCode
    // }
    if (this.pageFrom != 'details'){
      this.change.emit({ event: row })
    }
    else {      
      let path = this.routePath(row, actionName,extraPath,FilterType)
      this.store.openPage(path,this.openFront)
    }
  }
  onClick(event, actionName,extraPath?,FilterType?) {
    if(actionName =='match-report'){
      this.openMatching(event)      
    }else if(actionName=='full-report'){
      this.store.openPage(this.routePath(event, actionName,extraPath,FilterType),this.openFront)
    }else{
      this.store.openPage(this.routePath(event, actionName,extraPath,FilterType),this.openFront)
    }
  }
  routePath(event, actionName,extraPath?,FilterType?) {

    let appendPath=''
    // appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
    if(event.CompanyName != undefined){
      apPath = apPath+'CompanyName='+ this.store.getSetParmsVal(event.CompanyName)
      apPath = apPath+'&FN_EnablerSlug='+ event.FN_EnablerSlug
      apPath = apPath+'&ReferenceCode='+ event.ReferenceCode
    }
    if(FilterType !=undefined){

      apPath = (apPath+'&FilterType='+ FilterType)
      apPath = apPath+'&chipLbl='+(FilterType == 'introductions'?'total_'+FilterType:FilterType)
    }

    let path;
    if (actionName == 'enablers')
    path = ((this.store.appType=='admin'?'admin':'user')+'/enabler/' + event.EnablerSlug +this.store.getSeprater('user')+ 'overview')
    else if(actionName =='match-report')
    path=((this.store.appType =='admin'?'admin/full-report/':'user/full-report/') +this.FP_EnablerSlug+'/'+event.FN_EnablerSlug+'/detail')    
    else if(actionName=='full-report'){
      if(this.store.appType =='admin')
      path=('/admin'+this.store.getSeprater(undefined,apPath)+'full-report')
      else
      path=('/user'+this.store.getSeprater('user',apPath)+'full-report')
    }
    else{

      let endPoint = actionName
      if(extraPath != undefined){
        endPoint = extraPath
      }
      if(this.store.appType =='admin'){
        if(actionName == 'profile-form'){
          path=('admin/'+(actionName=='profile-form'?'funding-profiles':'fundraise-needs')+'-submitted/'+(actionName =='profile-form'?event.FP_EnablerSlug:event.FN_EnablerSlug)+this.store.getSeprater(undefined,apPath)+endPoint)
        }else{
          path=('admin/fundraise-needs-submitted/'+(event.FN_EnablerSlug)+this.store.getSeprater(undefined,apPath)+endPoint)
        }
      }
      else{
        if(this.pageFrom == 'details'){
          if(event.IsMyFundraise == 1) {
            path = ('user/fundraise-need/submissions/'+event.FN_EnablerSlug+this.store.getSeprater('user',apPath)+endPoint );
          }else{
            path = "user/funding-profile/details/"+this.pageType+"/"+event.FN_EnablerSlug+"/"+this.FP_EnablerSlug+"/funding_profile_fundraise"+this.store.getSeprater('user',apPath)+"fundraise-form"
          }

        }else{
          path = ((event.IsMyFundraise==0 ?'fundraise/':'user/fundraise-need/'+(this.pageFrom =='profile'?'match-report/':'submissions/'))+ event.FN_EnablerSlug + this.store.getSeprater(event.IsMyFundraise==0?'':'user',apPath) +endPoint)
        }
      }
    }
    return path
  }
  openPage(url,FilterType?){
    this.store.openPage(url,this.openFront)
  }
  doInfinitePage(event) {
    this.setPage(true,{offset:(this.rowsMobile.length / 10)},event)
  }
  changeAction(event){
  }
  callIntroduce(type,row){
    let eslug = row.EnablerSlug;
    let pslug = ((row.FP_EnablerSlug != undefined && row.FP_EnablerSlug !='')?row.FP_EnablerSlug:this.FP_EnablerSlug);
    let fslug = ((row.FN_EnablerSlug != undefined && row.FN_EnablerSlug !='')?row.FN_EnablerSlug:this.FP_EnablerSlug);
    ((row.FP_EnablerSlug != undefined && row.FP_EnablerSlug !='')?row.FP_EnablerSlug:'')
    this.apiService.getIntroduceInfo(eslug,pslug,fslug,type).subscribe(async response => {
      let res: any = response;
      if(!res.success){
        this.store.showToast(res.message,5000,'error','middle')
      }else{
        let url = ('introduce/'+eslug+'/'+pslug+'/'+fslug+'/matched-fundraise-needs/'+(this.pageFrom == undefined || this.pageFrom == ''?'list':this.pageFrom.toLowerCase())+'/'+type)
        this.store.openPage(url,'1')
      }
      return res.success
    });
  }
}
