import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { EventService } from 'src/shared/EventService';
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import * as _ from 'lodash';

@Component({
  selector: 'filter-view',
  templateUrl: './filter-view.component.html',
  styleUrls: ['./filter-view.component.scss'],
})
export class FilterViewComponent implements OnInit {

  clickClear = false;

  bsConfig: Partial<BsDatepickerConfig>;
  minMode: BsDatepickerViewMode = 'day';

  displayFilter = false;
  callAt: any = ''
  filteCnt = 0
  isDisabel: false

  sdgShow: any = false
  esgShow: any = false
  countryShow: any = false
  impactThemeAreaShow: any = false

  FundingProviderTypeShow:any=false
  MinimumTicketSizeShow:any=false
  FundingTypeShow:any=false
  FundingStageShow:any=false
  EnablerShow:any=false
  GenderLensShow:any=false

  segment: any;
  sort: string = 'recent'
  keyword: string = ''
  SdgIDs: any = '';
  EsgKeys: any = '';
  countryOfEnabler: any = [];
  ImpactThemesAndAreasKey:any = []

  EnablerSlug: any = [];
  FundingProviderType: any = [];
  FundingType: any = [];
  FundingStage: any = [];
  GenderLens: any = [];
  MinimumTicketSize: any = [];


  pageFrom: string = '';
  from: string = '';



  isFocus: boolean = false;
  isShowLocal: boolean = true;
  isCurrent = false;
  isView = false
  saveLabel = false;
  callFrom: string = 'other'

  totalCountry = 0;
  totalCountryInv = 0;
  totalThemesAreas = 0;
  totalEsg = 0;
  
  impactThemesAreasList: any = []
  esgList: any = []
  countryList = [];
  sdgList = [];
  enablerList= [];
  fundingProviderTypeList= [];
  fundingTypeList= [];
  fundingStageList= [];
  investorTicketSizeList= [];
  genderLensList= [];




  countries: any = []
  countriesInv: any = []

