import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
})
export class InfiniteScrollComponent implements OnInit {

  @Input()
  items: any = [];
  @Input()
  itemTotal: number;

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  constructor() {

  }

  ngOnInit() {
   
  }

  doInfiniteItems(event) {
    this.change.emit(event)
  }
}
