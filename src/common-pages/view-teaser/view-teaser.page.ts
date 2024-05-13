import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../shared/EventService';
import { StorageService } from '../../shared/StorageService';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'view-teaser',
  templateUrl: './view-teaser.page.html',
  styleUrls: ['./view-teaser.page.scss'],
})
export class ViewTeaser implements OnInit {
  type: any='';
  pageType: any;
  slug: any;
  from: any;
  itemData: any;
  public PLATFORMID: any;
  displayName :any
  notfound :any='...'
  constructor(@Inject(PLATFORM_ID) platformId: any, public alertController: AlertController,public route:ActivatedRoute,public apiService: ApiService, public router: Router, public store: StorageService, public eventService: EventService) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.pageType = 'fundraise';
    this.slug = this.route.snapshot.paramMap.get('slug') != undefined ? this.route.snapshot.paramMap.get('slug') : undefined;
    this.from = this.route.snapshot.paramMap.get('from') != undefined ? this.route.snapshot.paramMap.get('from') : undefined;
    this.type = store.appType =='admin'?'fundraise' :'fundraise-needs';
    if(this.slug != undefined){
      this.getData();
    }
  }

  ngOnInit() {
    
  }  
  getData() {
    let apiEnd = 'investee/view_teaser'
    let postData = new FormData();
    postData.append("FN_EnablerSlug", this.slug);
    if(this.from =='user'){
      postData.append("IsSubmittedEnabler", '1');
      postData.append("IsProfile", '1');
    }
    this.apiService.teaserCall(apiEnd,postData).subscribe(async response => {
      let res: any = response;
      if (res.success && res.data != undefined) {
        this.itemData =  res.data.detail;
        this.displayName =this.itemData.ReferenceCode +' '+ this.store.getVal('view_teaser')
      }else{
        this.notfound=res.message
      }
    });
  }
}
