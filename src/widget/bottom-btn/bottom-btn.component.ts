import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'bottom-btn',
  templateUrl: './bottom-btn.component.html',
  styleUrls: ['./bottom-btn.component.scss'],
})
export class BottomBtnComponent implements OnInit {

  @Input()
  styleD: string = "left";
  @Input()
  screen: string = '0';

  @Input()
  leftBtn: string;

  @Input()
  backKey: string = 'back';
  @Input()
  backBtn: string;

  @Input()
  rightBtn: string;

  @Input()
  leftKey: string;

  @Input()
  rightKey: string = 'cancel';

  @Input()
  isBack: any = '';
  @Input()
  isShow: string = '1';
  @Input()
  isReset: string = '';
  @Input()
  direction: string = 'ltr';
  @Input()
  justify: string = 'center';

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public alertController: AlertController, public store: StorageService, public eventService: EventService) {
    this.eventService.updateLabel$.subscribe(async (item: any) => {
      if (this.leftBtn != undefined)
        this.leftBtn = this.store.getVal(this.leftKey)
      else
        this.leftBtn = this.store.getVal('save')
      this.backBtn = this.store.getVal(this.backKey)
      if (this.rightKey != undefined)
        this.rightBtn = this.store.getVal(this.rightKey)
      else
        this.leftBtn = this.store.getVal('cancel')
      if (this.backKey != undefined)
        this.backBtn = this.store.getVal(this.backKey)
      else
        this.backBtn = this.store.getVal('back')
    });
  }

  ngOnInit() {
    if (this.leftBtn == '' || this.leftBtn == undefined) {
      this.leftBtn = this.store.getVal('save')
    }
    if (this.rightBtn == '' || this.rightBtn == undefined) {
      this.rightBtn = this.store.getVal('cancel')
    }
    if (this.backBtn == '' || this.backBtn == undefined) {
      this.backBtn = this.store.getVal('back')
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.leftBtn != undefined)
    this.leftBtn = this.store.getVal(this.leftKey)
  else
    this.leftBtn = this.store.getVal('save')
  this.backBtn = this.store.getVal(this.backKey)
  if (this.rightKey != undefined)
    this.rightBtn = this.store.getVal(this.rightKey)
  else
    this.leftBtn = this.store.getVal('cancel')
  if (this.backKey != undefined)
    this.backBtn = this.store.getVal(this.backKey)
  else
    this.backBtn = this.store.getVal('back')
  }

  async actionCall(type) {
    if (type == 1 || type == 2) {
      this.change.emit(type);
    } else {
      if (this.screen == '1') {
        this.change.emit(type);
      } else {
        const alert = await this.alertController.create({
          message: (this.isReset == '1')?this.store.getVal('reset_changes'):this.store.getVal('unsaved_changes'),
          animated: true,
          cssClass: 'alertCustomCssBtn',
          buttons: [
            {
              text: this.store.getVal('yes'),
              handler: () => {
                if(this.isReset == '1') {
                  this.change.emit(type);
                } else {
                  this.store.backPage();
                }
              }
            },
            {
              text: this.store.getVal('no'),
              role: 'cancel',
              handler: () => {

              }
            }
          ], backdropDismiss: true
        });
        return await alert.present();
      }
    }
  }
}
