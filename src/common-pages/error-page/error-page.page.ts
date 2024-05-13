import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../shared/EventService';
import { StorageService } from '../../shared/StorageService';
@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.page.html',
  styleUrls: ['./error-page.page.scss'],
})
export class ErrorPage implements OnInit {
  error_404: any = '';
  title: any = '';
  subLabel: any ;
  constructor(public store: StorageService, private eventService: EventService) {
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.error_404 = (this.error_404 == undefined || this.error_404 == '')?this.store.getVal('error_404'):this.error_404;
      this.title = (this.title == undefined || this.title == '')?this.store.getVal('page_not_found'):this.title;   
    });
  }

  ngOnInit() {
    // window.location.replace("#");
    // slice off the remaining '#' in HTML5:    
    // if (typeof window.history.replaceState == 'function') {
    //   history.replaceState({}, '', window.location.href.slice(0, -1));
    // }
    this.error_404 = (this.error_404 == undefined || this.error_404 == '')?this.store.getVal('error_404'):this.error_404;
    this.title = (this.title == undefined || this.title == '')?this.store.getVal('page_not_found'):this.title;
  }
  ngOnDestroy() {
    if(this.subLabel !=undefined)
    this.subLabel.unsubscribe()
  }
}
