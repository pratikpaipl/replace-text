import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'page-header-back',
  templateUrl: './page-header-back.component.html',
  styleUrls: ['./page-header-back.component.scss'],
})
export class PageHeaderBackComponent implements OnInit {

  @Input()
  pageTitle: any = 0

  @Input()
  home: any = false

  @Input()
  isHome: any

  @Input()
  selectedSegment: any = false

  @Input()
  isShow: any = false

  @Input()
  segments: any = []

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public store: StorageService, private menu: MenuController, public router: Router,) {

  }
  ngOnInit() {
  }

  ngOnChanges() {
  }
  selctedTab(event) {
  }
  openMenu() {
    this.change.emit({ openMenu: true })
  }
}

