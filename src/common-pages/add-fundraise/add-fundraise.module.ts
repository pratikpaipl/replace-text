import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AddFundraisePage } from './add-fundraise.page';
import { FormsModule } from '@angular/forms';
import { ExtraSharedModule } from 'src/shared/extra-shared.module';

const routes: Routes = [
  {
    path: '',
    component: AddFundraisePage,
  }
];


@NgModule({
  imports: [
    SharedModule,FormsModule, NgSelectModule,ExtraSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddFundraisePage],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class AddFundraisePageModule { }
