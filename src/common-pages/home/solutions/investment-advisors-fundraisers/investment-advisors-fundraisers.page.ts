import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../shared/StorageService';
import { EventService } from '../../../../shared/EventService';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'investment-advisors-fundraisers',
  templateUrl: './investment-advisors-fundraisers.page.html',
  styleUrls: ['./investment-advisors-fundraisers.page.scss'],
})
export class InvestmentAdvisorsFundraisers implements OnInit {

  PLATFORMID:any
  setFirstLoad: any=false;
  userData: any;
  isLogin=false

  isShowUp:any=false
  constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService,private cookieService: CookieService, private eventService: EventService, public apiService: ApiService, public router: Router, private menu: MenuController,) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    
    this.eventService.updateLabel$.subscribe((item: any) => {
      this.setTitle()
    });
  }
  ngOnInit() {
  this.setInitialData()
  }
  setInitialData() {
    setTimeout(() => {      
      this.setTitle();
    }, 200);
  }
  ionViewWillEnter() {
    if(!this.setFirstLoad){
      this.setInitialData()
    }else{
      this.setFirstLoad=false
    }   
  }
  openMenu(){
    this.menu.enable(true, "nmenu");
    this.menu.open("nmenu");
  }
  openPage(path){
    this.menu.close("nmenu");
    this.router.navigateByUrl(path)
  }
  setTitle(){
    let sTitle = this.store.getVal('website_key_118')
    let sDesc=this.store.getVal('website_key_117')

    this.store.updateMetaData('',{ pTitle:sTitle, ShortDescription:sDesc, EnablerLogo:environment.social_logo})
    this.store.titleCntWithPage(sTitle);
  }
  ngAfterViewInit() {
  }
  openContact(){
    this.router.navigate(['contact']);
  }
 
  ngOnDestroy(): void {
  }
  updateScroll(event) {
    this.isShowUp = event;
  }
  function(event) {
    if (event.detail.scrollTop == 0) {
      this.isShowUp = false;
      return
    } else {
      this.isShowUp = true;
    }
  }
}
