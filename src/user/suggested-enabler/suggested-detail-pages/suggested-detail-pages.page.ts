import { EventService } from 'src/shared/EventService';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, IonSearchbar, IonInfiniteScroll, ModalController, ActionSheetController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectorRef, AfterContentChecked, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { FilterViewComponent } from '../../../widget/filter-view/filter-view.component';
import * as moment from 'moment';
import { actType, appApi } from 'src/shared/app.constants';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ShareComponent } from 'src/widget/share/share.component';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'suggested-detail-pages',
  templateUrl: 'suggested-detail-pages.page.html',
  styleUrls: ['suggested-detail-pages.page.scss'],
  queries: {
    content: new ViewChild('content')
  }
})
export class SuggestedDetailPage implements OnInit, OnDestroy, AfterContentChecked  {
  @ViewChild('searchbar1') searchbar1: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('content') content: any;
  selItem: any;
  ClickFrom: any;
  filteCnt = 0;
  updateTime = 0;
  detailData: any;

  ActionMenu = [];
  OnscreenActions = [];
  isShowFilter = false;
  isShowUp = false;
  byName = ""
  Name = ""
  parentDesc = ""
  parentLogo = ""

  EnablerIDs = "";
  allTotal;
  keyword: any = '';
  sort: any = 'recent';
  pageType: any;
  type = '';
  lng: any = 'en';
  from = '';
  slug = '';
  eslug = '';
  pagePath = '';
  isShowPageAdminView = false;
  public segments = []
  permissions = []
  pageTypeMeg: any;
  ImpactThemesAndAreas: any = ''
  Sdgs: any = ''
  Esg: any = ''
  FNImpactThemesAndAreas: any = []
  FPImpactThemesAndAreas: any = []
  FNFundingType: any = []
  FPFundingType: any = []
  FNSdgs: any = []
  FPSdgs: any = []
  FNEsg: any = []
  FPEsg: any = []

  sdgShow = true;
  countryShow = true;
  impactThemeAreaShow = true;
  EnablerSlug: any = [];
  FundingType: any = [];
  
  private applyFilter: any;
  private applyTabReload: any;
  private subSelectSegment: any;
  private subLabel: any;
  private PLATFORMID: any;
  breadCrumpData: any;
  
