import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../shared/StorageService';
import { EventService } from '../../shared/EventService';


@Component({
  selector: 'common-error',
  templateUrl: 'common-error.page.html',
  styleUrls: ['common-error.page.scss'],
  queries: {
    content: new ViewChild('content')
  }
})
export class CommonError implements OnInit {

  // from = 'product';
  isError = false;
  isShowUp = false;
  title = 'Error Page'
  dataAction: any = []
  loadMsg = ''
  lng: any
  constructor(public store: StorageService, public route: ActivatedRoute, private eventService: EventService, public router: Router) {
    this.lng = this.route.snapshot.paramMap.get('lng')
    var data = JSON.parse(localStorage.getItem('eventContent'));

    if (data != undefined && data != null) {
      this.isError = true;
      this.dataAction =data.data !=undefined && data.data.Actions != undefined ? data.data.Actions : [];
      this.loadMsg = data.message != undefined ? data.message : ''
    } else {
      this.isError = false
      this.store.backPage();
    }

  }
  ngOnInit(): void {
  }
  updateScroll(event) {
    this.isShowUp = event;
  }
  function(event) {
    if (event.detail.scrollTop == 0) {
      this.isShowUp = false;
      return
    } else {
      this.isShowUp = true;
    }
  };
}
