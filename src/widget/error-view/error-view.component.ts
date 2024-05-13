import { Component, OnInit, Input, NgZone, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
declare const getActionsFromMessage
declare var $: any;

@Component({
  selector: 'error-view',
  templateUrl: './error-view.component.html',
  styleUrls: ['./error-view.component.scss'],
})
export class ErrorViewComponent implements OnInit {

  name: any = '';
  email: any = '';

  messageAction: any = [];
  activePage = ''

  @Input()
  isError: any = true;
  @Input()
  isShow: any = true;
  @Input()
  from: string = '';
  @Input()
  actionFrom:any;
  @Input()
  key: string = '';
  @Input()
  loadMsg: string;

  @Input()
  message: string;
  
  @Input()
  dataAction: any = [];
  
  @Input()
  leftKey:any = ''
  @Input()
  leftBtn:any = ''

  @Input()
  nav:any
  
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  
  constructor(public store: StorageService, public eventService: EventService, private zone: NgZone, public router: Router) {
    
    this.eventService.updateLabel$.subscribe((item: any) => {
      this.leftKey = this.leftKey ==''?this.store.appType=='admin'?'go_to_dashboard':'go_to_explore':this.leftKey
      this.leftBtn = this.leftBtn =='' ?this.store.getVal(this.store.appType=='admin'? 'go_to_dashboard':'go_to_explore'):this.leftBtn
      this.leftBtn = (this.leftBtn == undefined)?this.store.getVal(this.leftKey):this.leftBtn
    });

   }

  ngOnInit() {
    this.leftKey = this.leftKey ==''?this.store.appType=='admin'? 'go_to_dashboard':'go_to_explore':this.leftKey
    this.leftBtn = this.leftBtn =='' ?this.store.getVal(this.store.appType=='admin'? 'go_to_dashboard':'go_to_explore'):this.leftBtn
    this.leftBtn = (this.leftBtn == undefined)?this.store.getVal(this.leftKey):this.leftBtn
  }

  ngOnChanges() {

    if (this.message != undefined && this.message.length > 0) {
      this.message = !this.message.includes('@')?this.message.replace(/\+/g, ' '):this.message
    for (let i = 0; i < getActionsFromMessage(this.message).length; i++) {
      const element = getActionsFromMessage(this.message)[i];
      this.messageAction.push(element.replace(/[{}]/g, ''))
    }
   
    for (let i = 0; i < this.messageAction.length; i++) {
      const element = this.messageAction[i];
      var dataApos = 0;
      for (let j = 0; j < this.dataAction.length; j++) {
        if (element == this.dataAction[j].ActionKey) {
          dataApos = j
          break
        }
      }
      this.message = this.store.highlight(this.message, element, this.dataAction[dataApos].Text, this.dataAction[dataApos].FunctionName)
    }
    }
  }
  callAction(event) {    
   
    if(this.actionFrom != undefined && this.actionFrom == 'auth'){
      this.change.emit(event)
    }else{
      if(this.nav !=undefined){
        this.router.navigateByUrl(this.nav, { replaceUrl: true })
      }else{
        if (event == 1) {
          if(this.actionFrom != undefined){
            this.store.Explore()
            setTimeout(() => {            
              this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
            }, 30);
          }else{
            if ((this.from != 'alert' && this.from != 'funding-profile' && this.from != 'confirm-funding-profile-enabler' && this.from != 'fundraise') || !this.isError) {
              this.store.backPage();
            } else if(this.from == 'funding-profile' || this.from == 'confirm-funding-profile-enabler') {
              this.router.navigateByUrl(this.store.navicateUrl, { replaceUrl: true })
            } else if(this.from == 'fundraise') {
              this.router.navigateByUrl(this.store.navicateUrl, { replaceUrl: true })
            } else {
              this.router.navigateByUrl('/' + this.from + '/' + this.key + '/result', { replaceUrl: true })
            }
          }
        }
      }
    }
  }
}