  constructor(public navParams: NavParams,  public router: Router, public store: StorageService, public eventService: EventService, public modalCtrl: ModalController, public apiService: ApiService) {

    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      containerClass: 'theme-default',
      placement:'auto',
      minMode: this.minMode
    });
  }

  ngOnDestroy(): void {
  }

  ngOnChanges() {

  }
  customSelect(event) {
    if (event.modalName != undefined && this['' + event.modalName] != undefined) {
      if (event.modal == null || (event.modal.length == 0) || (!_.isEqual(this['' + event.modalName], event.modal))) {
        this['' + event.modalName] = event.modal
        this.apply();
      }
    }
  }
  onChange(event, type?) {
    this.apply();
  }
  async ngOnInit() {
    this.SdgIDs = this.store.getFilterFromUrl('SdgIDs', '');
    this.EsgKeys = this.store.getFilterFromUrl('EsgKeys', '');
    this.countryOfEnabler =this.store.getFilterFromUrl('countryOfEnabler', '');
    this.ImpactThemesAndAreasKey = this.store.getFilterFromUrl('ImpactThemesAndAreasKey', '');
    this.EnablerSlug =this.store.getFilterFromUrl('EnablerSlug', '');
    this.FundingProviderType =this.store.getFilterFromUrl('this.FundingProviderType', '');
    this.MinimumTicketSize = this.store.getFilterFromUrl('MinimumTicketSize', '');
    this.FundingType = this.store.getFilterFromUrl('FundingType', '');
    this.FundingStage =this.store.getFilterFromUrl('FundingStage', '');
    this.GenderLens =this.store.getFilterFromUrl('this.GenderLens', '');

    await this.processFilterData();
    this.displayFilter = await this.setFilterData();
  }
  async onFocusSelect(select){
    if(!select.isOpen){
     await select.filter('')
    }
  }
  changeInvestorCountries(event) {
    this.countryOfEnabler = this.countryOfEnabler == ''?[]:(this.countryOfEnabler.length > 0)?this.countryOfEnabler:this.countryOfEnabler.split(',');
    if (event.item != undefined && !event.clear) {
      if (event.item.Children != undefined) {
        for (let g = 0; g < event.item.Children.length; g++) {
          const element = event.item.Children[g];
          if (element.Children != undefined) {
            for (let k = 0; k < element.Children.length; k++) {
              const conty = element.Children[k];
              if (conty.checked) {
                this.countryOfEnabler.push(conty.ReferenceKey)
              } else {
                var index = this.countryOfEnabler.map(String).indexOf(conty.ReferenceKey);
                if (index > -1) {
                  this.countryOfEnabler.splice(index, 1);
                }
              }
            }
          } else {
            if (element.checked) {
              this.countryOfEnabler.push(element.ReferenceKey)
            } else {
              var index = this.countryOfEnabler.map(String).indexOf(element.ReferenceKey);
              if (index > -1) {
                this.countryOfEnabler.splice(index, 1);
              }
            }
          }
        }
      } else {
        if (event.item.checked) {
          this.countryOfEnabler.push(event.item.ReferenceKey)
        } else {
          var index = this.countryOfEnabler.map(String).indexOf(event.item.ReferenceKey);
          if (index > -1) {
            this.countryOfEnabler.splice(index, 1);
          }
        }
      }
      this.countryOfEnabler = [...new Set(this.countryOfEnabler)]
    } 
    if (event.clear != undefined && event.clear) {
      this.countryOfEnabler = []
    }
    if(event.item != undefined || event.clear != undefined)
    this.apply()
  }

  changeImpactTheme(event) {
    this.ImpactThemesAndAreasKey = this.ImpactThemesAndAreasKey == ''?[]:(this.ImpactThemesAndAreasKey.length > 0)?this.ImpactThemesAndAreasKey:this.ImpactThemesAndAreasKey.split(',');
    
    if (event.item != undefined && !event.clear) {
      if (event.item.Children != undefined) {
        for (let g = 0; g < event.item.Children.length; g++) {
          const element = event.item.Children[g];
          if (element.Children != undefined) {
            for (let k = 0; k < element.Children.length; k++) {
              const conty = element.Children[k];
              if (conty.checked) {
                this.ImpactThemesAndAreasKey.push(conty.ReferenceKey)
              } else {
                var index = this.ImpactThemesAndAreasKey.indexOf(conty.ReferenceKey);
                if (index > -1) {
                  this.ImpactThemesAndAreasKey.splice(index, 1);
                }
              }
            }
          } else {
            if (element.checked) {
              this.ImpactThemesAndAreasKey.push(element.ReferenceKey)
            } else {
              var index = this.ImpactThemesAndAreasKey.indexOf(element.ReferenceKey);
              if (index > -1) {
                this.ImpactThemesAndAreasKey.splice(index, 1);
              }
            }
          }
        }
      } else {
        if (event.item.checked) {
          this.ImpactThemesAndAreasKey.push(event.item.ReferenceKey)
        } else {
          var index = this.ImpactThemesAndAreasKey.indexOf(event.item.ReferenceKey);
          if (index > -1) {
            this.ImpactThemesAndAreasKey.splice(index, 1);
          }
        }
      }
      this.ImpactThemesAndAreasKey = [...new Set(this.ImpactThemesAndAreasKey)]
    } else {
      if (event.clear != undefined && event.clear) {
        this.ImpactThemesAndAreasKey = []
      }
    }

    for (let k = 0; k < this.impactThemesAreasList.length; k++) {
      let clickF = 0
      if (this.ImpactThemesAndAreasKey.includes(this.impactThemesAreasList[k].ReferenceKey)) {
        this.impactThemesAreasList[k].checked = true
      }
      let clickS = 0
      for (let l = 0; l < this.impactThemesAreasList[k].Children.length; l++) {
        if (this.ImpactThemesAndAreasKey.includes(this.impactThemesAreasList[k].Children[l].ReferenceKey)) {
          this.impactThemesAreasList[k].Children[l].checked = true
          clickS = clickS + 1
        }
        let clickT = 0
        for (let m = 0; m < this.impactThemesAreasList[k].Children[l].Children.length; m++) {
          if (this.ImpactThemesAndAreasKey.includes(this.impactThemesAreasList[k].Children[l].Children[m].ReferenceKey)) {
            this.impactThemesAreasList[k].Children[l].Children[m].checked = true
            clickT = clickT + 1;
            clickF = clickF + 1
          }
        }
        if (this.impactThemesAreasList[k].Children[l].Children.length == clickT) {
          this.impactThemesAreasList[k].Children[l].checked = true
        } else {
          this.impactThemesAreasList[k].Children[l].checked = false
        }
      }
      if (this.impactThemesAreasList[k].Children.length == clickS) {
        this.impactThemesAreasList[k].Children.checked = true
      } else {
        this.impactThemesAreasList[k].Children.checked = false
      }
      if (this.impactThemesAreasList[k].cnt == clickF) {
        this.impactThemesAreasList[k].checked = true
      } else {
        this.impactThemesAreasList[k].checked = false
      }
    }
    if(event.item != undefined || event.clear != undefined)
    this.apply()
  }
  changeEsg(event) {
    this.EsgKeys = this.EsgKeys == ''?[]:(this.EsgKeys.length > 0)?this.EsgKeys:this.EsgKeys.split(',');
    
    if (event.item != undefined && !event.clear) {
      if (event.item.Children != undefined) {
        for (let g = 0; g < event.item.Children.length; g++) {
          const element = event.item.Children[g];
          if (element.Children != undefined) {
            for (let k = 0; k < element.Children.length; k++) {
              const conty = element.Children[k];
              if (conty.checked) {
                this.EsgKeys.push(conty.ReferenceKey)
              } else {
                var index = this.EsgKeys.indexOf(conty.ReferenceKey);
                if (index > -1) {
                  this.EsgKeys.splice(index, 1);
                }
              }
            }
          } else {
            if (element.checked) {
              this.EsgKeys.push(element.ReferenceKey)
            } else {
              var index = this.EsgKeys.indexOf(element.ReferenceKey);
              if (index > -1) {
                this.EsgKeys.splice(index, 1);
              }
            }
          }
        }
      } else {
        if (event.item.checked) {
          this.EsgKeys.push(event.item.ReferenceKey)
        } else {
          var index = this.EsgKeys.indexOf(event.item.ReferenceKey);
          if (index > -1) {
            this.EsgKeys.splice(index, 1);
          }
        }
      }
      this.EsgKeys = [...new Set(this.EsgKeys)]
    } else {
      if (event.clear != undefined && event.clear) {
        this.EsgKeys = []
      }
    }

    for (let k = 0; k < this.esgList.length; k++) {
      let clickF = 0
      if (this.EsgKeys.includes(this.esgList[k].ReferenceKey)) {
        this.esgList[k].checked = true
      }
      let clickS = 0
      for (let l = 0; l < this.esgList[k].Children.length; l++) {
        if (this.EsgKeys.includes(this.esgList[k].Children[l].ReferenceKey)) {
          this.esgList[k].Children[l].checked = true
          clickS = clickS + 1
        }
        let clickT = 0
        for (let m = 0; m < this.esgList[k].Children[l].Children.length; m++) {
          if (this.EsgKeys.includes(this.esgList[k].Children[l].Children[m].ReferenceKey)) {
            this.esgList[k].Children[l].Children[m].checked = true
            clickT = clickT + 1;
            clickF = clickF + 1
          }
        }
        if (this.esgList[k].Children[l].Children.length == clickT) {
          this.esgList[k].Children[l].checked = true
        } else {
          this.esgList[k].Children[l].checked = false
        }
      }
      if (this.esgList[k].Children.length == clickS) {
        this.esgList[k].Children.checked = true
      } else {
        this.esgList[k].Children.checked = false
      }
      if (this.esgList[k].cnt == clickF) {
        this.esgList[k].checked = true
      } else {
        this.esgList[k].checked = false
      }
    }
    if(event.item != undefined || event.clear != undefined)
    this.apply()
  }

  async processFilterData() {
    if ((this.sdgShow) ||(this.esgShow) || (this.countryShow) || (this.impactThemeAreaShow) || (this.FundingProviderTypeShow) || (this.MinimumTicketSizeShow) || (this.FundingTypeShow) || (this.FundingStageShow) || (this.EnablerShow) || (this.GenderLensShow)) {
      await this.apiService.filterData(this.sdgShow,this.esgShow, this.countryShow, this.impactThemeAreaShow,this.FundingProviderTypeShow,this.MinimumTicketSizeShow,this.FundingTypeShow,this.FundingStageShow,this.EnablerShow,this.GenderLensShow).subscribe(async response => {
        let res: any = response;
        if (res.success && res.data != undefined) {
          // SdgList
          if (res.data.SdgList != undefined && res.data.SdgList.length > 0) {
            this.sdgList = res.data.SdgList;
          }
          if (res.data.SdgList != undefined && res.data.enabler_list.length > 0) {
            this.enablerList = res.data.enabler_list;
          }
          if (res.data.funding_provider_type_list != undefined && res.data.funding_provider_type_list.length > 0) {
            this.fundingProviderTypeList = res.data.funding_provider_type_list;
          }
          if (res.data.investor_ticket_size_list != undefined && res.data.investor_ticket_size_list.length > 0) {
            this.investorTicketSizeList = res.data.investor_ticket_size_list;
          }
          if (res.data.funding_type_list != undefined && res.data.funding_type_list.length > 0) {
            this.fundingTypeList = res.data.funding_type_list;
          }
          if (res.data.funding_stage_list != undefined && res.data.funding_stage_list.length > 0) {
            this.fundingStageList = res.data.funding_stage_list;
          }
          if (res.data.gender_lens_list != undefined && res.data.gender_lens_list.length > 0) {
            this.genderLensList = res.data.gender_lens_list;
          }

          if (res.data.region_tree_list != undefined) {
            let region_tree_list = res.data.region_tree_list;
            this.totalCountry = 0
            this.totalCountryInv = 0
            for (let k = 0; k < region_tree_list.length; k++) {
              const element = region_tree_list[k];
              let child = element.SubRegionJson != undefined ? JSON.parse(element.SubRegionJson) : []
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
                    checked: (this.countryOfEnabler != undefined && this.countryOfEnabler != '')?(this.countryOfEnabler.includes(''+cntry.CountryKey)):false
                  })
                }
                ChildrenList.push({
                  ReferenceKey: chil.SubRegionKey,
                  Region: chil.SubRegionName,
                  Children: countryList,
                  checked: (this.countryOfEnabler != undefined && this.countryOfEnabler != '')?(this.countryOfEnabler?.includes(''+chil.SubRegionKey)):false
                })
              }
              let cnt = ChildrenList.reduce((count, current) => count + current.Children.length, 0)

              this.countries.push({
                ReferenceKey: element.ReferenceKeyRegion,
                Region: element.Region,
                Children: ChildrenList,
                isParent: true,
                cnt: cnt,
                checked: (this.countryOfEnabler != undefined && this.countryOfEnabler != '')?(this.countryOfEnabler?.includes(''+element.ReferenceKeyRegion)):false
              })
              this.totalCountry = this.totalCountry + cnt
  
            }
          }

          if (res.data.impact_themes_areas_list != undefined) {
            let impact_themes_areas_list = res.data.impact_themes_areas_list;
            let mList = [];
            mList.push({ "ReferenceKey": "select_all", "ReferenceName": this.store.getVal("select_all"), isParent: true, ImpactThemesAreas: impact_themes_areas_list })
            this.totalThemesAreas = 0;
            for (let k = 0; k < mList.length; k++) {
              const element = mList[k];
              let child = element.ImpactThemesAreas != undefined ? element.ImpactThemesAreas : []
              let ChildrenList = []
              for (let l = 0; l < child.length; l++) {
                const chil = child[l];
                let Item = chil.ImpactThemesAreas != undefined ? JSON.parse(chil.ImpactThemesAreas) : []
                let ItemList = [];
                for (let j = 0; j < Item.length; j++) {
                  const cntry = Item[j];
                  ItemList.push({
                    ReferenceKey: cntry.ReferenceKey,
                    Region: cntry.ReferenceName,
                    showFirst: false,
                    visible: true,
                    checked: (this.ImpactThemesAndAreasKey.includes(cntry.ReferenceKey))
                  })
                }
                
                ChildrenList.push({
                  ReferenceKey: chil.ReferenceKey,
                  Region: chil.ReferenceName,
                  Children: ItemList,
                  visible: false,
                  showFirst: true,
                  checked: (this.ImpactThemesAndAreasKey.includes(chil.ReferenceKey))
                })
  
              }
              let cnt = ChildrenList.reduce((count, current) => count + current.Children.length, 0)
              // let cnt = ChildrenList.length;
  
              this.impactThemesAreasList.push({
                ReferenceKey: element.ReferenceKey,
                Region: element.ReferenceName,
                Children: ChildrenList,
                isParent: true,
                showFirst: true,
                visible: true,
                cnt: cnt,
                checked: (this.ImpactThemesAndAreasKey.includes(element.ReferenceKey))
              })
  
              this.totalThemesAreas = this.totalThemesAreas + cnt
            }
          }
          if (res.data.Esglist != undefined) {
            let Esglist = res.data.Esglist;
            let mList = [];
            mList.push({ "ReferenceKey": "select_all", "ReferenceName": this.store.getVal("select_all"), isParent: true, ESG: Esglist })
            this.totalEsg = 0;
            for (let k = 0; k < mList.length; k++) {
              const element = mList[k];
              let child = element.ESG != undefined ? element.ESG : []
              let ChildrenList = []
              for (let l = 0; l < child.length; l++) {
                const chil = child[l];
                let Item = chil.ESG != undefined ? JSON.parse(chil.ESG) : []
                let ItemList = [];
                for (let j = 0; j < Item.length; j++) {
                  const cntry = Item[j];
                  ItemList.push({
                    ReferenceKey: cntry.ReferenceKey,
                    Region: cntry.ReferenceName,
                    showFirst: false,
                    visible: true,
                    checked: (this.EsgKeys.includes(cntry.ReferenceKey))
                  })
                }
                
                ChildrenList.push({
                  ReferenceKey: chil.ReferenceKey,
                  Region: chil.ReferenceName,
                  Children: ItemList,
                  visible: false,
                  showFirst: true,
                  checked: (this.EsgKeys.includes(chil.ReferenceKey))
                })
  
              }
              let cnt = ChildrenList.reduce((count, current) => count + current.Children.length, 0)
              // let cnt = ChildrenList.length;
  
              this.esgList.push({
                ReferenceKey: element.ReferenceKey,
                Region: element.ReferenceName,
                Children: ChildrenList,
                isParent: true,
                showFirst: true,
                visible: true,
                cnt: cnt,
                checked: (this.EsgKeys.includes(element.ReferenceKey))
              })
  
              this.totalEsg = this.totalEsg + cnt
            }
          }
          
        }
      });
    }
    return true;
  }
  setListData(list, SelectedValue) {
    let NewList = [];
    let SelectedValuesArray = (SelectedValue != undefined && SelectedValue != '' ? SelectedValue : []);
    for (let i = 0; i < list.length; i++) {
      let check = false;
      if (typeof SelectedValuesArray === 'string') {
        if (SelectedValuesArray == list[i].ReferenceKey) {
          check = true
        }
      } else {
        for (let index = 0; index < SelectedValuesArray.length; index++) {
          if (SelectedValuesArray[index] == list[i].ReferenceKey) {
            check = true
          }
        }
      }
      NewList.push({ ReferenceName: list[i].ReferenceName, ReferenceKey: list[i].ReferenceKey, isChecked: check });
    }
    return NewList;
  }
  setFilterData() {
    let SdgIDs = this.checkUndefind(this.SdgIDs);
    let EsgKeys = this.checkUndefind(this.EsgKeys);
    let countryOfEnabler = this.checkUndefind(this.countryOfEnabler);
    let ImpactThemesAndAreasKey = this.checkUndefind(this.ImpactThemesAndAreasKey);
    let EnablerSlug = this.checkUndefind(this.EnablerSlug);
    let FundingProviderType = this.checkUndefind(this.FundingProviderType);
    let MinimumTicketSize = this.checkUndefind(this.MinimumTicketSize);
    let FundingType = this.checkUndefind(this.FundingType);
    let FundingStage = this.checkUndefind(this.FundingStage);
    let genderLens = this.checkUndefind(this.GenderLens);
    // this.checkUndefind(this.countryOfEnabler);
    this.filteCnt = this.store.calculateFilter(this.sdgShow, SdgIDs,this.esgShow,EsgKeys, this.countryShow, countryOfEnabler,this.impactThemeAreaShow,ImpactThemesAndAreasKey,this.EnablerShow,EnablerSlug,this.FundingProviderTypeShow,FundingProviderType,this.MinimumTicketSizeShow,MinimumTicketSize,this.FundingTypeShow,FundingType,this.FundingStageShow,FundingStage,this.GenderLensShow,genderLens);
    return true;
  }

  async getReferenceValueData(ReferenceType, SelectedValue) {
    let ReferenceList = [];
    await this.apiService.referenceList(ReferenceType).subscribe(async response => {
      let res: any = response;
      if (res.success && res.data != undefined && res.data.list.length > 0) {
        let SelectedValuesArray = (SelectedValue != undefined && SelectedValue != '' ? SelectedValue : []);
        var list = res.data.list;
        for (let i = 0; i < list.length; i++) {
          let check = false;
          if (typeof SelectedValuesArray === 'string') {
            if (SelectedValuesArray == list[i].ReferenceKey) {
              check = true
            }
          } else {
            for (let index = 0; index < SelectedValuesArray.length; index++) {
              if (SelectedValuesArray[index] == list[i].ReferenceKey) {
                check = true
              }
            }
          }

          ReferenceList.push({ ReferenceName: list[i].ReferenceName, ReferenceKey: list[i].ReferenceKey, isChecked: check });
        }
      }
    });
    return ReferenceList;
  }

  close() { this.modalCtrl.dismiss({ keyword: this.checkUndefind(this.keyword), sort: this.checkUndefind(this.sort), pageFrom: this.checkUndefind(this.pageFrom),from:this.from, callFrom: this.callFrom, segment: this.checkUndefind(this.segment), SdgIDs: this.checkUndefind(this.SdgIDs),EsgKeys:this.checkUndefind(this.EsgKeys), countryOfEnabler: this.checkUndefind(this.countryOfEnabler), ImpactThemesAndAreasKey: this.checkUndefind(this.ImpactThemesAndAreasKey), type: "savelbl" }); }
  async clearAll() {
    this.clickClear = true;
    if (this.sdgShow) {
      this.SdgIDs = ''
    }
    if (this.countryOfEnabler.length>0) {
      this.countryOfEnabler = []
    }
    if (this.ImpactThemesAndAreasKey.length>0) {
      this.ImpactThemesAndAreasKey = []
    }
    if (this.EsgKeys.length>0) {
      this.EsgKeys = []
    }
    if (this.EnablerShow) {
      this.EnablerSlug=[]
    }
    if (this.FundingProviderTypeShow) {
      this.FundingProviderType=[]
    }
    if (this.FundingTypeShow) {
      this.FundingType=[]
    }
    if (this.FundingStageShow) {
      this.FundingStage=[]
    }
    if (this.MinimumTicketSizeShow) {
      this.MinimumTicketSize=[]
    }
    if (this.GenderLensShow) {
      this.GenderLens=[]
    }

    for (let k = 0; k < this.countries.length; k++) {
      this.countries[k].checked = false;
      for (let l = 0; l < this.countries[k].Children.length; l++) {
        this.countries[k].Children[l].checked = false;
        if (this.countries[k].Children[l].Children != undefined) {
          for (let i = 0; i < this.countries[k].Children[l].Children.length; i++) {
            this.countries[k].Children[l].Children[i].checked = false;
          }
        }
      }
    }

    for (let k = 0; k < this.countriesInv.length; k++) {
      this.countriesInv[k].checked = false;
      for (let l = 0; l < this.countriesInv[k].Children.length; l++) {
        this.countriesInv[k].Children[l].checked = false;
        if (this.countriesInv[k].Children[l].Children != undefined) {
          for (let i = 0; i < this.countriesInv[k].Children[l].Children.length; i++) {
            this.countriesInv[k].Children[l].Children[i].checked = false;
          }
        }
      }
    }

    for (let k = 0; k < this.impactThemesAreasList.length; k++) {
      this.impactThemesAreasList[k].checked = false;
      for (let l = 0; l < this.impactThemesAreasList[k].Children.length; l++) {
        this.impactThemesAreasList[k].Children[l].checked = false;
        if (this.impactThemesAreasList[k].Children[l].Children != undefined) {
          for (let i = 0; i < this.impactThemesAreasList[k].Children[l].Children.length; i++) {
            this.impactThemesAreasList[k].Children[l].Children[i].checked = false;
          }
        }
      }
    }
   
    this.apply(true);
    this.modalCtrl.dismiss();
  }

  async apply(isClear?) {
    isClear = (isClear == undefined) ? false : isClear
    if (this.pageFrom != 'search-profile') {
      let SdgIDs = this.sdgShow ? this.checkUndefind(this.SdgIDs) : '';
      let EsgKeys = this.sdgShow ? this.checkUndefind(this.EsgKeys) : '';
      let countryEnabler = this.countryShow ? this.checkUndefind(this.countryOfEnabler) : '';

      let EnablerSlug = this.EnablerShow ? this.checkUndefind(this.EnablerSlug) : '';
      let FundingProviderType = this.FundingProviderTypeShow ? this.checkUndefind(this.FundingProviderType) : '';
      let FundingType = this.FundingTypeShow ? this.checkUndefind(this.FundingType) : '';
      let FundingStage = this.FundingStageShow ? this.checkUndefind(this.FundingStage) : '';
      let GenderLens = this.GenderLens ? this.checkUndefind(this.GenderLens) : '';
      let MinimumTicketSize = this.MinimumTicketSizeShow ? this.checkUndefind(this.MinimumTicketSize) : '';
      //,EnablerShow?,Enablers?,FundingProviderTypeShow?,FundingProviderType?,MinimumTicketSizeShow?,MinimumTicketSize?,genderLensShow?,genderLens?
      this.filteCnt = this.store.calculateFilter(this.sdgShow, SdgIDs,this.esgShow,EsgKeys, this.countryShow, countryEnabler,this.impactThemeAreaShow,this.ImpactThemesAndAreasKey,this.EnablerShow,EnablerSlug,this.FundingProviderTypeShow,FundingProviderType,this.MinimumTicketSizeShow,MinimumTicketSize,this.FundingTypeShow,FundingType,this.FundingStageShow,FundingStage,this.GenderLensShow,GenderLens);
      
      await this.saveFilterData(isClear)

      let data = {
        keyword: this.checkUndefind(this.keyword),
        sort: this.checkUndefind(this.sort),
        pageFrom: this.checkUndefind(this.pageFrom),
        from: this.checkUndefind(this.from),

        callFrom: this.callFrom,
        segment: this.checkUndefind(this.segment),
        filteCnt: this.filteCnt,
        SdgIDs: !this.sdgShow?undefined:this.checkUndefind(this.SdgIDs),
        EsgKeys: !this.esgShow?undefined:this.checkUndefind(this.EsgKeys),
        countryOfEnabler: !this.countryShow?undefined:this.checkUndefind(this.countryOfEnabler),
        ImpactThemesAndAreasKey: !this.impactThemeAreaShow?undefined:this.checkUndefind(this.ImpactThemesAndAreasKey),
        EnablerSlug: !this.EnablerShow?undefined:this.checkUndefind(this.EnablerSlug),
        FundingProviderType: !this.FundingProviderTypeShow?undefined:this.checkUndefind(this.FundingProviderType),
        FundingType: !this.FundingTypeShow?undefined:this.checkUndefind(this.FundingType),
        FundingStage: !this.FundingStageShow?undefined:this.checkUndefind(this.FundingStage),
        MinimumTicketSize: !this.MinimumTicketSizeShow?undefined:this.checkUndefind(this.MinimumTicketSize),
        GenderLens: !this.GenderLensShow?undefined:this.checkUndefind(this.GenderLens),
        updateTime:(new Date().getTime()),
        type: "savelbl",
      }
      setTimeout(() => {
        this.clickClear = false
        this.eventService.publishApplyFilter(data)
      }, 50);
    }
    // this.modalCtrl.dismiss();
  }
  saveFilterData(isClear?) {
    this.store.setGetParameter('sort',  this.sort != undefined ? this.sort : 'recent', isClear);
    this.store.setGetParameter('SdgIDs', this.SdgIDs != undefined ? this.SdgIDs : '', (isClear || this.SdgIDs == undefined || this.SdgIDs == ''))
    this.store.setGetParameter('EsgKeys', this.EsgKeys != undefined ? this.EsgKeys : '', (isClear || this.EsgKeys == undefined || this.EsgKeys == ''))

    if (this.EnablerShow) {
      this.store.setGetParameter('EnablerSlug', this.EnablerSlug != undefined ? this.EnablerSlug : '', (isClear || this.EnablerSlug == undefined || this.EnablerSlug == ''));
    }
    if (this.FundingProviderTypeShow) {
      this.store.setGetParameter('FundingProviderType', this.FundingProviderType != undefined ? this.FundingProviderType : '',(isClear ||  this.FundingProviderType == undefined || this.FundingProviderType ==''));
    }
    this.store.setGetParameter('FundingType', this.FundingType != undefined ? this.FundingType : '',(isClear || this.FundingType == undefined || this.FundingType.length == 0  ));
    this.store.setGetParameter('FundingStage', this.FundingStage != undefined ? this.FundingStage : '',(isClear || this.FundingStage == undefined || this.FundingStage.length == 0  ));
    this.store.setGetParameter('MinimumTicketSize', this.MinimumTicketSize != undefined ? this.MinimumTicketSize : '',(isClear || this.MinimumTicketSize == undefined || this.MinimumTicketSize.length == 0 ));
    this.store.setGetParameter('GenderLens', this.GenderLens != undefined ? this.GenderLens : '',(isClear || this.GenderLens == undefined || this.GenderLens.length == 0));
    this.store.saveData('countryOfEnabler', (this.countryOfEnabler != undefined && this.countryOfEnabler != '' && this.countryOfEnabler.length > 0) ? this.countryOfEnabler.toString() : '');
    this.store.setGetParameter('countryOfEnabler', (this.countryOfEnabler != undefined && this.countryOfEnabler != '' && this.countryOfEnabler.length > 0) ? this.countryOfEnabler.toString() : '',(isClear || this.countryOfEnabler == undefined || this.countryOfEnabler.length == 0));
    this.store.setGetParameter('ImpactThemesAndAreasKey',  (this.ImpactThemesAndAreasKey != undefined && this.ImpactThemesAndAreasKey != '' && this.ImpactThemesAndAreasKey.length > 0) ? this.ImpactThemesAndAreasKey.toString() : '',(isClear || this.ImpactThemesAndAreasKey == undefined || this.ImpactThemesAndAreasKey.length == 0));
  }

  checkUndefind(data: any) {
    return data != undefined ? data : '';
  }
  checkUndefindInteger(data: any) {
    return data != undefined ? data : 0;
  }

}
