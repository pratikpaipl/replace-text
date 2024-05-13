import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { EventService } from 'src/shared/EventService';
@Component({
  selector: 'about-page',
  templateUrl: './about-page.page.html',
  styleUrls: ['./about-page.page.scss'],
})
export class AboutPage implements OnInit {

  PLATFORMID:any
  setFirstLoad: any=false;
  userData: any;
  isLogin=false
  keyword:any=''
  faqList=[]
  faqListMain=[]
  subscription;
  isShowUp:any=false
  constructor(@Inject(PLATFORM_ID) platformId: any,private eventService:EventService, public store: StorageService, public apiService: ApiService, public router: Router) {
    this.PLATFORMID = isPlatformBrowser(platformId)
     
    this.eventService.updateLabel$.subscribe((item: any) => {
      this.setTitle()
    });
  }
  ngOnInit() {
    setTimeout(() => {    
      this.setTitle();
    }, 200);
  }
  
  ionViewWillEnter() {
   
  }
  setTitle(){
    let sTitle = this.store.getVal('website_key_22');
    let sDesc= this.store.getVal('website_key_120');

    this.store.updateMetaData('',{ pTitle:sTitle, ShortDescription:sDesc, EnablerLogo:environment.social_logo})
    this.store.titleCntWithPage(sTitle);
  }
  ngAfterViewInit() {
   
  }
  openPage(path){
    this.router.navigateByUrl(path)
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
