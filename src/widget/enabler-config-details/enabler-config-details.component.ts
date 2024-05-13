import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { EventService } from 'src/shared/EventService';


@Component({
  selector: 'enabler-config-details',
  templateUrl: './enabler-config-details.component.html',
  styleUrls: ['./enabler-config-details.component.scss'],
})
export class EnablerConfigDetailsComponent implements OnInit {

  @Input()
  title: string;
  @Input()
  enablerData: any;
  @Input()
  FNImpactThemesAndAreas:any;
  @Input()
  FPImpactThemesAndAreas:any;
  @Input()
  FNSdgs:any;
  @Input()
  FPSdgs:any;

  @Input()
  FNEsg:any;
  @Input()
  FPEsg:any;

  @Input()
  FNFundingType:any;
  @Input()
  FPFundingType:any;

  className: string;
  PLATFORMID:any=false
  constructor(@Inject(PLATFORM_ID) platformId: any,private eventService: EventService,public store: StorageService,public san: DomSanitizer) {
    this.PLATFORMID = isPlatformBrowser(platformId)
  }

  ngOnInit() {
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
  
}
