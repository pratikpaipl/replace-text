import { Router, ActivatedRoute } from '@angular/router';
import { Platform, MenuController, IonSearchbar, IonInfiniteScroll, ModalController, ActionSheetController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { StorageService } from 'src/shared/StorageService';
import { AuthenticationService } from 'src/services/authentication.service';
import { EventService } from 'src/shared/EventService';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'common-page',
  templateUrl: 'common-page.page.html',
  styleUrls: ['common-page.page.scss'],
  queries: {
    content: new ViewChild('content')
  }
})
export class CommonPage implements OnInit {

  name: any
  email: any
  isOpenContact = false;
  activePage = '';
  from = 'product';
  isShowUp = false;
  PageSlug = '';
  title = ''
  contentData = ''
  constructor(public myElement: ElementRef, public store: StorageService,  private activatedRoute: ActivatedRoute, private cookieService: CookieService, private eventService: EventService, public toastController: ToastController, public actionSheetController: ActionSheetController, public modalController: ModalController, public router: Router, public platform: Platform, public apiService: ApiService) {
    this.from = this.activatedRoute.snapshot.paramMap.get('from')
    this.title = store.getVal(this.from)
    this.isOpenContact = false;
    this.activePage = '';
    this.eventService.formRefresh$.subscribe(async (item: any) => {
       this.setUserData()
    });
    // this.eventService.publishFormShowContact(false);

  }
  setUserData() {
    this.store.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.store.isLogin){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      this.store.userData = datas;
      if (datas != undefined && datas.UserData != undefined) {
        this.name = datas.UserData.FirstName + ' ' + datas.UserData.LastName
        this.email = datas.UserData.Email
      } else {
        this.name = ''
        this.email = ''
      }
    } 
  }
  ngOnInit() {
    this.setUserData()
    this.getPageContent(this.from);
   
  }
  getPageContent(from: string) {
    this.apiService.pageContent(from).subscribe(response => {
      let res: any = response;
      if (res.success) {
        this.title = res.data.detail.PageName
        this.PageSlug = res.data.detail.PageSlug
        this.contentData = res.data.detail.Description
        this.store.titleCntWithPage(this.title);
      }
    });
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
  };
  async callAction(event) {
    if (event == 1) {
      this.Contact()
    } else {
      this.store.backPage();
    }
  }

  Contact() {
    // this.eventService.publishUpdateContactUs({ PermissionKey: 'contact_us', PageSlug: '', UserName: this.name, Email: this.email, emailTo: 'pi2life', Subject: '', Message: '', subjectReadOnly: false });
    // this.isOpenContact = true;
    // this.activePage = 'contactUsMenu'
    this.router.navigateByUrl('contact');
  }
}
