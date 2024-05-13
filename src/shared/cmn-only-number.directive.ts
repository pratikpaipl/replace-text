import { Directive,ElementRef,forwardRef,HostListener,Renderer2,} from '@angular/core';
  import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
  
  @Directive({
    selector: '[onlyNumber]',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CmnOnlyNumberDirective),
        multi: true,
      },
    ],
  })
  export class CmnOnlyNumberDirective implements ControlValueAccessor {
    private onChange: (val: string) => void;
    private onTouched: () => void;
    private value: string;
    GROUP_SEPARATOR = ',';
    commas=0
    isBackEv=false
    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
      //this.commas = (this.value !=undefined)?(this.value.match(/,/g) || []).length:0
    }
    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
      const code = event.keyCode? event.keyCode: 0;
      console.log('keydown event => ', code);
      this.isBackEv = (code==8)
    }
  //.target.value
    @HostListener('input', ['$event'])
    onInputChange(event: any) {
      console.log('onInputChange ',event)
      let v = event.target.value
      let curPos = (event.target.selectionStart);
     
      const filteredValue: string = filterValue(v);
      const nValue = filteredValue.substring(0, 11);
      const fval = nValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      this.updateTextInput(fval, this.value !== nValue);

      let totalCommas = (fval.match(/,/g) || []).length;
      if(this.commas > totalCommas) {
        this.commas--;
        curPos =(curPos == -1)?1:curPos--;
      } else if (this.commas < totalCommas){
        this.commas++;
        curPos++;
        if(this.isBackEv)
        curPos = (curPos - this.commas)
      }
        event.target.setSelectionRange(curPos, curPos);
    }
  
    @HostListener('blur')
    onBlur() {
      this.onTouched();
    }
  
    private updateTextInput(value: string, propagateChange: boolean) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
      if (propagateChange) {
        this.onChange(value);
      }
      this.value = value;
    }
  
    // ControlValueAccessor Interface
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }
  
    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }
  
    setDisabledState(isDisabled: boolean): void {
      this.renderer.setProperty(
        this.elementRef.nativeElement,
        'disabled',
        isDisabled
      );
    }
  
    writeValue(value: any): void {
      value = value ? String(value) : '';     
      // value.replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR);
      this.updateTextInput(value, false);
    }
  }
  
  function filterValue(value): string {
    return value.replace(/([^0-9])*/g, '');
    return value.replace(/\B(?=(?:\[^0-9,]{3})+(?!\[^0-9,]))*/g, '');
  }
  