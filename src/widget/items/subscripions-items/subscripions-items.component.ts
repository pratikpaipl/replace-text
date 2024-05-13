import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, TemplateRef, ViewChild, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { permission } from 'src/shared/app.constants';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from '../model/page.class';
import { ResponseTbl } from '../model/response-tbl.class';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';


@Component({
  selector: 'subscripions-items',
  templateUrl: './subscripions-items.component.html',
  styleUrls: ['./subscripions-items.component.scss'],
})
export class SubscripionsItemsComponent implements OnInit, OnDestroy {

  // expanded=false

  optionsWithCheckbox = {}
  // dataWithCheckbox = [];
  rows:any = Array<ResponseTbl>();
  rowsMobile:any = Array<ResponseTbl>();
  rowsDup:any = Array<ResponseTbl>();
  columnsWithCheckbox: any = {};

  @Input()
  apiEnd: any='subscription_plans' 
  @Input()
  UserSlug: any='' 
  @Input()
  WithoutActivePlan: any=false

  @Input()
  updateTime:any=0;
  keyword: string = '';
  sort: string = 'recent';

  @Input()
  ActionType: any = ''

  @Input()
  PlanStatus: string = '';
  @Input()
  PlanID: string = '';
  @Input()
  EnablerID: string = '';
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
  apiAction: string = 'user';


  isShowMsg = false;
  isShowField = false;
  PermissionTextKey = [];

  // pageNumber: number;
  limit = 5;
  EnablerTotal = 0;
  cache: any = {};

  private reload: any;
  private changeRel: any;
  private delete: any;
  // private updateData: any;
  private subLabel: any;

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


  // @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(public store: StorageService,public alertController: AlertController,  private eventService: EventService, public apiService: ApiService,private router:Router) {

    this.page.pageNumber = 0;
    this.page.size = 5;
    
