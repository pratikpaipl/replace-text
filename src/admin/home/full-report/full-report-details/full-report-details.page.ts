import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/services/api.service';
import { actType, appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'full-report-details',
  templateUrl: './full-report-details.page.html',
  styleUrls: ['./full-report-details.page.scss'],
})
export class FullReportDetailPage implements OnInit {

  filteCnt = 0
  @Input()
  selItem: any;

  itemData:any;
  enabler:any;
  dataList=[]

  columTitle1='investor'
  columTitle2= 'investee'

  mItem:any=[]
  mItem2:any=[]
  clmF:any=[]
  clmS:any=[]
  clmT:any=[]
  clm4:any=[]
  CompanyIDs = ''
  isShow = false;

  permissions = []
  allTotal = 0;
  dataFound:any = false;
  keyword = '';
  sort = 'recent';
  pageType = '';

  @ViewChild('content') content: any;
  FP_EnablerSlug: any='';
  FN_EnablerSlug: any='';
  EnablerSlug: any='';

  from:any=''
  pageTitle:any=''
  itemTitle:any=''
  extea:any=''
  updateLabel:any
  constructor(public sanitizer:DomSanitizer,public modalController: ModalController,public activatedRoute: ActivatedRoute, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {
    let href = this.router.url;
    this.from = href.split('/')[1];
    this.pageType = href.split('/')[2]

    this.extea = this.store.getVal('matching_parameters')+' '
    this.FP_EnablerSlug = this.activatedRoute.snapshot.paramMap.get('FundingProfileUID')
    this.FN_EnablerSlug = this.activatedRoute.snapshot.paramMap.get('FundraiseUID')
    this.EnablerSlug = this.activatedRoute.snapshot.paramMap.get('EnablerSlug') !=undefined?this.activatedRoute.snapshot.paramMap.get('EnablerSlug'):'' 
    this.updateLabel = this.eventService.updateLabel$.subscribe((item: any) => {
      this.extea = this.store.getVal('matching_parameters')+' '
      this.setTitle()
    });
  }
  ngOnInit() {
    
  }
  ionViewWillEnter() {
    this.setViewForm()
    this.getReport();
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.setViewForm();
      this.getReport();
    }
  }
  async setViewForm() {
    this.clmF=[]
    this.clmS=[]
    this.clmT=[]
    this.clm4=[]
    this.extea = await this.store.getVal('matching_parameters')+' '
    this.clmF.push({title:'last_introduce_date',profile:'',need:'',isIntroduce:true})
    this.clmF.push({title:'reference_number',profile:'',need:'',pLink:'profile-form',nLink:'fundraise-form',showPUser:false,showNUser:false,FPIsFeatured:false,FNIsFeatured:false,click:true, iricon:'fa-rocket fa-solid',ipicon:'fa-money-bill-transfer fa-solid',extraClss:'ext-head-ref'})
    this.clmF.push({title:'match_percentage', profile:'',need:'',extraClss:'ext-head'})

    this.clmF.push({title:'screening_status',profile:'',need:''})
    this.clmF.push({title:'interested',profile:'',need:'',showDrop:false,showNDrop:false})
    this.clmF.push({title:'total_match_fn_fp',profile:'',need:'',click:true,FilterType:''})
    this.clmF.push({title:'total_expressed_interest',profile:'',need:'',click:true,FilterType:'introduction_requested'})
    this.clmF.push({title:'total_introductions',profile:'',need:'',click:true,FilterType:'introductions'})
    this.clmF.push({title:'total_received_interest',profile:'',need:'',click:true,FilterType:'introduction_requests_received',hide:(this.store.appType != 'admin')})

    this.clmF.push({title:'profile_name_company_name',profile:'',need:'',FPLogo:'',FNLogo:''})
    this.clmF.push({title:'representing_for_first_and_last_name',profile:'',need:''})
    this.clmF.push({title:'representing_for_email',profile:'',need:'',isMail:true})
    this.clmF.push({title:'first_and_last_name',profile:'',need:''})
    if(this.store.appType =='admin'){
      this.clmF.push({title:'email',profile:'',need:'',isMail:true})
      this.clmF.push({title:'website',profile:'',need:''})
    }
    this.clmS.push({licon:'fa-solid fa-infinity',matchCount:'', title:'impact_themes_and_areas',profile:'',need:''})
    this.clmS.push({licon:'fa-solid fa-infinity',matchCount:'',title:'sdgs',profile:'',need:''})
    this.clmS.push({licon:'fa-solid fa-infinity',matchCount:'',title:'esg',profile:'',need:''})
    this.clmS.push({licon:'fa-solid fa-infinity',matchCount:'',title:'gender_lens',profile:'',need:''})
   
    this.clmT.push({licon:'fa-solid fa-infinity',title:'funding_type',profile:'',need:''})
    this.clmT.push({licon:'fa-solid fa-infinity',title:'funding_stage',profile:'',need:''})
    this.clmT.push({licon:'fa-solid fa-infinity',title:'total_raise_amount_eur',profile:'',need:''})
    this.clmT.push({licon:'fa-solid fa-infinity',title:'cumulative_revenue_last_two_years_till_date_in_eur',profile:'',need:''})
    this.clmT.push({licon:'fa-solid fa-infinity',title:'country_ies_of_incorporation',profile:'',need:''})
    this.clmT.push({licon:'fa-solid fa-infinity',matchCount:'',title:'industries_sectors',profile:'',need:''})
    this.clmT.push({title:'raise_start_date',profile:'',need:''})
    this.clmT.push({title:'raise_end_date',profile:'',need:''})
    this.clmT.push({title:'investor_profile_access_to_pitch',profile:'',need:'',isPitch:true,isMyP:false,isMyN:false,})
    /*
    
    */
    if(this.store.appType =='admin')
    this.clmT.push({title:'additional_notes',profile:'',need:''})
    
    this.clm4.push({licon:'fa-solid fa-infinity',title:'funding_provider_type',profile:'',need:''})
    this.clm4.push({licon:'fa-solid fa-infinity',title:'minimum_ticket_size_per_funding_eur',profile:'',need:''})
    this.clm4.push({licon:'fa-solid fa-infinity',matchCount:'',title:'countries_of_domicile_nationality',profile:'',need:''})
  }
    ngOnDestroy(): void {
      if(this.updateLabel !=undefined)
      this.updateLabel.unsubscribe()
    }
    getReport() {
      this.apiService.matchMakingReport(this.FP_EnablerSlug,this.FN_EnablerSlug,this.EnablerSlug,this.keyword, this.sort,0,50,actType.funding_profile_fundraise).subscribe(async response => {
        let res: any = response;
        if (res.success) {
          this.mItem=[]
          this.mItem2=[]
          let domain=((window.location.host).includes('localhost')?'http':'https')+"://"+window.location.host
          let profileUrl:any
          let needUrl:any
          this.itemData = res.data

          if(res.data.fundraise && res.data.funding_profile){
            let need = res.data.fundraise
            let profile = res.data.funding_profile
            
            this.getTitle(need,profile)
            this.setFList(profile,need)
            this.setSList(profile,need)
            this.setTList(profile,need)
            this.setFoList(profile,need)

            this.itemData.FP_EnablerSlug = this.itemData.funding_profile.FP_EnablerSlug
            this.itemData.FN_EnablerSlug = this.itemData.fundraise.FN_EnablerSlug

            this.dataFound = true;
            profileUrl = domain + '/admin/funding-profiles-submitted/'+profile.FP_EnablerSlug + '#profile-form'
            needUrl = domain +'/admin/fundraise-needs-submitted/'+need.FN_EnablerSlug + '#fundraise-form'
            
            this.pageTitle = profile.ReferenceCode
            this.pageTitle = this.pageTitle+' - '+ need.ReferenceCode
          }

          this.mItem.push({ title:'', data:this.clmF ,class:'extra' })
          this.mItem.push({ title:'impact_objectives', data:this.clmS,class:'title-col' })
          this.mItem.push({ title:'fundraise_need', data:this.clmT,class:'title-col' })
          this.mItem.push({ title:'funding_profile', data:this.clm4,class:'title-col' })
                  
          if(res.data.enabler !=undefined){
            this.itemData.EnablerSlug = res.data.enabler.length>0?this.itemData.enabler[0].EnablerSlug:''
            this.enabler = Object.assign(res.data.enabler.length>0?this.itemData.enabler[0]:undefined,res.data.fundraise,res.data.funding_profile);
            this.enabler.ActionMenuData= res.data.ActionMenuData

            this.enabler.FPReferenceCode=res.data.funding_profile != undefined?res.data.funding_profile.ReferenceCode:''
            this.enabler.FNReferenceCode= res.data.fundraise != undefined ?res.data.fundraise.ReferenceCode:''

            let clm4=[]
            for (let k = 0; k < res.data.enabler.length; k++) {
              const element = res.data.enabler[k];
              this.itemData.PageType = element.PageType
              this.itemData.EnablerName = element.EnablerName
              if(this.store.appType =='admin')
              clm4.push({title:'sources',profile:this.store.checkDefault(element.FPSourceOrReferral),need:this.store.checkDefault(element.FNSourceOrReferral)})
              if(this.store.appType =='admin')
              clm4.push({title:'internal_reference_number',profile:this.store.checkDefault(element.FPInternalReferenceNumber),need:this.store.checkDefault(element.FNInternalReferenceNumber)})
              if(this.store.appType =='admin')
              clm4.push({title:'tags',profile:this.store.checkDefault(element.FPTags),need:this.store.checkDefault(element.FNTags)})
              clm4.push({title:'created_on',profile:this.store.checkDefault(element.FPCreatedTs) !=''? moment(element.FPCreatedTs).format('DD MMM YYYY hh:mm a')+'&nbsp'+this.store.getVal('utc'):'',need:this.store.checkDefault(element.FNCreatedTs) !=''? moment(element.FNCreatedTs).format('DD MMM YYYY hh:mm a')+'&nbsp'+this.store.getVal('utc'):''})
              clm4.push({title:'last_update',profile:this.store.checkDefault(element.FPModifiedTs)!=''? moment(element.FPModifiedTs).format('DD MMM YYYY hh:mm a')+'&nbsp'+this.store.getVal('utc'):'',need:this.store.checkDefault(element.FNModifiedTs)!=''? moment(element.FNModifiedTs).format('DD MMM YYYY hh:mm a')+'&nbsp'+this.store.getVal('utc'):''})
              if(this.store.appType != 'front')
              clm4.push({title:'created_by',profile:this.store.checkDefault(element.FPCreatedBy),need:this.store.checkDefault(element.FNCreatedBy)})
              if(this.store.appType =='admin')
              clm4.push({title:'internal_notes',profile:(element.FPInternalNotes!= undefined?element.FPInternalNotes:'') ,need:(element.FNInternalNotes != undefined?element.FNInternalNotes:'')})
            }
            this.mItem2.push({ title:'internal_use', data:clm4,class:'title-col' })
          }
          this.setTitle()
         
        }
      });
    }
    getTitle(need,profile){
      this.itemTitle= profile.ReferenceCode+' < > '+need.ReferenceCode
     
    }
  setFoList(profile: any, need: any) {
    this.clm4[0].profile=this.getMatchList(profile.FundingProviderType !=undefined?JSON.parse(profile.FundingProviderType):[]).join(', ');
    this.clm4[1].profile=(profile.TicketSizePerFunding != undefined?profile.TicketSizePerFunding :'')
    this.clm4[2].profile=this.getMatchList(profile.CountriesOfDomicileNationality !=undefined?JSON.parse(profile.CountriesOfDomicileNationality):[]).join(', ');

    this.clm4[0].need=this.getMatchList(need.FundingProviderType !=undefined?JSON.parse(need.FundingProviderType):[]).join(', ');
    this.clm4[1].need=(need.TicketSizePerInvestor !=undefined?need.TicketSizePerInvestor:'')
    this.clm4[2].need=this.getMatchList(need.CountriesOfDomicileNationality !=undefined?JSON.parse(need.CountriesOfDomicileNationality):[]).join(', ');

    this.clm4[2].matchCount = need.CountriesOfDomicileNationalityMatchedTotal
  }
  setTList(profile: any, need: any) {
    let rev =this.store.getVal('pre_revenue')
    rev = '<b style="color:var(--ion-color-black)">'+rev+'</b>'
    this.clmT[0].profile=this.getMatchList(profile.FundingType !=undefined?JSON.parse(profile.FundingType):[]).join(', ');
    this.clmT[1].profile=this.getMatchList(profile.FundingStage !=undefined?JSON.parse(profile.FundingStage):[]).join(', ');
    this.clmT[2].profile=profile.TotalRaiseAmount != undefined?profile.TotalRaiseAmount:'';
   
    this.clmT[3].profile=profile.CumulativeRevenue !=undefined?profile.CumulativeRevenue:rev
    this.clmT[4].profile=this.getMatchList(profile.CountriesOfIncorporation !=undefined?JSON.parse(profile.CountriesOfIncorporation):[]).join(', ');
    this.clmT[5].profile=this.getMatchList(profile.IndustriesSectors !=undefined?JSON.parse(profile.IndustriesSectors):[]).join(', ');
    this.clmT[6].profile=profile.RaiseStartDate != undefined?profile.RaiseStartDate:''
    this.clmT[7].profile=profile.RaiseEndDate != undefined?profile.RaiseEndDate:''
    // this.clmT[8].profile=profile.PitchRequestStatus !=undefined?profile.PitchRequestStatus:''
    this.clmT[8].profile=profile.PitchRequestStatus !=undefined?profile.PitchRequestStatus:''
    this.clmT[8].isMyP = (this.store.appType == 'admin' || (profile.IsMyFundingProfile == 1?true:false))

    if(this.store.appType =='admin')
    this.clmT[9].profile=profile.AdditionalNotes != undefined?profile.AdditionalNotes:''

    this.clmT[0].need= this.getMatchList(need.FundingType !=undefined?JSON.parse(need.FundingType):[]).join(', ');
    
    this.clmT[1].need=this.getMatchList(need.FundingStage !=undefined?JSON.parse(need.FundingStage):[]).join(', ');
    this.clmT[2].need=need.TotalRaise != undefined?need.TotalRaise:'';
    this.clmT[3].need=need.CumulativeRevenue !=undefined?need.CumulativeRevenue:rev
    this.clmT[4].need=this.getMatchList(need.CountriesOfIncorporation !=undefined?JSON.parse(need.CountriesOfIncorporation):[]).join(', '); //this.getMatchList(need.CountryName !=undefined?JSON.parse(need.CountryName):[]).join(', ');
    this.clmT[5].need=this.getMatchList(need.IndustriesSectors !=undefined?JSON.parse(need.IndustriesSectors):[]).join(', ');
    this.clmT[6].need=need.RaiseStartDate !=undefined?moment(need.RaiseStartDate).format('DD MMM yyyy'):''
    this.clmT[7].need=need.RaiseEndDate !=undefined?moment(need.RaiseEndDate).format('DD MMM yyyy'):''
    // this.clmT[8].need=need.PitchSubmitted !=undefined?need.PitchSubmitted:''
    this.clmT[8].isMyN=(this.store.appType == 'admin' || (profile.IsMyFundraise == 1))
    if(this.store.appType =='admin')
    this.clmT[9].need=need.AdditionalNotes !=undefined?need.AdditionalNotes:''

    this.clmT[5].matchCount = need.IndustriesSectorsMatchedTotal 
  }
  setSList(profile: any, need: any) {
    

    this.clmS[0].profile=this.store.getMatchListTwoLevel(profile.ImpactThemesAndAreas !=undefined?JSON.parse(profile.ImpactThemesAndAreas):[],'ImpactThemesAndAreas');
    this.clmS[1].profile=this.getMatchList(profile.SDGs !=undefined?JSON.parse(profile.SDGs):[]).join(', ');
    this.clmS[2].profile= this.store.getMatchListTwoLevel(profile.ESG !=undefined?JSON.parse(profile.ESG):[],'ESG');
    this.clmS[3].profile=this.getMatchList(profile.GenderLens !=undefined?JSON.parse(profile.GenderLens):[]).join(', ');

    this.clmS[0].need=this.store.getMatchListTwoLevel(need.ImpactThemesAndAreas !=undefined?JSON.parse(need.ImpactThemesAndAreas):[],'ImpactThemesAndAreas');
    this.clmS[1].need=this.getMatchList(need.SDGs !=undefined?JSON.parse(need.SDGs):[]).join(', ');
    this.clmS[2].need=this.store.getMatchListTwoLevel(need.ESG !=undefined?JSON.parse(need.ESG):[],'ESG');
    this.clmS[3].need=this.getMatchList(need.GenderLens !=undefined?JSON.parse(need.GenderLens):[]).join(', ');

    this.clmS[0].matchCount = need.ImpactThemesAndAreasMatchedTotal
    this.clmS[1].matchCount = need.SdgsMatchedTotal
    this.clmS[2].matchCount = need.EsgMatchedTotal
    this.clmS[3].matchCount = need.GenderLensMatchedTotal

  }
  setFList(profile: any, need: any) {

    this.clmF[0].profile = ''

    this.clmF[1].profile = profile.ReferenceCode !=undefined?profile.ReferenceCode:''
    this.clmF[1].showPUser = (profile.IsMyFundingProfile !=undefined?profile.IsMyFundingProfile == 1 :false)
    this.clmF[1].FPIsFeatured = (profile.IsFeatured !=undefined?profile.IsFeatured == 1 :false)

    this.clmF[2].profile = profile.FundingProfilePercentage !=undefined?profile.FundingProfilePercentage+'%':''
    this.clmF[3].profile= profile.ScreeningStatus !=undefined?profile.ScreeningStatus:''
    this.clmF[4].profile= profile.ReactionValue !=undefined?((this.store.appType == 'admin' || (profile.IsMyFundingProfile == 1) ))?profile.ReactionValue:profile.ReactionData:''
    this.clmF[4].showDrop = (this.store.appType == 'admin' || (profile.IsMyFundingProfile == 1))
    this.clmF[5].profile= (profile.TotalFundraiseNeed !=undefined && profile.TotalMatchingFundraiseNeeds >0)?profile.TotalMatchingFundraiseNeeds+' / '+profile.TotalFundraiseNeed:''
    this.clmF[6].profile= (profile.TotalExpressedInterest !=undefined &&  profile.TotalExpressedInterest>0)?profile.TotalExpressedInterest:''
    this.clmF[7].profile = (profile.TotalIntroductionsWithInvestees >0)?profile.TotalIntroductionsWithInvestees:''
    this.clmF[8].profile = (profile.TotalReceivedInterest !=undefined && profile.TotalReceivedInterest>0)?profile.TotalReceivedInterest:''
   
    
    this.clmF[9].profile=profile.ProfileName !=undefined?profile.ProfileName:''
    this.clmF[9].FPLogo = profile.Logo !=undefined?profile.Logo:''

    this.clmF[10].profile=(profile.RepresentingForFirstName !=undefined)?profile.RepresentingForFirstName+' '+((profile.RepresentingForLastName !=undefined && profile.RepresentingForLastName !='null')?profile.RepresentingForLastName:''):''
    this.clmF[11].profile=(profile.RepresentingForEmail !=undefined)?profile.RepresentingForEmail:''
    this.clmF[12].profile=(profile.FirstName !=undefined)?profile.FirstName+' '+((profile.LastName !=undefined && profile.LastName !='null')?profile.LastName:''):''
    if(this.store.appType =='admin'){
      this.clmF[13].profile=profile.Email !=undefined?profile.Email:''
      this.clmF[14].profile=profile.Website !=undefined?profile.Website:''
    }

    this.clmF[0].profile = ''

    this.clmF[1].need= need.ReferenceCode !=undefined?need.ReferenceCode:''
    this.clmF[1].showNUser= (need.IsMyFundraise !=undefined?need.IsMyFundraise == 1:false)
    this.clmF[1].FNIsFeatured= (need.IsFeatured !=undefined?need.IsFeatured == 1 :false)

    this.clmF[2].need = need.FundraisePercentage !=undefined?need.FundraisePercentage+'%':''
    this.clmF[3].need = need.ScreeningStatus !=undefined?need.ScreeningStatus:''
    this.clmF[4].need = need.ReactionValue !=undefined?(this.store.appType == 'admin' || (need.IsMyFundraise == 1))?need.ReactionValue:need.ReactionData:''
    this.clmF[4].showNDrop = (this.store.appType == 'admin' || (need.IsMyFundraise == 1))
    this.clmF[5].need= (need.TotalFundingProfile !=undefined && need.TotalMatchingFundingProfiles>0)? need.TotalMatchingFundingProfiles+' / '+need.TotalFundingProfile:''
    this.clmF[6].need= (need.TotalExpressedInterest !=undefined&& need.TotalExpressedInterest>0)?need.TotalExpressedInterest:''
    this.clmF[7].need= (need.TotalIntroductionsWithInvestors>0)?need.TotalIntroductionsWithInvestors:''
    this.clmF[8].need= (need.TotalReceivedInterest !=undefined && need.TotalReceivedInterest>0)?need.TotalReceivedInterest:''
   
    this.clmF[9].need=need.CompanyName !=undefined?need.CompanyName:''
    this.clmF[9].FNLogo = need.Logo !=undefined?need.Logo:''

    this.clmF[10].need=(need.RepresentingForFirstName !=undefined)?need.RepresentingForFirstName+' '+((need.RepresentingForLastName !=undefined && need.RepresentingForLastName !='null')?need.RepresentingForLastName:''):''
    this.clmF[11].need=(need.RepresentingForEmail !=undefined)?need.RepresentingForEmail:''
    this.clmF[12].need=(need.FirstName !=undefined) ?need.FirstName+' '+((need.LastName !=undefined && need.LastName !='null')?need.LastName:''):''
    if(this.store.appType =='admin'){
      this.clmF[13].need=need.Email !=undefined?need.Email:''
      this.clmF[14].need=need.Website !=undefined?need.Website:''
    }
  }
  setTitle(){
    this.store.titleCntWithPage(this.extea+this.pageTitle,undefined,this.enabler)
  }
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
  // getMatchListTwoLevel(list: any=[]) {
  //   let lst=''
  //   for (let i = 0; i < list.length; i++) {
  //     const main = list[i];
  //     lst = lst + '<span class="two-leve-data">'+main.ParentReferenceName+'</span><br />'
  //     var subObj =JSON.parse(main.ImpactThemesAndAreas != undefined?main.ImpactThemesAndAreas:main.ESG)
  //     for (let j = 0; j < subObj.length; j++) {
  //       const element = subObj[j];
  //       if(element.IsMatch){
  //         lst =lst + ('<span class="match">'+element.ReferenceName+((j == subObj.length - 1)?'</span>':', </span>')+(j == subObj.length - 1?'<br /><br />':''))
  //       }else{
  //         lst = lst + (element.ReferenceName+((j == subObj.length - 1)?'':', ')+(j == subObj.length - 1?'<br /><br />':''))
  //       }
  //     }      
  //   }
  //   return lst;
  // }
  changeStatus(type,endPoint,rType,value) {
    let postData = new FormData();
    postData.append("ReactionType", rType);
    postData.append("ReactionValue", value);
    postData.append("FN_EnablerSlug", this.FN_EnablerSlug);
    postData.append("FP_EnablerSlug", this.FP_EnablerSlug);
    this.apiService.update(type, endPoint, postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        if(res.data != undefined) {
          // this.change.emit({ TotalExpressedInterest: res.data.TotalExpressedInterest })
          this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
          this.getReport();
        }
        this.store.showToast(res.message, 2000);
      }
    });

  }
  changePitchStatus(type,endPoint,row) {
    // row.cassette1Bill = '22';
    let postData = new FormData();
    postData.append("RequestStatus", row.PitchRequestStatus);
    postData.append("FN_EnablerSlug", (row.FN_EnablerSlug != undefined ? row.FN_EnablerSlug : this.FN_EnablerSlug));
    postData.append("FP_EnablerSlug", (row.FP_EnablerSlug != undefined ? row.FP_EnablerSlug : this.FP_EnablerSlug));
    this.apiService.update(type, endPoint, postData).subscribe(response => {
      // let res = this.store.getReponseData(response)
      let res: any = response;
      if (res.success) {
        if(res.data != undefined) {
          // this.getReport();
        }
        this.store.showToast(res.message, 2000);
      }
    });

  }
  callRequest(item,isView?) {
    //PitchRequestStatus
    let apiEnd = 'fundraise/'
    let type = 'view'
    let postData = new FormData();
    postData.append("FN_EnablerSlug", item.FN_EnablerSlug);
    if (item.PitchRequestStatus == undefined || item.PitchRequestStatus == '' || item.PitchRequestStatus == 'blank') {
      apiEnd = apiEnd + 'add_pitch_request'
      type = 'add'
      postData.append("FP_EnablerSlug", (item.FP_EnablerSlug != undefined ? item.FP_EnablerSlug : this.FP_EnablerSlug));
    } else {
      apiEnd = apiEnd + 'view_pitch'
      postData.append("RequestStatus", 'approved');
    }
    if(item.PitchRequestStatus !='approved' && !isView){
      this.apiService.pitchCall(type, apiEnd, postData).subscribe(async response => {
        let res: any = response;
        if (res.success) {
          if (type == 'add'){
            this.store.showToast(res.message, 2000, !res.success ? 'error' : undefined);
            await this.setViewForm()
            this.getReport();
          }
        }
      });
    }else {
      this.store.navigatePage(['user/' + this.FP_EnablerSlug  +'/'+ item.FN_EnablerSlug  + '/funding-profile-match-report/pitch-view'])
    }
  }
  download(event) {
    this.apiService.callDownload(appApi.matchmakingReportAdminExcel, 'FP_EnablerSlug', this.FP_EnablerSlug,this.keyword, this.sort, '', 'FN_EnablerSlug', this.FN_EnablerSlug,'EnablerSlug', this.EnablerSlug);
  }
  routePathFull(actionName,event,pageFrom,FilterType?,tab?) {

   
    let path='';
    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
    if(FilterType != undefined && FilterType !=''){
      apPath = apPath+'FilterType='+ FilterType
      apPath = apPath+'&chipLbl='+ (FilterType == 'introductions'?'total_'+FilterType:FilterType)
    }

    if(this.store.appType =='admin'){
      path=('admin/'+(actionName =='fundraise'?'fundraise-needs-submitted':'funding-profiles-submitted')+'/'+(actionName =='fundraise'?event.FN_EnablerSlug:event.FP_EnablerSlug)+this.store.getSeprater(undefined,apPath)+(tab!=undefined?tab: (actionName=='fundraise'?'funding-profile-match-report':'fundraise-need-match-report')))
    }
    else{
      if(event.IsMyFundingProfile == 1 && actionName =='profile') {
        path='user/funding-profile/submissions'+'/'+event.FP_EnablerSlug+this.store.getSeprater('user',apPath)+(tab!=undefined?tab:('fundraise-need-match-report'))
      }else if(event.IsMyFundraise == 1 && actionName =='fundraise'){
        path='user/fundraise-need/submissions'+'/'+event.FN_EnablerSlug+this.store.getSeprater('user',apPath)+(tab!=undefined?tab:('funding-profile-match-report'))
      }else{
        let actionPage = actionName=='profile'?'matching-funding-profiles':'matched-fundraise-needs';
        let pageType =(actionName=='profile'?'funding-profile':'fundraise-need')
        path = "user/"+((pageType !='fundraise-need')?'fundraise-need':'funding-profile')+"/details/"+actionPage+"/"+(event.FN_EnablerSlug !=undefined?event.FN_EnablerSlug:this.FN_EnablerSlug)+"/"+(event.FP_EnablerSlug !=undefined?event.FP_EnablerSlug:this.FP_EnablerSlug)+"/"+(pageType !='fundraise-need'? 'funding_profile_fundraise':'fundraise_funding_profile')+this.store.getSeprater('user',apPath)+(pageType =='fundraise-need'?'fundraise-form':'profile-form')
      }
    }
    let parms = path.includes('#')?'':(apPath != undefined && apPath !='')?apPath:''
    return path+parms
  }
  callIntroduce(type){

    let eslug = this.enabler.EnablerSlug;
    let pslug = ((this.itemData.FP_EnablerSlug != undefined && this.itemData.FP_EnablerSlug !='')?this.itemData.FP_EnablerSlug:'');
    let fslug = ((this.itemData.FN_EnablerSlug != undefined && this.itemData.FN_EnablerSlug !='')?this.itemData.FN_EnablerSlug:'');
    ((this.itemData.FP_EnablerSlug != undefined && this.itemData.FP_EnablerSlug !='')?this.itemData.FP_EnablerSlug:'')

    this.apiService.getIntroduceInfo(eslug,pslug,fslug,type).subscribe(async response => {
      let res: any = response;
      if(!res.success){
        this.store.showToast(res.message,5000,'error','middle')
      }else{
        //matching-funding-profiles
        let url = ('introduce/'+eslug+'/'+pslug+'/'+fslug+'/'+'matching-funding-profiles'+'/list/'+type)
        this.router.navigateByUrl(url);
      }
      return res.success
    });
  }

  openReport(type,itemVar,pageFrom,FilterType?,tab?){
    this.store.openPage(this.routePathFull(type,this.itemData[''+itemVar],pageFrom,FilterType,tab),FilterType)
  }
}
