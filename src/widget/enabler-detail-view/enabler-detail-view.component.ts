import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { EventService } from 'src/shared/EventService';


@Component({
  selector: 'enabler-detail-view',
  templateUrl: './enabler-detail-view.component.html',
  styleUrls: ['./enabler-detail-view.component.scss'],
})
export class EnablerDetailViewComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  FNImpactThemesAndAreas: any;
  @Input()
  FPImpactThemesAndAreas: any;
  @Input()
  FNSdgs: any;
  @Input()
  FPSdgs: any;
  @Input()
  FNEsg: any;
  @Input()
  FPEsg: any;
  @Input()
  FNFundingType: any;
  @Input()
  FPFundingType: any;

  @Input()
  detailData: any;

  className: string;
  
  PLATFORMID:any=false
  constructor(@Inject(PLATFORM_ID) platformId: any,private eventService: EventService,public store: StorageService,public sanitizer: DomSanitizer,) {
    this.PLATFORMID = isPlatformBrowser(platformId)
  }

  ngOnInit() {
  }
}
