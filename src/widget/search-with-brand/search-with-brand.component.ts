import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-with-brand.component.html',
  styleUrls: ['./search-with-brand.component.scss'],
})
export class SearchWithBrandComponent implements OnInit {


  @Input()
  isShow: any = false;

  @Input()
  placeholder: string = 'Search';
  @Input()
  keyword: string = '';
  @Input()
  pageType: string;

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(public eventService: EventService, public store: StorageService, public apiService: ApiService, public router: Router, public actionSheetController: ActionSheetController) {

  }

  async ngOnInit() {
    if (this.isShow == 0) {
      this.isShow = false
    }
  }

  ngOnChanges() {

  }
  clearSearch(event) {
    this.store.setGetParameter('keyword','', true)
    this.change.emit({ keyword: '' });
  }
  hideSearch(event) {
  }
  getItems(ev: any) {
    const val = ev.target.value;
    this.onEnter(ev)
  }
  onEnter(event) {
    const val = event.target.value;
    this.callSearch(val);
  }
  openFilter() {
    this.change.emit({ keyword: this.keyword != undefined ? this.keyword : '', filter: 1 });
  }
  callSearch(val) {
    if(val ==undefined)
      val = ''
    this.store.setGetParameter('keyword',val, val.trim() == '')
    this.change.emit({ keyword: val});
  }
}
