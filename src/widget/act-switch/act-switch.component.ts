import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'act-switch',
  templateUrl: './act-switch.component.html',
  styleUrls: ['./act-switch.component.scss'],
})
export class ActSwitchComponent implements OnInit {

  @Input()
  type:any;
  @Input()
  IsPartner:any;

  @Input()
  IsActive:any;

  @Input()
  IsEnable:any;

  @Input()
  IsFeatured:any;
  @Input()
  DataStatus:any;
  @Input()
  elementClass:any = false
  prod:any={
    IsActive:undefined,
    IsEnable:undefined,
    IsFeatured:undefined,
    DataStatus:undefined,
  };



  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  isLogin:any=false

  constructor(public store: StorageService,private cookieService: CookieService, public eventService: EventService) {
    this.eventService.updateLabel$.subscribe(async (item: any) => {
    });
  }
  ngOnInit() {

    this.prod.IsActive=this.IsActive
    this.prod.IsEnable=this.IsEnable
    this.prod.IsFeatured=this.IsFeatured
    this.prod.DataStatus=this.DataStatus

    this.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.cookieService.check(environment.cookiesKey)){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      if (datas != undefined && datas.UserData != undefined) {
        this.store.userData = datas
        this.store.IsSystemAdmin = datas.UserData.IsSystemAdmin == 1
        this.store.AdminAccess = datas.UserData.AdminAccess == 1
      }
    }
  }
  changeSwitch(event){
    this.change.emit({IsActive:this.IsActive,IsPartner:this.IsPartner,IsEnable:this.IsEnable,IsFeatured:this.IsFeatured});
  }
  changeStatus(event){
    this.change.emit(this.prod);
  }
}