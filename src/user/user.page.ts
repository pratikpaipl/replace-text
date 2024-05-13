import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { SegmentModel } from 'src/shared/segment.model';
import { EventService } from 'src/shared/EventService';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  public selectedSegment: string = '';
  public selectedSegmentLbl: string = '';
  isShow = false;
  changeTab = true;
  pageType: string = ''
  pageLbl = '';
  updateTime:any=0;
  selItem: any
  private subLabel: any;
  private subSelectSegment: any;
  private applyFilter: any;
  // private removeData: any;
  PLATFORMID:any
  public segments: SegmentModel[] = [];
  constructor( @Inject(PLATFORM_ID)  platformId: any,private route: ActivatedRoute,  public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService, private cookieService: CookieService, private cdref: ChangeDetectorRef) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      for (let i = 0; i < this.segments.length; i++) {        
        this.segments[i].label =  this.store.getVal(this.segments[i].key == 'enablers'?'user_enablers': this.segments[i].key == 'funding-profile-match-report'?'fundraise-need-match-report':this.segments[i].key == 'fundraise-need-match-report'?'funding-profile-match-report':this.segments[i].key)
        if(this.segments[i].mTitleKey != undefined)
        this.segments[i].title =  this.store.updateSegmentName(this.segments[i].mTitle,this.segments[i].mTitleKey) //this.store.getVal(this.segments[i].mTitleKey)
        this.segments[i].mTitle =  this.store.updateSegmentName(this.segments[i].mTitle,this.segments[i].mTitleKey) //this.store.getVal(this.segments[i].mTitleKey)
      }      
      this.getPageLbl(this.pageType)
    });
    this.pageType = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : 'my-profile';
    this.getPageLbl(this.pageType)
    this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
      this.changeTab=false
      this.pageType=item.action
      this.selItem = item.item;
      // this.updateTime = store.getCurrentTime()
      this.getPageLbl(item.action)
    });
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        if (this.router.getCurrentNavigation().extras.state != undefined) {
          this.click(this.router.getCurrentNavigation().extras.state)
        }
      }
    });
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
      this.updateTime = item.updateTime
    });
  }
  
  ngOnDestroy() {
    this.subLabel.unsubscribe();
    this.subSelectSegment.unsubscribe();
    this.applyFilter.unsubscribe();
  }
  click(event){
    if(event.state != undefined || event.action != undefined){
      this.selItem = event.state != undefined ? event.state:event
      this.changeTab = false
      this.pageType = event.state != undefined?event.state.action:event.action
      this.eventService.publishRemoveData({FN_EnablerSlug:this.selItem.itemData.FN_EnablerSlug !=undefined?this.selItem.itemData.FN_EnablerSlug:'' ,FP_EnablerSlug:this.selItem.itemData.FP_EnablerSlug !=undefined?this.selItem.itemData.FP_EnablerSlug:''});
    }
    this.updateTime = new Date().getTime()
  }
  
  setTitle(){
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined){
      this.store.titleCntWithPage(obj.label)
    }
  }
   ngOnInit() {
    this.store.isLogin = this.PLATFORMID?(this.cookieService.check(environment.cookiesKey)):false
    this.setLeftPanel()
    this.updateTime = new Date().getTime()
  }
   ionViewWillEnter() {
    this.setTitle()
  }
  setLeftPanel() {
    this.segments=[]
    if (this.store.isLogin)
    this.segments.push({ key: 'my-profile',icon: 'fa-solid fa-id-badge', active: this.pageType == 'my-profile' ? 'active' : '', label: this.store.getVal('my_profile'),title:'M',mTitleKey:'main',mTitle:this.store.getVal('main') })
    if (this.store.isLogin) {
      this.segments.push({ key: 'change-password', icon: 'fas fa-lock', active: this.pageType == 'change-password' ? 'active' : '', label: this.store.getVal('change_password') })
      if(this.store.appType !='admin'){
        this.segments.push({ key: 'enablers', icon: 'fa-solid fa-vector-square', active: this.pageType == 'enablers' ? 'active' : '', label: this.store.getVal('user_enablers') })
        this.segments.push({ key: 'full-report', icon: 'fa-solid fa-infinity', active: this.pageType == 'full-report' ? 'active' : '', label:  this.store.getVal('full_report') })
        this.segments.push({ key: 'activity-log', icon: 'fa-solid fa-chart-line', active: this.pageType == 'activity-log' ? 'active' : '',label:this.store.getVal('activity_log')})
        
        this.segments.push({ key: 'my-funding-profiles', icon: 'fa-solid fa-money-bills', active: this.pageType == 'my-funding-profiles' ? 'active' : '',label:this.store.getVal('my_funding_profiles'), title: 'FP',mTitleKey:'side_funding_profiles',mTitle:this.store.getVal('side_funding_profiles')})
        this.segments.push({ key: 'funding-profile-submissions', icon: 'fa-solid fa-money-bill-transfer', active: this.pageType == 'funding-profile-submissions' ? 'active' : '',label:this.store.getVal('funding_profile_submissions')})
        this.segments.push({ key: 'funding-profile-match-report', icon: 'fa-solid fa-infinity', active: this.pageType == 'funding-profile-match-report' ? 'active' : '',label:this.store.getVal('fundraise_need_match_report')})
        this.segments.push({ key: 'investore-suggested-enabler', icon: 'fa-solid fa-infinity', active: this.pageType == 'investore-suggested-enabler' ? 'active' : '', label: this.store.getVal('investore_suggested_enabler') })
        // this.segments.push({ key: 'profile-activity-log', icon: 'fas fa-lock', active: this.pageType == 'profile-activity-log' ? 'active' : '',label:this.store.getVal('activity_log')})
        
        this.segments.push({ key: 'my-fundraise-needs', icon: 'fa-brands fa-space-awesome', active: this.pageType == 'my-fundraise-needs' ? 'active' : '',label:this.store.getVal('my_fundraise_needs'), title:'FN',mTitleKey:'side_fundraise_needs',mTitle:this.store.getVal('side_fundraise_needs')})
        this.segments.push({ key: 'fundraise-need-submissions', icon: 'fa-solid fa-rocket', active: this.pageType == 'fundraise-need-submissions' ? 'active' : '',label:this.store.getVal('fundraise_need_submissions')})
        this.segments.push({ key: 'fundraise-need-match-report', icon: 'fa-solid fa-infinity', active: this.pageType == 'fundraise-need-match-report' ? 'active' : '',label:this.store.getVal('funding_profile_match-report')})
        this.segments.push({ key: 'investee-suggested-enabler', icon: 'fa-solid fa-infinity', active: this.pageType == 'investee-suggested-enabler' ? 'active' : '', label: this.store.getVal('investee_suggested_enabler') })
        // this.segments.push({ key: 'need-activity-log', icon: 'fas fa-lock', active: this.pageType == 'need-activity-log' ? 'active' : '',label:this.store.getVal('activity_log')})
        }
      }
      this.setTitle()
    }
    onClickSegment(event) {
      if(this.changeTab)
      this.selItem = undefined
      this.changeTab=true
      this.getPageLbl(event)
    }
    
    getPageLbl(event) {
      for (let j = 0; j < this.segments.length; j++) {
        const element = this.segments[j];
        if (element.key == event) {
          this.pageLbl = element.label
        }
      }
      this.pageType = event;
      this.isShow = (window.innerWidth <= 768);
      this.setTitle()
    }
    
    updateCount(event){
      
    }
    ngAfterContentChecked() {
      this.cdref.detectChanges();
    }
  }
