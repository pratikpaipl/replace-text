import { Component, OnInit, Input, EventEmitter, Output, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'bread-crump',
  templateUrl: './bread-crump.component.html',
  styleUrls: ['./bread-crump.component.scss'],
})
export class BreadCrumpComponent implements OnInit {
  @Input()
  skipLogin:any;
  @Input()
  fHide: any=true;
  @Input()
  breadCrumpData: any;
  @Input()
  pageLbl: string;
  @Input()
  pageType: string;
  @Input()
  extraType: string;

  @Input()
  showHome: any = '0';

  @Input()
  type: any = '';

  @Input()
  EnablerSlug: any = '';
  @Input()
  from: any = '';
  // @Input()
  // isClick: any=true;
  @Input()
  PageSlug: any = '';

  @Input()
  DisplayName: any = '';

  @Input()
  Map: any = '0';

  PLATFORMID:any;
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService, private cookieService: CookieService, public router: Router, public eventService: EventService) {

    this.PLATFORMID = isPlatformBrowser(platformId)

  }


  ngOnInit() {

    console.log(' --> ',this.breadCrumpData)
    this.skipLogin = (this.skipLogin == undefined?(this.PLATFORMID?this.cookieService.check(environment.cookiesKey):false):true);
  }
  ngOnChanges() {
    this.skipLogin = (this.skipLogin == undefined?(this.PLATFORMID?this.cookieService.check(environment.cookiesKey):false):true);
  }

  openPageList(type) {
    let page = this.openPageListPath(type);
    this.store.openPage(page,'0')
  }
  openPageListPath(type) {

    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;

  
    if (type == 'funding_profile')
      type = 'funding-profile'
    if (type == 'fundraise_needs')
      type = 'fundraise-needs'
    if (this.store.appType == 'admin') {
      type = type=='enablers'?type:type.replace('enabler','enablers')
      let path = ('admin#'+ type);
      return path + (path.includes('#')?'':(apPath != undefined && apPath != '')?apPath:'');
    } else {
      if(this.from != 'user'){
        type = type=='enablers'?type:type.replace('enabler','enablers')
        let path = (((type == 'impact-funding-resources')?'':'explore'+this.store.getSeprater())+type);
        return path + (path.includes('#')?'':(apPath != undefined && apPath != '')?apPath:'');
      }
      else{
        type = type=='enablers'?type:type.replace('enabler','enablers')
        let path = ('user#'+((type == 'funding-profile' || type == 'funding-profiles')?'my-funding-profiles':(type == 'fundraise-needs' || type == 'fundraise-need')? 'my-fundraise-needs':type));
        return path + (path.includes('#')?'':(apPath != undefined && apPath != '')?apPath:'');
      }
    }
  }
  openPage(type) {
    this.store.openPage(this.openPagePath(type),'0')
  }
  openPagePath(type) {
    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;

    this.pageType = this.pageType == 'fundraise_needs' ? 'fundraise-needs' :this.pageType == 'funding_profile' ? 'funding-profile': this.pageType
     if (this.from != undefined && this.from != '' && this.from == 'permission') {

      let path =  ('admin/' + (this.pageType =='enablers'?'enabler':this.pageType) + '/' + this.PageSlug + this.store.getSeprater(undefined,apPath)+'overview')

      return path + (path.includes('#')?'':(apPath != undefined && apPath != '')?apPath:'');
    }    
    else if (this.store.appType == 'admin') {
      return ('admin'+this.store.getSeprater(undefined,apPath) + type);
    }
    else if (this.store.appType == 'front') {
      let path = ('explore'+this.store.getSeprater(undefined,apPath) + type);
      return path + (path.includes('#')?'':(apPath != undefined && apPath != '')?apPath:'');
    }
  }

  openDetails(type, PageSlug, action?,extraPath?) {
    if (action == undefined)
      action = 'overview'
      if (action == 'funding_profile')
      action = 'funding-profile'
    if (action == 'fundraise_needs')
      action = 'fundraise-needs'

    if (type == 'funding_profile')
      type = 'funding-profile'
    if (type == 'fundraise_needs')
      type = 'fundraise-needs'

    this.store.openPage(this.openDetailsPath(type, PageSlug, action,extraPath),'0')
  }

  openDetailsPath(type, PageSlug, action?,extraPath?) {

    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;

    if (action == undefined)
      action = 'overview'
    if (action == 'funding_profile')
      action = 'funding-profile'
    if (action == 'fundraise_needs')
      action = 'fundraise-needs'
    if (this.store.appType == 'admin')
      return ('admin/' + (type =='enablers'?'enabler':type) + '/' + PageSlug + this.store.getSeprater(undefined,apPath) + action);
    else {
      if(extraPath != undefined){  
        let path = ((this.from != 'user' || !this.fHide?type:'user/'+extraPath) + '/' + PageSlug + this.store.getSeprater(this.from && this.fHide?this.from:undefined,apPath) + action)
        return path + (path.includes('#')?'':(apPath != undefined && apPath != '')?apPath:'');
      }else{
        let path =  ((this.from != 'user' || !this.fHide?type:'user/'+type) + '/' + PageSlug + this.store.getSeprater(this.from && this.fHide?this.from:undefined) + action)
        return path + (path.includes('#')?'':(apPath != undefined && apPath != '')?apPath:'');
      }
    }
  }
}

