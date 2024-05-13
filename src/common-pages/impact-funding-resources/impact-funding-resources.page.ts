import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'impact-funding-resources',
  templateUrl: './impact-funding-resources.page.html',
  styleUrls: ['./impact-funding-resources.page.scss'],
})
export class ImpactFundingResourcesPage implements OnInit {
  isMessage=true
  keyword:any
  allTotal:any
  updateTime:any
  pageType:any='impact-funding-resources'
  setFirstLoad: any=false

  constructor(public store: StorageService,private eventService: EventService,public router: Router) {

    this.eventService.updateLabel$.subscribe((item: any) => {
      this.setTitle()
    });
  }
 
  ngOnInit() {
    this.setFirstLoad=true
    this.setInitialData()    
  }
  async ionViewWillEnter() {
    if(!this.setFirstLoad){
      this.setInitialData()
    }else{
      this.setFirstLoad=false
    }    
  }
    setInitialData() {
      setTimeout(() => {        
        let sTitle= this.store.getVal('impact_funding_resources_list_social_title')
        let sDesc = this.store.getVal('impact_funding_resources_list_social_description')
        this.store.updateMetaData(this.pageType,{
          Title:sTitle, ShortDescription:sDesc,
          EnablerLogo:environment.social_logo
        })
      }, 200);
    this.keyword=this.store.getFilterFromUrl('keyword', '')
    this.setTitle();
  }
  setTitle() {
    this.store.titleCntWithPage(this.store.getVal('impact_funding_resources'));
  }
  updateCount(event){
    if (event.count != undefined) {
      this.allTotal = event.count
    }

  }
  callFilter(event) {
    if (event.keyword != undefined) {
      this.keyword = event.keyword
      
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    }
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime = this.store.getCurrentTime();
    }
  }
}
