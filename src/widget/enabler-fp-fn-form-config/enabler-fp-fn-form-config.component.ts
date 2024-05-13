import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'enabler-fp-fn-form-config',
  templateUrl: './enabler-fp-fn-form-config.component.html',
  styleUrls: ['./enabler-fp-fn-form-config.component.scss'],
})
export class EnablerFPFNFormConfigComponent implements OnInit, OnDestroy {
  impactthemeView=true;
  sdgsView=true;
  esgEnvView=true;
  esgSocialView=true;
  esgGovView=true;
  genLansView=true;
  investTypeView=true;
  investStageView=true;
  raiseAmtView=true;
  minTicketSizeView=true;
  cumRevView=true;
  investorTypeView=true;
  induSectorView=true;
  investeeCompCountryView=true;
  investorDomCountryView=true;
  
  disclaimerView=true;
  confidentialityView=true;

  isSdgView=false;

  @Input()
  apiEnd: any = ''

  @Input()
  EnablerSlug: any = ''
  @Input()
  ActionType: any = ''
  @Input()
  type: string = '';
  @Input()
  pageType: string = '';
  @Input()
  pageFrom: string = '';
  @Input()
  from: string = '';
  
  fp_impact_themes_and_areas_same_as = false //SameAsImpactTheme
  fp_sdgs_same_as = false //SameAsSdgs

  fp_esg_environment_same_as = false //SameAsSdgs
  fp_esg_governance_same_as = false //SameAsSdgs
  fp_esg_social_same_as = false //SameAsSdgs
  
  fp_gender_lens_same_as = false //SameAsGenderLens
  fp_funding_type_same_as = false //SameAsFundingType
  fp_funding_stage_same_as = false //SameAsFundingStage
  fp_countries_of_incorporation_same_as = false //SameAsCountriesOfIncorporation
  fp_countries_of_domicile_nationality_same_as = false //SameAsCountriesOfDomicileNationality
  fp_industries_sectors_same_as = false //SameAsIndustrySectors
  fp_funding_provider_type_same_as = false //  SameAsFundingProviderType



  isView = false
  IsDisableFundaraiseSubmission = false
  IsDisableFundingProfileSubmission = false
  checkAll: any
  loadMsg: any = ''

  MinRaiseError: any  = ''
  MaxRaiseError: any  = ''
  // FNMinTicketError: any  = ''

  FPMinTotalRaiseAmountError:any = false
  FPMaxTotalRaiseAmountError:any = false
  
  FNMinimumTicketSizePerFundingError:any = false
  FNMaximumTicketSizePerFundingError:any = false

  FPMinimumTicketSizePerFundingError:any = false
  FPMaximumTicketSizePerFundingError:any = false

  FPCumulativeRevenueError:any = false
  FNCumulativeRevenueError:any = false
  // TicketSizePerFundingError: any  = ''

  IsEnablerCurrency: any = false;
  IsFNImpactThemeUn: any = false;
  IsFNSdgUn: any = false;
  IsFNEsgEnvironmentUn: any = false;
  IsFNEsgSocialUn: any = false;
  IsFNEsgGovernanceUn: any = false;
  
  IsRequiredAnyoneUn: any = false;


  IsFNGenderLensUn: any = false;
  IsFNFundingTypeUn: any = false;
  IsFNFundingStageUn: any = false;
  IsFNCountriesOfIncorporationUn: any = false;
  IsFPCountriesOfIncorporationUn: any = false;
  IsFNIndustrySectorsUn: any = false;
  IsFPIndustrySectorsUn: any = false;
  IsFPImpactThemeUn: any = false;
  IsFPSdgUn: any = false;
  IsFPEsgEnvironmentUn: any = false;
  IsFPEsgSocialUn: any = false;
  IsFPEsgGovernanceUn: any = false;

  IsFPGenderLensUn: any = false;
  IsFPFundingTypeUn: any = false;
  IsFPFundingStageUn: any = false;
  IsFNFundingProviderTypeUn: any = false;
  IsFPFundingProviderTypeUn: any = false;
  IsFPCountriesOfDomicileNationalityUn: any = false;
  IsFNCountriesOfDomicileNationalityUn: any = false;
  IsMinRaiseAmountUn: any = false;
  IsMaxRaiseAmountUn: any = false;
  
  IsFPMinTotalRaiseAmountUn: any = false;
  IsFPMaxTotalRaiseAmountUn: any = false;

  IsFNMaximumTicketSizePerFundingUn: any = false;
  IsFNMinimumTicketSizePerFundingUn: any = false;

  IsFPMaximumTicketSizePerFundingUn: any = false;
  IsFPMinimumTicketSizePerFundingUn: any = false;
  // IsFPTicketSizePerFundingUn = false
  IsTotalRaiseAmountUn = false
  IsFPCumulativeRevenueUn = false
  IsFNCumulativeRevenueUn = false

  CountryList = []
  FNImpactThemesAreasList: any = []
  FPImpactThemesAreasList: any = []
  currency_list = []
  FN_sdg_list = []
  FP_sdg_list = []
  FNFundingTypeList = []
  FPFundingTypeList = []
  funding_stage_list = []
  FNIncorporationCountryList = []
  FPIncorporationCountryList = []
  FNIndustriesSectorsList = []
  FPIndustriesSectorsList = []
  
  FNEsgEnvironmentList = []
  FPEsgEnvironmentList = []
  FNEsgGovernanceList = []
  FPEsgGovernanceList = []
  FNEsgSocialList = []
  FPEsgSocialList = []

  FNFundingProviderTypeList = []
  FPFundingProviderTypeList = []
  FN_gender_lens_list = []
  FP_gender_lens_list = []
  FNDomicileNationalityCountryList = []
  FPDomicileNationalityCountryList = []
  InvestorRaiseAmountList = []
  InvestorTicketSizeList = []
  CumulativeRevenueList = []

  TotalFNThemesAreas = 0;
  TotalFPThemesAreas = 0;
  TotalFNFundingType = 0;
  TotalFPFundingType = 0;
  TotalFNIncorporationCountry = 0;
  TotalFPIncorporationCountry = 0;
  TotalFNDomicileNationalityCountry = 0;
  TotalFPDomicileNationalityCountry = 0;



  respObj:any ={};

  selectedEnablerCurrency: any
  selectedFNImpactTheme: any = []
  selectedFPImpactTheme: any = []
  selectedFNSdgs: any = []
  selectedFPSdgs: any = []
  selectedFNFundingType: any = []
  selectedFPFundingType: any = []
  selectedFNFundingStage: any = []
  selectedFPFundingStage: any = []
  selectedFNCountriesOfIncorporation: any = []
  selectedFPCountriesOfIncorporation: any = []
  selectedFNIndustrySectors: any = []
  selectedFPIndustrySectors: any = []

  selectedFNEsgEnvironment: any = []
  selectedFPEsgEnvironment: any = []
  selectedFNEsgSocial: any = []
  selectedFPEsgSocial: any = []
  selectedFNEsgGovernance: any = []
  selectedFPEsgGovernance: any = []
  
  selectedFNGenderLens: any = [];
  selectedFPGenderLens: any = [];
  selectedFNFundingProviderType: any = [];
  selectedFPFundingProviderType: any = [];
  selectedFPCountriesOfDomicileNationality: any = []
  selectedFNCountriesOfDomicileNationality: any = []
  // selectedFPTicketSizePerFunding: any = []
  // selectedTotalRaiseAmount: any = []
  // selectedCumulativeRevenue: any = []


  selectedFNFundingStageTag: any = []
  selectedFPFundingStageTag: any = []
 
  selectedFNIndustrySectorsTag: any = []
  selectedFPIndustrySectorsTag: any = []

  selectedFNEsgEnvironmentTag: any = []
  selectedFPEsgEnvironmentTag: any = []
  selectedFNEsgSocialTag: any = []
  selectedFPEsgSocialTag: any = []
  selectedFNEsgGovernanceTag: any = []
  selectedFPEsgGovernanceTag: any = []

  selectedFNFundingProviderTypeTag: any = [];
  selectedFPFundingProviderTypeTag: any = [];

  MinRaiseAmount: any = ''
  MaxRaiseAmount: any = ''

  FPMinTotalRaiseAmount: any = ''
  FPMaxTotalRaiseAmount: any = ''

  FNMinimumTicketSizePerFunding: any = ''
  FNMaximumTicketSizePerFunding: any = ''

  FPMinimumTicketSizePerFunding: any = ''
  FPMaximumTicketSizePerFunding: any = ''

  FNCumulativeRevenue: any = ''
  FPCumulativeRevenue: any = ''

  FNSubmissionAccept: any = false
  FPSubmissionAccept: any = false
  TotalFNFP: any

  fp_disclaimer;
  IsFPDisclaimerUn = false
  fp_confidentiality;
  IsFPConfidentiality = false
  fn_disclaimer;
  IsFNDisclaimerUn = false
  fn_confidentiality;
  IsFNConfidentiality = false

  // DefMinimumTicketSizePerFunding:any=1
  // DefMaximumTicketSizePerFunding:any=99999999999
  DefaultMinimumAmount = 1;
  DefaultMaximumAmount = 99999999999;

