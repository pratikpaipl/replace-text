import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit, OnDestroy {

  filteCnt = 0
  @Input()
  selItem: any;

  isShow = false;
  enabler_list = []
  fundingSeekerList = []
  permissions = []
  fundriseList = []
  matchRateFundingList = []
  fundingProviderList = []
  sort = 'recent';
  EnablerSlug:any

  private applyFilter: any;
  @ViewChild('content') content: any;
  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {
    this.applyFilter = this.eventService.applyFilter$.subscribe((item: any) => {
      // this.getReport();
  });
  }

  ngOnInit() {
    // this.getReport();
  }
  customSelect(event){
    if(event.modalName !=undefined){
      this['' + event.modalName] = event.modal
      this.getReport();
    }
    // if(event.modal != undefined)
  }
  getReport() {
    this.apiService.summaryReport(this.EnablerSlug !=undefined?this.EnablerSlug:'', '', this.sort, 0, 50).subscribe(async response => {
      let res: any = response;
      if (res.success) {
        if(res.data.enabler_list !=undefined){
          this.enabler_list = res.data.enabler_list;
        }
          this.setTbData(res.data.list[0])
        }
    });
  }
  setTbData(obj) {
    this.fundingSeekerList = []
    this.fundriseList = []
    this.fundingProviderList = []
    this.matchRateFundingList = []
    this.fundingSeekerList.push({
      title: this.store.getVal('number_of_unique_organisations_companies'),
      value: obj.FundingSeekers
    })
    this.fundingSeekerList.push({
      title: this.store.getVal('number_of_submitted_fundraise_needs'),
      value:obj.FundraiseNeeds
    })
    this.fundingSeekerList.push({
      title: this.store.getVal('matched_fundraise_needs'),
      value:obj.NumberOfMatchedFundraiseNeeds
    })
    this.fundingSeekerList.push({
      title: this.store.getVal('total_raise_amount_eur'),
      value: this.store.format(undefined,obj.TotalRaiseAmount)
    })
    this.fundingSeekerList.push({
      title: this.store.getVal('average_per_fundraise_eur'),
      value:this.store.format(undefined,obj.AverageRaiseAmountPerFundraise)
      })
    this.fundriseList.push({
      title: this.store.getVal('average_number_of_matching_uniique_funding_provider_emails_per_submitted_fundraise_need'),
      value: parseFloat(obj.AvgNoOfMatchingUniqueFundingProviderPerSubmittedFundraiseNeed).toFixed(2)
    })
    this.fundriseList.push({
      title: this.store.getVal('average_number_of_matching_submitted_funding_profiles_per_submitted_fundraise_need'),
      value: parseFloat(obj.AverageNumberOfMatchedFundingProfilesPerFundraiseNeed).toFixed(2)
    })
    this.fundriseList.push({
      title: this.store.getVal('average_number_of_expression_of_interest_per_submitted_fundraise_need'),
      value: obj.AvgNoOfExpressionOfInterestPerSubmittedFundraise
    })
    this.fundriseList.push({
      title: this.store.getVal('matching_funding_amount_eur'),
      value: obj.FNMinToMaxTicketSize
    })
    this.fundingProviderList.push({
      title: this.store.getVal('number_of_unique_funding_provider_emails'),
      value: obj.UniqueNumberOfFundingProvider != undefined?obj.UniqueNumberOfFundingProvider:''
    })
    this.fundingProviderList.push({
      title: this.store.getVal('number_of_submitted_funding_profiles'),
      value:  obj.FundingProfiles != undefined?obj.FundingProfiles:''
    })
    this.fundingProviderList.push({
      title: this.store.getVal('matched_funding_profiles'),
      value:  obj.NumberOfMatchedFundingProfiles != undefined?obj.NumberOfMatchedFundingProfiles:''
    })
    this.fundingProviderList.push({
      title: this.store.getVal('min_to_max_ticket_size_eur'),
      value:  obj.FPMinToMaxTicketSize
    })
    this.fundingProviderList.push({
      title: this.store.getVal('average_min_to_max_ticket_size_per_funding_profile_eur'),
      value: obj.AverageMinToMaxTicketSizePerFundingProfile
    })
    this.matchRateFundingList.push({
      title: this.store.getVal('average_number_of_matched_fundraise_needs_per_unique_funding_profile_email'),
      value: parseFloat(obj.AverageNumberOfMatchedFundraiseNeedsPerFundingProvider).toFixed(2)
    })
    this.matchRateFundingList.push({
      title: this.store.getVal('average_number_of_matched_fundraise_needs_per_submitted_funding_profile'),
      value: parseFloat(obj.AverageNumberOfMatchedFundraiseNeedsPerFundingProfile).toFixed(2)
    })
    this.matchRateFundingList.push({
      title: this.store.getVal('average_number_of_expression_of_interest_per_submitted_funding_profile'),
      value: obj.AvgNoOfExpressionOfInterestPerSubmittedFundingProfile
    })
    this.matchRateFundingList.push({
      title: this.store.getVal('average_matching_funding_amount_per_funding_profile_eur'),
      value: obj.AvgMatchingFundingAmountPerFundingProfile
    })
  }
  ngOnDestroy() {
    this.applyFilter.unsubscribe();
  }

  download(event) {
    this.apiService.callDownload(appApi.summaryReportExcel, 'EnablerSlug', this.EnablerSlug, '', this.sort,'');
  }

}
