import { ChangeDetectorRef, Component, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { SegmentModel } from 'src/shared/segment.model';
import { StorageService } from 'src/shared/StorageService';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {


  pageType = 'enablers';
  pageLbl = 'Dashboard';
  isShowUp = false;
  isShow = false;
  changeTab = true;
  public segments: SegmentModel[] = [];
  private subLabel: any;
  private subSelectSegment: any;
  private applyTabReload: any;
  private applyFilter: any;
  // private removeData: any;

  NavigatePage: any;
  selItem: any
  sessionID: any

  updateTime:any;
  @ViewChild('content') content: any;
  constructor(private menu: MenuController, private cookieService: CookieService, private route: ActivatedRoute, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService, private cdref: ChangeDetectorRef, public platform: Platform) {
    this.sessionID = this.route.snapshot.paramMap.get('sessionID')
    this.NavigatePage = this.route.snapshot.paramMap.get('type');
    if (route.snapshot.fragment != null) {
      this.pageType = this.route.snapshot.fragment;
    } else {
      this.pageType = 'dashboard';
    }
    this.route.queryParams.subscribe(params => {
      let rState = localStorage.getItem('state') != undefined?JSON.parse(localStorage.getItem('state')):undefined
      
      if(rState != undefined){
        this.updateTime = new Date().getTime()
      }
      if (this.router.getCurrentNavigation().extras.state) {
        if (this.router.getCurrentNavigation().extras.state != undefined) {
          this.click(this.router.getCurrentNavigation().extras.state)
        }
      }
    });
    this.applyFilter = this.eventService.applyFilter$.subscribe(async (item: any) => {
      this.updateTime = item.updateTime;
      this.setTabMenu()
    })
  }
  ionViewDidEnter(){
    this.applyTabReload = this.eventService.applyTabReload$.subscribe((item: any) => {
      this.updateTime = new Date().getTime();
    });
  }
  ionViewDidLeave(){
    if( this.applyTabReload != undefined)
    this.applyTabReload.unsubscribe()
  }
  ngOnDestroy() {
    if(this.subLabel != undefined)
    this.subLabel.unsubscribe()
    if( this.subSelectSegment != undefined)
    this.subSelectSegment.unsubscribe()
    if( this.applyFilter != undefined)
    this.applyFilter.unsubscribe()
  }
  getPageLbl(event) {
    for (let j = 0; j < this.segments.length; j++) {
      const element = this.segments[j];
      if (element.key == event) {
        this.pageLbl = element.label
        this.segments[j].active = 'active'
      }
    }
    this.pageType = event;
    this.setTitle()
    this.isShow = (window.innerWidth <= 768);
  }
  ionViewWillEnter() {  
    // this.updateTime = new Date().getTime()    
    this.setTitle()
  }
  setTitle() {
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined) {
      this.store.titleCntWithPage(obj.label);
    }
  }
  tabChange(event) {
    if (event != undefined && event.openMenu) {
      this.menu.enable(true, "admin");
      this.menu.open("admin");
    }
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime = this.store.getCurrentTime();
    }
  }
  async onClickSegment(event): Promise<void> {
    this.menu.close();
    if(this.changeTab)
      this.selItem = undefined
      this.changeTab=true
    this.getPageLbl(event)
  }
  ngOnInit() {
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      for (let i = 0; i < this.segments.length; i++) {
          this.segments[i].label = this.store.updateSegmentName(this.segments[i].label,this.segments[i].key)
          this.segments[i].mTitle = this.store.updateSegmentName(this.segments[i].mTitle,this.segments[i].mTitleKey)
      }
      this.getPageLbl(this.pageType)
    });
    this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
      this.changeTab=false
      this.pageType=item.action
      this.selItem = item.item;
    });    
    
    this.setTabMenu()
  }
  setTabMenu() {
    let datas=undefined
    let isLogin = this.cookieService.check(environment.cookiesKey)
    if(isLogin){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      datas = res!=undefined?res.data:undefined
    }
    this.segments=[]
    // this.segments.push({ key: 'backoffice',icon: '', active: this.pageType == 'dashboard' ? 'active' : '', label:'Back Office'})
    // this.segments.push({ key: 'backoffice',icon: 'fa-solid fa-shuffle', active: this.pageType == 'dashboard' ? 'active' : '', label:'Switch to marcket place'})

    this.segments.push({ key: 'back-office',icon: '', active: this.pageType == 'back-office' ? 'active' : '', label:this.store.getVal('back_office')})
    this.segments.push({ key: 'switch-to-marcket-place',icon: 'fa-solid fa-shuffle', active: this.pageType == 'switch-to-marcket-place' ? 'active' : '', label:this.store.getVal('switch_to_marcket_place')})


    this.segments.push({ key: 'dashboard',icon: 'fas fa-home', active: this.pageType == 'dashboard' ? 'active' : '', label: this.store.getVal('dashboard'),title:'G',mTitleKey:'general',mTitle:this.store.getVal('general') })
    this.segments.push({ key: 'enablers', icon: 'fa-solid fa-vector-square', active: this.pageType == 'enablers' ? 'active' : '', label: this.store.getVal('enablers') })
    this.segments.push({ key: 'summary', icon: 'fas fa-tags', active: this.pageType == 'summary' ? 'active' : '', label: this.store.getVal('summary') })
    this.segments.push({ key: 'full-report', icon: 'fa-solid fa-infinity', active: this.pageType == 'full-report' ? 'active' : '', label: this.store.getVal('full_report') })
    this.segments.push({ key: 'subscripions',icon: 'fa-solid fa-file-invoice', active: (this.pageType == 'subscripions' || this.pageType == 'plans_and_pricing' || this.pageType == 'plan_details' ) ? 'active' : '', label: this.store.getVal('subscripions')})
    this.segments.push({ key: 'matchmaking',icon: 'fa-solid fa-file-csv', active: (this.pageType == 'matchmaking' || this.pageType == 'activity-log' || this.pageType == 'data-format-rules') ? 'active' : '', label: this.store.getVal('csv_matchmaking')})
    
    this.store.IsSystemAdmin = datas!=undefined?datas.UserData != undefined?(datas.UserData.IsSystemAdmin == 1):false:false
    this.store.AdminAccess = datas!=undefined?datas.UserData != undefined?(datas.UserData.AdminAccess == 1):false:false
    if(this.store.IsSystemAdmin){
      let obj = { key: 'reference-data', icon: 'fa-solid fa-database', active: this.pageType == 'reference_data' ? 'active' : '', label: this.store.getVal('reference_data') }
      let isExist = this.segments.some(o => o.key === obj.key );
      if(!isExist){
        this.segments.splice(7, 0, obj);
      }
    }
    
    this.segments.push({ key: 'users',icon: 'fa-solid fa-user', active: this.pageType == 'users' ? 'active' : '', label: this.store.getVal('users')})
    if(this.store.IsSystemAdmin){
      let obj = { key: 'funding-profiles',icon: 'fa-solid fa-money-bills', active: this.pageType == 'funding-profiles' ? 'active' : '', label: this.store.getVal('funding_profiles'),title:'I',mTitleKey:'funding_providers',mTitle:this.store.getVal('funding_providers') }
      let isExist = this.segments.some(o => o.key === obj.key );
      if(!isExist){
        this.segments.splice(8, 0, obj);
      }
      let objSub = { key: 'funding-profiles-submitted', icon: 'fa-solid fa-money-bill-transfer', active: this.pageType == 'funding-profiles-submitted' ? 'active' : '', label: this.store.getVal('funding_profiles_submitted') }
      let isExistSub = this.segments.some(o => o.key === objSub.key );
      if(!isExistSub)
      this.segments.push(objSub)
    }else{
      let objSub = { key: 'funding-profiles-submitted', icon: 'fa-solid fa-money-bill-transfer', active: this.pageType == 'funding-profiles-submitted' ? 'active' : '', label: this.store.getVal('funding_profiles_submitted'),title:'I',mTitleKey:'funding_providers',mTitle:this.store.getVal('funding_providers') }
      let isExistSub = this.segments.some(o => o.key === objSub.key );
      if(!isExistSub)
      this.segments.push(objSub)
    }
    this.segments.push({ key: 'fundraise-need-match-report', icon: 'fa-solid fa-infinity', active: this.pageType == 'fundraise-need-match-report' ? 'active' : '', label: this.store.getVal('fundraise_need_match_report') })
    if(this.store.IsSystemAdmin){
      let obj = { key: 'fundraise-needs',icon: 'fa-brands fa-space-awesome', active: this.pageType == 'fundraise-needs' ? 'active' : '', label: this.store.getVal('fundraise_needs'),title:'I',mTitleKey:'investees',mTitle:this.store.getVal('investees') }
      let isExist = this.segments.some(o => o.key === obj.key );
      if(!isExist)
      this.segments.push(obj);
      let objSub = { key: 'fundraise-needs-submitted', icon: 'fa-solid fa-rocket', active: this.pageType == 'fundraise-needs-submitted' ? 'active' : '', label: this.store.getVal('fundraise_needs_submitted') }
      let isExistSub = this.segments.some(o => o.key === objSub.key );
      if(!isExistSub)
      this.segments.push(objSub)
    }else{
      let objSub = { key: 'fundraise-needs-submitted', icon: 'fa-solid fa-rocket', active: this.pageType == 'fundraise-needs-submitted' ? 'active' : '', label: this.store.getVal('fundraise_needs_submitted'),title:'I',mTitleKey:'investees',mTitle:this.store.getVal('investees')  }
      let isExistSub = this.segments.some(o => o.key === objSub.key );
      if(!isExistSub)
      this.segments.push(objSub)
    }
    this.segments.push({ key: 'funding-profile-match-report', icon: 'fa-solid fa-infinity', active: this.pageType == 'funding-profile-match-report' ? 'active' : '', label: this.store.getVal('funding_profile_match_report') })
    this.getPageLbl(this.pageType)
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  changePassword() {
    this.router.navigateByUrl('/change-password');
  }
  changeEmail() {
    this.router.navigateByUrl('/change-email');
  }
  function(event) {
    if (event.detail.scrollTop == 0) {
      this.isShowUp = false;
      return
    } else {
      this.isShowUp = true;
    }
  };

  click(event){
    if(event != undefined ){
      this.selItem = event.state !=undefined? event.state:event.itemData != undefined?event:undefined
      this.changeTab=false
      this.pageType = event.state != undefined?event.state.action:event.action != undefined?event.action:this.pageType
      if(this.selItem != undefined)
      this.eventService.publishRemoveData({FN_EnablerSlug:this.selItem.itemData.FN_EnablerSlug !=undefined?this.selItem.itemData.FN_EnablerSlug:'' ,FP_EnablerSlug:this.selItem.itemData.FP_EnablerSlug !=undefined?this.selItem.itemData.FP_EnablerSlug:'',});
    }
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