  private subscription: any;
  private updateContentText: any;
  
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor( public store: StorageService,public router:Router, public modalController: ModalController,  private eventService: EventService, private cdref: ChangeDetectorRef, public apiService: ApiService, public alertController: AlertController,) {
  
    this.updateContentText = this.eventService.updateContentText$.subscribe((item: any) => {
      if(localStorage.getItem('titleKey') != undefined){
        let pt = localStorage.getItem('titleKey').split('_')
        this[(pt[0]=='investor'?'fp_':'fn_')+pt[1]] = item.returnVal;
      }});
  }

  ngOnInit() {   
    this.getDataSetupList(false);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnChanges() {

  }
  viewSH(varnm){
    this[varnm] = !this[varnm]
  }
  
  async openDesModal(from,descVar:any,titleTerm?) {
    localStorage.setItem('titleKey',from)
    localStorage.setItem('fromVar',this[''+descVar])
    localStorage.setItem('titleTerm',titleTerm)
    localStorage.setItem('fromUrl',this.router.url)
    let pt = from.split('_')
    let path ='admin/enabler/'+this.EnablerSlug+'/form-configuration/'+pt[0]+'/'+pt[1]
    this.router.navigateByUrl(path);
  }
  getDataSetupList(isReload) {
    setTimeout(() => {
      this.isView = false
      this.CountryList = []
      this.FNImpactThemesAreasList= []
      this.FPImpactThemesAreasList = []
      this.currency_list = []
      this.FN_sdg_list = []
      this.FP_sdg_list = []
      this.FNFundingTypeList = []
      this.FPFundingTypeList = []
      this.funding_stage_list = []
      this.FNIncorporationCountryList = []
      this.FPIncorporationCountryList = []
      this.FNIndustriesSectorsList = []
      this.FPIndustriesSectorsList = []

      this.FPEsgEnvironmentList = []
      this.FNEsgEnvironmentList = []
      this.FPEsgSocialList = []
      this.FNEsgSocialList = []
      this.FPEsgGovernanceList = []
      this.FNEsgGovernanceList = []

      this.FNFundingProviderTypeList = []
      this.FPFundingProviderTypeList = []
      this.FN_gender_lens_list = []
      this.FP_gender_lens_list = []
      this.FNDomicileNationalityCountryList = []
      this.FPDomicileNationalityCountryList = []
      this.InvestorRaiseAmountList = []
      this.InvestorTicketSizeList = []
      this.CumulativeRevenueList = []
      this.subscription = this.apiService.getData('enabler', 'fp_fn_form', 'EnablerSlug', this.EnablerSlug).subscribe(async response => {
          let res: any = response;
          if (res.success && res.data != undefined) {
            this.isView = true
            if (res.data.country_list != undefined) {
              this.CountryList = res.data.country_list
            }
            if (res.data.currency_list != undefined) {
              this.currency_list = res.data.currency_list
            }
            if (res.data.sdg_list != undefined) {
              this.FN_sdg_list = res.data.sdg_list
              this.FP_sdg_list = res.data.sdg_list
            }
            if (res.data.funding_stage_list != undefined) {
              this.funding_stage_list = res.data.funding_stage_list;
            }
            if (res.data.industries_sectors_list != undefined) {
              this.FNIndustriesSectorsList = res.data.industries_sectors_list
              this.FPIndustriesSectorsList = res.data.industries_sectors_list
            }
            if (res.data.esg_environment_list != undefined) {
              this.FNEsgEnvironmentList = res.data.esg_environment_list
              this.FPEsgEnvironmentList = res.data.esg_environment_list
            }
            if (res.data.esg_governance_list != undefined) {
              this.FNEsgGovernanceList = res.data.esg_governance_list
              this.FPEsgGovernanceList = res.data.esg_governance_list
            }
            if (res.data.esg_social_list != undefined) {
              this.FNEsgSocialList = res.data.esg_social_list
              this.FPEsgSocialList = res.data.esg_social_list

            }

            if (res.data.gender_lens_list != undefined) {
              this.FN_gender_lens_list = res.data.gender_lens_list
              this.FP_gender_lens_list = res.data.gender_lens_list
            }
            if (res.data.funding_provider_type_list != undefined) {
              this.FNFundingProviderTypeList = res.data.funding_provider_type_list
              this.FPFundingProviderTypeList = res.data.funding_provider_type_list
            }
            if (res.data.investor_ticket_size_list != undefined) {
              this.InvestorTicketSizeList = res.data.investor_ticket_size_list
            }
            if (res.data.investor_raise_amount_list != undefined) {
              this.InvestorRaiseAmountList = res.data.investor_raise_amount_list
            }
            if (res.data.region_tree_list != undefined) {
              this.FNIncorporationCountryList = res.data.region_tree_list
              this.FPIncorporationCountryList = res.data.region_tree_list
              this.FNDomicileNationalityCountryList = res.data.region_tree_list
              this.FPDomicileNationalityCountryList = res.data.region_tree_list

            }
            if (res.data.impact_themes_areas_list != undefined && res.data.impact_themes_areas_list.length > 0) {
              this.FNImpactThemesAreasList = res.data.impact_themes_areas_list;
              this.FPImpactThemesAreasList = res.data.impact_themes_areas_list;
           }
            if (res.data.funding_type_list != undefined && res.data.funding_type_list.length > 0) {
              this.FNFundingTypeList = res.data.funding_type_list;
              this.FPFundingTypeList = res.data.funding_type_list;
            }
            if (res.data.revenue_alert_list != undefined) {
              this.CumulativeRevenueList = res.data.revenue_alert_list
            }
            if(res.data.detail != undefined ) { //&& !isReload
              this.setFormData(res.data.detail)
            }
          }
        });
      }, this.store.isApiCalled);
    }
    setRegionTreeData(List) {
      let DataList = []
      let cnt = 0
      for (let k = 0; k < List.length; k++) {
        const element = List[k];
        let child = element.SubRegionJson != undefined ? element.SubRegionJson : []
        let ChildrenList = []
        for (let l = 0; l < child.length; l++) {
          const chil = child[l];
          let county = chil.CountryJson != undefined ? chil.CountryJson : []
          let countryList = []
          for (let j = 0; j < county.length; j++) {
            const cntry = county[j];
            countryList.push({
            ReferenceKey: ''+cntry.CountryKey,
            Region: cntry.CountryName,
            checked: false
          })
        }
        ChildrenList.push({
          ReferenceKey: chil.SubRegionKey,
          Region: chil.SubRegionName,
          Children: countryList,
          
          checked: false
        })
      }
      cnt = cnt + ChildrenList.reduce((count, current) => count + current.Children.length, 0)
      DataList.push({
        ReferenceKey: element.ReferenceKeyRegion,
        Region: element.Region,
        Children: ChildrenList,
        isParent: true,
        cnt: cnt,
        checked: false
      })
    }
    return { list : DataList, count : cnt } 
  }

  setFormData(detail: any) {
    let EnablerData = detail;
    let reference_data = detail.reference_data
      
    this.selectedFNImpactTheme = this.getKeyDatas(reference_data,'fn_impact_themes_and_areas',true)
    this.respObj.selectedFNImpactTheme = this.selectedFNImpactTheme 
    this.selectedFNFundingType =this.getKeyDatas(reference_data,'fn_funding_type',true)
    this.respObj.selectedFNFundingType = this.selectedFNFundingType
    this.selectedFNCountriesOfIncorporation = this.getKeyDatas(reference_data,'fn_countries_of_incorporation',true)
    this.respObj.selectedFNCountriesOfIncorporation = this.selectedFNCountriesOfIncorporation
    this.selectedFNCountriesOfDomicileNationality =this.getKeyDatas(reference_data,'fn_countries_of_domicile_nationality',true) 
    this.respObj.selectedFNCountriesOfDomicileNationality =this.selectedFNCountriesOfDomicileNationality

    let selCr =this.getKeyDatas(reference_data,'enabler_currency')
    this.selectedEnablerCurrency = selCr.length>0? parseInt(selCr[0]):undefined
    this.selectedFNSdgs =  this.getKeyDatas(reference_data,'fn_sdgs')
    this.selectedFNGenderLens = this.getKeyDatas(reference_data,'fn_gender_lens')
    this.selectedFNFundingStage = this.getKeyDatas(reference_data,'fn_funding_stage',false)
    if(this.selectedFNFundingStage != undefined && this.selectedFNFundingStage != '') {
      this.selectedFNFundingStageTag = this.funding_stage_list.filter(item => this.selectedFNFundingStage.includes(item.ReferenceKey))
    }
    this.MinRaiseAmount = this.store.format(undefined,this.getKeyDatas(reference_data,'fn_min_raise_amount',false))
    this.MaxRaiseAmount = this.store.format(undefined,this.getKeyDatas(reference_data,'fn_max_raise_amount',false))
    this.selectedFNIndustrySectors = this.getKeyDatas(reference_data,'fn_industries_sectors',false)
    if(this.selectedFNIndustrySectors != undefined && this.selectedFNIndustrySectors != '') {
      this.selectedFNIndustrySectorsTag = this.FNIndustriesSectorsList.filter(item => this.selectedFNIndustrySectors.includes(item.ReferenceKey))
    }

    this.selectedFNEsgEnvironment = this.getKeyDatas(reference_data,'fn_esg_environment',false)
    if(this.selectedFNEsgEnvironment != undefined && this.selectedFNEsgEnvironment != '') {
      this.selectedFNEsgEnvironmentTag = this.FPEsgEnvironmentList.filter(item => this.selectedFNEsgEnvironment.includes(item.ReferenceKey))
    }
    this.selectedFNEsgGovernance = this.getKeyDatas(reference_data,'fn_esg_governance',false)
    if(this.selectedFNEsgGovernance != undefined && this.selectedFNEsgGovernance != '') {
      this.selectedFNEsgGovernanceTag = this.FNEsgGovernanceList.filter(item => this.selectedFNEsgGovernance.includes(item.ReferenceKey))
    }
    this.selectedFNEsgSocial = this.getKeyDatas(reference_data,'fn_esg_social',false)
    if(this.selectedFNEsgSocial != undefined && this.selectedFNEsgSocial != '') {
      this.selectedFNEsgSocialTag = this.FNEsgSocialList.filter(item => this.selectedFNEsgSocial.includes(item.ReferenceKey))
    }

    this.selectedFNFundingProviderType =this.getKeyDatas(reference_data,'fn_funding_provider_type',false)
    if(this.selectedFNFundingProviderType != undefined && this.selectedFNFundingProviderType != '') {
      this.selectedFNFundingProviderTypeTag = this.FNFundingProviderTypeList.filter(item => this.selectedFNFundingProviderType.includes(item.ReferenceKey))
    }

    this.FPMinTotalRaiseAmount = this.store.format(undefined,this.getKeyDatas(reference_data,'fp_min_total_raise_amount',false))
    this.FPMaxTotalRaiseAmount = this.store.format(undefined,this.getKeyDatas(reference_data,'fp_max_total_raise_amount',false))


    this.FNMinimumTicketSizePerFunding = this.store.format(undefined,this.getKeyDatas(reference_data,'fn_min_ticket',false))
    this.FNMaximumTicketSizePerFunding = this.store.format(undefined,this.getKeyDatas(reference_data,'fn_max_ticket',false))
    
    this.FPMinimumTicketSizePerFunding = this.store.format(undefined,this.getKeyDatas(reference_data,'fp_minimum_ticket_size_per_funding',false))
    this.FPMaximumTicketSizePerFunding = this.store.format(undefined,this.getKeyDatas(reference_data,'fp_maximum_ticket_size_per_funding',false))

    this.FNCumulativeRevenue = this.store.format(undefined,this.getKeyDatas(reference_data,'fn_cumulative_revenue',false))

    this.FPCumulativeRevenue = this.store.format(undefined,this.getKeyDatas(reference_data,'fp_cumulative_revenue',false))


    this.selectedFPImpactTheme =this.getKeyDatas(reference_data,'fp_impact_themes_and_areas',true)
    this.respObj.selectedFPImpactTheme = this.selectedFPImpactTheme
    this.selectedFPFundingType =this.getKeyDatas(reference_data,'fp_funding_type',true)
    this.respObj.selectedFPFundingType =this.selectedFPFundingType
    this.selectedFPCountriesOfIncorporation = this.getKeyDatas(reference_data,'fp_countries_of_incorporation',true)
    this.respObj.selectedFPCountriesOfIncorporation = this.selectedFPCountriesOfIncorporation
    this.selectedFPCountriesOfDomicileNationality =this.getKeyDatas(reference_data,'fp_countries_of_domicile_nationality',true) 
    this.respObj.selectedFPCountriesOfDomicileNationality =this.selectedFPCountriesOfDomicileNationality
    this.selectedFPSdgs =  this.getKeyDatas(reference_data,'fp_sdgs')
    this.selectedFPGenderLens = this.getKeyDatas(reference_data,'fp_gender_lens')
    this.selectedFPFundingStage = this.getKeyDatas(reference_data,'fp_funding_stage',false)
    if(this.selectedFPFundingStage != undefined && this.selectedFPFundingStage != '') {
      this.selectedFPFundingStageTag = this.funding_stage_list.filter(item => this.selectedFPFundingStage.includes(item.ReferenceKey))
    }    
    // this.selectedTotalRaiseAmount =this.getKeyDatas(reference_data,'fp_total_raise_amount',false)


    this.selectedFPIndustrySectors = this.getKeyDatas(reference_data,'fp_industries_sectors',false)
    if(this.selectedFPIndustrySectors != undefined && this.selectedFPIndustrySectors != '') {
      this.selectedFPIndustrySectorsTag = this.FPIndustriesSectorsList.filter(item => this.selectedFPIndustrySectors.includes(item.ReferenceKey))
    }

    this.selectedFPEsgEnvironment = this.getKeyDatas(reference_data,'fp_esg_environment',false)
    if(this.selectedFPEsgEnvironment != undefined && this.selectedFPEsgEnvironment != '') {
      this.selectedFPEsgEnvironmentTag = this.FPEsgEnvironmentList.filter(item => this.selectedFPEsgEnvironment.includes(item.ReferenceKey))
    }
    this.selectedFPEsgGovernance = this.getKeyDatas(reference_data,'fp_esg_governance',false)
    if(this.selectedFPEsgGovernance != undefined && this.selectedFPEsgGovernance != '') {
      this.selectedFPEsgGovernanceTag = this.FPEsgGovernanceList.filter(item => this.selectedFPEsgGovernance.includes(item.ReferenceKey))
    }
    this.selectedFPEsgSocial = this.getKeyDatas(reference_data,'fp_esg_social',false)
    if(this.selectedFPEsgSocial != undefined && this.selectedFPEsgSocial != '') {
      this.selectedFPEsgSocialTag = this.FPEsgSocialList.filter(item => this.selectedFPEsgSocial.includes(item.ReferenceKey))
    }
    
    this.selectedFPFundingProviderType =this.getKeyDatas(reference_data,'fp_funding_provider_type',false)
    if(this.selectedFPFundingProviderType != undefined && this.selectedFPFundingProviderType != '') {
      this.selectedFPFundingProviderTypeTag = this.FPFundingProviderTypeList.filter(item => this.selectedFPFundingProviderType.includes(item.ReferenceKey))
    }
    // this.selectedFPTicketSizePerFunding =this.getKeyDatas(reference_data,'fp_minimum_ticket_size_per_funding',false)

    this.FNSubmissionAccept = (EnablerData.FNSubmissionAccept == 1)?true:false;
    this.FPSubmissionAccept = (EnablerData.FPSubmissionAccept == 1)?true:false;
    this.TotalFNFP = EnablerData.TotalFNFP

    this.fp_disclaimer =this.getKeyDatas(reference_data,'fp_disclaimer',false,true);
    this.fp_confidentiality=this.getKeyDatas(reference_data,'fp_confidentiality',false,true);
    this.fn_disclaimer=this.getKeyDatas(reference_data,'fn_disclaimer',false,true);
    this.fn_confidentiality=this.getKeyDatas(reference_data,'fn_confidentiality',false,true);
  }

  getKeyDatas(refList,key: string,isTree?,isText?) {
    var idx = refList.findIndex(p => p.FieldKey == key);
    this[key+'_same_as'] !=undefined ? (this[key+'_same_as'] = refList[idx].SameAs !=null?refList[idx].SameAs :false):'' 
    return (idx != -1 && refList[idx].ReferenceValues != undefined && refList[idx].ReferenceValues != '')?(isTree?refList[idx].ReferenceValues:isText?refList[idx].ReferenceValues:refList[idx].ReferenceValues.split(',')):isText?'':[];
  }
  changeTreeData(event,isCheck?){
    if(event != undefined){
      if(event.modalName != undefined){
        this[event.modalName]= event.modal
        this.respObj[event.modalName]=this[event.modalName].toString()
        if(isCheck){
          this[event.modalName.replace(/FN/g, "FP")] = JSON.parse(JSON.stringify(event.modal))
          this.respObj[event.modalName.replace(/FN/g, "FP")]=this[event.modalName.replace(/FN/g, "FP")].toString()
        }
      }
    }
  }

  customSelect(event,isCheck?){
    setTimeout(() => {
      if(event.modalName !=undefined){
        this['' + event.modalName] = event.modal
        if(isCheck != undefined && isCheck){
          let mName = event.modalName;
          this.changeSwitch(isCheck,mName,mName.replace(/FN/g, "FP"))
        }
      }
      if(event.select !=undefined){
        if(event.select.itemsList._selectionModel !=undefined  && event.isNewTag){
          let nList=[]
          let lst = event.list
          let ncList = JSON.parse(JSON.stringify(lst))
          let key = event.select.bindValue
          let lbl = event.select.bindLabel
          for (let i = 0; i < event.select.itemsList._selectionModel._selected.length; i++) {
            const element = event.select.itemsList._selectionModel._selected[i].value;
            var idx = lst.findIndex(p => p.ReferenceKey == element.ReferenceKey);
            let isNew=idx !=-1?lst[idx].isNew !=undefined?lst[idx].isNew :true:true
            nList.push({'ReferenceKey':(idx!= -1 ?element.ReferenceKey:'') ,'ReferenceName':element.ReferenceName,isNew:isNew })
            if(idx == -1)
            ncList.push({[key]:element.ReferenceKey ,[lbl]:element.ReferenceName,isNew:isNew})
          }
          this[event.listName] = JSON.parse(JSON.stringify(ncList))
          this[event.listName.replace(/FN/g, "FP")] = JSON.parse(JSON.stringify(ncList))
          this['' + event.modalName+'Tag'] = nList
          if(isCheck != undefined && isCheck){
            let mName = event.modalName;
            this['' +mName.replace(/FN/g, "FP")+'Tag'] = JSON.parse(JSON.stringify(nList))
          }
        }
      }
    }, 100);
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  getMinMaxLengthData(selectedData,List) {
    let SelectedElements = List.filter(item => selectedData.includes(item.ReferenceKey)).map((x) => x.OriginalValue).join('-')
    let SelectedElementsArray = SelectedElements.split('-')
    let Max = Math.max(...SelectedElementsArray);
    let Min = Math.min(...SelectedElementsArray);
    return { MinValue : Min, MaxValue : Max }
  }

  clickSwitch(varn){
    this.submitForm(1,varn,this[varn])
  }
  async updateInput(event, checkVar){
  
    if(event.value != undefined){
      this[''+checkVar  ] = false;
      let value = event.value.replace(/,/g, '');
      if(this.FPSubmissionAccept) {
        if(checkVar == 'IsFPMinTotalRaiseAmountUn' || checkVar == 'IsFPMaxTotalRaiseAmountUn' || checkVar == 'IsFPMinimumTicketSizePerFundingUn' || checkVar == 'IsFPMaximumTicketSizePerFundingUn'){
          if (value == undefined || value == '') {
            this[''+checkVar  ] = true;
          }
        }
      }
      if(checkVar == 'IsFPCumulativeRevenueUn'){
        if ((value != undefined && value != '')) {
          let FNCumulativeRevenue = parseInt(value.replace(/,/g,''));
          if(FNCumulativeRevenue > this.DefaultMaximumAmount){
            this.IsFPCumulativeRevenueUn=true
          }
        }
      }
      if(checkVar == 'IsFPMinTotalRaiseAmountUn' || checkVar == 'IsFPMaxTotalRaiseAmountUn'){
        if (value != undefined && value != '') {
          this.IsFPMinTotalRaiseAmountUn=false
          this.IsFPMaxTotalRaiseAmountUn=false
          this.FPMinTotalRaiseAmountError=''
          let FPMinTotalRaiseAmount=0
          let FPMaxTotalRaiseAmount=0
         
          FPMinTotalRaiseAmount = (checkVar == 'FPMinTotalRaiseAmount'?parseInt(value):(this.FPMinTotalRaiseAmount !== undefined && this.FPMinTotalRaiseAmount !== '')?parseInt(this.FPMinTotalRaiseAmount.replace(/,/g, ''), 10):0);

          FPMaxTotalRaiseAmount = (checkVar == 'FPMaxTotalRaiseAmount'?parseInt(value):(this.FPMaxTotalRaiseAmount !== undefined && this.FPMaxTotalRaiseAmount !== '')?parseInt(this.FPMaxTotalRaiseAmount.replace(/,/g, ''), 10):0);
          
          this.IsFPMinTotalRaiseAmountUn= (FPMinTotalRaiseAmount==0)
          this.IsFPMaxTotalRaiseAmountUn= (FPMaxTotalRaiseAmount==0)

          if (FPMinTotalRaiseAmount > FPMaxTotalRaiseAmount && FPMinTotalRaiseAmount>0 && FPMaxTotalRaiseAmount > 0) {
            this.IsFPMinTotalRaiseAmountUn=true
            this.IsFPMaxTotalRaiseAmountUn=true
            this.FPMinTotalRaiseAmountError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
          }
          if(FPMinTotalRaiseAmount>this.DefaultMaximumAmount || FPMaxTotalRaiseAmount >this.DefaultMaximumAmount ){
            this.IsFPMinTotalRaiseAmountUn=true
            this.IsFPMaxTotalRaiseAmountUn=true
            this.FPMinTotalRaiseAmountError =''
          }
        }
      }
      if(checkVar == 'IsFPMinimumTicketSizePerFundingUn' || checkVar == 'IsFPMaximumTicketSizePerFundingUn'){
        if (value != undefined && value != '') {

          this.IsFPMinimumTicketSizePerFundingUn=false
          this.IsFPMaximumTicketSizePerFundingUn=false
          this.FPMinimumTicketSizePerFundingError=''
          let FPMinimumTicketSizePerFunding=0
          let FPMaximumTicketSizePerFunding=0
          
          FPMinimumTicketSizePerFunding = (checkVar == 'FPMinimumTicketSizePerFunding'?parseInt(value):(this.FPMinimumTicketSizePerFunding !== undefined && this.FPMinimumTicketSizePerFunding !== '')?parseInt(this.FPMinimumTicketSizePerFunding.replace(/,/g, ''), 10):0);
          
          FPMaximumTicketSizePerFunding = (checkVar == 'FPMaximumTicketSizePerFunding'?parseInt(value):(this.FPMaximumTicketSizePerFunding !== undefined && this.FPMaximumTicketSizePerFunding !== '')?parseInt(this.FPMaximumTicketSizePerFunding.replace(/,/g, ''), 10):0);
          
          this.IsFPMinimumTicketSizePerFundingUn=(FPMinimumTicketSizePerFunding==0)
          this.IsFPMaximumTicketSizePerFundingUn=(FPMaximumTicketSizePerFunding==0)
  
          
          if ((this.FPMinimumTicketSizePerFunding != undefined && this.FPMinimumTicketSizePerFunding != ''))
          FPMinimumTicketSizePerFunding = parseInt(this.FPMinimumTicketSizePerFunding != undefined && this.FPMinimumTicketSizePerFunding !=''? this.FPMinimumTicketSizePerFunding.replace(/,/g,''):0);
           if((this.FPMaximumTicketSizePerFunding != undefined && this.FPMaximumTicketSizePerFunding != ''))
           FPMaximumTicketSizePerFunding = parseInt(this.FPMaximumTicketSizePerFunding != undefined && this.FPMaximumTicketSizePerFunding !=''? this.FPMaximumTicketSizePerFunding.replace(/,/g,''):0);
           if (FPMinimumTicketSizePerFunding > FPMaximumTicketSizePerFunding && FPMinimumTicketSizePerFunding>0 && FPMaximumTicketSizePerFunding > 0) {
            this.IsFPMinimumTicketSizePerFundingUn=true
            this.IsFPMaximumTicketSizePerFundingUn=true
            this.FPMinimumTicketSizePerFundingError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
          }
          if(FPMinimumTicketSizePerFunding>this.DefaultMaximumAmount || FPMaximumTicketSizePerFunding >this.DefaultMaximumAmount ){
            this.IsFPMinimumTicketSizePerFundingUn=true
            this.IsFPMaximumTicketSizePerFundingUn=true
            this.FPMinimumTicketSizePerFundingError = ''
          }
        }
      }

      if(this.FNSubmissionAccept) {      
        if(checkVar == 'IsMinRaiseAmountUn' || checkVar == 'IsMaxRaiseAmountUn' || checkVar == 'IsFNMinimumTicketSizePerFundingUn' || checkVar == 'IsFNMaximumTicketSizePerFundingUn'){          
          if (value == undefined || value == '') {
            this[''+checkVar  ] = true;
          }
        }
      }

      if(checkVar == 'IsMinRaiseAmountUn' || checkVar == 'IsMaxRaiseAmountUn'){
        if (value != undefined && value != '') {
          this.IsMaxRaiseAmountUn=false
          this.IsMinRaiseAmountUn=false          
          this.MinRaiseError=''  
          let MinRaiseAmount=0
          let MaxRaiseAmount=0

          MinRaiseAmount = (checkVar == 'MinRaiseAmount'?parseInt(value):(this.MinRaiseAmount !== undefined && this.MinRaiseAmount !== '')?parseInt(this.MinRaiseAmount.replace(/,/g, ''), 10):0);
        
          MaxRaiseAmount = (checkVar == 'MaxRaiseAmount'?parseInt(value):(this.MaxRaiseAmount !== undefined && this.MaxRaiseAmount !== '')?parseInt(this.MaxRaiseAmount.replace(/,/g, ''), 10):0);
          
          this.IsMinRaiseAmountUn=(MinRaiseAmount==0)
          this.IsMaxRaiseAmountUn=(MaxRaiseAmount==0)

          if (MinRaiseAmount > MaxRaiseAmount && MinRaiseAmount>0 && MaxRaiseAmount > 0) {
            this.IsMaxRaiseAmountUn=true
            this.IsMinRaiseAmountUn=true
            this.MinRaiseError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
          }
          if(MinRaiseAmount>this.DefaultMaximumAmount || MaxRaiseAmount >this.DefaultMaximumAmount ){
            this.IsMinRaiseAmountUn=true
            this.IsMaxRaiseAmountUn=true
            this.MinRaiseError = ''
          }
        }
      }

      if(checkVar == 'IsFNMinimumTicketSizePerFundingUn' || checkVar == 'IsFNMaximumTicketSizePerFundingUn'){
        if (value != undefined && value != '') {

          this.IsFNMinimumTicketSizePerFundingUn=false
          this.IsFNMaximumTicketSizePerFundingUn=false
          this.FNMinimumTicketSizePerFundingError=''
          let FNMinimumTicketSizePerFunding=0
          let FNMaximumTicketSizePerFunding=0
          
          FNMinimumTicketSizePerFunding = (checkVar == 'FNMinimumTicketSizePerFunding'?parseInt(value):(this.FNMinimumTicketSizePerFunding !== undefined && this.FNMinimumTicketSizePerFunding !== '')?parseInt(this.FNMinimumTicketSizePerFunding.replace(/,/g, ''), 10):0);
          
          FNMaximumTicketSizePerFunding = (checkVar == 'FNMaximumTicketSizePerFunding'?parseInt(value):(this.FNMaximumTicketSizePerFunding !== undefined && this.FNMaximumTicketSizePerFunding !== '')?parseInt(this.FNMaximumTicketSizePerFunding.replace(/,/g, ''), 10):0);
          
          this.IsFNMinimumTicketSizePerFundingUn=(FNMinimumTicketSizePerFunding==0)
          this.IsFNMaximumTicketSizePerFundingUn=(FNMaximumTicketSizePerFunding==0)
  
          
          if ((this.FNMinimumTicketSizePerFunding != undefined && this.FNMinimumTicketSizePerFunding != ''))
          FNMinimumTicketSizePerFunding = parseInt(this.FNMinimumTicketSizePerFunding != undefined && this.FNMinimumTicketSizePerFunding !=''? this.FNMinimumTicketSizePerFunding.replace(/,/g,''):0);
           if((this.FNMaximumTicketSizePerFunding != undefined && this.FNMaximumTicketSizePerFunding != ''))
           FNMaximumTicketSizePerFunding = parseInt(this.FNMaximumTicketSizePerFunding != undefined && this.FNMaximumTicketSizePerFunding !=''? this.FNMaximumTicketSizePerFunding.replace(/,/g,''):0);
           if (FNMinimumTicketSizePerFunding > FNMaximumTicketSizePerFunding && FNMinimumTicketSizePerFunding > 0 && FNMaximumTicketSizePerFunding > 0) {
            this.IsFNMinimumTicketSizePerFundingUn=true
            this.IsFNMaximumTicketSizePerFundingUn=true
            this.FNMinimumTicketSizePerFundingError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
          }
          if(FNMinimumTicketSizePerFunding > this.DefaultMaximumAmount || FNMaximumTicketSizePerFunding >this.DefaultMaximumAmount ){
            this.IsFNMinimumTicketSizePerFundingUn=true
            this.IsFNMaximumTicketSizePerFundingUn=true
            this.FNMinimumTicketSizePerFundingError = ''
          }
        }
      }
      if(checkVar == 'IsFNCumulativeRevenueUn'){
        if ((value != undefined && value != '')) {
          let FPCumulativeRevenue = parseInt(value.replace(/,/g,''));
          if(FPCumulativeRevenue > this.DefaultMaximumAmount){
            this.IsFNCumulativeRevenueUn=true
          }
        }
      }
    }
  }
  async submitForm(event,ext?,check?) {
    if(event == 1) {
      this.resetVar();
      let isCall = false;

      if (this.selectedEnablerCurrency == undefined || this.selectedEnablerCurrency =='') {
        this.IsEnablerCurrency = true;
        this.store.scrollTo('EnablerCurrency');
        isCall = true
      }
      if(this.FNSubmissionAccept == true || (ext=='FNSubmissionAccept' && check)) {
        if (this.selectedFNImpactTheme == undefined || this.selectedFNImpactTheme.length == 0) {
          this.IsFNImpactThemeUn = true;
          if (!isCall)
          this.store.scrollTo('FNImpactThemeAndArea');
          isCall = true
        }
        if((this.selectedFPSdgs != undefined && this.selectedFPSdgs.length !=0) && (this.selectedFNSdgs == undefined || this.selectedFNSdgs.length == 0)){
          this.IsFNSdgUn = true;
          if (!isCall)
          this.store.scrollTo('FN_sdg_list');
          isCall = true
        }
        
        if((this.selectedFPEsgEnvironment != undefined && this.selectedFPEsgEnvironment.length !=0) && (this.selectedFNEsgEnvironment == undefined || this.selectedFNEsgEnvironment.length == 0)){
          this.IsFNEsgEnvironmentUn = true;
          if (!isCall)
          this.store.scrollTo('FNEsgEnvironment');
          isCall = true
        }
        if((this.selectedFPEsgSocial != undefined && this.selectedFPEsgSocial.length !=0) && (this.selectedFNEsgSocial == undefined || this.selectedFNEsgSocial.length == 0)){
          this.IsFNEsgSocialUn = true;
          if (!isCall)
          this.store.scrollTo('FNEsgSocial');
          isCall = true
        }
        if((this.selectedFPEsgGovernance != undefined && this.selectedFPEsgGovernance.length !=0) && (this.selectedFNEsgGovernance == undefined || this.selectedFNEsgGovernance.length == 0)){
          this.IsFNEsgGovernanceUn = true;
          if (!isCall)
          this.store.scrollTo('FNEsgGovernance');
          isCall = true
        }

        if((this.selectedFNSdgs == undefined || this.selectedFNSdgs.length == 0) && (this.selectedFNEsgEnvironment == undefined || this.selectedFNEsgEnvironment.length == 0) && (this.selectedFNEsgSocial == undefined || this.selectedFNEsgSocial.length == 0) && (this.selectedFNEsgGovernance == undefined || this.selectedFNEsgGovernance.length == 0)){
          this.IsRequiredAnyoneUn=true

          this.IsFNSdgUn = true;
          this.IsFNEsgEnvironmentUn = true;
          this.IsFNEsgSocialUn = true;
          this.IsFNEsgGovernanceUn = true;

          if (!isCall)
          this.store.scrollTo('requireAnyOne');
          isCall = true
        }

        if (this.selectedFNFundingType == undefined || this.selectedFNFundingType.length == 0) {
          this.IsFNFundingTypeUn = true;
          if (!isCall)
          this.store.scrollTo('FNFundingType');
          isCall = true
        }

        
        if (this.MinRaiseAmount == undefined || this.MinRaiseAmount == '' || this.MaxRaiseAmount == undefined || this.MaxRaiseAmount == '') {
          if(this.MinRaiseAmount == undefined || this.MinRaiseAmount == '') {
            this.IsMinRaiseAmountUn = true;
            if (!isCall)
              this.store.scrollTo('MinRaiseAmount');
              isCall = true
          }

          if(this.MaxRaiseAmount == undefined || this.MaxRaiseAmount == '') {
            this.IsMaxRaiseAmountUn = true;
            if (!isCall)
              this.store.scrollTo('MaxRaiseAmount');
              isCall = true
          }
        }
    
        if (this.selectedFNCountriesOfIncorporation == undefined || this.selectedFNCountriesOfIncorporation.length == 0) {
          this.IsFNCountriesOfIncorporationUn = true;
          if (!isCall)
          this.store.scrollTo('FNCountriesOfIncorporation');
          isCall = true
        }
        if (this.selectedFNFundingProviderType == undefined || this.selectedFNFundingProviderType.length == 0) {
          this.IsFNFundingProviderTypeUn = true;
          if (!isCall)
          this.store.scrollTo('FNFundingProviderType');
          isCall = true
        }

        if (this.FNMinimumTicketSizePerFunding == undefined || this.FNMinimumTicketSizePerFunding == '') {
          this.IsFNMinimumTicketSizePerFundingUn = true;
          if (!isCall)
          this.store.scrollTo('FNMinimumTicketSizePerFunding');
          isCall = true
        }
        if (this.FNMaximumTicketSizePerFunding == undefined || this.FNMaximumTicketSizePerFunding == '') {
          this.IsFNMaximumTicketSizePerFundingUn = true;
          if (!isCall)
          this.store.scrollTo('FNMaximumTicketSizePerFunding');
          isCall = true
        }
        
      }
      
      let FNMinimumTicketSizePerFunding=0
      let FNMaximumTicketSizePerFunding=0
      if ((this.FNMinimumTicketSizePerFunding != undefined && this.FNMinimumTicketSizePerFunding != ''))
      FNMinimumTicketSizePerFunding = parseInt(this.FNMinimumTicketSizePerFunding != undefined && this.FNMinimumTicketSizePerFunding !=''? this.FNMinimumTicketSizePerFunding.replace(/,/g,''):0);
       if((this.FNMaximumTicketSizePerFunding != undefined && this.FNMaximumTicketSizePerFunding != ''))
       FNMaximumTicketSizePerFunding = parseInt(this.FNMaximumTicketSizePerFunding != undefined && this.FNMaximumTicketSizePerFunding !=''? this.FNMaximumTicketSizePerFunding.replace(/,/g,''):0);
       if (FNMinimumTicketSizePerFunding > FNMaximumTicketSizePerFunding && FNMinimumTicketSizePerFunding>0 && FNMaximumTicketSizePerFunding > 0) {
        this.IsFNMinimumTicketSizePerFundingUn=true
        this.IsFNMaximumTicketSizePerFundingUn=true
        this.FNMinimumTicketSizePerFundingError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
        if(!isCall)
        this.store.scrollTo('FNMinimumTicketSizePerFunding');
        isCall = true
      }
      if(FNMinimumTicketSizePerFunding>this.DefaultMaximumAmount || FNMaximumTicketSizePerFunding >this.DefaultMaximumAmount ){
        this.IsFNMinimumTicketSizePerFundingUn=true
        this.IsFNMaximumTicketSizePerFundingUn=true
        this.FNMinimumTicketSizePerFundingError = ''
        if(!isCall)
        this.store.scrollTo('FNMaximumTicketSizePerFunding');
        isCall = true
      }
      
      let MinRaiseAmount=0
      let MaxRaiseAmount=0
      if ((this.MinRaiseAmount != undefined && this.MinRaiseAmount != ''))
       MinRaiseAmount = parseInt(this.MinRaiseAmount != undefined && this.MinRaiseAmount !=''? this.MinRaiseAmount.replace(/,/g,''):0);
       if((this.MaxRaiseAmount != undefined && this.MaxRaiseAmount != ''))
       MaxRaiseAmount = parseInt(this.MaxRaiseAmount != undefined && this.MaxRaiseAmount !=''? this.MaxRaiseAmount.replace(/,/g,''):0);
        if (MinRaiseAmount > MaxRaiseAmount && MinRaiseAmount>0 && MaxRaiseAmount > 0) {
          this.IsMaxRaiseAmountUn=true
          this.IsMinRaiseAmountUn=true
          this.MinRaiseError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
          if(!isCall)
          this.store.scrollTo('MinRaiseAmount');
          isCall = true
        }
        if(MinRaiseAmount>this.DefaultMaximumAmount || MaxRaiseAmount >this.DefaultMaximumAmount ){
          this.IsMinRaiseAmountUn=true
          this.IsMaxRaiseAmountUn=true
          this.MinRaiseError = ''
          if(!isCall)
          this.store.scrollTo('MinRaiseAmount');
          isCall = true
        }
      if(this.FPSubmissionAccept == true || (ext=='FPSubmissionAccept' && check)) {
        if (this.selectedFPImpactTheme == undefined || this.selectedFPImpactTheme.length == 0) {
          this.IsFPImpactThemeUn = true;
          if (!isCall)
          this.store.scrollTo('FPImpactThemeAndArea');
          isCall = true
        }
        
        if((this.selectedFNSdgs != undefined && this.selectedFNSdgs.length !=0) && (this.selectedFPSdgs == undefined || this.selectedFPSdgs.length == 0)){
          this.IsFPSdgUn = true;
          if (!isCall)
          this.store.scrollTo('FP_sdg_list');
          isCall = true
        }
        if((this.selectedFNEsgEnvironment != undefined && this.selectedFNEsgEnvironment.length !=0) && (this.selectedFPEsgEnvironment == undefined || this.selectedFPEsgEnvironment.length == 0)){
          this.IsFPEsgEnvironmentUn = true;
          if (!isCall)
          this.store.scrollTo('FPEsgEnvironment');
          isCall = true
        }
        if((this.selectedFNEsgSocial != undefined && this.selectedFNEsgSocial.length !=0) && (this.selectedFPEsgSocial == undefined || this.selectedFPEsgSocial.length == 0)){
          this.IsFPEsgSocialUn = true;
          if (!isCall)
          this.store.scrollTo('FPEsgSocial');
          isCall = true
        }
        if((this.selectedFNEsgGovernance != undefined && this.selectedFNEsgGovernance.length !=0) && (this.selectedFPEsgGovernance == undefined || this.selectedFPEsgGovernance.length == 0)){
          this.IsFPEsgGovernanceUn = true;
          if (!isCall)
          this.store.scrollTo('FPEsgGovernance');
          isCall = true
        }
        if((this.selectedFPSdgs == undefined || this.selectedFPSdgs.length == 0) && (this.selectedFPEsgEnvironment == undefined || this.selectedFPEsgEnvironment.length == 0) && (this.selectedFPEsgSocial == undefined || this.selectedFPEsgSocial.length == 0) && (this.selectedFPEsgGovernance == undefined || this.selectedFPEsgGovernance.length == 0)){
          this.IsRequiredAnyoneUn=true

          this.IsFPSdgUn = true;
          this.IsFPEsgEnvironmentUn = true;
          this.IsFPEsgSocialUn = true;
          this.IsFPEsgGovernanceUn = true;

          if (!isCall)
          this.store.scrollTo('requireAnyOne');
          isCall = true
        }
        // if (this.selectedFPSdgs == undefined || this.selectedFPSdgs.length == 0) {
        //   this.IsFPSdgUn = true;
        //   if (!isCall)
        //   this.store.scrollTo('FP_sdg_list');
        //   isCall = true
        // }

        if (this.selectedFPFundingType == undefined || this.selectedFPFundingType.length == 0) {
          this.IsFPFundingTypeUn = true;
          if (!isCall)
          this.store.scrollTo('FPFundingType');
          isCall = true
        }

        if (this.selectedFPCountriesOfIncorporation == undefined || this.selectedFPCountriesOfIncorporation.length == 0) {
          this.IsFPCountriesOfIncorporationUn = true;
          if (!isCall)
          this.store.scrollTo('FPCountriesOfIncorporation');
          isCall = true
        }
        if (this.selectedFPFundingProviderType == undefined || this.selectedFPFundingProviderType.length == 0) {
          this.IsFPFundingProviderTypeUn = true;
          if (!isCall)
          this.store.scrollTo('FPFundingProviderType');
          isCall = true
        }

        if (this.FPMinTotalRaiseAmount == undefined || this.FPMinTotalRaiseAmount == '') {
          this.IsFPMinTotalRaiseAmountUn = true;
          if (!isCall)
          this.store.scrollTo('FPMinTotalRaiseAmount');
          isCall = true
        }
        if (this.FPMaxTotalRaiseAmount == undefined || this.FPMaxTotalRaiseAmount == '') {
          this.IsFPMaxTotalRaiseAmountUn = true;
          if (!isCall)
          this.store.scrollTo('FPMaxTotalRaiseAmount');
          isCall = true
        }

        if (this.FPMinimumTicketSizePerFunding == undefined || this.FPMinimumTicketSizePerFunding == '') {
          this.IsFPMinimumTicketSizePerFundingUn = true;
          if (!isCall)
          this.store.scrollTo('FPMinimumTicketSizePerFunding');
          isCall = true
        }
        if (this.FPMaximumTicketSizePerFunding == undefined || this.FPMaximumTicketSizePerFunding == '') {
          this.IsFPMaximumTicketSizePerFundingUn = true;
          if (!isCall)
          this.store.scrollTo('FPMaximumTicketSizePerFunding');
          isCall = true
        }
      }

      let FPMinimumTicketSizePerFunding=0
      let FPMaximumTicketSizePerFunding=0
      if ((this.FPMinimumTicketSizePerFunding != undefined && this.FPMinimumTicketSizePerFunding != ''))
      FPMinimumTicketSizePerFunding = parseInt(this.FPMinimumTicketSizePerFunding != undefined && this.FPMinimumTicketSizePerFunding !=''? this.FPMinimumTicketSizePerFunding.replace(/,/g,''):0);
       if((this.FPMaximumTicketSizePerFunding != undefined && this.FPMaximumTicketSizePerFunding != ''))
       FPMaximumTicketSizePerFunding = parseInt(this.FPMaximumTicketSizePerFunding != undefined && this.FPMaximumTicketSizePerFunding !=''? this.FPMaximumTicketSizePerFunding.replace(/,/g,''):0);
       if (FPMinimumTicketSizePerFunding > FPMaximumTicketSizePerFunding && FPMinimumTicketSizePerFunding>0 && FPMaximumTicketSizePerFunding > 0) {
        this.IsFPMinimumTicketSizePerFundingUn=true
        this.IsFPMaximumTicketSizePerFundingUn=true
        this.FPMinimumTicketSizePerFundingError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
        if(!isCall)
        this.store.scrollTo('FPMinimumTicketSizePerFunding');
        isCall = true
      }
      if(FPMinimumTicketSizePerFunding>this.DefaultMaximumAmount || FPMaximumTicketSizePerFunding >this.DefaultMaximumAmount ){
        this.IsFPMinimumTicketSizePerFundingUn=true
        this.IsFPMaximumTicketSizePerFundingUn=true
        this.FPMinimumTicketSizePerFundingError = ''
        if(!isCall)
        this.store.scrollTo('FPMaximumTicketSizePerFunding');
        isCall = true
      }

      let FPMinTotalRaiseAmount=0
      let FPMaxTotalRaiseAmount=0
      if ((this.FPMinTotalRaiseAmount != undefined && this.FPMinTotalRaiseAmount != ''))
      FPMinTotalRaiseAmount = parseInt(this.FPMinTotalRaiseAmount != undefined && this.FPMinTotalRaiseAmount !=''? this.FPMinTotalRaiseAmount.replace(/,/g,''):0);
       if((this.FPMaxTotalRaiseAmount != undefined && this.FPMaxTotalRaiseAmount != ''))
       FPMaxTotalRaiseAmount = parseInt(this.FPMaxTotalRaiseAmount != undefined && this.FPMaxTotalRaiseAmount !=''? this.FPMaxTotalRaiseAmount.replace(/,/g,''):0);
       if (FPMinTotalRaiseAmount > FPMaxTotalRaiseAmount && FPMinTotalRaiseAmount>0 && FPMaxTotalRaiseAmount > 0) {
        this.IsFPMinTotalRaiseAmountUn=true
        this.IsFPMaxTotalRaiseAmountUn=true
        this.FPMinTotalRaiseAmountError = this.store.getVal('please_enter_min_amount_that_is_lower_or_same_as_max_amount')
        if(!isCall)
        this.store.scrollTo('FPMinTotalRaiseAmount');
        isCall = true
      }
      if(FPMinTotalRaiseAmount>this.DefaultMaximumAmount || FPMaxTotalRaiseAmount >this.DefaultMaximumAmount ){
        this.IsFPMinTotalRaiseAmountUn=true
        this.IsFPMaxTotalRaiseAmountUn=true
        this.FPMinTotalRaiseAmountError =''
        if(!isCall)
        this.store.scrollTo('FPMinTotalRaiseAmount');
        isCall = true
      }

      if ((this.FNCumulativeRevenue != undefined && this.FNCumulativeRevenue != '')) {
        let FNCumulativeRevenue = parseInt(this.FNCumulativeRevenue != undefined && this.FNCumulativeRevenue !=''? this.FNCumulativeRevenue.replace(/,/g,''):0);
        if(FNCumulativeRevenue>this.DefaultMaximumAmount){
          this.IsFNCumulativeRevenueUn=true
          if(!isCall)
            this.store.scrollTo('FNCumulativeRevenue');
          isCall = true
        }
      }
      if ((this.FPCumulativeRevenue != undefined && this.FPCumulativeRevenue != '')) {
        let FPCumulativeRevenue = parseInt(this.FPCumulativeRevenue != undefined && this.FPCumulativeRevenue !=''? this.FPCumulativeRevenue.replace(/,/g,''):0);
        if(FPCumulativeRevenue>this.DefaultMaximumAmount){
          this.IsFPCumulativeRevenueUn=true
          if(!isCall)
            this.store.scrollTo('FPCumulativeRevenue');
          isCall = true
        }
      }

      if ((this.fp_disclaimer == undefined || this.fp_disclaimer == '')) {       
          this.IsFPDisclaimerUn=true
          // if(!isCall)
          //   this.store.scrollTo('FPCumulativeRevenue');
          isCall = true
      }
      if ((this.fn_disclaimer == undefined || this.fn_disclaimer == '')) {       
          this.IsFNDisclaimerUn=true
          // if(!isCall)
          //   this.store.scrollTo('FPCumulativeRevenue');
          isCall = true
      }
      if ((this.fp_confidentiality == undefined || this.fp_confidentiality == '')) {       
        this.IsFPConfidentiality=true
        // if(!isCall)
        //   this.store.scrollTo('FPCumulativeRevenue');
        isCall = true
    }
    if ((this.fn_confidentiality == undefined || this.fn_confidentiality == '')) {       
        this.IsFNConfidentiality=true
        // if(!isCall)
        //   this.store.scrollTo('FPCumulativeRevenue');
        isCall = true
    }
    // console.log('fp_disclaimer ',this.fp_disclaimer,this.IsFPDisclaimerUn)
    // console.log('fn_disclaimer ',this.fn_disclaimer,this.IsFNDisclaimerUn)
    // console.log('fp_confidentiality ',this.fp_confidentiality,this.IsFPConfidentiality)
    // console.log('fn_confidentiality ',this.fn_confidentiality,this.IsFNConfidentiality)
    // console.log('isCall ',isCall)
      if(isCall) {
        this.loadMsg = this.store.getVal('please_complete_required_field');
      } else {
        this.openUserConfirmationBox();
      }
    }
  }

  async openUserConfirmationBox() {
    const alert = await this.alertController.create({
      message: this.store.getVal('save_changes')+'<br /><br />'+this.store.getVal('enabler_edit_warning_new'),
      animated: true,
      cssClass: 'alertCustomCssBtn',
      buttons: [
        {
          text: 'Yes',
          handler: () => { this.publishFundraiseReferenceData(); }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        }
      ], backdropDismiss: true
    });
    return await alert.present();
  }

  publishFundraiseReferenceData() {
      let postData = new FormData();      
      postData.append("EnablerSlug", (this.EnablerSlug != undefined && this.EnablerSlug != '') ? this.EnablerSlug : '');
      postData.append("FPSubmissionAccept", this.FPSubmissionAccept != undefined && this.FPSubmissionAccept != false ? '1': '0');
      postData.append("FNSubmissionAccept", this.FNSubmissionAccept != undefined && this.FNSubmissionAccept != false ? '1' : '0');
      postData.append("enabler_currency", this.selectedEnablerCurrency );
      // Fundraise Need form configuration
      // if(this.FNSubmissionAccept == true) {
        postData.append("fn_impact_themes_and_areas", ((this.selectedFNImpactTheme != undefined && this.selectedFNImpactTheme.length > 0) ? this.selectedFNImpactTheme.toString() : ''));
        postData.append("fn_sdgs", this.selectedFNSdgs != undefined ?this.selectedFNSdgs:'');
        postData.append("fn_gender_lens", this.selectedFNGenderLens != undefined ? this.selectedFNGenderLens : '');
        postData.append("fn_funding_type", this.selectedFNFundingType != undefined?this.selectedFNFundingType:'');
        postData.append("fn_funding_stage",this.selectedFNFundingStageTag != undefined? JSON.stringify(this.listWithNew(this.funding_stage_list,this.selectedFNFundingStageTag)) : '');
        if(!this.IsFNCumulativeRevenueUn)
        postData.append("fn_cumulative_revenue", this.FNCumulativeRevenue != undefined ? this.FNCumulativeRevenue.replace(/,/g, "") : '');
        postData.append("fn_min_raise_amount", this.MinRaiseAmount != undefined ? this.MinRaiseAmount.replace(/,/g, "") : '');
        postData.append("fn_max_raise_amount", this.MaxRaiseAmount != undefined ? this.MaxRaiseAmount.replace(/,/g, "") : '');
        postData.append("fn_countries_of_incorporation", this.selectedFNCountriesOfIncorporation != undefined? this.selectedFNCountriesOfIncorporation.toString() : '');
       
        postData.append("fn_industries_sectors", this.selectedFNIndustrySectorsTag != undefined ?JSON.stringify(this.listWithNew(this.FNIndustriesSectorsList,this.selectedFNIndustrySectorsTag)):'');

        postData.append("fn_esg_environment", this.selectedFNEsgEnvironmentTag != undefined ?JSON.stringify(this.listWithNew(this.FNEsgEnvironmentList,this.selectedFNEsgEnvironmentTag)):'');
        postData.append("fn_esg_governance", this.selectedFNEsgGovernanceTag != undefined ?JSON.stringify(this.listWithNew(this.FNEsgGovernanceList,this.selectedFNEsgGovernanceTag)):'');
        postData.append("fn_esg_social", this.selectedFNEsgSocialTag != undefined ?JSON.stringify(this.listWithNew(this.FNEsgSocialList,this.selectedFNEsgSocialTag)):'');
       
        postData.append("fn_funding_provider_type", this.selectedFNFundingProviderTypeTag != undefined ? JSON.stringify(this.listWithNew(this.FNFundingProviderTypeList,this.selectedFNFundingProviderTypeTag)) : '');

        postData.append("fn_min_ticket", this.FNMinimumTicketSizePerFunding != undefined ? this.FNMinimumTicketSizePerFunding.replace(/,/g, "") : '');
        postData.append("fn_max_ticket", this.FNMaximumTicketSizePerFunding != undefined ? this.FNMaximumTicketSizePerFunding.replace(/,/g, "") : '');


        postData.append("fn_countries_of_domicile_nationality", this.selectedFNCountriesOfDomicileNationality != undefined  ? this.selectedFNCountriesOfDomicileNationality.toString() : '');
        // }
        // if(this.FPSubmissionAccept == true) {
        // Funding Profile form configuration
        postData.append("fp_impact_themes_and_areas", this.selectedFPImpactTheme != undefined ? this.selectedFPImpactTheme.toString() : '');
        postData.append("fp_sdgs", this.selectedFPSdgs != undefined ? this.selectedFPSdgs:'');
        postData.append("fp_gender_lens", this.selectedFPGenderLens != undefined ? this.selectedFPGenderLens : '');
        postData.append("fp_funding_type", this.selectedFPFundingType != undefined ? this.selectedFPFundingType:'');
        postData.append("fp_funding_stage",this.selectedFPFundingStageTag != undefined? JSON.stringify(this.listWithNew(this.funding_stage_list,this.selectedFPFundingStageTag)) : '');
        // postData.append("fp_total_raise_amount", this.selectedTotalRaiseAmount != undefined ? this.selectedTotalRaiseAmount : '');



        postData.append("fp_esg_environment", this.selectedFPEsgEnvironmentTag != undefined ?JSON.stringify(this.listWithNew(this.FPEsgEnvironmentList,this.selectedFPEsgEnvironmentTag)):'');
        postData.append("fp_esg_governance", this.selectedFPEsgGovernanceTag != undefined ?JSON.stringify(this.listWithNew(this.FPEsgGovernanceList,this.selectedFPEsgGovernanceTag)):'');
        postData.append("fp_esg_social", this.selectedFPEsgSocialTag != undefined ?JSON.stringify(this.listWithNew(this.FPEsgSocialList,this.selectedFPEsgSocialTag)):'');

        if(!this.IsFPCumulativeRevenueUn)
        postData.append("fp_cumulative_revenue", this.FPCumulativeRevenue != undefined ? this.FPCumulativeRevenue.replace(/,/g, "") : '');
        postData.append("fp_countries_of_incorporation", this.selectedFPCountriesOfIncorporation != undefined? this.selectedFPCountriesOfIncorporation.toString() : '');
        postData.append("fp_industries_sectors", this.selectedFPIndustrySectorsTag != undefined ?JSON.stringify(this.listWithNew(this.FPIndustriesSectorsList,this.selectedFPIndustrySectorsTag)):'');

        postData.append("fp_funding_provider_type", this.selectedFPFundingProviderTypeTag != undefined ? JSON.stringify(this.listWithNew(this.FPFundingProviderTypeList,this.selectedFPFundingProviderTypeTag)) : '');
        // postData.append("fp_minimum_ticket_size_per_funding", this.selectedFPTicketSizePerFunding != undefined ? this.selectedFPTicketSizePerFunding : '');
        postData.append("fp_min_total_raise_amount", this.FPMinTotalRaiseAmount != undefined ? this.FPMinTotalRaiseAmount.replace(/,/g, "") : '');
        postData.append("fp_max_total_raise_amount", this.FPMaxTotalRaiseAmount != undefined ? this.FPMaxTotalRaiseAmount.replace(/,/g, "") : '');

        postData.append("fp_minimum_ticket_size_per_funding", this.FPMinimumTicketSizePerFunding != undefined ? this.FPMinimumTicketSizePerFunding.replace(/,/g, "") : '');
        postData.append("fp_maximum_ticket_size_per_funding", this.FPMaximumTicketSizePerFunding != undefined ? this.FPMaximumTicketSizePerFunding.replace(/,/g, "") : '');

        postData.append("fp_countries_of_domicile_nationality", this.selectedFPCountriesOfDomicileNationality != undefined  ? this.selectedFPCountriesOfDomicileNationality.toString() : '');


        postData.append("fp_impact_themes_and_areas_same_as",this.fp_impact_themes_and_areas_same_as?'1':'0')
        postData.append("fp_sdgs_same_as",this.fp_sdgs_same_as?'1':'0')
        
        postData.append("fp_esg_environment_same_as",this.fp_esg_environment_same_as?'1':'0')
        postData.append("fp_esg_governance_same_as",this.fp_esg_governance_same_as?'1':'0')
        postData.append("fp_esg_social_same_as",this.fp_esg_social_same_as?'1':'0')

        postData.append("fp_gender_lens_same_as",this.fp_gender_lens_same_as?'1':'0')
        postData.append("fp_funding_type_same_as",this.fp_funding_type_same_as?'1':'0')
        postData.append("fp_funding_stage_same_as",this.fp_funding_stage_same_as?'1':'0')
        postData.append("fp_countries_of_incorporation_same_as",this.fp_countries_of_incorporation_same_as?'1':'0')
        postData.append("fp_countries_of_domicile_nationality_same_as",this.fp_countries_of_domicile_nationality_same_as?'1':'0')
        postData.append("fp_industries_sectors_same_as",this.fp_industries_sectors_same_as?'1':'0')
        postData.append("fp_funding_provider_type_same_as",this.fp_funding_provider_type_same_as?'1':'0')

        postData.append("fp_disclaimer",this.fp_disclaimer?this.fp_disclaimer:'')
        postData.append("fp_confidentiality",this.fp_confidentiality?this.fp_confidentiality:'')
        postData.append("fn_disclaimer",this.fn_disclaimer?this.fn_disclaimer:'')
        postData.append("fn_confidentiality",this.fn_confidentiality?this.fn_confidentiality:'')
        

      // }
      this.apiService.addData('enabler', postData, 'update_fp_fn_form').subscribe(async response => {
        let res = response
        // let res = this.store.getReponseData(response)
        if (res.success) {
          this.getDataSetupList(true);
          this.store.showToast(res.message, 4000);
          this.eventService.publishEnablerUpdate({FNSubmissionAccept: this.FNSubmissionAccept,FPSubmissionAccept:this.FPSubmissionAccept });
        }else{
          this.store.scrollTo('myprofile')
          this.loadMsg = res.message
        } 
      });
  }
  listWithNew(mainList: any[], selectedDataList: any): any {
    let nList=[]
    for (let i = 0; i < selectedDataList.length; i++) {
      const element = selectedDataList[i];
      var idx = mainList.findIndex(p => p.ReferenceKey == element.ReferenceKey);
      nList.push({'ReferenceKey':((idx != -1?mainList[idx].isNew:false)?'':element.ReferenceKey) ,'ReferenceName':element.ReferenceName})
    }
    return nList;
  }

  resetVar() {
    this.loadMsg = ''
    this.MinRaiseError  = ''
    this.MaxRaiseError  = ''
    this.FPMinTotalRaiseAmountError  = ''
    this.FPMaxTotalRaiseAmountError  = ''

    this.FNMinimumTicketSizePerFundingError=''
    this.FNMaximumTicketSizePerFundingError=''

    this.FPMinimumTicketSizePerFundingError=''
    this.FPMaximumTicketSizePerFundingError=''

    this.FPCumulativeRevenueError=''
    this.FNCumulativeRevenueError=''
    // this.TicketSizePerFundingError = ''
    this.IsEnablerCurrency = false;
    this.IsFNImpactThemeUn = false;
    this.IsFNSdgUn = false;
    this.IsFNEsgEnvironmentUn = false;
    this.IsFNEsgSocialUn = false;
    this.IsFNEsgGovernanceUn = false;
    this.IsRequiredAnyoneUn = false;


    this.IsFNGenderLensUn = false;
    this.IsFNFundingTypeUn = false;
    this.IsFNFundingStageUn = false;
    this.IsMinRaiseAmountUn = false;
    this.IsMaxRaiseAmountUn = false;
    this.IsFNCountriesOfIncorporationUn = false;
    this.IsFNIndustrySectorsUn = false;
    this.IsFNFundingProviderTypeUn = false;

    this.IsFNCountriesOfDomicileNationalityUn = false;
    
    this.IsFPImpactThemeUn = false;
    this.IsFPSdgUn = false;
    this.IsFPEsgEnvironmentUn = false;
    this.IsFPEsgSocialUn = false;
    this.IsFPEsgGovernanceUn = false;

    this.IsFPGenderLensUn = false;
    this.IsFPFundingTypeUn = false;
    this.IsFPFundingStageUn = false;
    this.IsTotalRaiseAmountUn = false
    this.IsFNCumulativeRevenueUn = false
    this.IsFPCumulativeRevenueUn = false
    this.IsFPCountriesOfIncorporationUn = false;
    this.IsFPIndustrySectorsUn = false;
    this.IsFPFundingProviderTypeUn = false;
    this.IsFPMinTotalRaiseAmountUn = false
    this.IsFPMaxTotalRaiseAmountUn = false

    this.IsFNMinimumTicketSizePerFundingUn = false
    this.IsFNMaximumTicketSizePerFundingUn = false

    this.IsFPMinimumTicketSizePerFundingUn = false
    this.IsFPMaximumTicketSizePerFundingUn = false
    // this.IsFPTicketSizePerFundingUn = false
    this.IsFPCountriesOfDomicileNationalityUn = false;

    this.IsFPDisclaimerUn = false
    this.IsFPConfidentiality = false
    this.IsFNDisclaimerUn = false
    this.IsFNConfidentiality = false
  }

  async changeSwitch(isCheck,fromList,toList?,list?) {
    if(list != undefined){     
      let nm  = JSON.parse(JSON.stringify(list))
      let newVal =  this[nm.replace(/FP/g, "FN")]
      this[list] = JSON.parse(JSON.stringify(newVal))
    }
    if(isCheck){
      let newVal = JSON.parse(JSON.stringify({list : this[fromList]}))
      this.respObj[fromList.replace(/FN/g, "FP")]=this[fromList].toString()
      this[toList] = newVal.list
      if(fromList =='selectedFNFundingStage' || fromList =='selectedFNIndustrySectors' || fromList =='selectedFNFundingProviderType' || fromList =='selectedFNEsgEnvironment' || fromList =='selectedFNEsgSocial' || fromList =='selectedFNEsgGovernance'){
        let taglist =  JSON.parse(JSON.stringify({list : this[fromList+'Tag']}))
        this[toList+'Tag'] = taglist.list
      } 
    }
  }

}