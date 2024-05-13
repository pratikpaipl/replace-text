import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'filter-count',
  templateUrl: './filter-count.component.html',
  styleUrls: ['./filter-count.component.scss'],
})
export class FilterCountComponent implements OnInit {

  @Input()
  pageType: string;
  @Input()
  pageFrom: string;

  @Input()
  filteCnt: number;


  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();



  constructor(public store: StorageService) {
  }

  ngOnInit() {
  }

  openFilterView(){
    this.change.emit({filteCnt:this.filteCnt,pageType:this.pageType,pageFrom:this.pageFrom})
  }
}
