import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSelect, MenuController, ModalController, Platform } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { EventService } from 'src/shared/EventService';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit , AfterContentChecked {

  activePage = ''
  @ViewChild('mySelect', { static: false }) selectRef: IonSelect;
  selectedText: any;
  userData: any;
  @Input()
  contentID: any
  @Input()
  cnt: any = 0
  @Input()
  isHome: string = 'false';
  @Input()
  page: any = "home"
  @Input()
  platType: any = ""

  isLogin:any=false;

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  PLATFORMID;
  
  constructor(@Inject(PLATFORM_ID) platformId: any,public modalController: ModalController,public platform: Platform, private eventService: EventService, private location: Location,private cookieService: CookieService, public store: StorageService, private menu: MenuController, public router: Router, public apiService: ApiService, private cdref: ChangeDetectorRef) {

    this.PLATFORMID = isPlatformBrowser(platformId)
    this.eventService.formRefresh$.subscribe(async (item: any) => {
      this.updateUserData()
    });
    this.updateUserData()
  }
  updateUserData() {
    this.isLogin =  this.PLATFORMID?this.cookieService.check(environment.cookiesKey):false
      if(this.isLogin){
        let res=this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
        if(res!=undefined){
          if(res.data !=undefined){
            if(res.data.UserData != undefined){
              this.userData = res.data.UserData
            }
          }else if(res.UserData != undefined){
            this.userData = res.UserData;
          }
        }
      }else{
        this.userData = this.userData
      }
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (document.visibilityState === 'visible') {
      this.updateUserData()
    }
  }
  changePath(len) {
    var href = this.router.url;
    this.store.lng = len;
    var newPath = href//this.store.replaceAll(href, oldLng, newLng);
    this.router.navigateByUrl(newPath, { replaceUrl: true });
  }
  openPage(path){
    
    if(this.store.appType =='admin' && !this.store.isLogin){
      path='auth#login'
      this.store.openPage(path,'0')
    }else if(path=='enablers'&& this.store.appType !='admin'){
      path='/explore/enablers'
      this.store.openPage(path,'0')
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    }else if(path=='full-report' && this.store.appType !='admin'){
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
      path='user#full-report'
      if(this.store.isLogin)
      this.store.openPage(path,'0')
      else
      this.store.openPage('auth#login','0')

    }else if(this.store.appType =='admin'){
      this.router.navigateByUrl(this.store.appType + this.store.getSeprater()+path);
    }
    else{
      this.router.navigateByUrl(path);
    }
  }
  getText() {
    var len = this.store.languageList.filter(item => item.LanguageCode === this.store.lng).length;
    this.selectedText = len > 0 ? this.store.languageList.filter(item => item.LanguageCode === this.store.lng)[0].LanguageName : ''
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isLogin = this.PLATFORMID?this.cookieService.check(environment.cookiesKey):false
    if(this.PLATFORMID){
      if(this.cookieService.check(environment.cookiesKey)){
          let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
          this.userData = res!=undefined?res.data.UserData:undefined
      }
    }
  }

  searchProfile() {
    //this.router.navigateByUrl('/user#search-list');
  }
  languageChange(event) {
    this.changePath(event.detail.value)
    this.eventService.publishUpdateLng(event.detail.value)
  }
  notificaionList() {
    this.router.navigateByUrl('/notification');
  }
  openFirst() {
    if(this.PLATFORMID){
        this.menu.enable(true, this.page);
        this.menu.open(this.page);
    }
  }
  openProfile() {
    this.menu.enable(true, "profile");
    this.menu.open("end");
  }
  openLogin() {
    this.router.navigateByUrl('/auth#login');
  }


  goPage(page) {
    this.store.navigatePage(['user'],page)
  }
}

