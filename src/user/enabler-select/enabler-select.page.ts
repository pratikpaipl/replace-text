import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'enabler-select',
  templateUrl: './enabler-select.page.html',
  styleUrls: ['./enabler-select.page.scss'],
})
export class EnablerSelectPage implements OnInit {

  permissions = []
  pageType = 'enablers'

  allTotal:any=0
  updateTime = 0
  slug:any
  type:any
  isLogin:any
  private applyFilter: any;
  constructor( public store: StorageService,private activatedRoute: ActivatedRoute, public apiService: ApiService, public router: Router,private cookieService: CookieService, private eventService: EventService,) {
    this.slug = this.activatedRoute.snapshot.paramMap.get('slug')
    this.type = this.activatedRoute.snapshot.paramMap.get('type')
    this.isLogin =this.cookieService.check(environment.cookiesKey)

  }

  ngOnInit(): void {
    this.applyFilter = this.eventService.applyFilter$.subscribe(async (item: any) => {
      this.updateTime = item.updateTime;
    })
  }
  ngOnDestroy() {
    if(this.applyFilter != undefined)
    this.applyFilter.unsubscribe();
  }
  updateCount(event) {
    if (event.count != undefined) {
      this.allTotal = event.count
    }
    if (event.permissions != undefined) {
      this.permissions = event.permissions
    }
  }
  callAction(event){
    if (event == 1) {
      let postData = new FormData();
      postData.append((this.type=='funding-profile'?'ProfileSlug':'FundraiseSlug'),this.slug)

      const controller = this.type === 'funding-profile' ? 'funding_profile' : 'fundraise';
      const endpoint = this.type === 'funding-profile' ? 'submit_investor' : 'submit_investee';

      this.apiService.update(controller,endpoint,postData).subscribe(response => {
        let res: any = response;
        if(res.success){
          this.store.saveData('altMsg', res, true)
          this.router.navigateByUrl('/message/'+this.type);
        }else{
          this.store.showToast(res.message, 2000, res.success?undefined:'error');
        }
      });

    }
     else {
      this.router.navigateByUrl('/explore/enablers', { replaceUrl: true });
    }
  }
}
