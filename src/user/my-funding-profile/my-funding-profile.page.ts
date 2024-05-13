import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
@Component({
  selector: 'my-funding-profile',
  templateUrl: './my-funding-profile.page.html',
  styleUrls: ['./my-funding-profile.page.scss'],
})
export class MyFundingProfilePage implements OnInit {
  
  permissions = []
  loadMsg: any = "";
  dataAction: any = [];
  pageType = 'funding-profiles'
  // email: any = "";
  // nemail: any = "";
  // emailErr: any = "";
  // nEmailErr: any = "";
  keyword = ''
  pageTitle = 'My Funding Profiles'
  allTotal = 0;
  @Input()
  updateTime = 0;

  constructor(public store: StorageService, public apiService: ApiService, private route: ActivatedRoute, public router: Router, private eventService: EventService,) {
   

  }
  
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime =new Date().getTime()
    }
  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.keyword = this.store.getFilterFromUrl('keyword', '');    
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
  ngOnDestroy(): void {
  }
}
