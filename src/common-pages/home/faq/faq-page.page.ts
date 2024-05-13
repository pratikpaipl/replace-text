import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { EventService } from 'src/shared/EventService';
@Component({
  selector: 'faq-page',
  templateUrl: './faq-page.page.html',
  styleUrls: ['./faq-page.page.scss'],
})
export class FaqPage implements OnInit {

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
    this.getData()
    setTimeout(() => {      
      this.setTitle();
    }, 200);
  }
  getData() {
    this.subscription = this.apiService.getFaqList().subscribe(async response => {
      let res: any = response;
      if (res.success && res.data != undefined) {
        let lits =  res.data.faq_list != undefined?res.data.faq_list:[]
        this.faqList=[]
        for (let k = 0; k < lits.length; k++) {
          const element = lits[k];
          element.FaqJson = JSON.parse(element.FaqJson) 
          this.faqList.push(element)
        }
        this.faqListMain = JSON.parse(JSON.stringify(this.faqList))
      }
    });
  }
  
  ionViewWillEnter() {
   
  }
  callFilter(event){

    console.log(event.detail.value)
    if(event != undefined && event.detail.value != undefined){

      let sterm = (event.detail.value).toLowerCase()
      this.faqList = this.faqListMain.filter(element => element.FaqJson
        .some(subElement => {
          let ques:any = subElement.Question != undefined?subElement.Question:''
          let ans:any = subElement.Answer != undefined?subElement.Answer:''
          return (ques.toLowerCase().includes(sterm) || ans.includes(sterm));
        })
      )
      .map(element => {
        let n = Object.assign({}, element, {'FaqJson': element.FaqJson.filter(
          subElement => {
            let ques:any = subElement.Question != undefined?subElement.Question:''
          let ans:any = subElement.Answer != undefined?subElement.Answer:''
            return (ques.includes(sterm) || ans.includes(sterm));
          }
        )})
        return n;
      })
      // this.faqList = this.faqListMain
      // .filter((element) => 
      //   element.subElements.some((subElement) => subElement.Answer === 1))
      // .map(element => {
      //   let newElt = Object.assign({}, element); // copies element
      //   return newElt.subElements.filter(subElement => subElement.Answer === '1');
      // });
      // this.faqList = this.deepSearch(this.faqListMain, 'Answer', (k, v) => {
      //   return v.includes(event.detail.value) ;
      // });
      // this.faqListMain.filter(val => val.areas.includes(filterValue));
    }
  }
  clearSearch(event) {

  }
  onEnter(event){
    
  }
  hideSearch(event) {
  }
  setTitle(){
    let sTitle = this.store.getVal('website_key_25')
    let sDesc= this.store.getVal('website_key_130')

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
