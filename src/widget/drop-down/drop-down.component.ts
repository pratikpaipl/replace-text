import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
})
export class DropDownComponent implements OnInit {
  isFocus = false;

  displayVal;

  @Input()
  from: string = '';
  @Input()
  customClass: string = '';
  @Input()
  pageType: string = '';
  @Input()
  isSort = false;
  @Input()
  enable:any = 0;
  @Input()
  preSlected: string
  @Input()
  slected: string
  @Input()
  itemList: any = []

  @Input()
  border = "1px solid var(--ion-color-logo-red)"

  @Input()
  radius: any = "50px"

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  constructor(public store: StorageService, public eventService: EventService, public actionSheetController: ActionSheetController) {

  }


  ngOnChanges() {
    const obj = this.itemList.find(x => x.val === this.slected);
      if (obj != undefined){
        this.displayVal =obj.lbl
      }
    }
  ngOnInit() {
    const $this = this

  }

  focusBrand($event) {
    this.isFocus = !this.isFocus;
  }
  unCheckFocus() {
    setTimeout(() => {
      this.isFocus = false;
    }, 200);
  }
  changeSelect(event) {
    this.isFocus = false
    if ((this.preSlected != this.slected) && this.itemList != undefined && this.itemList.length > 0) {
      if(this.from =='sort'){
        this.store.setGetParameter('sort',this.slected)
      }
      this.change.emit(this.slected);
    }
  }
getVal(){
  const obj = this.itemList.find(x => x.val === this.slected);
    if (obj != undefined){
      this.displayVal =obj.lbl
      return this.displayVal
    }
}
  createButtons() {
    let buttons = [];
    for (let i = 0; i < this.itemList.length; i++) {
      let element = this.itemList[i];
      let button = {
        text: element.lbl,
        value: element.val,
        cssClass: this.slected == element.val?'selected_opt':'',
        handler: (item) => {
          if(!this.enable){
            if(this.from =='sort'){
              this.store.setGetParameter('sort',buttons[i].value)
            }      
            this.change.emit(buttons[i].value);
          }
          return true;
        }
      }
      buttons.push(button);
      if(this.enable)
      break;
    }
    return buttons;
  }
  async presentSortSheet() {
    let actionSheet;
    actionSheet = await this.actionSheetController.create({
      header: this.store.getVal('sort_by'),
      cssClass: 'my-custom-class',
      buttons: this.createButtons()
    });
    await actionSheet.present();
  }
}
