import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'data-chip',
  templateUrl: './data-chip.component.html',
  styleUrls: ['./data-chip.component.scss'],
})
export class DataChipComponent implements OnInit {

  @Input()
  isEnabler:any=false
  @Input()
  isInvestor:any=false
  @Input()
  isInvestee:any=false
  @Input()
  isUser:any=false
  @Input()
  isFilterType:any=false
  @Input()
  updateTime:any

  @Input()
  selItem:any
  @Input()
  type:any


  @Input()
  BrandIDs:any=''
  @Input()
  CompanyIDs:any=''

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(public store: StorageService) {
  }

  ngOnInit() {
    localStorage.removeItem('state') 
  }

  ngOnChanges(){
  }
  
  removeFilter(isCall,rmType){
    if(rmType =='all'){
      this.selItem=undefined;
      localStorage.removeItem('fromDetails')
    }
    if(rmType == 'fundaise'){
      this.store.setGetParameter('FN_EnablerSlug','',true)
      this.store.setGetParameter('CompanyName','',true)
      this.store.setGetParameter('ReferenceCode','',true)
      this.selItem.itemData.FN_EnablerSlug = undefined
      this.selItem.itemData.CompanyName = undefined
      this.selItem.itemData.ReferenceCode = undefined
    }
    if(rmType == 'profile'){
      this.store.setGetParameter('FP_EnablerSlug','',true)
      this.store.setGetParameter('ProfileName','',true)
      this.store.setGetParameter('ReferenceCode','',true)
      this.selItem.itemData.FP_EnablerSlug = undefined
      this.selItem.itemData.ProfileName = undefined
      this.selItem.itemData.ReferenceCode = undefined
    }
    if(rmType == 'enablers'){

      this.store.setGetParameter('EnablerSlug','',true)
      this.store.setGetParameter('EnablerName','',true)
      this.store.setGetParameter('extraType','',true)
      this.selItem.itemData.EnablerName = undefined
      this.selItem.itemData.EnablerSlug = undefined
      this.selItem.itemData.extraType = undefined
    }
    if(rmType == 'users'){
      this.selItem.itemData.UserName = undefined
      this.selItem.itemData.UserSlug = undefined
      this.store.setGetParameter('UserSlug','',true)
      this.store.setGetParameter('ContactName','',true)
    }
    if(rmType == 'introduction_requested' || rmType == 'sent_introduction_requested' || rmType == 'receive_introduction_requested'  || rmType == 'introduction_requests_received' || rmType == 'matched' || rmType == 'introductions')
    this.selItem.itemData.EnablerFilterType =''
    this.store.setGetParameter('FilterType','',true)
    this.store.setGetParameter('chipLbl','',true)
    this.change.emit({isCall:isCall, rmType:rmType, selItem:this.selItem})
  }
}
