import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss'],
})
export class TotalComponent implements OnInit {
  result: any='result'
  results: any='results'


  @Input()
  pageType: string;
  @Input()
  allTotal: number;
  @Input()
  locationTotal: number;
  @Input()
  brandsTotal: number;
  @Input()
  productsTotal: number;
  @Input()
  stockistTotal: number;
  @Input()
  labelsTotal: number;
  @Input()
  color: number;
  constructor(public store:StorageService) {}
  ngOnInit() {
  }
}
