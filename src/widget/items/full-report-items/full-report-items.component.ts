import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, HostListener, OnChanges, TemplateRef, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { Router } from '@angular/router';
import { Page } from '../model/page.class';
import { ResponseTbl } from '../model/response-tbl.class';

@Component({
  selector: 'full-report-items',
  templateUrl: './full-report-items.component.html',
  styleUrls: ['./full-report-items.component.scss'],
})
export class FullReportItemsComponent implements OnInit,OnChanges, OnDestroy {

  // expanded=false
  @ViewChild('myTable') table: any;

  fullreport = [];
  optionsWithCheckbox = {}
  columnsWithCheckbox: any = [];
  columns = [];

  @Input()
  apiEnd:any='report/full_report';
  @Input()
  EnablerFilterType: any = ''
  @Input()
  UserSlug: any = ''
  @Input()
  EnablerSlug: any = ''
  @Input()
  FN_EnablerSlug: any = ''
  @Input()
  FP_EnablerSlug: any = ''


  @Input()
  ActionType: any = ''

  @Input()
  itemActionType: any
  @Input()
  ExtraViewType: any=''

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
  updateTime:any=0

  @Input()
  displayMode:any = 1


  keyword: string = '';
  sort: string = 'recent';

  @Input()
  apiAction: string = '';

  isShowMsg = false;
  isShowField = false;
  PermissionTextKey = [];
  limit = 20;
  EnablerTotal = 0;

  private removeData: any;
 
  page = new Page();
  rows:any = Array<ResponseTbl>();
  rowsMobile:any = Array<ResponseTbl>();
  isLoading=false;
  isResize=false
  isMobile=false

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('cellTpl') cellTpl: TemplateRef<any>;
  @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;


