import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/shared/EventService';
import { ApiService } from 'src/services/api.service';
import { Component, NgZone, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonInfiniteScroll, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';

import { Location } from '@angular/common';
import { Page } from 'src/widget/items/model/page.class';
import { ResponseTbl } from 'src/widget/items/model/response-tbl.class';
declare const uploadFile: any;
declare const pageToTop: any;
declare var $: any;

@Component({
  selector: 'reference-data-setting',
  templateUrl: 'reference-data-setting.page.html',
  styleUrls: ['reference-data-setting.page.scss'],
})
export class ReferenceDataSettingPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('content') content: any;
  @ViewChild('refereance-data') table;

  IsScrolling:any = false;
  LanguageList: any = [];
  ReferenceTypeList: any = [];
  loadMsg: any = '';
  loadMsgError: any = '';
  dataAction: any = [];
  Changeable = true;
  pageTitle = ''
  selectedReferenceType:any;
  keyword = ''
  label: any = {};
  isAdmin = false;
  isShowField = false; 
  limit = 20;
  ReferenceValueTotal = 0; 
  permissions:any = []; 
  
  clmTitle: any =[]
  optionsWithCheckbox = {}
  // dataWithCheckbox = [];
  columnsWithSearch: string[] = ['ReferenceName'];
  filteredData = [];
  temp = [];
  columnsWithCheckbox: any = {};
  
  page = new Page();
  rows:any = Array<ResponseTbl>();
  rowsMobile:any = Array<ResponseTbl>();
  isLoading=false;
  isShowMsg=false;
  ReferanceTotal=0;
  pageType='reference-data';

  isResize=false
  isMobile=false


  public applyFilter: any;
  constructor(public alertController: AlertController, private location: Location, public store: StorageService,private zone: NgZone, public activatedRoute: ActivatedRoute, public router: Router, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController, public apiService: ApiService) {

    this.page.pageNumber = 0;
    this.page.size = 10;

    this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.pageTitle = this.store.getVal('reference_data')
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
  
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.getParamData()
  //   this.callApi();
  // }
  getParamData() {
    this.pageTitle = this.store.getVal('reference_data')
    this.keyword = this.store.getFilterFromUrl('keyword', '');
  }
  
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.getParamData()
      this.callApi();
    }
  }
  ngOnInit() {
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
      this.callApi();
    });
    this.getParamData()
    setTimeout(() => {
      this.callApi();
    }, this.store.isApiCalled);   
    
    this.columnsWithCheckbox=[]
    
    this.columnsWithCheckbox.push({prop: 'ReferenceType', name:'reference_type',sortable:false,showExp:true,resisable:true,width:200})
    this.columnsWithCheckbox.push({prop: 'ReferenceName', name:'reference_name',sortable:false,showExp:true,resisable:true,width:400})
    this.columnsWithCheckbox.push({prop: 'OriginalValue', name:'original_value',sortable:false,showExp:true,resisable:true,width:200})
    this.columnsWithCheckbox.push({prop: 'DisplayOrder', name:'display_order',sortable:false,showExp:true,resisable:true,width:200})
    this.columnsWithCheckbox.push({prop: 'LanguageID', name:'language',sortable:false,showExp:true,resisable:true,width:200})
  }
  
  ionViewWillEnter() {    
    // this.table.refresh()
  }

  callApi() {
    this.setPage(false,{offset:0})
  }
  setPage(isFirstLoad,pageInfo, event?) {
    var parms = "?ReferenceType=" + ((this.selectedReferenceType == undefined)?'':this.selectedReferenceType) + '&Keyword=' + this.keyword;
    this.page.pageNumber = pageInfo.offset;
    this.isLoading=true
    this.apiService.getResults('reference_value/all_reference_list',this.page,parms).subscribe(pagedData => {
      this.isLoading=false
      this.isResize = false;
      this.page = pagedData.page;
      this.ReferenceTypeList = pagedData.datas.reference_type_list;
      this.LanguageList = pagedData.datas.language_list;
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
        if(!unique.some(obj => (obj.ReferenceID === o.ReferenceID))) {
          unique.push(o);
        }
        return unique;
    },[]);
    
    this.ReferanceTotal = (pagedData.page.totalElements != undefined?pagedData.page.totalElements:0)
      // this.PermissionTextKey = pagedData.datas.PermissionTextKey
      // this.change.emit({ count: (pagedData.page.totalElements != undefined?pagedData.page.totalElements:0), permissions: this.PermissionTextKey, pageType: this.apiAction })
      if (isFirstLoad) {
        if (event != undefined && event.target != undefined)
          event.target.complete();
      }
      if (this.rowsMobile.length == this.ReferanceTotal) {
        if (event != undefined && event.target != undefined)
          event.target.disabled = true;
      }
      this.isShowMsg = this.store.msgDisplay(this.rows.length == 0 || this.rowsMobile.length == 0);
    });
  }
  ngOnDestroy() {
    this.applyFilter.unsubscribe();
  }

  onChangeReferenceType(event) {
    this.setPage(false,{offset:0})
  }
  customSelect(event){
      if(event.modalName !=undefined){
        this['' + event.modalName] = event.modal
        this.setPage(false,{offset:0})
      }
  }

  
  setColumwithData(element: any): any {
    this.clmTitle=[]
    this.clmTitle.push({key:'reference_type',title:'Reference Type',class:'',value:element.ReferenceType})
    this.clmTitle.push({key:'reference_name',title:'Reference Name',class:'',value:element.ReferenceName})
    this.clmTitle.push({key:'original_value',title:'Original Value',class:'',value:element.OriginalValue})
    this.clmTitle.push({key:'display_order',title:'Display Order',class:'',value:element.DisplayOrder})
    this.clmTitle.push({key:'language',title:'Language',class:'',value:element.LanguageID})
    this.clmTitle.push({key:'action',title:'Action',class:'',value:''})
    
    return this.clmTitle;
  }
  
  updateReferenceData(item,Index) {
    let isCall = false     
    item.IsReferenceNameUn = false;
    item.IsDisplayOrderUn = false;
    if(item.ReferenceName == undefined || item.ReferenceName.trim() == '') {
      item.IsReferenceNameUn = true;
      isCall = true
    } else {
      let ExistingReferenceData = this.rows.filter(obj => (obj.ReferenceType == item.ReferenceType && obj.ReferenceName.toLowerCase() == item.ReferenceName.toLowerCase()));
      if(ExistingReferenceData.length > 1) {
        item.IsReferenceNameUn = true
        isCall = true
      }
    }
    
    if(item.DisplayOrder == undefined ||item.DisplayOrder == null) {
      // item.DisplayOrder == 11
    } else {
      if(!/^[0-9]+$/.test(item.DisplayOrder)) {
        item.IsDisplayOrderUn = true;
        isCall = true
      } 
    }

    this.rows[Index].IsReferenceNameUn = item.IsReferenceNameUn;
    this.rows[Index].IsDisplayOrderUn =  item.IsDisplayOrderUn;
    
    if(!isCall) {
      let postData = new FormData();
      postData.append("ReferenceID", item.ReferenceID);
      postData.append("ReferenceName", item.ReferenceName != undefined ? item.ReferenceName : '');
      postData.append("OriginalValue", item.OriginalValue != undefined ? item.OriginalValue : '');
      postData.append("DisplayOrder", item.DisplayOrder != undefined ? item.DisplayOrder : '');
      postData.append("LanguageID", item.LanguageID != undefined ? item.LanguageID : '');
      
      this.apiService.updateReferenceData(postData).subscribe(async response => {
        let res: any = response;
        // let res = this.store.decryptData(response,atob(environment.keyData))
        if (res.success) {
          this.loadMsg = '';
          this.store.showToast(res.message,2000)
        }  else {
          this.store.scrollTo('topRow');
          this.loadMsg = res.message
          this.dataAction = res.data.Actions
        }
      })
    }
    
  }
  
  callSearchFilter(event) {
    if (event.keyword != undefined) {
        this.keyword = event.keyword
        this.setPage(false,{offset:0})
    }
  }

  onAddAction() {
    this.router.navigateByUrl('admin/add-reference-data');
  }

  validateReferenceName(item) {
    item.IsReferenceNameUn = false;
    let ExistingReferenceData = this.rows.filter(obj => (obj.ReferenceType == item.ReferenceType && obj.ReferenceName.toLowerCase() == item.ReferenceName.toLowerCase()));
    if(ExistingReferenceData.length > 1) {
      item.IsReferenceNameUn = true
    }
  }
  callAction(event,Index){
    this[''+event.FunctionName](event.Item,Index)
  }
  doInfinitePage(event) {
    this.setPage(true,{offset:(this.rowsMobile.length / 10)},event)
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
}