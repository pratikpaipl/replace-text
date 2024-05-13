import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, TemplateRef, ViewChild, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { permission } from 'src/shared/app.constants';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from '../model/page.class';
import { ResponseTbl } from '../model/response-tbl.class';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'plan-items',
  templateUrl: './plan-items.component.html',
  styleUrls: ['./plan-items.component.scss'],
})
export class PlanItemsComponent implements OnInit, OnDestroy {

  // expanded=false

  optionsWithCheckbox = {}
  rowsMobile:any = Array<ResponseTbl>();
  rowsDup:any = Array<ResponseTbl>();
  columnsWithCheckbox: any = {};

  @Input()
  apiEnd: any='subscription_plans' 
  @Input()
  UserSlug: any='' 

  @Input()
  updateTime:any=0;
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
  subtype: string = '';
  @Input()
  SelectEnabler: any;
  @Input()
  WithoutActivePlan: any=false 

  @Input()
  apiAction: string = 'user';


  isShowMsg = false;
  isShowField = false;
  PermissionTextKey = [];

  // pageNumber: number;
  limit = 10;
  EnablerTotal = 0;
  cache: any = {};

  private reload: any;
  private changeRel: any;
  private delete: any;
  // private updateData: any;
  // private subLabel: any;

  isLoading = false;
  isResize=false
  isMobile=false

  page = new Page();

  ColumnMode = ColumnMode;

  // Split template
  @ViewChild('splitTmpl', {static: true}) splitTmpl: TemplateRef<any>;
  @ViewChild('Users') table;
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  PLATFORMID:any
  constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService, public alertController: AlertController, private eventService: EventService, public apiService: ApiService,private router:Router) {
    this.PLATFORMID = isPlatformBrowser(platformId) 
    this.page.pageNumber = 0;
    this.page.size = 10;
    
    this.reload = this.eventService.applyRefreshData$.subscribe(async (item: any) => {
      if(item !=undefined && (item.page == 'subscripions' || item.segment == 'subscripions')){
        this.callApi();
      }
    });
    
    this.changeRel = this.eventService.fundingProfileRel$.subscribe(async (item: any) => {
      this.callApi();
    });
    this.delete = this.eventService.deleteData$.subscribe((item: any) => {
      this.callApi();
    });
    if(this.PLATFORMID){

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
  }
  getParamData() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', this.sort);
    this.SelectEnabler = this.store.getFilterFromUrl('SelectEnabler', '')
  }
  ngOnDestroy() {
    this.reload.unsubscribe();
    this.changeRel.unsubscribe();
    this.delete.unsubscribe();
}
  ionViewWillEnter() {  
    // this.table.refresh()
  }
  ngOnInit() {
    this.optionsWithCheckbox = {
      checkboxes: false,
      autoWidth:false,
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    this.callApi();
  }
  
  onDetailToggle(event) {
  }

  onClick(event, actionName,FilterType?,isProfile?) {
    this.store.openPage(this.routePath(event, actionName,FilterType,isProfile),this.openFront)
  }
  callAction(event,Index?) {
    if(event !=undefined){
      if(event.FunctionName =='changeStatus'){
        this[''+event.FunctionName](event.endPoint,event.parmName,event.value,event.row,Index,event.isConfig)
        // changeStatus(endPoint, parmName, value, row,rowIndex,isConfig?) 
      }else if(event.route != undefined){
        if(event.route == 'profile-form'){
          this[''+event.FunctionName](event.Item,event.route,event.FilterType)
        }
        else{
          // row,column.route,column.FilterType,column.isProfile
          this[''+event.FunctionName](event.Item,event.route,event.FilterType,event.isProfile)
        }
      }
      // this[''+event.FunctionName](event.Item,event.route)
    }

  }
  onSelect(row){
  }
  callApi() {
     this.setPage(false,{offset:0})
  }
  setPage(isFirstLoad,pageInfo, event?) {
    var parms = "?EnablerID="+(this.SelectEnabler!=undefined?this.SelectEnabler:'') + "&Keyword="+(this.keyword !=''?encodeURIComponent(this.keyword):'')+"&SortBy="+this.sort+"&PermissionTextKeys="+permission.add_download+"&PageType=" + this.apiAction    
    this.page.pageNumber = pageInfo.offset;
    this.isLoading=true
    this.apiService.getResults(this.apiEnd,this.page,parms).subscribe(pagedData => {
      this.isLoading=false
      this.isResize = false;
      let datas = pagedData[`datas`];

      setTimeout(() => {        
        let sTitle= this.store.getVal('plan_and_pricing_social_title') 
        let sDesc = this.store.getVal('plan_and_pricing_description') 
        this.store.updateMetaData(this.pageType,{
          pTitle:sTitle, ShortDescription:sDesc
        })
      }, 300);
      
      let enablerList=datas != undefined && datas.enabler_list !=undefined?datas.enabler_list:[]
      this.page = pagedData.page;
      if(pageInfo.offset == 0){
        this.rowsMobile =[]
      }
      let rows = pagedData[`results`];
      for (let i = 0; i <  rows.length; i++) {
        const element:any =  rows[i];
        element.PlanDescriptionDup = element.PlanDescription != undefined? JSON.parse(element.PlanDescription):[]
        element.PlanFeaturesDescriptionDup = element.PlanFeaturesDescription != undefined?JSON.parse(element.PlanFeaturesDescription):[]
        this.rowsMobile.push(element)        
      }
      this.rowsDup = JSON.parse(JSON.stringify(this.rowsMobile));
      this.EnablerTotal = (pagedData.page.totalElements != undefined?pagedData.page.totalElements:0)
      this.PermissionTextKey = pagedData.datas.PermissionTextKey
      this.change.emit({ count: (pagedData.page.totalElements != undefined?pagedData.page.totalElements:0), permissions: this.PermissionTextKey, pageType: this.apiAction,enabler_list:enablerList })
      this.isShowMsg = this.store.msgDisplay(this.rowsMobile.length == 0);
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
  routePath(event, actionName,FilterType?,isProfile?) {
    let appendPath=''
    // appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
    apPath = apPath+'UserSlug='+ event.UserSlug
    if(event.ContactName != undefined)
    apPath = apPath+'&ContactName='+ this.store.getSetParmsVal(event.ContactName)

    if(FilterType != undefined){
      apPath = apPath+'&FilterType='+ FilterType
      apPath = apPath+'&displayMode='+((FilterType.includes('sent_') ||FilterType.includes('receive_'))?'2':'1')
      apPath= apPath+'&chipLbl='+ (FilterType == 'introductions'?'total_'+FilterType:FilterType)
    }
    if(isProfile != undefined)
    apPath= apPath+'&isProfile='+ isProfile

    let path;
    if(actionName =='enablers' && this.pageFrom != 'explore')
    path=('/admin/enabler/' + event.EnablerSlug +this.store.getSeprater(undefined,apPath)+ 'overview')
    else{
      if(this.store.appType =='admin')
      path=('/admin'+this.store.getSeprater(undefined,apPath)+actionName)
      else
      path=('/user'+this.store.getSeprater(undefined,apPath)+actionName)
    }
    return path
  }
  doInfinitePage(event) {
    this.setPage(true,{offset:(this.rowsMobile.length / 10)},event)
  }
}
