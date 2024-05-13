import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {

  @Input()
  selItem: any;
  isShow = false;
  permissions = []
  filteCnt = 0;
  allTotal = 0;
  keyword = '';
  sort = 'recent';
  
  @Input()
  updateTime = 0;

  pageType = '';
  sdgShow = true;
  countryShow = true;
  impactThemeAreaShow = true;

  applyTabReload:any;

  from='admin'
  @ViewChild('content') content: any;
  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {

  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime =new Date().getTime()
    }
  }
  ngOnInit() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', 'recent');
    this.pageType = 'users'
  }
  ionViewDidEnter(){

    this.applyTabReload = this.eventService.applyTabReload$.subscribe((item: any) => {
      this.updateTime = new Date().getTime();
    });
  }
  ionViewDidLeave(){
    if(this.applyTabReload != undefined)
    this.applyTabReload.unsubscribe()

  }
  download(event){

  }

  callFilter(event){
    if (event.keyword != undefined) {
      this.keyword = event.keyword
      // this.updateTime = (new Date().getTime())
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    }
  }
  openFilter(event){

  }
  updateCount(event){
    if (event.count != undefined) {
      this.allTotal = event.count
    } 
    
    if (event.permissions != undefined) {
      this.permissions = event.permissions
    }
  }
  ngOnDestroy() {
  }
}
