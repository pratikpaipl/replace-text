import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'activity-log',
  templateUrl: './activity-log.page.html',
  styleUrls: ['./activity-log.page.scss'],
})
export class ActivityLogPage implements OnInit, OnDestroy {

  @Input()
  selItem: any;
  isShow = false;
  permissions = []
  allTotal = 0;
  keyword = '';
  sort = 'recent';

  pageType = '';
  sdgShow = true;
  countryShow = true;
  impactThemeAreaShow = true;

  from='admin'
  @ViewChild('content') content: any;
  constructor(public modalController: ModalController, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {
    
  }
  async ngOnInit() {
    this.keyword = this.store.getFilterFromUrl('keyword','');
    this.sort = this.store.getFilterFromUrl('sort', 'recent');
    this.pageType = 'activity-log'
  }
  ngOnDestroy() {}
}
