import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
declare const getActionsFromMessage
declare var $: any;

@Component({
  selector: 'app-empty-list',
  templateUrl: './empty-list.component.html',
  styleUrls: ['./empty-list.component.scss'],
})
export class EmptyListComponent implements OnInit {

  @Input()
  type: string;
  @Input()
  msg: string;
  @Input()
  color: string;
  @Input()
  dataAction: any = [{ActionKey:'contact_us',FunctionName:'Contect'}];
 
  message: string;
  @Input()
  isMessage: string = 'true';

  messageAction: any = [];

  activePage: '';

  public isMenuOpen: boolean = false;
  constructor(public store: StorageService, private zone: NgZone,) {
    const $this = this;
    $(document).on('click', '.actonTg', function () {
      const action = $(this).data('action');
      var href = $this.msg.match(/href="([^"]*)/)[1];
      $this.zone.run(() => {
        if (action == 'contact_us') {
          if(href != undefined && href !='')
          window.open(href)
        }
        
      });
    });
  }
  ngOnChanges() {
    if (this.msg != undefined && this.msg.length > 0) {
      this.msg = !this.msg.includes('@')?this.msg.replace(/\+/g, ' '):this.msg
      for (let i = 0; i < getActionsFromMessage(this.msg).length; i++) {
        const element = getActionsFromMessage(this.msg)[i];
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
        this.message = this.store.highlight(this.msg, element, this.dataAction.length>0? this.store.getVal(this.dataAction[dataApos].ActionKey):'', this.dataAction.length>0?this.dataAction[dataApos].FunctionName != undefined ? this.dataAction[dataApos].FunctionName : '':'')
      }
    }
  }
  ngOnInit() {
  }

  Contect() {
  }

}
