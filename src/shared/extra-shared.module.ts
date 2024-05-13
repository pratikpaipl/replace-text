import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, forwardRef } from '@angular/core';
import { SharedModule } from './shared.module';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { OnlyNumberDirective } from './only-number.directive';


@NgModule({
  //
  declarations: [OnlyNumberDirective],
  imports: [SharedModule,FormsModule, ReactiveFormsModule],
//AddFundraisePage,AddFundingProfilePage
  exports: [],
  providers: [
    {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OnlyNumberDirective),  // replace name as appropriate
    multi: true
  }
],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class ExtraSharedModule { }
