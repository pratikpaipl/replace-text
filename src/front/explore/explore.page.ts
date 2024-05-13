import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, ToastController, Platform } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { SegmentModel } from 'src/shared/segment.model';
import { EventService } from 'src/shared/EventService';
import { FilterViewComponent } from 'src/widget/filter-view/filter-view.component';
import { actType, appApi } from 'src/shared/app.constants';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { ShareComponent } from 'src/widget/share/share.component';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss'],
  queries: {
    content: new ViewChild('content')
  }
})
export class ExplorePage implements OnInit, OnDestroy {
  @ViewChild('content') content: any;
  sdgShow = true;
  countryShow = true;
  impactThemeAreaShow = true;
  EnablerSlug: any = [];
  filteCnt = 0;
  updateTime = 0;
  activePage = 'main_rows mt-res'
  isShowUp = false;
  selItem: any
  name: any
  email: any
  userData: any = {};
  isShow: any = 'none';
  allTotal = 0;
  keyword = '';
  isFocus = false;
  isShowLocal = true;
  adminPath:any;

  sort = 'recent';
  pageType = '';

  permissions = []

  isCall=0;
  PLATFORMID:any=false
  setFirstLoad: any=false;
  
  private applyFilter: any;
  private applyTabReload: any;
  public segments: SegmentModel[] = [];
  private subSelectSegment: any;
  constructor(@Inject(PLATFORM_ID) platformId: any,public platform: Platform, public myElement: ElementRef, public store: StorageService, public apiService: ApiService, private route: ActivatedRoute,private cookieService: CookieService, private eventService: EventService, public toastController: ToastController, public modalController: ModalController, public router: Router, private cdref: ChangeDetectorRef) {

    this.PLATFORMID = isPlatformBrowser(platformId)
    this.adminPath = environment.redirectAdmin;

    this.segments.push({ key: 'enablers', label: this.store.getVal('enablers'),icon:'fa-solid fa-vector-square' })
    this.segments.push({ key: 'funding-profiles', label: this.store.getVal('investors'),icon:'fa-money-bill-transfer fa-solid' })
    this.segments.push({ key: 'fundraise-needs', label: this.store.getVal('investees'),icon:'fa-rocket fa-solid' })

 
    this.eventService.updateLabel$.subscribe(async (item: any) => {
      for (let i = 0; i < this.segments.length; i++) {        
        let key = this.segments[i].key=='fundraise-needs'?'investees':this.segments[i].key=='funding-profiles'?'investors':this.segments[i].key
        this.segments[i].label = this.store.updateSegmentName(this.segments[i].label,key)
        this.segments[i].mTitle = this.store.updateSegmentName(this.segments[i].mTitle,this.segments[i].mTitleKey)
      }
      this.setTitle();
    });

    this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
      if (item.pageFrom == "user" && item.filterItem != undefined) {
        this.selItem = item;
      }
    });
    
  }
  openPage(path){
    this.router.navigateByUrl(path)
  }
  ngOnInit() {
    this.applyFilter = this.eventService.applyFilter$.subscribe(async (item: any) => {
      this.updateTime = item.updateTime;
    })
    this.setFirstLoad=true
    this.setInitialData()    
  }
  async ionViewWillEnter() {
    this.pageType = this.route.snapshot.paramMap.get('page')
    if(!this.setFirstLoad){
      this.setInitialData()
    }else{
      this.setFirstLoad=false
    }    
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.updateTime = this.store.getCurrentTime();
    }
  }
  setInitialData() {
    this.keyword=this.store.getFilterFromUrl('keyword', '')
    this.pageType = this.route.snapshot.paramMap.get('page')
    this.activePage = 'main_rows mt-res'
    this.setUserData()
    this.setTitle();
  }
  ionViewDidEnter(){
    this.applyTabReload = this.eventService.applyTabReload$.subscribe((item: any) => {
      this.updateTime = item.updateTime;
    });
  }
  ngOnDestroy() {
    this.subSelectSegment.unsubscribe();
    if( this.applyFilter != undefined)
    this.applyFilter.unsubscribe()

  }
  ionViewDidLeave(){
    if(this.applyTabReload != undefined)
    this.applyTabReload.unsubscribe()
  }
  setUserData() {
    this.store.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.store.isLogin){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      this.store.userData = datas;
      if (datas != undefined && datas.UserData != undefined) {
        this.userData = datas;
        this.name = datas.UserData.FirstName + ' ' + datas.UserData.LastName
        this.email = datas.UserData.Email
      } else {
        this.name = ''
        this.email = ''
      }
    } 
  }
  download($event) {
    let endPoint = ''
    let slugParam = ''
    let actionType = ''
    if (this.pageType == 'enablers') {
      endPoint = appApi.EnablerListExcel
      slugParam = ''
      actionType = actType.enabler
    } else if (this.pageType == 'fundraise') {
      endPoint = appApi.FNsubmittedAtEnablersListExcel
      slugParam = ''
      actionType = actType.fundraise_enabler
    } else if (this.pageType == 'funding-profiles') {
      endPoint = appApi.FPsubmittedAtEnablersListExcel
      slugParam = ''
      actionType = actType.funding_profile_enabler
    }

    let keyword = this.store.getFilterFromUrl('keyword', '')
    let sort = this.store.getFilterFromUrl('sort', 'recent')
    let countryOfEnabler = this.pageType == 'enablers'? this.store.getFilterFromUrl('countryOfEnabler',[]):'';
    let ImpactThemesAndAreasKey = this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []);
    let SdgIDs = this.store.getFilterFromUrl('SdgIDs',[]);
    let EsgKeys = this.store.getFilterFromUrl('EsgKeys',[])
    this.apiService.callDownload(endPoint, slugParam, '', keyword, sort, actionType,'','','','',countryOfEnabler,ImpactThemesAndAreasKey,SdgIDs,EsgKeys);
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
    const modal = await this.modalController.create({
      component: FilterViewComponent,
      cssClass: "modal-save-filter",
      componentProps: { sdgShow: true, esgShow:true, countryShow: this.pageType=='enablers',impactThemeAreaShow : true, FundingProviderTypeShow:false,MinimumTicketSizeShow:false,FundingTypeShow:false,FundingStageShow:false,EnablerShow:false,EnablerSlug:this.EnablerSlug,GenderLensShow:false,pageFrom: 'user',from:'front', segment: this.pageType  },
      backdropDismiss: true
    });
    await modal.present();
    await modal.onDidDismiss().then((data) => {
    });
  }
  
  setFilterCnt() {
    this.filteCnt = this.store.calculateFilter(true, this.store.getFilterFromUrl('SdgIDs',[]),true, this.store.getFilterFromUrl('EsgKeys',[]), this.pageType=='enablers',this.store.getFilterFromUrl('countryOfEnabler',[]), true,  this.store.getFilterFromUrl('ImpactThemesAndAreasKey',[]),false,this.EnablerSlug,false, this.store.getFilterFromUrl('FundingProviderType',[]),false,this.store.getFilterFromUrl('MinimumTicketSize',[]),false,this.store.getFilterFromUrl('FundingType',[]),false,this.store.getFilterFromUrl('FundingStage',[]),false,this.store.getFilterFromUrl('GenderLens',[]))
  }

  callFilter(event) {
    if (event.filter != undefined && event.filter == '1') {
      this.openFilterView();
    } else if (event.keyword != undefined) {
      this.keyword = event.keyword
      // this.updateTime = (new Date().getTime())
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    }
  }
  selectSort(event) {
    if (event != undefined) {
      this.sort = event;
      this.updateTime = (new Date().getTime())
    }
  }
  onClickSegment(event): void {
    this.allTotal = 0;
    this.pageType = event;
    this.setTitle();
  }
  setTitle(){
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined) {
      this.store.titleCntWithPage(obj.label);
    }
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
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
  updateCount(event) {
    if (event.count != undefined) {
      this.allTotal = event.count
    }
    if (event.permissions != undefined) {
      this.permissions = event.permissions
    }
    if(event !=undefined && event.event !=undefined) {
      if(event.event.itemData.EnablerFilterType !=undefined){
        let subData = {chipLbl:event.event.itemData.chipLbl,EnablerFilterType:event.event.itemData.EnablerFilterType,EnablerSlug:event.event.itemData.EnablerSlug,EnablerName:event.event.itemData.EnablerName,extraType:event.event.action}
        this.PLATFORMID?localStorage.setItem('state',JSON.stringify(subData)):undefined
        this.store.navigatePage(['user'],event.event.action)
      }
      // this.change.emit({ itemData: event.event.itemData,action:event.event.action })
      // this.change.emit(event)
    }
    this.setFilterCnt();
  }
}