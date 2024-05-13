import { Component, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { IonSlides } from '@ionic/angular';
import { EventService } from 'src/shared/EventService';
@Component({
  selector: 'how-it-works-page',
  templateUrl: './how-it-works-page.page.html',
  styleUrls: ['./how-it-works-page.page.scss'],
})
export class HowItWorksPage implements OnInit {

  PLATFORMID:any
  setFirstLoad: any=false;
  userData: any;
  isLogin=false
  subscription;
  isShowUp:any=false
  adminPath:any;
  slideOpts = {
    slidesPerView: 5,
    initialSlide: 0,
    spaceBetween: 5,
    autoHeight: true,
    loop:false
  }
  howItWorksEnablers=[]
  howItWorksInvestors=[]
  howItWorksInvestees=[]
  activeIndex=1
  @ViewChild('slidesEnablers') slidesEnablers: IonSlides;
  @ViewChild('slidesInvestors') slidesInvestors: IonSlides;  
  @ViewChild('slidesInvestees') slidesInvestees: IonSlides;
  constructor(@Inject(PLATFORM_ID) platformId: any, private eventService:EventService, public store: StorageService, public apiService: ApiService, public router: Router) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.adminPath = environment.redirectAdmin;
    this.slideOpts.slidesPerView = (this.store.windowWidth > 992 ?5:this.store.windowWidth < 992 && this.store.windowWidth > 830 ?4.3:this.store.windowWidth < 830 && this.store.windowWidth > 768 ?3.3:this.store.windowWidth < 768 && this.store.windowWidth > 420?2.3:this.store.windowWidth < 420?1.5:5  )
    this.eventService.updateLabel$.subscribe((item: any) => {
      this.setTitle()
      this.setDatas();
    });
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    const newWidth = event.target.innerWidth;
    this.store.windowWidth = newWidth;
    this.store.windowHight = window.innerHeight;
    this.store.screenWidth = newWidth
    console.log('windowWidth ',this.store.windowWidth)
    this.store.IsWebView = (window.innerWidth > 992 ? true : false);
    this.slideOpts.slidesPerView = (this.store.windowWidth > 992 ?5:this.store.windowWidth < 992 && this.store.windowWidth > 830 ?4.3:this.store.windowWidth < 830 && this.store.windowWidth > 768 ?3.3:this.store.windowWidth < 768 && this.store.windowWidth > 420?2.3:this.store.windowWidth < 420?1.5:5  )
  }
  
  ngOnInit() {
    this.setDatas()
    setTimeout(() => {      
      this.setTitle();
    }, 200);
  }
  setDatas() {
    this.howItWorksEnablers=[]
    this.howItWorksEnablers.push({ img1:'../../../assets/images/how-it-work/img1.png',cotent:this.store.getVal('website_key_133')})
    this.howItWorksEnablers.push({ img1:'../../../assets/images/how-it-work/img11.png',
    img2:'../../../assets/images/how-it-work/img3.png',cotent:this.store.getVal('website_key_134')})
    this.howItWorksEnablers.push({ img1:'../../../assets/images/how-it-work/img13.png',img2:'../../../assets/images/how-it-work/img5.png',cotent:this.store.getVal('website_key_135')})
    this.howItWorksEnablers.push({img1:'../../../assets/images/how-it-work/img6.png',img2:'../../../assets/images/how-it-work/img7.png',cotent:this.store.getVal('website_key_136')})
    this.howItWorksEnablers.push({ img1:'../../../assets/images/how-it-work/img8.png',
    img2:'../../../assets/images/how-it-work/img9.png',cotent:this.store.getVal('website_key_137')})
    
    this.howItWorksInvestors=[]
    this.howItWorksInvestors.push({ img1:'../../../assets/images/how-it-work/img11.png',cotent:this.store.getVal('website_key_138')})
    this.howItWorksInvestors.push({ img1:'../../../assets/images/how-it-work/img12.png',cotent:this.store.getVal('website_key_139')})
    this.howItWorksInvestors.push({ img1:'../../../assets/images/how-it-work/img13.png',
    img2:'../../../assets/images/how-it-work/img5.png',cotent:this.store.getVal('website_key_140')})
    this.howItWorksInvestors.push({ img1:'../../../assets/images/how-it-work/img14.png',cotent:this.store.getVal('website_key_141')})

    this.howItWorksInvestees=[]
    this.howItWorksInvestees.push({ img1:'../../../assets/images/how-it-work/img12.png',cotent:this.store.getVal('website_key_142')})
    this.howItWorksInvestees.push({ img1:'../../../assets/images/how-it-work/img11.png',cotent:this.store.getVal('website_key_143')})
    this.howItWorksInvestees.push({ img1:'../../../assets/images/how-it-work/img13.png',
    img2:'../../../assets/images/how-it-work/img5.png',cotent:this.store.getVal('website_key_144')})
    this.howItWorksInvestees.push({ img1:'../../../assets/images/how-it-work/img14.png',cotent:this.store.getVal('website_key_145')})
  }
  slidePrev(type) {
    this[type].slidePrev();
  }
  slideNext(type) {
    this[type].slideNext();
  }
  sliderChanges(type) {
    const context = this;
    this[type].getActiveIndex().then(index => {
      this.activeIndex=index
    });
  }
  ionViewWillEnter() {
   
  }
  setTitle(){
    let sTitle =this.store.getVal('website_key_3');
    let sDesc=this.store.getVal('website_key_103');

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
