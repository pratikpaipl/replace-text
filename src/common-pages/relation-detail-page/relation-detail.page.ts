import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'relation-detail',
  templateUrl: 'relation-detail.page.html',
  styleUrls: ['relation-detail.page.scss'],
})
export class RelationDetailPage implements OnInit, OnDestroy {

  filteCnt = 0
  updateTime = 0

  fpslug: any = "";
  fnslug: any = "";
  parent: any = "";
  fromtab: any = "";
  from: any = "";
  pageType: any;
  DetailsData: any;
  // FundraiseData: any;

  AdminList = [];
  permissionsList = []
  fundraiseForm = []
  ReferenceValueJsonData: any = [];
  FundraiseNeedsCriteriaJsonData: any = [];
  FundingProfilesCriteriaJsonData: any = [];
  message = '';
  sort = 'recent';
  ImpactThemesAndAreas: any = []
  FundingType: any = []
  Sdgs: any = []
  Esg: any = []

  segments = [];
  keyword = ''
  address = ''

  pageTypeMeg: any;
  // type: any = ''
  public subscription: any;
  public subLabel: any;
  ClickFrom: any;
  selItem: any;
  callFromListner = false
  breadCrumpData:any;
  title: any;
  PLATFORMID:any=false;
  constructor(@Inject(PLATFORM_ID) platformId: any,public alertController: AlertController, public modalController: ModalController, private cookieService: CookieService, private route: ActivatedRoute, public store: StorageService, public activatedRoute: ActivatedRoute, public router: Router, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController, public apiService: ApiService, private cdref: ChangeDetectorRef) {
    
    this.PLATFORMID = isPlatformBrowser(platformId)
    
    this.fpslug = this.activatedRoute.snapshot.paramMap.get('fpslug')
    this.fnslug = this.activatedRoute.snapshot.paramMap.get('fnslug')
    this.parent = this.activatedRoute.snapshot.paramMap.get('parent')
    this.pageType = this.activatedRoute.snapshot.paramMap.get('pType')
    this.from = this.activatedRoute.snapshot.paramMap.get('from')
    this.fromtab = this.activatedRoute.snapshot.paramMap.get('fromtab')   

   

    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].label = this.store.updateSegmentName(this.segments[i].label,this.segments[i].key)
      }
      this.setTitle()
    });
    
  }
  setTitle(){
    const obj = this.segments.find(x => x.key === this.pageType);
    if (obj != undefined) {
      if(this.DetailsData != undefined && this.DetailsData !='')
      this.store.titleCntWithPage(this.store.getVal('submitted_fundraise_needs')+'-'+this.DetailsData.ReferenceCode, obj.label,this.DetailsData);
    }
  }
  ngOnDestroy(): void {
    this.subLabel.unsubscribe();
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  async ngOnInit() {
    this.PLATFORMID?localStorage.removeItem('state'):''
    this.getDetails();
  }
  
  getDetails() {
    setTimeout(() => {
      let path = window.location.href.replace(window.location.origin,'')
      if(this.cookieService.check(environment.cookiesKey)){
        this.apiService.RelationDetails((this.parent == 'fundraise-need'?'fundraise':this.parent),this.fpslug,this.fnslug,this.pageType).subscribe(async response => {
          let res: any = response;
          if (res.success) {
            if (!this.callFromListner)
            this.segments = [];
            if (res.data.detail == undefined) {
              this.message = res.message
              this.pageType = ''
            } else {
              this.DetailsData = res.data.detail;
              this.ImpactThemesAndAreas = this.DetailsData.ImpactThemesAndAreasJson != undefined && this.DetailsData.ImpactThemesAndAreasJson != ''?JSON.parse(this.DetailsData.ImpactThemesAndAreasJson):[]

              this.Esg = this.DetailsData.EsgJson != undefined && this.DetailsData.EsgJson != ''?JSON.parse(this.DetailsData.EsgJson):[]


              this.FundingType = this.DetailsData.FundingTypeJson != undefined && this.DetailsData.FundingTypeJson != ''?JSON.parse(this.DetailsData.FundingTypeJson):[]
              this.Sdgs = this.DetailsData.SdgsJson != undefined && this.DetailsData.SdgsJson != ''?JSON.parse(this.DetailsData.SdgsJson):[]
              this.DetailsData.CreatedTs = (this.DetailsData.CreatedTs != undefined && this.DetailsData.CreatedTs != '')?moment(this.DetailsData.CreatedTs).format('DD MMM yyyy'):''
              this.DetailsData.ModifiedTs = (this.DetailsData.ModifiedTs != undefined && this.DetailsData.ModifiedTs != '')?moment(this.DetailsData.ModifiedTs).format('DD MMM yyyy'):''
              this.FundingProfilesCriteriaJsonData = (this.DetailsData.FundingProfilesCriteriaJsonData != undefined?JSON.parse(this.DetailsData.FundingProfilesCriteriaJsonData):[]);
              if (!this.callFromListner) {
                this.segments.push({ key: this.parent=='fundraise-need'?'profile-form': 'fundraise-form', label:this.store.getVal(this.parent!='fundraise-need'?'fundraise_form':'profile_form'), icon: 'fa-rocket fa-solid'})
                this.pageType = this.route.snapshot.fragment != null ? this.route.snapshot.fragment : this.parent=='fundraise-need'?'profile-form': 'fundraise-form';
                this.callFromListner = false
              }
              let ld=[]
              let bpage =this.fromtab =='matched-fundraise-needs'?'matched-fundraise-need':'matched-funding-profiles'

              ld.push({ PageName:(this.parent=='fundraise-need'? this.DetailsData.FNReferenceCode:this.DetailsData.FPReferenceCode), PageSlug:(this.parent=='fundraise-need'?this.fnslug:this.fpslug), PageType:(this.parent=='fundraise-need'?'fundraise-need-submissions': 'funding-profile-submissions'),
              extraPath:(this.parent=='fundraise-need'?'fundraise-need/submissions': 'funding-profile/submissions'),action:(this.parent=='fundraise-need'?'fundraise-form': 'profile-form')})
              ld.push({ PageName: this.parent=='fundraise-need'?this.DetailsData.FPReferenceCode:this.DetailsData.FNReferenceCode, PageSlug: this.parent=='fundraise-need'?this.fnslug:this.fpslug, PageType:bpage, extraPath:(this.parent=='fundraise-need'?'fundraise-need/submissions': 'funding-profile/submissions'),action:this.fromtab =='matched-fundraise-needs'?'fundraise-need-match-report':this.fromtab })
              this.breadCrumpData = {
                list: ld, Page: 'Relation Page'
              }
              this.setTitle()
            }
            setTimeout(() => {
              if(this.pageType != 'overview' && this.pageType != 'fundraise-form' && this.pageType != 'profile-form')
              this.store.scrollToEnd('#tabblings')
            }, 2000);
          } else {
            this.message = res.message
          }
          setTimeout(() => {     
            if((this.pageType == 'overview' || this.pageType =='profile-form'|| this.pageType =='fundraise-form') && localStorage.getItem('scroll') != undefined){
              localStorage.removeItem('scroll')
              this.store.scrollToEnd('#tabs_contents');
            }
          }, 500);
        });
      }else{
        this.store.navigatePage(['/auth'],'login',{url:path},undefined,true)
      }
    }, this.store.isApiCalled);
  }
  
  onClickSegment(event): void {
    
  }
  
  }