import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AddInvestor } from './add-investor.page';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AddInvestor,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddInvestor],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class AddInvestorModule { }
