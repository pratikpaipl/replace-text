import { AfterContentChecked, ChangeDetectorRef, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { EventService } from 'src/shared/EventService';
import { ProductMenuComponent } from './header-popover-menu/header-popover-menu.component';


@Component({
  selector: 'web-page-header',
  templateUrl: './web-page-header.component.html',
  styleUrls: ['./web-page-header.component.scss'],
})
export class WebHeaderComponent implements OnInit , AfterContentChecked {

  isLogin:any=false;
  userData:any
  PLATFORMID;
  
  constructor(@Inject(PLATFORM_ID) platformId: any, public platform: Platform, private cookieService: CookieService, public store: StorageService, private menu: MenuController,public eventService:EventService, public popover:PopoverController, public router: Router, public apiService: ApiService, private cdref: ChangeDetectorRef) {

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
 
  openMenu(){
    this.menu.enable(true, "nmenu");
    this.menu.open("nmenu");
  }
  openProfile() {
    this.menu.enable(true, "profile");
    this.menu.open("end");
  }
  async openPage(path,povoverID?){
    this.menu.close("nmenu");
    if (await this.popover.getTop()) this.popover.dismiss();
    // this.popover.dismiss();
    this.router.navigateByUrl(path)
  }
  ngOnInit() {
    
  }

  async openPopover(ev,type,clss){
    let Items=[]
    if(type == 'Product'){
      Items.push({title:this.store.getVal('website_key_3'),url:'/how-it-works'})
      Items.push({title:this.store.getVal('website_key_28'),url:'/features'})
      Items.push({title:this.store.getVal('website_key_25'),url:'/faq'})
      Items.push({title:this.store.getVal('website_key_27'),url:'/plans-and-pricing'})
    }else if(type =='Solutions') {      
      Items.push({title:this.store.getVal('website_key_30'),url:'/solutions/impact-investor-clubs'})
      Items.push({title:this.store.getVal('website_key_31'),url:'/solutions/impact-and-sustainability-ecosystems'})
      Items.push({title:this.store.getVal('website_key_32'),url:'/solutions/incubators-and-accelerators'})
      Items.push({title:this.store.getVal('website_key_33'),url:'/solutions/investment-advisors-and-fundraisers'})
      Items.push({title:this.store.getVal('website_key_34'),url:'/impact-funding-resources'})
    }else if(type == 'Company'){
      Items.push({title:this.store.getVal('website_key_22'),url:'/about'})
      Items.push({title:this.store.getVal('website_key_29'),url:'/partners'})
      Items.push({title:this.store.getVal('website_key_122'),url:'/contact'})
    }

    const popover = await this.popover.create({
      component: ProductMenuComponent,
      componentProps: { value: '',items:Items },
      cssClass: clss,
      event: ev,
      translucent: true
    });
    await popover.present();
  }
}

