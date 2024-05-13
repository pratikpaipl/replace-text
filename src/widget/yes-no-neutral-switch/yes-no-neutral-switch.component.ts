// yes-no-neutral-switch.component.ts
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'app-yes-no-neutral-switch',
  templateUrl: './yes-no-neutral-switch.component.html',
  styleUrls: ['./yes-no-neutral-switch.component.scss'],
})
export class YesNoNeutralSwitchComponent {
  @Output() selectionChanged = new EventEmitter<string>();

  @Input()
  isSelected: string = 'remove';

  @Input()
  isDisabled: any=false;
  @Input()
  isView: any=true;

  constructor(public store:StorageService){
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isSelected == undefined?'remove':this.isSelected
  }

  toggleSelection(type) {
    if(!this.isDisabled){
        this.isSelected = type
        // switch (this.isSelected) {
        //   case 'yes':
        //     this.isSelected = 'no';
        //     break;
        //   case 'no':
        //     this.isSelected = 'remove';
        //     break;
        //   default:
        //     this.isSelected = 'yes';
        //     break;
        // }
        this.selectionChanged.emit(this.isSelected);
    }
  }
}
