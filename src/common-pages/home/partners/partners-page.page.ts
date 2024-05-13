import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { IonSlides } from '@ionic/angular';
import { EventService } from 'src/shared/EventService';
@Component({
  selector: 'partners',
  templateUrl: './partners-page.page.html',
  styleUrls: ['./partners-page.page.scss'],
})
export class PartnersPage implements OnInit {

  PLATFORMID:any
  setFirstLoad: any=false;
  subscription;
  isShowUp:any=false
  partners:any=[]
  slideOpts = {
    slidesPerView: 1,
    spaceBetween: 20,
    autoHeight: true,
    loop:true,
    speed: 1200,
    autoplay: {
      delay: 1000,
    }
  }
  @ViewChild('slides') slides: IonSlides;
  constructor(@Inject(PLATFORM_ID) platformId: any,private eventService:EventService, public store: StorageService, public apiService: ApiService, public router: Router) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.slideOpts.slidesPerView=store.IsWebView?3.2:1
     
    this.eventService.updateLabel$.subscribe((item: any) => {
      this.setTitle()
    });
  }
  ngOnInit() {
    this.partners=[]
    let btnTitle =  (this.store.getVal('website_key_26') != undefined? this.store.getVal('website_key_26'):'Learn More');
    this.partners.push({ Logo:'../../../assets/images/parners/purposewithprofit_logo.jpeg', PartnerName:'Purpose with Profit',Descriptions:'Purpose with Profit (PwP) helps motivated founders of vegan food businesses who are not growing as fast as they deserve. By identifying and closing strategic gaps, we accelerate business growth, creating more quality time, financial freedom, and greater social impact.',WebSite:'https://www.purposewithprofit.co/',btnTitle:btnTitle})

    this.partners.push({ Logo:'../../../assets/images/parners/knowledgeimpactnetwork_logo.jpeg', PartnerName:'Knowledge Impact Network (KIN)',Descriptions:'KIN forms Impact Circles- intimate forums that address specific causes to alleviate hardship and uplift humanity, also dubbed "forums with a cause".',WebSite:'https://www.knowledgeimpactnetwork.org/',btnTitle:btnTitle})


    this.partners.push({ Logo:'../../../assets/images/parners/family_office_list_logo.jpeg', PartnerName:'Family Office List',Descriptions:'Family Office List (Familyofficelist.org) is one of the leading providers of investor list sources. As a company, we are committed to providing comprehensive, accurate and up-to-date information to our clients worldwide.',WebSite:'https://familyofficelist.org/',btnTitle:btnTitle})

    this.partners.push({ Logo:'../../../assets/images/parners/alternative_proteins_global.jpeg', PartnerName:'Alternative Proteins Global (APG)',Descriptions:'Alternative Proteins Global (APG) is a newly founded market research company tracking, analyzing and visualizing all aspects of the alternative protein industry including Companies, Investments and Investors.',WebSite:'https://alternativeproteinsglobal.com/',btnTitle:btnTitle})

    this.partners.push({ Logo:'../../../assets/images/parners/vegan-finance-webinar-2.png', PartnerName:'ESSEC Vegan Finance Webinar',Descriptions:'Vegan  investing, the path towards profitability Taking place online on Friday, June 21st, 2024 from 1:30 pm - 4:30 pm (Paris time)',WebSite:'https://vegan-finance-webinar.essec.edu/',btnTitle:btnTitle})

    setTimeout(() => {
      this.setTitle();
    }, 200);
    
  }
  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }
  ionViewWillEnter() {
   
  }
  setTitle(){
    let sTitle = this.store.getVal('website_key_112') 
    let sDesc=this.store.getVal('website_key_111');

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
