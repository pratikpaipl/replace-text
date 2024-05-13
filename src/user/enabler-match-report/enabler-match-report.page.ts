import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'enabler-match-report',
  templateUrl: './enabler-match-report.page.html',
  styleUrls: ['./enabler-match-report.page.scss'],
})
export class EnablerMatchReportPage implements OnInit, OnDestroy {

  filteCnt = 0
  @Input()
  selItem: any;
  enabler: any;

  dataList=[]

  columTitle2='enabler'

  mItem:any=[]
 

  isShow = false;
  
  ItemPage:any = '';
  permissions = []
  allTotal = 0;
  dataFound:any = false;
  type = '';
  private subLabel: any;
  breadCrumpData:any;
  @ViewChild('content') content: any;

  from:any=''
  tslug:any=''
  fslug:any=''
  pageTitle:any=''
  dispTitle:any=''
  constructor(public sanitizer:DomSanitizer,public modalController: ModalController,public activatedRoute: ActivatedRoute, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {

    this.type = this.activatedRoute.snapshot.paramMap.get('type')
    this.from = this.activatedRoute.snapshot.paramMap.get('from')
    this.tslug = this.activatedRoute.snapshot.paramMap.get('tslug')
    this.fslug = this.activatedRoute.snapshot.paramMap.get('fslug')

    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
    });
  }
  ngOnInit() {
    this.getReport();
  }
  ionViewWillEnter() {
    this.setTitle()
  }
  getReport() {
      let apiEnd =this.type.replace('-','_')+'/'+(this.type=='funding-profile'?'fp':'fn')+'_enabler_match_report'
      let sleSlugParms= (this.type=='funding-profile'?'ProfileSlug':'FundraiseSlug')
      this.apiService.enablerMatchingReport(apiEnd,sleSlugParms,this.tslug,this.fslug).subscribe(async response => {
        let res: any = response;
        let clmS:any=[]
        clmS.push({title:this.store.getVal('profile_display_name_enabler_name'), selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('impact_themes_and_areas'),matchCount:0, selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('sdgs'),matchCount:0, selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('esg'),matchCount:0, selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('gender_lens'),matchCount:0, selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('funding_type'),matchCount:0, selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('funding_provider_type'),matchCount:0,selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('countries_of_domicile_nationality'),matchCount:0,selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('funding_stage'),matchCount:0,selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('country_ies_of_incorporation'),matchCount:0,selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        clmS.push({title:this.store.getVal('industries_sectors'),matchCount:0,selType:'',enabler:'',img:'',Logo:'',EnablerClick:0})
        
        if (res.success) {
          this.mItem=[]
          let selType:any
          let enabler:any
          if(res.data.funding_profile){
            this.ItemPage = 'funding_profile'
            this.dataFound = true;
             selType = res.data.funding_profile;
            // this.pageTitle = selType.ProfileName
            this.pageTitle = selType.ReferenceCode
            this.dispTitle = selType.ReferenceCode
            clmS[0].title = this.store.getVal('profile_display_name_enabler_name')
           clmS[0].selType= selType.ProfileName !=undefined?selType.ProfileName:''
           clmS[0].Logo= selType.Logo !=undefined?selType.Logo:''
           clmS[1].selType= this.store.getMatchListTwoLevel(selType.ImpactThemesAndAreas !=undefined?JSON.parse(selType.ImpactThemesAndAreas):[],'ImpactThemesAndAreas')
           clmS[2].selType= this.getMatchList(selType.SDGs !=undefined?JSON.parse(selType.SDGs):[]).join(', ')
           clmS[3].selType= this.store.getMatchListTwoLevel(selType.ESG !=undefined?JSON.parse(selType.ESG):[],'ESG')
           clmS[4].selType=this.getMatchList(selType.GenderLens !=undefined?JSON.parse(selType.GenderLens):[]).join(', ')
           clmS[5].selType= this.getMatchList(selType.FundingType !=undefined?JSON.parse(selType.FundingType):[]).join(', ')
           clmS[6].selType= this.getMatchList(selType.FundingProviderType !=undefined?JSON.parse(selType.FundingProviderType):[]).join(', ')
           clmS[7].selType= this.getMatchList(selType.CountriesOfDomicileNationality !=undefined?JSON.parse(selType.CountriesOfDomicileNationality):[]).join(', ')
           clmS[8].selType=this.getMatchList(selType.FundingStage !=undefined?JSON.parse(selType.FundingStage):[]).join(', ')
           clmS[9].selType= this.getMatchList(selType.CountriesOfIncorporation !=undefined?JSON.parse(selType.CountriesOfIncorporation):[]).join(', ')
           clmS[10].selType= this.getMatchList(selType.IndustriesSectors !=undefined?JSON.parse(selType.IndustriesSectors):[]).join(', ')
          }
          if(res.data.fundraise){
            this.ItemPage = 'fundraise'
            selType = res.data.fundraise
            this.pageTitle = selType.ReferenceCode
            this.dispTitle = selType.ReferenceCode
            clmS[0].title = this.store.getVal('company_name_enabler_name')
            clmS[0].selType= selType.CompanyName !=undefined?selType.CompanyName:''
            clmS[0].Logo= selType.Logo !=undefined?selType.Logo:''
            clmS[1].selType=this.store.getMatchListTwoLevel(selType.ImpactThemesAndAreas !=undefined?JSON.parse(selType.ImpactThemesAndAreas):[],'ImpactThemesAndAreas')
            clmS[2].selType=this.getMatchList(selType.SDGs !=undefined?JSON.parse(selType.SDGs):[]).join(', ')
            clmS[3].selType=this.store.getMatchListTwoLevel(selType.ESG !=undefined?JSON.parse(selType.ESG):[],'ESG')
            clmS[4].selType=this.getMatchList(selType.GenderLens !=undefined?JSON.parse(selType.GenderLens):[]).join(', ')
            clmS[5].selType=this.getMatchList(selType.FundingType !=undefined?JSON.parse(selType.FundingType):[]).join(', ')
            clmS[6].selType= this.getMatchList(selType.FundingProviderType !=undefined?JSON.parse(selType.FundingProviderType):[]).join(', ')
            clmS[7].selType= this.getMatchList(selType.CountriesOfDomicileNationality !=undefined?JSON.parse(selType.CountriesOfDomicileNationality):[]).join(', ')
            clmS[8].selType=this.getMatchList(selType.FundingStage !=undefined?JSON.parse(selType.FundingStage):[]).join(', ')
            clmS[9].selType=this.getMatchList(selType.CountriesOfIncorporation !=undefined?JSON.parse(selType.CountriesOfIncorporation):[]).join(', ')
            clmS[10].selType=this.getMatchList(selType.IndustriesSectors !=undefined?JSON.parse(selType.IndustriesSectors):[]).join(', ')
          }
          
          if(selType !=undefined){
            clmS[1].matchCount = selType.ImpactThemesAndAreasMatchedTotal;
            clmS[2].matchCount = selType.SdgsMatchedTotal;
            clmS[3].matchCount = selType.EsgMatchedTotal;
            clmS[4].matchCount = selType.GenderLensMatchedTotal;
            clmS[5].matchCount = selType.InvestmentTypeMatchedTotal;
            clmS[6].matchCount = selType.InvestorTypeMatchedTotal;
            clmS[7].matchCount = selType.CountriesOfDomicileNationalityMatchedTotal;
            clmS[8].matchCount =selType.InvestmentStageMatchedTotal
            clmS[9].matchCount =selType.CountryiesOfIncorporationMatchedTotal
            clmS[10].matchCount = selType.IndustriesSectorsMatchedTotal
          }

          if(res.data.enabler){
            enabler = res.data.enabler
            // this.enabler = res.data.enabler
            this.pageTitle = this.store.getVal('matching_enablers') +' '+ this.pageTitle+' '+this.store.getVal('for')+' '+ enabler.EnablerName
            this.dispTitle = this.dispTitle+' '+this.store.getVal('for')+' '+ enabler.EnablerName
            clmS[0].enabler= enabler.EnablerName !=undefined?enabler.EnablerName:''
            clmS[0].img= enabler.EnablerLogo !=undefined?enabler.EnablerLogo:''
            clmS[0].EnablerClick= enabler.EnablerClick !=undefined?enabler.EnablerClick:0
            clmS[1].enabler=this.store.getMatchListTwoLevel(enabler.ImpactThemesAndAreas !=undefined?JSON.parse(enabler.ImpactThemesAndAreas):[],'ImpactThemesAndAreas')
            clmS[2].enabler=this.getMatchList(enabler.SDGs !=undefined?JSON.parse(enabler.SDGs):[]).join(', ')
            clmS[3].enabler=this.store.getMatchListTwoLevel(enabler.ESG !=undefined?JSON.parse(enabler.ESG):[],'ESG')
            clmS[4].enabler=this.getMatchList(enabler.GenderLens !=undefined?JSON.parse(enabler.GenderLens):[]).join(', ')
            clmS[5].enabler= this.getMatchList(enabler.FundingType !=undefined?JSON.parse(enabler.FundingType):[]).join(', ')
            clmS[6].enabler=this.getMatchList(enabler.FundingProviderType !=undefined?JSON.parse(enabler.FundingProviderType):[]).join(', ')
            clmS[7].enabler=this.getMatchList(enabler.CountriesOfDomicileNationality !=undefined?JSON.parse(enabler.CountriesOfDomicileNationality):[]).join(', ')
            clmS[8].enabler=this.getMatchList(enabler.FundingStage !=undefined?JSON.parse(enabler.FundingStage):[]).join(', ')
            clmS[9].enabler=this.getMatchList(enabler.CountriesOfIncorporation !=undefined?JSON.parse(enabler.CountriesOfIncorporation):[]).join(', ')          
            clmS[10].enabler=this.getMatchList(enabler.IndustriesSectors !=undefined?JSON.parse(enabler.IndustriesSectors):[]).join(', ')            
          }

          this.mItem.push({ title:'', data:clmS ,class:'' })
          var ld = []
          ld.push({
            PageName: this.type == 'funding-profile'?selType.ReferenceCode:selType.ReferenceCode, PageSlug: this.tslug, PageType: this.type=='funding-profile'?this.type:'fundraise-need',action:this.type=='fundraise'?'fundraise-form':'profile-form'
          })
          ld.push({
            PageName: this.dispTitle, PageSlug: this.tslug, PageType: "matching-enablers",action:'matching-enablers'
          })
          this.breadCrumpData = {
            list: ld, Page: this.from+'-match-'+this.type+'-report'
          }
          if(res.data.fundraise !=undefined)
          this.enabler= Object.assign(res.data.enabler,res.data.funding_profile);
          if(res.data.funding_profile !=undefined)
          this.enabler= Object.assign(res.data.enabler,res.data.funding_profile);
        }
        this.setTitle()
      });
  }
  getMatchList(list: any=[]) {
    let lst=[]
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if(element.IsMatch){
        lst.push('<span class="match">'+element.ReferenceName+'</span>')
      }else{
        lst.push(element.ReferenceName)
      }
    }
    return lst;
  }
  setTitle(){
    this.store.titleCntWithPage(this.pageTitle,undefined ,this.enabler)
  }
  // download(event){
    
  // }
  openEnabler(slug){
    this.router.navigateByUrl(this.enablerPath(slug));
  }
  enablerPath(slug) {
    let routePath=''
    if (this.from != 'admin') { // || this.openFront == '1'
      routePath = '/enabler/'+ slug +this.store.getSeprater()+'overview'
    } else if (this.from == 'admin') {
        routePath = ('/admin/enabler/' + slug+ '#overview');
    }
    return routePath;
  }
  ngOnDestroy() {
    this.subLabel.unsubscribe();
  }
}
