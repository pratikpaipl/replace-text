import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { EventService } from 'src/shared/EventService';
@Component({
  selector: 'features',
  templateUrl: './features-page.page.html',
  styleUrls: ['./features-page.page.scss'],
})
export class FeaturesPage implements OnInit {

  PLATFORMID:any
  setFirstLoad: any=false;
  subscription;
  isShowUp:any=false
  viewItems:any=[]
  constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService, public apiService: ApiService, public router: Router,private eventService: EventService,) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    
    this.eventService.updateLabel$.subscribe((item: any) => {
      this.setList();
      this.setTitle()
    });

  }
  ngOnInit() {
    this.setList()
    setTimeout(() => {      
      this.setTitle();
    }, 200);
  }
  setList() {
    this.viewItems=[]
    this.viewItems.push({ KeyFeatures: this.store.getVal('website_key_63') , Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-xmark',InvestorsAndInvesteesMsg:''})
    this.viewItems.push({ KeyFeatures:this.store.getVal('website_key_64'), Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-xmark',InvestorsAndInvesteesMsg:''})
    this.viewItems.push({ KeyFeatures:this.store.getVal('website_key_65'), Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-xmark',InvestorsAndInvesteesMsg:''})
    this.viewItems.push({ KeyFeatures:this.store.getVal('website_key_66'), Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-user-lock',InvestorsAndInvesteesMsg:''})
    this.viewItems.push({ KeyFeatures:this.store.getVal('website_key_67'), Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-user-lock',InvestorsAndInvesteesMsg:''})
    this.viewItems.push({ KeyFeatures:this.store.getVal('website_key_68'), Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-user-lock',InvestorsAndInvesteesMsg:''})
    this.viewItems.push({ KeyFeatures:this.store.getVal('website_key_69'), Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-user-lock',InvestorsAndInvesteesMsg:''})
    this.viewItems.push({ KeyFeatures:this.store.getVal('website_key_70'), Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-user-lock',InvestorsAndInvesteesMsg:''})
    this.viewItems.push({ KeyFeatures:this.store.getVal('website_key_71'), Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-user-lock',InvestorsAndInvesteesMsg:this.store.getVal('website_key_73')})
    this.viewItems.push({ KeyFeatures:this.store.getVal('website_key_72'), Enablers:'fa-solid fa-check',InvestorsAndInvestees:'fa-solid fa-user-lock',InvestorsAndInvesteesMsg:''})
  }
  
  ionViewWillEnter() {
   
  }
  setTitle(){
    let sTitle = this.store.getVal('website_key_126'); 
    let sDesc= this.store.getVal('website_key_125');

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
