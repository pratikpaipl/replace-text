import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

export interface Email {
  UserEmail: string;

}

@Component({
  selector: 'email-input-chip',
  templateUrl: './email-input-chip.component.html',
  styleUrls: ['./email-input-chip.component.scss'],
})
export class EmailInputChipComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  emailErr: any = '';
  regEmail: any =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Input()
  emails: Email[] = [];

  @Input()
  isInclude: any = false
  @Input()
  email: any = ''

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(public store: StorageService) {}

  ngOnInit() {  
    
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (this.store.checkMail(value)) {
        this.emailErr = this.store.getVal('please_enter_valid_email');
      } else {
        this.emailErr = '';
        let emil = value.trim()
        const index = this.emails.findIndex(e => e.UserEmail == emil);
        if(index == -1){
          this.emails.push({ UserEmail: value.trim() });
        }
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    if(this.isInclude){
      this.change.emit({emails:this.emails})
    }else{
      this.change.emit({emails:[]})
    }
  }
  remove(email: Email): void {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

}
