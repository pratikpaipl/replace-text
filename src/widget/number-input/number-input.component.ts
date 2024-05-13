import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {
  value: string;

  @Input()
  maxlength=''
  @Input()
  disabled:any=false

  @Input()
  min:any='1'

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  
  commas = 0;
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
    // console.log('event ',event)
    this.onChange(this.value);
    this.onTouch();
    this.change.emit({inputUpdate:true,value:this.value})
  }
  
  handleKeyUp(e) {
    const num = e.target.value.replace(/,/g, "");
    const formatted = new Intl.NumberFormat().format(num);
    // get total commas in number
    let totalCommas = (formatted.match(/,/g) || []).length;
    var cursor = e.target.selectionStart;    
    if(this.commas > totalCommas) {
      //shift cursor to the left (a comma was removed)
      this.commas--;
      cursor--;
    } else if (this.commas < totalCommas){
      // shift cursor to the right (a comma was added)
      this.commas++;
      cursor++;
    }
    
    this.value = formatted;
    e.target.setSelectionRange(cursor, cursor);
  }

  
}

