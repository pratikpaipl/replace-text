import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Input, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
declare const getActionsFromMessage
declare var $: any;

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent implements OnInit {

  name: any = '';
  email: any = '';
  messageAction: any = [];
  activePage = ''

  @Input()
  isMessage: string = 'false';
  @Input()
  isNameUn: any;
  @Input()
  fromClass: any = '';
  @Input()
  styleD: any = 'center';

  @Input()
  message: string = '';
  @Input()
  extraVal: any;
  @Input()
  dataAction: any = [];
  public PLATFORMID: any;
  constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService, public eventService: EventService, private zone: NgZone, public router: Router) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    if(this.PLATFORMID){
      const $this = this; 
    $(document).on('click', '.actonTg', function () {
      const action = $(this).data('action');
      $this.zone.run(() => {
        if (action == 'yes') {
        }
        else if (action == 'no') {
        }

      });
    });
  }
  }

  ngOnInit() {}
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
        this.message = this.store.highlight(this.message, element, this.dataAction.length>0? this.dataAction[dataApos].Text:'', this.dataAction.length>0?this.dataAction[dataApos].FunctionName != undefined ? this.dataAction[dataApos].FunctionName : '':'')
      }
    }
  }
}