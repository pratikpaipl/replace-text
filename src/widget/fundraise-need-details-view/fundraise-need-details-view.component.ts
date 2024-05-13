import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { EventService } from 'src/shared/EventService';
import { ApiService } from 'src/services/api.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'fundraise-need-details-view',
  templateUrl: './fundraise-need-details-view.component.html',
  styleUrls: ['./fundraise-need-details-view.component.scss'],
})
export class FundraiseNeedDetailsViewComponent implements OnInit {

  @Input()
  title: string;
  @Input()
  ImpactThemesAndAreas: any;
  @Input()
  Esg: any;
  @Input()
  Sdgs: any;
  @Input()
  FundingType: any;
  @Input()
  FundraiseData: any;
  className: string;
  PLATFORMID:any=false
  constructor(@Inject(PLATFORM_ID) platformId: any,public router:Router, private eventService: EventService,public store: StorageService,public sanitizer: DomSanitizer,public apiService:ApiService,public modalController:ModalController) {
    this.PLATFORMID = isPlatformBrowser(platformId)
  }

  ngOnInit() {
  }
  onPitchDownload(path){
    this.apiService.pitchDownload(path);
  }
  moveToEnabler(type, data) {
    let filterData:any = [];
    if(data != undefined){
      filterData = data.map(function (e) {
        return e.ReferenceKey;
      })
    }
    if(type =='impact_themes_and_areas'){
      this.store.setGetParameter('ImpactThemesAndAreasKey',filterData.join())
    }
     if(type =='sdgs'){
      this.store.setGetParameter('SdgIDs',filterData.join())
    }
    if(type =='esg'){
      this.store.setGetParameter('EsgKeys',filterData.join())
    }
    this.eventService.publishApplyFilter({updateTime:new Date().getTime()})
    this.store.navigatePage([ this.store.appType =='admin'?'admin':'explore/enablers'],this.store.appType =='admin'?'enablers':undefined)
  }
  async openDesModal(fronType,from){
    localStorage.setItem('titleKey',from)
    localStorage.setItem('fromVar',this.FundraiseData[''+fronType])
    let pt = from.split('_')
    if(this.FundraiseData.EnablerSlug == undefined){
      let path =((this.store.appType =='admin')?'admin/':'')+this.FundraiseData.ReferenceCode+'/investee'+pt[1]
      this.router.navigateByUrl(path);
    }
    else{
      let path =((this.store.appType =='admin')?'admin/':'')+'enabler/'+this.FundraiseData.EnablerSlug+'/'+this.FundraiseData.ReferenceCode+'/investee/'+pt[1]
      this.router.navigateByUrl(path);
    }
    }
}
