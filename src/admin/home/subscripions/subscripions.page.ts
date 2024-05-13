import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { SegmentModel } from 'src/shared/segment.model';

@Component({
  selector: 'subscripions',
  templateUrl: './subscripions.page.html',
  styleUrls: ['./subscripions.page.scss'],
})
export class SubscripionsPage implements OnInit, OnDestroy {

  public segments: SegmentModel[] = []
  public selectedSegment: string = '';
  public selectedSegmentLbl: string = '';
  WithoutActivePlan=false
  from=''
  allTotal=0
  pageType='subscripions'
  permissions=[]
  updateTime:any
  isError:any=false
  
  enabler_list=[]
  planList=[]
  statusList=[]
  selectedEnabler:any
  selectedPlanEnabler:any
  selectPlanDetail:any
  selectPDetail:any
  selectedPlan:any
  selectedStatus:any
  subscription:any

  @ViewChild('content') content: any;
  constructor(public modalController: ModalController,private route: ActivatedRoute, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {
   
    this.segments.push({key: 'subscripions',icon:'fa-file-invoice fa-solid',label: this.store.getVal('subscripions')})
    this.segments.push({key: 'plans_and_pricing',icon:'fa-solid fa-ranking-star',label: this.store.getVal('plans_and_pricing')
    })
    this.segments.push({key: 'plan_details',icon:'fa-solid fa-ranking-star',label: this.store.getVal('plan_details')
    })
    
    this.eventService.updateLabel$.subscribe((item: any) => {
      this.segments[0].label = this.store.getVal('subscripions')
      this.segments[1].label = this.store.getVal('plans_and_pricing')
      this.segments[2].label = this.store.getVal('plan_details')
    });
  }
  ngOnInit() {
    this.pageType = this.route.snapshot.fragment != null && (this.route.snapshot.fragment =='subscripions' || this.route.snapshot.fragment =='plans_and_pricing' || this.route.snapshot.fragment =='plan_details')?this.route.snapshot.fragment : 'subscripions';
    if(this.pageType =='plan_details'){
      this.defVarData();
      this.callApi()
    }
  }
  onClickSegment(event){
    this.pageType = event;
    if(this.pageType =='plan_details'){
     this.defVarData();
      this.callApi()
    }
  }
  defVarData() {
    this.selectPlanDetail = (this.store.getFilterFromUrl('selectPlanDetail', '') != undefined && this.store.getFilterFromUrl('selectPlanDetail', '') !='')?parseInt(this.store.getFilterFromUrl('selectPlanDetail', undefined)):undefined
  }
  callApi() {
    this.subscription = this.apiService.getPlanList('plans').subscribe(async response => {
      let res: any = response;
     // let res = this.store.decryptData(response,atob(environment.keyData))
      if (res.success && res.data != undefined) {
        if (res.data.list != undefined) {
          this.planList = res.data.list
        }
        this.dataView();        
            
      }else{
        this.store.showToast(res.message,3000,'error')
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnDestroy() {
   
  }
  updateCount(event){
    if (event.count != undefined) {
      this.allTotal = event.count
    }
    if (event.enabler_list != undefined) {
      this.enabler_list = event.enabler_list
    }
    if (event.planList != undefined) {
      this.planList = event.planList
    }
    this.selectedPlanEnabler = (this.store.getFilterFromUrl('SelectEnabler', '') != undefined && this.store.getFilterFromUrl('SelectEnabler', '') !='')?parseInt(this.store.getFilterFromUrl('SelectEnabler', undefined)):undefined
    this.selectPlanDetail = (this.store.getFilterFromUrl('selectPlanDetail', '') != undefined && this.store.getFilterFromUrl('selectPlanDetail', '') !='')?parseInt(this.store.getFilterFromUrl('selectPlanDetail', undefined)):undefined
    
    this.selectedEnabler = this.store.getListParmsWise(this.store.getFilterFromUrl('EnablerID', undefined)); 
    this.selectedPlan = this.store.getListParmsWise(this.store.getFilterFromUrl('PlanID', undefined));
    this.selectedStatus = this.store.getListParmsWiseStr(this.store.getFilterFromUrl('PlanStatus', undefined));
    // this.selectedStatus = this.store.getList(this.store.PlanStatusResult,this.store.getFilterFromUrl('PlanStatus', undefined)); 

  }
  customSelect(event){
    if(event.modalName !=undefined){
      this['' + event.modalName] = event.modal
      if(event.modalName =='selectedPlanEnabler'){
        this.store.setGetParameter('SelectEnabler',event.modal,event.modal == undefined)
        this.updateTime = this.store.getCurrentTime()
      }else if(event.modalName =='selectPlanDetail'){
        this.dataView()
        if(event.modal == undefined)
        this.store.setGetParameter('selectPlanDetail','',true)
      }
      else{
        let ids = event.modal !=undefined?event.modal.join(","):''
        if(event.modalName =='selectedEnabler'){
          this.store.setGetParameter('EnablerID',ids,ids.length==0)
        }
        if(event.modalName =='selectedPlan'){
          this.store.setGetParameter('PlanID',ids,ids.length==0)
        }
        if(event.modalName =='selectedStatus'){
          this.store.setGetParameter('PlanStatus',ids,ids.length==0)
        }
        this.updateTime = this.store.getCurrentTime()
      }
    }
  }
  dataView() {
    let check = this.planList.findIndex(c => c.PlanID == this.selectPlanDetail)
    this.selectPDetail = (check != -1? this.planList[check]:undefined)
    if(this.selectPDetail != undefined) {
      this.selectPDetail.PlanDescriptionDup = this.selectPDetail.PlanDescription != undefined? JSON.parse(this.selectPDetail.PlanDescription):[]
      this.selectPDetail.PlanFeaturesDescriptionDup = this.selectPDetail.PlanFeaturesDescription != undefined?JSON.parse(this.selectPDetail.PlanFeaturesDescription):[]
    }
  }
}

