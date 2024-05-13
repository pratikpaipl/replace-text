import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'item-cnt',
  templateUrl: './item-cnt.component.html',
  styleUrls: ['./item-cnt.component.scss'],
})
export class ItemCntComponent implements OnInit {


  @Input()
  pageType: string;

  @Input()
  prod: any;

  @Input()
  showSource: string;

  @Input()
  dClass: string = '';


  constructor(public store: StorageService,) {
  }

  ngOnInit() {
  }
}
