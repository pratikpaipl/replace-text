import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { actType, appApi } from 'src/shared/app.constants';
@Component({
  selector: 'profile-submissions',
  templateUrl: './profile-submissions.page.html',
  styleUrls: ['./profile-submissions.page.scss'],
})
export class ProfileSubmissionsPage implements OnInit {

  // @Input()
  selItem: any;

  @Input()
  sort: any = 'recent';

  @Input()
  keyword: any = '';
  @Input()
  updateTime: any = 0

  EnablerSlug:any=''
  permissions = []
  loadMsg: any = "";
  dataAction: any = [];
  pageType = 'funding-profiles'
  
  pageTitle = ''
  allTotal: any = 0


  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(public store: StorageService, public apiService: ApiService, private route: ActivatedRoute, public router: Router, private eventService: EventService,) {
  
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime =new Date().getTime()
    }
  }
 ngOnInit() {
  this.keyword = this.store.getFilterFromUrl('keyword','');
  this.store.titleCntWithPage(this.store.getVal('funding_profile_submissions'));
  }
  ngOnChanges(): void {    
    this.EnablerSlug = this.store.getFilterFromUrl('EnablerSlug','')
      this.selItem = {
        itemData :
        {
          EnablerName: this.EnablerSlug !=undefined && this.EnablerSlug!=''?this.store.getFilterFromUrl('EnablerName',''):undefined,
          EnablerSlug:this.EnablerSlug !=undefined && this.EnablerSlug!=''?this.EnablerSlug:undefined,
          chipLbl:this.store.getFilterFromUrl('chipLbl',''),
          displayMode:this.store.getFilterFromUrl('displayMode',''),
          EnablerFilterType:this.store.getFilterFromUrl('FilterType',''),
        }
      }
  }
  ngOnDestroy(): void {
  }
  callEnablerFilter(event) {
    if (event.filter != undefined && event.filter == '1') {
      // this.openFilterView();
    } else if (event.keyword != undefined) {
      this.keyword = event.keyword
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    }
  }
  updateCount(event) {
    if (event.count != undefined) {
      this.allTotal = event.count
    } 
    if (event.permissions != undefined) {
      this.permissions = event.permissions
    }   
  }

  removeFilter(event) {
    this.selItem = event.selItem    
    if (event != undefined) {
      this.EnablerSlug=''
      // this.eventService.publishRemoveData({EnablerSlug:''});
    }
  }

  download($event) {
      this.apiService.callDownload(appApi.myFPSubmittedAtEnablersListExcel, '', '', '', this.sort,actType.funding_profile_enabler);
  }
}
