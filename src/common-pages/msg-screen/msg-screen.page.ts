import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../shared/StorageService';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/services/api.service';
import { environment } from 'src/environments/environment';
import { EventService } from 'src/shared/EventService';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;
declare const getActionsFromMessage
@Component({
  selector: 'app-msg-screen',
  templateUrl: './msg-screen.page.html',
  styleUrls: ['./msg-screen.page.scss'],
})
export class MsgScreenPage implements OnInit {

  title = 'Message View'
  // isT: any = false;
  // isA: any = false;
  email: any;
  from: any;
  loadMsg: any = this.store.getVal('please_wait');

  leftKey:any=''
  leftBtn:any=''
  moveLogin:any=true
  // lng: any;
  messageAction: any = [];
  dataAction: any = [];
  resData: any = {};
  isShow: any = false;
  isSuccess: any = false;
  private subscription: Subscription;
  total = (1000 * 5)
  shouldDisable = false;

  public PLATFORMID: any;
  constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService,private cookieService: CookieService, private zone: NgZone, public apiService: ApiService, private route: ActivatedRoute, public router: Router) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.from = this.route.snapshot.paramMap.get('from')

    this.title = this.from
    if(this.PLATFORMID){
      const $this = this;
      $(document).on('click', '.actonTg', function () {
        const action = $(this).data('action');
        $this.zone.run(() => {
          if (action == 'start_exploring') {
            $this.store.backPage();
          }
        });
      });
    }
  }

  getTimeDifference(val) {
    this.total = this.total - 100;
    if (this.total == 0) {
      this.subscription.unsubscribe();
    }
  }
  millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = parseInt(Math.floor(((millis % 60000) / 1000)).toFixed(0));
    return `${(minutes < 10 ? "0" : "")}${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
  }



  async ngOnInit(){
    this.store.titleCntWithPage('Info message');
    if(this.PLATFORMID){
      this.resData = localStorage.getItem('altMsg') != undefined ? JSON.parse(localStorage.getItem('altMsg')) : undefined
      this.dataAction = this.resData != undefined ? this.resData.data.Actions : ''
      this.loadMsg = this.resData != undefined ? this.resData.message : ''
      this.isSuccess = this.resData != undefined? this.resData.success:false
    }
    this.leftKey = (this.leftKey ==''?this.store.appType=='admin'? 'go_to_dashboard':'go_to_explore':this.leftKey)
    this.leftBtn = (this.leftBtn =='' ?this.store.getVal(this.store.appType=='admin'?'go_to_dashboard':'go_to_explore'):this.leftBtn)

    if(this.from =='confirm-email' || this.from== 'forgotpassword'|| this.from== 'reset-password' || this.from== 'change-email' || this.from=='update_new_email' || this.from== 'signup'){
      this.moveLogin=true
      this.leftKey = 'log_in'
      if(this.from== 'change-email'){
        this.leftKey = this.store.appType=='admin'? 'go_to_dashboard':'go_to_home'
      }
    }else{
      this.moveLogin=false
      if(this.PLATFORMID)
      if(this.cookieService.check(environment.cookiesKey)){
        this.leftKey = 'add_more'
      }else{        
        this.leftKey = this.store.appType=='front'? 'go_to_explore':'add_more'
      }
    }
    this.leftBtn = this.store.getVal(this.leftKey)

  }

  callAction(event) {
    
    if(this.moveLogin && this.store.appType !='front'){
      this.router.navigateByUrl((this.leftKey=='go_to_home' || this.leftKey=='go_to_dashboard'?this.store.navicateUrl: '/auth#login'), { replaceUrl: true })
    }else{
      if(this.store.appType !='front'){
        this.router.navigateByUrl(((this.leftKey=='go_to_explore')?'explore/enablers' :('/add-'+ this.from)), { replaceUrl: true })
      }else{
        if(this.leftKey == 'log_in'){
          this.router.navigateByUrl('/auth#login', { replaceUrl: true })
        }else{
          this.router.navigateByUrl('explore/enablers',{ replaceUrl: true })
        }
      }
    }
  }
}
