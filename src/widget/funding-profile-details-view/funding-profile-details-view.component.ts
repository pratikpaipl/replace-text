import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { EventService } from 'src/shared/EventService';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'funding-profile-details-view',
  templateUrl: './funding-profile-details-view.component.html',
  styleUrls: ['./funding-profile-details-view.component.scss'],
})
export class FundingProfileDetailsViewComponent implements OnInit {

  @Input()
  title: string;
  @Input()
  ImpactThemesAndAreas: any;
  @Input()
  Sdgs: any;
  @Input()
  Esg: any;
  @Input()
  FundingType: any;
  @Input()
  fundingProfileData: any;
  className: string;
  PLATFORMID:any=false
  fromVar:any
  constructor(@Inject(PLATFORM_ID) platformId: any,public router:Router ,private eventService: EventService,public store: StorageService,public sanitizer: DomSanitizer,public modalController:ModalController) {
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
  
  async openDesModal(fronType,from){
  localStorage.setItem('titleKey',from)
  localStorage.setItem('fromVar',this.fundingProfileData[''+fronType])
  
  let pt = from.split('_')
  console.log('this.fundingProfileData ',this.fundingProfileData)
  if(this.fundingProfileData.EnablerSlug == undefined){
    let path =((this.store.appType =='admin')?'admin/':'')+this.fundingProfileData.ReferenceCode+'/investor/'+pt[1]
    console.log('path ',path)
    this.router.navigateByUrl(path);
  }
  else{
    let path =((this.store.appType =='admin')?'admin/':'')+'enabler/'+this.fundingProfileData.EnablerSlug+'/'+this.fundingProfileData.ReferenceCode+'/investor/'+pt[1]
    console.log('path ',path)
    this.router.navigateByUrl(path);
  }
  }
}
