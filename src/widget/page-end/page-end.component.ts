import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'app-page-end',
  templateUrl: './page-end.component.html',
  styleUrls: ['./page-end.component.scss'],
})
export class PageEndComponent implements OnInit {

  @Input()
  type: string;
  @Input()
  msg: string;
  @Input()
  color: string;


  constructor(public store: StorageService) {

  }
  ngOnInit() {
  }
}