  constructor(public store: StorageService, private eventService: EventService, public apiService: ApiService,private router:Router) {
    this.page.pageNumber = 0;
    this.page.size = 10;

    this.removeData = this.eventService.removeData$.subscribe(async (item: any) => {
      this.FN_EnablerSlug=item.FN_EnablerSlug
      this.FP_EnablerSlug=item.FP_EnablerSlug
      this.EnablerSlug=item.EnablerSlug
      this.UserSlug=item.UserSlug
      this.EnablerFilterType=item.EnablerFilterType
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
    getTitle(item){
    let titl=''
    titl=(item.FPReferenceCode != undefined?item.FPReferenceCode:item.ReferenceCode)+' < > '+(item.FNReferenceCode != undefined?item.FNReferenceCode:item.ReferenceCode)
    return titl
  }
  getParamData() {
    // this.keyword = this.store.getFilterFromUrl('keyword','');
    // this.sort = this.store.getFilterFromUrl('sort', this.sort);
    // this.from = item.pageFrom
  }


  ngOnDestroy() {
    if(this.removeData !=undefined)
      this.removeData.unsubscribe()
  }

  ngOnInit() {
    this.columns = [
      {
        cellTemplate: this.cellTpl,
        headerTemplate: this.hdrTpl,
      },
    ]
   
    this.optionsWithCheckbox = {
      checkboxes: false,
    }
    
    this.columnsWithCheckbox.push({name:'matching_parameters',prop:'',frozenLeft:true,sortable:false,showExp:false,click:true,route:'match-report',width:'180',resisable:true})
    this.columnsWithCheckbox.push({name:'enabler_name',prop:'EnablerName',frozenLeft:true,sortable:false,showExp:false,click:false,route:'enablers',width:'160',resisable:true,isFaci:true,color:'enabler'})

    this.columnsWithCheckbox.push({name:'matchmaking_result_match_with_investment_raise',prop:'FNPercentage',frozenLeft:false,sortable:false,showExp:false,click:false,isPer:true,route:'',width:'200',resisable:true,isColor:true,color:'matched'})
    this.columnsWithCheckbox.push({name:'matchmaking_result_match_with_investor_profile',prop:'FPPercentage',frozenLeft:false,sortable:false,showExp:false,click:false,isPer:true,route:'',width:'200',resisable:true,color:'matched'})

    this.columnsWithCheckbox.push({ prop: 'LastIntroduceDate', name: 'last_introduce_date', frozenLeft:false, sortable: false, showExp: false,click:false,route:'fundraise-form', width: '250',isDate:true, resisable: true ,icon:'fa-regular fa-handshake',color:'enabler',isLastIntroduce:'var(--ion-color-dark-green)'});

    this.columnsWithCheckbox.push({name:'investor_profile_reference_number',prop:'FPReferenceCode',frozenLeft:false,sortable:false,showExp:false,click:true,route:'profile',width:'200',resisable:true,icon:'fa-money-bill-transfer fa-solid',color:'investore-profile',hidden:true})
    this.columnsWithCheckbox.push({name:'investor_profile_display_name',prop:'FPProfileName',frozenLeft:false,sortable:false,showExp:false,click:false,route:'',width:'160',resisable:true,color:'investore-profile',hidden:true})
    if(this.store.appType =='admin' || this.pageFrom =='profile')
    this.columnsWithCheckbox.push({name:'investor_profile_contact_name',prop:'FPContactName',frozenLeft:false,sortable:false,showExp:false,click:false,route:'',width:'160',resisable:true,color:'investore-profile',hidden:true})
 
    if(this.store.appType =='admin'){
      this.columnsWithCheckbox.push({name:'investor_profile_contact_email',prop:'FPContactEmail',frozenLeft:false,isMail:true,sortable:false,showExp:false,click:true,route:'',width:'160',resisable:true,color:'investore-profile',hidden:true})
      this.columnsWithCheckbox.push({ prop:'FPCompanyName', name: 'investor_profile_company', frozenLeft:false, sortable: false, showExp: false,click:false, width: '160', resisable: true ,color:'investore-profile',hidden:true});
    }

    this.columnsWithCheckbox.push({name:'investment_raise_reference_number',prop:'FNReferenceCode',frozenLeft:false,sortable:false,showExp:false,click:this.store.appType=='admin',route:'fundraise',width:'200',resisable:true,isColor:true,icon:'fa-rocket fa-solid',color:'investment-raise',hidden:true })
    this.columnsWithCheckbox.push({name:'investment_raise_company_name',prop:'FNCompanyName',frozenLeft:false,sortable:false,showExp:false,click:false,route:'',width:'160',resisable:true,isColor:true,color:'investment-raise',hidden:true})

    if(this.store.appType =='admin' || this.pageFrom =='profile')
    this.columnsWithCheckbox.push({name:'investment_raise_contact_name',prop:'FNContactName',frozenLeft:false,sortable:false,showExp:false,click:false,route:'',width:'160',resisable:true,isColor:true,color:'investment-raise',hidden:true})
 
    if(this.store.appType =='admin')
    this.columnsWithCheckbox.push({name:'investment_raise_contact_email',prop:'FNContactEmail',frozenLeft:false,sortable:false,showExp:false,click:false,isMail:true,route:'',width:'160',resisable:true,color:'investment-raise',hidden:true})

    this.columnsWithCheckbox.push({ prop: 'ImpactThemesAndAreas', name: 'matchmaking_result_matching_impact_themes_and_areas', frozenLeft:false, sortable: false, showExp: true,click:false,isImpact:true,  width: '300', resisable: true ,color:'matched',hidden:true});
    this.columnsWithCheckbox.push({ prop: 'SDGs', name: 'matchmaking_result_matching_sdgs', frozenLeft:false,isSDG:true, sortable: false, showExp: true,click:false,width: '200', resisable: true ,color:'matched',hidden:true});
    this.columnsWithCheckbox.push({ prop: 'ESG', name: 'matchmaking_result_matching_esg', frozenLeft:false, sortable: false, showExp: true,click:false,isImpact:true,  width: '300', resisable: true ,color:'matched',hidden:true});

    this.columnsWithCheckbox.push({ prop: 'GenderLens', name: 'matchmaking_result_matching_gender_lens', frozenLeft:false,isGenderLenc:true, sortable: false, showExp: true,click:false, width: '200', resisable: true ,color:'matched',hidden:true});
    this.columnsWithCheckbox.push({ prop: 'FundingType', name: 'matchmaking_result_matching_investment_type', frozenLeft:false, sortable: false, showExp: false,click:false, width: '160', resisable: true ,color:'matched',hidden:true});

    this.columnsWithCheckbox.push({name:'investor_profile_expressed_interest',prop:'FPExpressedInterest',frozenLeft:false,sortable:false,showExp:false,click:false,route:'',isDrop:true,width:'160',resisable:true,color:'investore-profile',hidden:true})
    this.columnsWithCheckbox.push({name:'investment_raise_expressed_interest',prop:'FNExpressedInterest',frozenLeft:false,sortable:false,showExp:false,click:false,route:'',isDrop:true,width:'160',resisable:true,isColor:true,color:'investment-raise',hidden:true})    

    // if(this.store.appType =='admin'){
      this.columnsWithCheckbox.push({name:'investor_profile_matchmaking_result_total_matching_investees_for_investor_profile',prop:'TotalMatchingFundraiseNeed',frozenLeft:false,sortable:false,showExp:false,click:true,route:'profile',extraPath:'fundraise-need-match-report',width:'265',resisable:true,color:'matched',hidden:true})    
      this.columnsWithCheckbox.push({name:'matchmaking_result_total_introductions_with_investees_for_investor_profile',prop:'TotalIntroductionsWithFundraiseNeed',frozenLeft:false,sortable:false,showExp:false,click:true,route:'profile',FilterType:'introductions',extraPath:'fundraise-need-match-report',width:'200',resisable:true,color:'matched',hidden:true})   
      this.columnsWithCheckbox.push({name:'matchmaking_result_total_matching_investors_for_investment_raise',prop:'TotalMatchingFundingProfile',frozenLeft:false,sortable:false,showExp:false,click:true,route:'fundraise',extraPath:'funding-profile-match-report',width:'200',resisable:true,isColor:true,color:'matched',hidden:true})    
      this.columnsWithCheckbox.push({name:'matchmaking_result_total_introductions_with_investors_for_investment_raise', prop:'TotalIntroductionsWithFundingProfile', frozenLeft:false,sortable:false,showExp:false,click:true,route:'fundraise',FilterType:'introductions',extraPath:'funding-profile-match-report',width:'200',resisable:true,isColor:true,color:'matched',hidden:true})
    // }

    this.columnsWithCheckbox.push({name: 'investor_profile_access_to_pitch',prop:'PitchRequestStatus',sortable:false,showExp:false,click:false,isPitch:true,isInvestor:true,width:'200',resisable:true,hidden:true})
    this.columnsWithCheckbox.push({name: 'access_to_pitch',prop:'PitchRequestStatus',sortable:false,showExp:false,click:false,isPitch:true,isInvestee:true,width:'200',resisable:true,hidden:true})

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    this.callApi();  
  }

  toggleExpandRow(row,rowIndex) {
    this.rows[rowIndex].expanded= this.rows[rowIndex].expanded !=undefined ? !this.rows[rowIndex].expanded:true
  }
  getRowHeight(row) {
    if (!row.expanded) {
      return 60;
    }
    if (row.expanded) {
      return 'auto';
    }
    return row.height;
  }
  onDetailToggle(event) {
  }

  changeStatus(type,endPoint,rType,row,rParm) {
    let postData = new FormData();
    postData.append("ReactionType", rType);
    postData.append("ReactionValue", row[rParm]);
    postData.append("FN_EnablerSlug", row.FN_EnablerSlug);
    postData.append("FP_EnablerSlug", row.FP_EnablerSlug);
    this.apiService.update(type, endPoint, postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        if(res.data != undefined) {
          this.change.emit({ TotalExpressedInterest: res.data.TotalExpressedInterest,rType:row[rParm] })
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
    postData.append("FP_EnablerSlug", row.FP_EnablerSlug);
    this.apiService.update(type, endPoint, postData).subscribe(response => {
      // let res = this.store.getReponseData(response)
      let res: any = response;
      if (res.success) {
        if(res.data != undefined) {
          // this.change.emit({ TotalExpressedInterest: res.data.TotalExpressedInterest })
        }
        this.store.showToast(res.message, 2000);
      }
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
  callAction(event,Index?) {
    if(event != undefined){
      if(event.FunctionName =='changeStatus'){
        this[''+event.FunctionName](event.type,event.endPoint,event.rType,event.row,event.rParm)
      }else  if(event.FunctionName =='callIntroduce'){
        this[''+event.FunctionName](event.type,event.row)
      }else if(event.FunctionName =='onClick'){
        this.openReport(event.route,event.Item,event.extraPath,event.FilterType)
      }else if( event.FunctionName =='changePitchStatus'){
        this[''+event.FunctionName]('fundraise',event.endPoint,event.Item)
      }else if(event.FunctionName =='callRequest'){
        this[''+event.FunctionName](event.Item,event.isView)
      }else if(event.item != undefined){
       this.rowsMobile[Index].FPExpressedInterestKey = event.item.FPExpressedInterestKey=='remove'?undefined:event.item.FPExpressedInterestKey
      this.rowsMobile[Index].FNExpressedInterestKey = event.item.FNExpressedInterestKey=='remove'?undefined:event.item.FNExpressedInterestKey
      }
      else{
        this.change.emit({ event: event.row})
      }
    }
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
  onSelect(row){
  }
  callApi() {
    this.setPage(false,{offset:0})
  }
  setPage(isFirstLoad,pageInfo, event?) {
    let parms='?EnablerSlug='+this.EnablerSlug+'&FN_EnablerSlug='+this.FN_EnablerSlug+'&FP_EnablerSlug='+this.FP_EnablerSlug+'&UserSlug='+this.UserSlug+'&EnablerFilterType='+this.EnablerFilterType +'&Keyword='+(this.keyword !=''?encodeURIComponent(this.keyword):'') +'&SortBy='+this.sort+'&PageType='+this.apiAction+"&ExtraViewType="+this.ExtraViewType
    this.page.pageNumber = pageInfo.offset;
    this.isLoading=true
    this.apiService.getResults(this.apiEnd,this.page,parms).subscribe(pagedData => {
      this.isLoading=false
      this.isResize = false;
      this.page = pagedData.page;
      if(pageInfo.offset == 0){
        this.rows=[]
        this.rowsMobile=[]
      }
      this.rows = pagedData[`results`];
      for (let i = 0; i <  this.rows.length; i++) {
        const element = this.rows[i];
        element.hidden=true
        this.rowsMobile.push(element)
      }
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
  openEnabler(type,item,FilterType?){
     this.openPage(this.routePath(type,item,undefined,FilterType))
  }
  openReport(type,item,extraPath?,FilterType?){
    // let exPath = (type =='profile'? item.IsMyFundingProfile == 1?(extraPath!=undefined?extraPath:(type+'-form')):(type+'-form') : item.IsMyFundraise == 1?(extraPath!=undefined?extraPath:(type+'-form')):(type+'-form'));
    this.openPage(this.routePath(type,item,extraPath,FilterType),undefined,FilterType)
  }
  routePath(actionName,event,extraPath?,FilterType?) {
    let appendPath=''
    // appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    if(FilterType != undefined){
      apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
      apPath = apPath+'FilterType='+ FilterType
      apPath= apPath+'&chipLbl='+ (FilterType == 'introductions'?'total_'+FilterType:FilterType)
    }
    let path;
    if(actionName =='enablers'){
      if(this.pageFrom == 'profile')
      path=('user/enabler/' + event.EnablerSlug + this.store.getSeprater('user',apPath)+'overview')
      else
      path=('/admin/enabler/' + event.EnablerSlug +this.store.getSeprater(undefined,apPath)+ 'overview')
    }else if(actionName =='match-report'){
      if(this.pageFrom == 'profile')
      path=('user/full-report/'+event.FP_EnablerSlug+'/'+event.FN_EnablerSlug+'/detail')
      else
      path=('admin/full-report/'+event.FP_EnablerSlug+'/'+event.FN_EnablerSlug+'/detail')
    }
    else if(actionName =='profile' || actionName =='fundraise')
    {
      if(this.pageFrom == 'profile'){
        let exPath = (actionName =='profile'?
        event.IsMyFundingProfile == 1?(extraPath!=undefined?extraPath:(actionName+'-form')):(actionName+'-form') : event.IsMyFundraise == 1?(extraPath!=undefined?extraPath:(actionName+'-form')):(actionName+'-form'));

        if((event.IsMyFundingProfile == 1 && actionName =='profile')||(event.IsMyFundraise == 1 && actionName =='fundraise')) {
         
          // http://localhost:8005/user/funding-profile/details/matched-fundraise-needs/SIR00589977/SIP01124637/fundraise_funding_profile?FilterType=introductions&chipLbl=total_introductions#funding-profile-match-report

          path='user/'+(actionName=='profile'?'funding-profile':'fundraise-need')+'/submissions'+'/'+(actionName=='profile'?event.FP_EnablerSlug:event.FN_EnablerSlug)+this.store.getSeprater('user',apPath)+ exPath
        }else{
          let actionPage = (actionName=='profile'?'matching-funding-profiles':'matched-fundraise-needs');
          let pageType = (actionName=='profile'?'funding-profile':'fundraise-need')
          path = "user/"+((pageType !='fundraise-need')?'fundraise-need':'funding-profile')+"/details/"+actionPage+"/"+(event.FN_EnablerSlug !=undefined?event.FN_EnablerSlug:this.FN_EnablerSlug)+"/"+(event.FP_EnablerSlug !=undefined?event.FP_EnablerSlug:this.FP_EnablerSlug)+"/"+(pageType !='fundraise-need'? 'funding_profile_fundraise':'fundraise_funding_profile')+this.store.getSeprater('user',apPath)+ (exPath!=undefined?exPath:(pageType =='fundraise-need'?'fundraise-form':'profile-form') )
          
        }
      } else{
        let endPoint = actionName+'-form'
        if((event.IsMyFundingProfile == 1 && actionName =='profile')||(event.IsMyFundraise == 1 && actionName =='fundraise') || this.store.appType =='admin'){
          endPoint = extraPath != undefined?extraPath:endPoint
        }        
        path=('admin/'+(actionName=='profile'?'funding-profiles':'fundraise-needs')+'-submitted/'+(actionName =='profile'?event.FP_EnablerSlug:event.FN_EnablerSlug)+this.store.getSeprater(undefined,apPath)+endPoint)
      }
    }
    else{
      if(this.store.appType =='admin')
      path=('admin/funding-profiles-submitted/'+event.FP_EnablerSlug+this.store.getSeprater(undefined,apPath)+(extraPath!=undefined?extraPath:(actionName+'-form')))
      else
      path=((event.IsMyFundingProfile==0?'funding-profile/':'user/funding-profile/'+(this.pageFrom =='profile'?'match-report/':'submissions/'))+ event.FP_EnablerSlug + this.store.getSeprater(event.IsMyFundingProfile==0?'':'user',apPath) + (event.IsMyFundingProfile!=0 ?(extraPath!=undefined?extraPath:(actionName+'-form')):'profile-form'))
    }
    return path
  }

  routePath2(actionName, event, extraPath?, filterType?) {
    let appendPath = ''; // Consider providing a default value or handling undefined
    // appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')[0] || ''; // Use a default value if split results in undefined
  
    if (filterType) {
      apPath = apPath.includes('?') ? apPath + '&' : apPath + '?';
      apPath += `FilterType=${filterType}&chipLbl=${filterType === 'introductions' ? 'total_introductions' : filterType}`;
    }
  
    let path;
  
    if (actionName === 'enablers') {
      const userPath = this.pageFrom === 'profile' ? 'user/' : '/admin/';
      path = `${userPath}enabler/${event.EnablerSlug}${this.store.getSeprater(this.pageFrom, apPath)}overview`;
    } else if (actionName === 'match-report') {
      const adminPath = this.pageFrom === 'profile' ? 'user/' : 'admin/';
      path = `${adminPath}full-report/${event.FP_EnablerSlug}/${event.FN_EnablerSlug}/detail`;
    } else if (actionName === 'profile' || actionName === 'fundraise') {
      let exPath = (actionName === 'profile' ?
        event.IsMyFundingProfile == 1 ? (extraPath || actionName + '-form') : (actionName + '-form') :
        event.IsMyFundraise == 1 ? (extraPath || actionName + '-form') : (actionName + '-form'));
  
      if (event.IsMyFundingProfile == 1 && actionName === 'profile' || event.IsMyFundraise == 1 && actionName === 'fundraise') {
        path = `user/${actionName === 'profile' ? 'funding-profile' : 'fundraise-need'}/submissions/${event.FP_EnablerSlug}${this.store.getSeprater('user', apPath)}${exPath}`;
      } else {
        const actionPage = (actionName === 'profile' ? 'matching-funding-profiles' : 'matched-fundraise-needs');
        const pageType = (actionName === 'profile' ? 'funding-profile' : 'fundraise-need');
        path = `user/${pageType !== 'fundraise-need' ? 'fundraise-need' : 'funding-profile'}/details/${actionPage}/${event.FN_EnablerSlug || this.FN_EnablerSlug}/${event.FP_EnablerSlug || this.FP_EnablerSlug}/${pageType !== 'fundraise-need' ? 'funding_profile_fundraise' : 'fundraise_funding_profile'}${this.store.getSeprater('user', apPath)}${exPath || (pageType === 'fundraise-need' ? 'fundraise-form' : 'profile-form')}`;
      }
    } else {
      const adminPath = this.store.appType === 'admin' ? 'admin/' : '';
      path = `${adminPath}${event.IsMyFundingProfile === 0 ? 'funding-profiles-submitted' : (this.pageFrom === 'profile' ? 'user/funding-profile/match-report/' : 'user/funding-profile/submissions/')}${event.FP_EnablerSlug}${this.store.getSeprater(event.IsMyFundingProfile === 0 ? '' : 'user', apPath)}${event.IsMyFundingProfile !== 0 ? (extraPath || actionName + '-form') : 'profile-form'}`;
    }
  
    return path;
  }

  
  openMatching(item){
    if(this.pageFrom == 'profile'){
      this.openPage('user/full-report/'+item.FP_EnablerSlug+'/'+item.FN_EnablerSlug+'/detail')
    }
    else{
      this.openPage('admin/full-report/'+item.FP_EnablerSlug+'/'+item.FN_EnablerSlug+'/detail')
    }
  }
  onClick(event,actionName,FilterType?){
    this.store.openPage(this.routePath(event, actionName,undefined,FilterType),this.openFront)
    
  }

  openPage(url,state?,FilterType?){
    this.store.openPage(url,this.openFront)
  }

  doInfinitePage(event) {
    this.setPage(true,{offset:(this.rowsMobile.length / 10)},event)
  }

  adds(row) {
  }
}
