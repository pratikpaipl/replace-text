import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
})
export class TextAreaComponent implements ControlValueAccessor {

  
  isFocused:any=false;
  value: string='';

  @Input()
  isCheck:any=false
  @Input()
  checkVar:any=false
  @Input()
  disabled:any=false
  @Input()
  title:any

  @Input()
  maxlength:any

  @Input()
  id:any
  @Input()
  note:any


  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  
  constructor(public store:StorageService){

  }
  
  // ControlValueAccessor methods
  onChange: any = (val) => {
  
  };
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabling if needed
  }

  onInputChange(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
    this.onTouch();
    this.change.emit({inputUpdate:true,value:this.value})
  }
  setTextCursor(){
    this.isFocused=true
  }
  removeTextCursor(){
    this.isFocused=false
  }
}