  options = { timeout: 30000, enableHighAccuracy: false, maximumAge: 0 };
  constructor(@Inject(PLATFORM_ID) platformId: any,private cookieService: CookieService, public myElement: ElementRef, public store: StorageService,  private route: ActivatedRoute, private activatedRoute: ActivatedRoute, private eventService: EventService, public toastController: ToastController, public actionSheetController: ActionSheetController, public modalController: ModalController, public router: Router, public platform: Platform, public apiService: ApiService, private cdref: ChangeDetectorRef) {
    this.PLATFORMID = isPlatformBrowser(platformId);
    this.store.pageTittle = '';
    const href = this.router.url;
    const urlParts = href.split('/');
    console.log('urlParts ',urlParts)
    this.from = urlParts[1];
    this.type = urlParts[4];
    this.slug = this.activatedRoute.snapshot.paramMap.get('slug');
    this.eslug = this.activatedRoute.snapshot.paramMap.get('eslug');
    console.log('this.slug ',this.slug)
    this.setPathPage();
    this.pageType = (this.from !== 'user') ? this.route.snapshot.paramMap.get('page') : undefined;
  
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.segments.forEach(segment => {
        console.log('segment.key', segment.key)
        const key = segment.key === 'profile-form' ?'investment_criteria': segment.key === 'fundraise-form' ?'investment_raise': segment.key === 'fundraise-needs' ? 'investees' : segment.key === 'funding-profiles' ? 'investors' : segment.key;
        segment.label = this.store.updateSegmentName(segment.label, key);
      });
      this.setTitle();
    });
    this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
      this.ClickFrom = item.ClickFrom;
      this.selItem = item.item;
      this.pageType = item.action;
    });


    if (this.PLATFORMID) {
      this.store.windowWidth = window.innerWidth;
      this.store.windowHight = window.innerHeight;
      this.store.IsWebView = window.innerWidth > 830;
    }
  }
  setPathPage() {
    this.route.queryParams.subscribe(params => {
      const navigationExtras = this.router.getCurrentNavigation()?.extras;
      if (navigationExtras?.state != undefined) {
        this.pagePath = navigationExtras.state.pagePath;
      } else {
        this.pagePath = '';
      }
    });
  }
  setTitle() {
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj && this.byName) {
      const pageTitle = (obj.key === 'contact') ? `${obj.label} ${this.byName}` : this.byName;
      this.store.titleCntWithPage(pageTitle, (obj.key !== 'contact') ? obj.label : undefined, this.detailData);
    }
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {    
      this.getDetails()
      this.updateTime = this.store.getCurrentTime();
    }
  }
  ionViewWillEnter() {
    
    if(this.from == 'user')
    this.pageType = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : 'profile-form';
    else
    this.pageType = this.route.snapshot.paramMap.get('page')
    this.store.isLogin = this.PLATFORMID?(this.cookieService.check(environment.cookiesKey)):false
    this.setTitle()
  }
  ionViewDidEnter(){
    this.applyTabReload = this.eventService.applyTabReload$.subscribe((item: any) => {
        this.updateTime = item.updateTime;
        if(window.location.pathname.includes('/enabler/'))
        this.getDetails();
    });
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
      this.updateTime = item.updateTime;
     });
  }
  ionViewDidLeave(){
    if(this.applyTabReload != undefined)
    this.applyTabReload.unsubscribe()
    if( this.applyFilter != undefined)
    this.applyFilter.unsubscribe()
  }
  ngOnInit(){
    this.keyword = this.store.getFilterFromUrl('keyword', '');
    this.sort =  this.store.getFilterFromUrl('sort', this.sort)
    this.getDetails();    
  }
  async removeFilter(event) {
    if (event != undefined) {
      this.selItem = await event.selItem;
      this.updateTime = new Date().getTime()
    }
  }
  setFilterCnt() {
    this.filteCnt = this.store.calculateFilter(true, this.store.getFilterFromUrl('SdgIDs',[]),true, this.store.getFilterFromUrl('EsgKeys',[]), this.pageType=='enablers',this.store.getFilterFromUrl('countryOfEnabler',[]), true, this.store.getFilterFromUrl('ImpactThemesAndAreasKey',[]),false,this.EnablerSlug,false,this.store.getFilterFromUrl('FundingProviderType',[]),false,this.store.getFilterFromUrl('MinimumTicketSize',[]),false,this.store.getFilterFromUrl('FundingType',[]),false,this.store.getFilterFromUrl('FundingStage',[]),false,this.store.getFilterFromUrl('GenderLens',[]))
  }
  onPitchDownload(path){
    this.apiService.pitchDownload(path);
  }
  ngOnDestroy() {
    this.subSelectSegment.unsubscribe();
    this.subLabel.unsubscribe();
    if(this.applyFilter ! = undefined){
      this.applyFilter.unsubscribe()
    }
  }
  onClickSegment(event): void {
    this.allTotal = 0;
    this.pageType = event;
    this.setPathPage()
    this.setTitle()
    if (this.ClickFrom == undefined && this.selItem != undefined)
    this.removeFilter({ isCall: false, rmType: 'all' })
    this.ClickFrom = undefined
  
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  openFilter(event) {
    if (event != undefined) {
      this.openFilterView()
    }
  }
  Share(){
    let postData = new FormData();
    postData.append("ShareUrl",window.location.href);
    postData.append('LanguageCode', this.store.lng)
    postData.append('application', this.store.appType)

    let share=this.store.getVal('share');
    let twitter=this.store.getVal('twitter');
    let facebook=this.store.getVal('facebook');
    let linkedin=this.store.getVal('linkedin')  

    this.store.http.post(environment.BaseUrl + 'share/add', postData, {  headers: { 'skip': 'false' } }).subscribe(async response => {
        let res: any = response;
        const modal = await this.modalController.create({
            component: ShareComponent,
            cssClass: "modal-share",
            componentProps: { value: { ShareUrl:res.data.ShareLink,share:share,twitter:twitter,facebook:facebook,linkedin:linkedin } },
        });
        await modal.present();
        await modal.onDidDismiss().then(() => {

        });
    });
  }
  async openFilterView() {
    let data = { sdgShow: true, esgShow:true, countryShow: this.pageType=='enablers',
    impactThemeAreaShow : true, FundingProviderTypeShow:false,
    MinimumTicketSizeShow:false,FundingTypeShow:false,FundingStageShow:false,EnablerShow:false,EnablerSlug:this.EnablerSlug, GenderLensShow:false, pageFrom:'user',from:'front', segment: this.pageType };
    const modal = await this.modalController.create({
      component: FilterViewComponent,
      cssClass: "modal-save-filter",
      componentProps: data,
    });
    await modal.present();
    await modal.onDidDismiss().then((data) => {
      
    });
  }
  updateCount(event) {
    if (event.count != undefined) {
      this.allTotal = event.count
    }
    this.setFilterCnt();
    if (event.permissions != undefined) {
      this.permissions = event.permissions
    }
    if(event !=undefined && event.action !=undefined){
      const obj = this.segments.find(x => x.key === event.action);
      if(obj != undefined)
      this.pageType = event.action
      else if(event.itemData!=undefined && event.itemData.EnablerFilterType !=undefined){
          let subData = {chipLbl:event.itemData.chipLbl,EnablerFilterType:event.itemData.EnablerFilterType,EnablerSlug:event.itemData.EnablerSlug,EnablerName:event.itemData.EnablerName,extraType:event.action}
          this.PLATFORMID?localStorage.setItem('state',JSON.stringify(subData)):undefined
          this.store.navigatePage(['user'],event.itemData.extraType)
      }
    }
  }
  callSearchFilter(event) {
    if (event.filter != undefined && event.filter == '1') {
      this.openFilterView();
    } else if (event.keyword != undefined) {
      this.keyword = event.keyword
      
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    }
  }
  selectSort(event) {
    if (event != undefined) {
      this.sort = event;
      this.updateTime =new Date().getTime()
    }
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
  openExploreWith(action) {
    this.router.navigateByUrl('/explore'+this.store.getSeprater() + action);
  }
  download($event) {
    const keyword = this.store.getFilterFromUrl('keyword', '');
    const sort = this.store.getFilterFromUrl('sort', 'recent');
    const ImpactThemesAndAreasKey = this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []);
    const SdgIDs = this.store.getFilterFromUrl('SdgIDs', []);
    const EsgKeys = this.store.getFilterFromUrl('EsgKeys', []);
    
    let slugParamsNm;
    let apiUrl;
    let slugValue;
    
    switch (this.type) {
      case 'enablers':
        if (this.pageType === 'funding-profiles' || this.pageType === 'fundraise-need' || this.pageType === 'fundraise') {
          slugParamsNm = (this.pageType === 'funding-profiles') ? 'ProfileSlug' : 'FundraiseSlug';
          apiUrl = (this.pageType === 'funding-profiles') ? appApi.EnablerFundingProfileListExcel : appApi.EnablerFundraiseListExcel;
          slugValue = (this.detailData[slugParamsNm] !== undefined) ? this.detailData[slugParamsNm] : '';
          this.apiService.callDownload(apiUrl, slugParamsNm, slugValue, keyword, sort, (this.pageType === 'funding-profiles') ? actType.funding_profile_enabler : actType.fundraise_enabler, 'EnablerSlug', (this.detailData.EnablerSlug !== undefined) ? this.detailData.EnablerSlug : '', undefined, undefined, undefined, ImpactThemesAndAreasKey, SdgIDs, EsgKeys);
        }
        break;
        
      case 'funding-profile':
        if (this.pageType === 'matching-enablers') {
          slugParamsNm = 'ProfileSlug';
          apiUrl = appApi.myFPEnablerListExcel;
          slugValue = (this.detailData[slugParamsNm] !== undefined) ? this.detailData[slugParamsNm] : '';
          this.apiService.callDownload(apiUrl, slugParamsNm, slugValue, keyword, sort, actType.funding_profile_enabler, undefined, undefined, undefined, undefined, undefined, ImpactThemesAndAreasKey, SdgIDs, EsgKeys);
        }
        break;
        
      case 'fundraise-need':
      case 'fundraise':
        if (this.pageType === 'matching-enablers') {
          slugParamsNm = 'FundraiseSlug';
          apiUrl = (this.type === 'fundraise-need') ? appApi.myFNEnablerListExcel : appApi.myFNEnablerListExcel;
          slugValue = (this.detailData[slugParamsNm] !== undefined) ? this.detailData[slugParamsNm] : '';
          this.apiService.callDownload(apiUrl, slugParamsNm, slugValue, keyword, sort, actType.fundraise_enabler, undefined, undefined, undefined, undefined, undefined, ImpactThemesAndAreasKey, SdgIDs, EsgKeys);
        }
        break;
        
      default:
        break;
    }
  }
  async getDetails() {
    try {
      const response = await this.apiService.getFrontDetails('submitted', this.type, this.slug, '', this.sort,'1','1',this.eslug).toPromise();
      const res: any = response;
      if (res.success && res.data.detail !== undefined) {
        this.segments = [];
        this.detailData = res.data.detail;
        this.store.updateMetaData(this.type, this.detailData, 'details');
        
        var ld = [];
          ld.push({
            PageName: this.detailData.EnablerName, PageSlug: this.eslug, PageType: "enabler"
          })
          // ld.push({
          //   PageName: this.detailData.EnablerName, PageSlug: this.eslug, PageType:this.pageType
          // })
          ld.push({
            PageName: this.detailData.ReferenceCode, PageSlug: this.eslug, PageType: this.type,action: this.type+'s'
          })
          this.breadCrumpData = {
            list: ld, Page: 'submitted enabler'
          }

        if (['fundraise-needs', 'fundraise-need', 'fundraise'].includes(this.type)) {
          this.byName = this.Name = this.detailData.ReferenceCode;
          this.ImpactThemesAndAreas = this.parseJson(this.detailData.ImpactThemesAndAreasJson);
          this.Esg = this.parseJson(this.detailData.EsgJson);
          this.FundingType = this.parseJson(this.detailData.FundingTypeJson);
          this.Sdgs = this.parseJson(this.detailData.SdgsJson);
          this.detailData.CreatedTs = this.formatDate(this.detailData.CreatedTs);
          this.detailData.ModifiedTs = this.formatDate(this.detailData.ModifiedTs);
        } else if (this.type === 'funding-profile') {
          this.byName = this.Name = this.detailData.ReferenceCode;
          this.ImpactThemesAndAreas = this.parseJson(this.detailData.ImpactThemesAndAreasJson);
          this.Esg = this.parseJson(this.detailData.EsgJson);
          this.FundingType = this.parseJson(this.detailData.FundingTypeJson);
          this.Sdgs = this.parseJson(this.detailData.SdgsJson);
          this.detailData.CreatedTs = this.formatDate(this.detailData.CreatedTs);
          this.detailData.ModifiedTs = this.formatDate(this.detailData.ModifiedTs);
        } else if (this.type === 'impact-funding-resources') {
          this.slug = this.byName = this.Name = this.detailData.Title;
        }
        if (this.segments.length === 0) {

          if (this.type === 'funding-profile') {
            this.segments.push({ key: 'profile-form', label: this.store.getVal('investment_criteria'), icon: this.from === 'user'?'fa-money-bills fa-solid': 'fa-money-bill-transfer fa-solid' });
            if (this.from === 'user') {
              this.pageType = this.route.snapshot.fragment || 'profile-form';
            }
          }
          if (this.type === 'fundraise-need') {
            this.segments.push({ key: 'fundraise-form', label: this.store.getVal('investment_raise'), icon: this.from === 'user'?'fa-brands fa-space-awesome':'fa-rocket fa-solid' });
            if (this.from === 'user') {
              this.pageType = this.route.snapshot.fragment || 'fundraise-form';
            }
          }
        }
       
        setTimeout(() => {
          if (this.pageType !== 'overview' && this.pageType !=='profile-form' && this.pageType !=='fundraise-form') {
            this.store.scrollToEnd('#tabblings');
          }
        }, 2000);
        if(this.PLATFORMID){
          setTimeout(() => {
            if((this.pageType == 'overview' || this.pageType =='profile-form'|| this.pageType =='fundraise-form') && localStorage.getItem('scroll') != undefined){
              localStorage.removeItem('scroll')
              this.store.scrollToEnd('#tabs_contents');
            }
          }, 800);
        }
        this.setTitle();
      } else {
        this.segments = [];
        this.pageType = '';
      }
      if (this.pageType === 'matching-enablers') {
        this.setFilterCnt();
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  }
  private parseJson(value: string): any[] {
    return value ? JSON.parse(value) : [];
  }
  private formatDate(date: string): string {
    return date ? moment(date).format('DD MMM yyyy') : '';
  }
  }