    this.reload = this.eventService.applyRefreshData$.subscribe(async (item: any) => {
      if(item !=undefined && (item.page == 'subscripions' || item.segment == 'subscripions')){
        this.callApi();
      }
    });
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.setColumns();
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
    this.PlanStatus =this.store.getFilterFromUrl('PlanStatus', [])
    this.PlanID =  this.store.getFilterFromUrl('PlanID', [])
    this.EnablerID = this.store.getFilterFromUrl('EnablerID', [])

  }
  ngOnDestroy() {
    this.reload.unsubscribe();
    this.changeRel.unsubscribe();
    this.delete.unsubscribe();
    this.subLabel.unsubscribe();
}
  ionViewWillEnter() {  
    // this.table.refresh()
  }
  ngOnInit() {
    this.optionsWithCheckbox = {
      checkboxes: false,
      autoWidth:false,
    }  
    this.setColumns();  
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getParamData()
    this.callApi();
  }
  toggleExpandRow(row,rowIndex) {
    this.rows[rowIndex].expanded= this.rows[rowIndex].expanded !=undefined ? !this.rows[rowIndex].expanded:true//!this.dataWithCheckbox[rowIndex].expanded;
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

  callStatusUpdate(endPoint: any, parmName: any, rowIndex: any,  postData: FormData) {
    this.apiService.update('user', 'update_'+endPoint, postData).subscribe(response => {
      let res: any = response;
      if (!res.success) {
        // if(dType != 'mob')
        this.rows[rowIndex][parmName]= this.rowsDup[rowIndex][parmName]
        // else
        // this.fundingProfileList[rowIndex][parmName]= this.dupFundingProfileList[rowIndex][parmName]
      }else{
        if(res.data.detail !=undefined){
          this.rows[rowIndex].IsActive= res.data.detail.IsActive 
          this.rows[rowIndex].IsEmailverified= res.data.detail.IsEmailverified 
          this.rows = [...this.rows]
        }
      }
      this.store.showToast(res.message, 2000,!res.success?'error':undefined);
    });
  }
  onClick(event, actionName,FilterType?,isProfile?) {
    this.store.openPage(this.routePath(event, actionName,FilterType,isProfile),this.openFront)
  }
  callAction(event,Index?) {
    if(event !=undefined){
      if(event.FunctionName =='changeStatus'){
        this[''+event.FunctionName](event.endPoint,event.parmName,event.value,event.row,Index,event.isConfig)
      }else if(event.route != undefined){
        if(event.route == 'profile-form'){
          this[''+event.FunctionName](event.Item,event.route,event.FilterType)
        }
        else{
          this[''+event.FunctionName](event.Item,event.route,event.FilterType,event.isProfile)
        }
      }else if(event.FunctionName == 'selectPlan'){
        this[''+event.FunctionName](event.Item)
      }
    }

  }
  onSelect(row){
  }
  callApi() {
     this.setPage(false,{offset:0})
  }
  setPage(isFirstLoad,pageInfo, event?) {
    var parms = "?Keyword=" +(this.keyword !=''?encodeURIComponent(this.keyword):'') + "&SortBy=" + this.sort+ "&EnablerIDs=" + this.EnablerID+ "&PlanIDs=" + this.PlanID+ "&PlanStatus=" + this.PlanStatus+"&WithoutActivePlan="+(this.WithoutActivePlan?'1':'0') + "&PermissionTextKeys="+permission.add_download+"&PageType=" + this.apiAction    
    this.page.pageNumber = pageInfo.offset;
    this.isLoading=true
    this.apiService.getResults(this.apiEnd,this.page,parms,5).subscribe(pagedData => {
      this.isLoading=false
      this.isResize = false;
      this.page = pagedData.page;
      if(pageInfo.offset == 0){
        this.rows =[]
        this.rowsMobile =[]
      }
      this.rows = pagedData[`results`];
      let datas = pagedData[`datas`];
      for (let i = 0; i <  this.rows.length; i++) {
        const element =  this.rows[i];
        element.hidden=true
        this.rowsMobile.push(element)        
      }
      this.rowsDup = JSON.parse(JSON.stringify(this.rowsMobile));
      this.EnablerTotal = (pagedData.page.totalElements != undefined?pagedData.page.totalElements:0)
      this.PermissionTextKey = pagedData.datas.PermissionTextKey
      let enablerList=datas != undefined && datas.enabler_list !=undefined?datas.enabler_list:[]
      let planList=datas != undefined && datas.plan_list!=undefined?datas.plan_list:[]
      let planStatusList=datas != undefined && datas.plan_status_list !=undefined?datas.plan_status_list:[]

      this.change.emit({ count: (pagedData.page.totalElements != undefined?pagedData.page.totalElements:0), permissions: this.PermissionTextKey, pageType: this.apiAction,enabler_list:enablerList,planList:planList,planStatusList:planStatusList })
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
  setColumns() {
    this.columnsWithCheckbox=[]
    this.columnsWithCheckbox.push({name:'',frozenLeft:true,sortable:false,showExp:false,click:false,width:'100',resisable:true,isFaci:true})
    this.columnsWithCheckbox.push({name:'enabler',prop:'EnablerName',frozenLeft:true,sortable:false,showExp:false,click:true,route:'enablers',width:'250',resisable:true,color:'enabler',isFaci:true})
    this.columnsWithCheckbox.push({prop:'PlanName', name:'plan',isMail:false,frozenLeft:false,sortable:false,showExp:false,click:true,route:'plan_details',resisable:true,width:'200',color:'matched'})
    this.columnsWithCheckbox.push({prop:'PlanStatus', name:'status',isDrop:true,isMail:false,frozenLeft:false,sortable:false,showExp:false,click:false,resisable:true,width:'200',color:'matched'})
    this.columnsWithCheckbox.push({prop:'PlanPrice', name:'price',isMail:false,frozenLeft:false,sortable:false,showExp:false,click:false,resisable:true,width:'200',color:'matched'})
    this.columnsWithCheckbox.push({prop:'MaximumFreeSubmissions', name:'free_limit',isMail:false,frozenLeft:false,sortable:false,showExp:false,click:false,resisable:true,width:'200',color:'matched'})
    this.columnsWithCheckbox.push({splitProps: ['FromDate', 'ToDate'], name:'from_to_dates',isMail:false,frozenLeft:false,sortable:false,showExp:false,click:false,isDate:true,resisable:true,width:'200',color:'matched'})
    
    
    this.columnsWithCheckbox.push({splitProps: ['CreatedTs', 'CreatedBy'], name: 'created_on', frozenLeft:false, sortable: false, showExp: false,click:false, width: '220',isDate:true,color:'matched' });

  }
  routePath(event, actionName,FilterType?,isProfile?) {

    let appendPath=''
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    
    let path;
    if(actionName =='enablers' && this.pageFrom != 'explore')
    path=('/admin/enabler/' + event.EnablerSlug +this.store.getSeprater(undefined,apPath)+ 'overview')
    else{
      if(this.store.appType =='admin'){
        apPath =(actionName =='plan_details'?'?selectPlanDetail='+event.PlanID:'')
        path=('/admin'+this.store.getSeprater(undefined,apPath)+actionName)
      }
      else{
        path=('/user'+this.store.getSeprater(undefined,apPath)+actionName)
      }
    }
    return path
  }
  async changeStatus(endPoint,parmName,value,row,rowIndex,isConfig?) {
    let postData = new FormData();
    postData.append(parmName, value);
    postData.append("UserSlug", row.UserSlug);
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
              this.callStatusUpdate(endPoint, parmName, rowIndex,postData)
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => { 
              postData.append("EmailSend",'0')
              this.callStatusUpdate(endPoint, parmName, rowIndex,postData)
            }
          }
        ], backdropDismiss: false
      });
      return await alert.present();
    
    }else{
      this.callStatusUpdate(endPoint, parmName, rowIndex,postData)
    }
    
  }
  doInfinitePage(event) {
    this.setPage(true,{offset:(this.rowsMobile.length / 5)},event)
  }
  async selectPlan(item){
   
    if(item.PlanStatus == 'plan_active'){

      const alert = await this.alertController.create({
        message: this.store.getVal('cancel_plan_conform_msg'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.planCancel(item);
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => { }
          }
        ], backdropDismiss: true
      });
      return await alert.present();

     
    }else{
      this.store.openPage('admin?SelectEnabler='+item.EnablerID+'#plans_and_pricing',this.openFront)
    }
  }
  planCancel(item: any) {
    let postData = new FormData();
    postData.append('EnablerPlanID',item.EnablerPlanID)
    this.apiService.addData('subscription_plans', postData, 'cancel_plan').subscribe(async response => {
      let res: any = response;
      if (res.success) {
        this.store.showToast(res.message, 2000);
        this.callApi()  
      }
    });
  }
  getDate(row,column){
    let date='';
    if(column.splitProps){
      let frmDate= row[column.splitProps[0]] != undefined?row[column.splitProps[0]]:''
      let toDate= row[column.splitProps[1]] != undefined?row[column.splitProps[1]]:''
      date =frmDate !=''? moment(frmDate).format('DD MMM yyyy') + ' ' + (toDate!=''?(this.store.getVal('to') + ' '+moment(toDate).format('DD MMM yyyy')):''):''
    }
    return date;
  }
  isInclude(key,column){
    if(column.splitProps){
      return column.splitProps[0] == key
    }
  }
  getDateWithName(row,column){
    let date='';
    if(column.splitProps){
      let createdBy= row[column.splitProps[0]] != undefined?row[column.splitProps[0]]:''
      let toDate= row[column.splitProps[1]] != undefined?row[column.splitProps[1]]:''
      date = (createdBy !=''? moment.utc(createdBy).format('DD MMM yyyy') + ' UTC <br />' + (toDate!=''?(' by '+' '+row[column.splitProps[1]]):''):'')
    }
    return date;
  }
}
