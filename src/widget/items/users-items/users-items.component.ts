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


@Component({
  selector: 'users-items',
  templateUrl: './users-items.component.html',
  styleUrls: ['./users-items.component.scss'],
})
export class UsersItemsComponent implements OnInit, OnDestroy {

  // expanded=false

  optionsWithCheckbox = {}
  // dataWithCheckbox = [];
  rows:any = Array<ResponseTbl>();
  rowsMobile:any = Array<ResponseTbl>();
  rowsDup:any = Array<ResponseTbl>();
  columnsWithCheckbox: any = {};

  @Input()
  apiEnd: any='' 
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
    this.page.size = 10;
    
    this.reload = this.eventService.applyRefreshData$.subscribe(async (item: any) => {
      if(item !=undefined && (item.page == 'funding-profile' || item.segment == 'funding-profile')){
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
    var parms = "?UserSlug=" + this.UserSlug +  "&Keyword=" +(this.keyword !=''?encodeURIComponent(this.keyword):'') + "&SortBy=" + this.sort + "&PermissionTextKeys="+permission.add_download+"&PageType=" + this.apiAction    
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
        if(!unique.some(obj => (obj.UserSlug === o.UserSlug))) {
          unique.push(o);
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
  setColumns() {
    this.columnsWithCheckbox=[]
    this.columnsWithCheckbox.push({prop:'ContactName',isIndicat:true, name:'contact_name',sortable:false,showExp:false,click:false,route:'users',frozenLeft:true,resisable:true,width:'180',color:'matched'})
    this.columnsWithCheckbox.push({prop:'Email', name:'email',isMail:true,frozenLeft:false,sortable:false,showExp:false,click:true,route:'profile-form',resisable:true,width:'200',color:'matched'})
    
    if(this.store.IsSystemAdmin)
    this.columnsWithCheckbox.push({prop:'TotalMIP', name:'total_master_ip',sortable:false,showExp:false,click:true,route:'funding-profiles',resisable:true,width:'90',color:'investore-profile'})
    this.columnsWithCheckbox.push({prop:'TotalSIP', name:'total_submitted_ip',sortable:false,showExp:false,click:true,route:'funding-profiles-submitted',resisable:true,width:'100',color:'investore-profile'})
    if(this.store.IsSystemAdmin)
    this.columnsWithCheckbox.push({prop:'TotalMIR', name:'total_master_ir',sortable:false,showExp:false,click:true,route:'fundraise-needs',resisable:true,width:'90',color:'investment-raise'})
    this.columnsWithCheckbox.push({prop:'TotalSIR', name:'total_submitted_ir',sortable:false,showExp:false,click:true,route:'fundraise-needs-submitted',resisable:true,width:'100',color:'investment-raise'})

    this.columnsWithCheckbox.push({prop:'TotalEnablersSubmissions', name:'number_of_enablers_for_submissions',sortable:false,showExp:false,click:false,route:'matched',resisable:true,width:'120',color:'enabler'})

    this.columnsWithCheckbox.push({prop:'TotalMatchedInvestors', name:'matched_investors',sortable:false,showExp:false,click:true,route:'full-report',FilterType:'matched',isProfile:0,resisable:true,width:'90',color:'matched'})
    this.columnsWithCheckbox.push({prop:'TotalMatchedInvestees', name:'matched_investees',sortable:false,showExp:false,click:true,route:'full-report',FilterType:'matched',isProfile:1,resisable:true,width:'90',color:'matched'})

    this.columnsWithCheckbox.push({prop:'TotalSentIntroductionRequests', name:'sent_introduction_requests',sortable:false,showExp:false,click:true,route:'full-report',FilterType:'sent_introduction_requested',resisable:true,width:'100',color:'matched'})
    this.columnsWithCheckbox.push({prop:'TotalReceivedIntroductionRequests', name:'received_introduction_requests',sortable:false,showExp:false,click:true,route:'full-report',FilterType:'receive_introduction_requested',resisable:true,width:'100',color:'matched'})
    // TotalIntroductionRequests

    this.columnsWithCheckbox.push({prop:'TotalIntroductions', name:'total_introductions',sortable:false,showExp:false,click:true,route:'full-report',FilterType:'introductions',resisable:true,width:'100',color:'matched'})

    if(this.store.IsSystemAdmin){
    this.columnsWithCheckbox.push({ prop: 'IsActive', name: 'active_status', frozenLeft:false, sortable: false, showExp: false,click:false, width: '140',isDrop:true,});
    this.columnsWithCheckbox.push({ prop: 'IsEmailverified', name: 'email_verified', frozenLeft:false, sortable: false, showExp: false,click:false, width: '140',isDrop:true,});
  }
  // this.columnsWithCheckbox.push({ prop: 'IsEmailverified', name: 'email_verified', frozenLeft:false, sortable: false, showExp: false,click:false, width: '140',isDrop:true,});
    
    this.columnsWithCheckbox.push({ prop: 'CreatedTs', name: 'created_on', frozenLeft:false, sortable: false, showExp: false,click:false, width: '220',isDate:true,color:'matched' });
    this.columnsWithCheckbox.push({ prop: 'ModifiedTs', name: 'last_update', frozenLeft:false, sortable: false, showExp: false,click:false, width: '220',isDate:true,color:'matched' });

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
    this.setPage(true,{offset:(this.rowsMobile.length / 10)},event)
  }
}
