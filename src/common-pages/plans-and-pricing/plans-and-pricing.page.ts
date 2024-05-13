import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../shared/StorageService';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { EventService } from 'src/shared/EventService';
declare var $: any;
declare const getActionsFromMessage
@Component({
  selector: 'plans-and-pricing',
  templateUrl: './plans-and-pricing.page.html',
  styleUrls: ['./plans-and-pricing.page.scss'],
})
export class PlansAndPricingPage implements OnInit {

  allTotal:any
  updateTime:any
  pageType:any='plans_and_pricing'
  
  constructor(public store: StorageService,private eventService: EventService, private zone: NgZone, public apiService: ApiService, public router: Router) {

    this.eventService.updateLabel$.subscribe((item: any) => {
      this.setTitle()
    });
  }
 

  ngOnInit(){
    this.setTitle();
  }
  setTitle() {
    this.store.titleCntWithPage(this.store.getVal('plans_and_pricing'));
  }
  updateCount(event){
    if (event.count != undefined) {
      this.allTotal = event.count
    }

  }
}
