import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as $ from 'jquery'
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.scss'],
})
export class ClassificationComponent implements OnInit {
  checkCnt=3
  moreItem: any = 3;
  // esgMoreItem: any = 1;
  // genderMoreItem: any = 1;

  @Input()
  towLevel: any;
  @Input()
  ImpactThemesAndAreas: any = [];
  @Input()
  title: string='';
  @Input()
  SustainabilityKeywordKey: string;
  @Input()
  prod: any;
  @Input()
  dataType: any;
  @Input()
  pageFrom: string = '';
  @Input()
  from: string = '';
  @Input()
  marginFrom: any;
  @Input()
  Saperator:any =',';
  @Input()
  seeMore:any= false;


  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  constructor(public store: StorageService) {}

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes.seeMore != undefined && changes.seeMore.currentValue){
    //   this.moreItem = this.ImpactThemesAndAreas.length
    // }else{
    //   this.moreItem = this.checkCnt
    // }
  }

  openFilter(){
    this.change.emit({Type:this.dataType,item:this.prod});
  }
  checkShowMore(item) {
    return item != undefined && item.ShowMore != undefined ? item.ShowMore : false
  }
  clickMoreAction(item, type) {
    let indsa = this[type == 'esg' ? 'ESG' :type == 'gender-lens' ? 'GenderLensJson' : 'ImpactThemesAndAreas'].findIndex(v => v.ReferenceKey == item.ReferenceKey)    
    this[type == 'esg' ? 'ESG' :type == 'gender-lens' ? 'GenderLensJson' : 'ImpactThemesAndAreas'][indsa].ShowMore = !this[type == 'esg' ? 'ESG' :type == 'gender-lens' ? 'GenderLensJson' : 'ImpactThemesAndAreas'][indsa].ShowMore
  }
  getLbl(item, type) {
    let len = item != undefined && item['' + type] != undefined ? item['' + type] : ''
    return len
  }
  trimString(string, length) {
    let len = string.length > length ? string.substring(0, length) + '...' : string
    return len;
  }
  viewMore() {
    this.seeMore = !this.seeMore
    if (this.moreItem == this.checkCnt) {
      this.moreItem = this.ImpactThemesAndAreas.length
    } else {
      this.moreItem = this.checkCnt
    }
    this.change.emit({seeMore:this.seeMore});
  }
}
