import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ExtraSharedModule } from 'src/shared/extra-shared.module';
import { AddInvestee } from './add-investee.page';

const routes: Routes = [
  {
    path: '',
    component: AddInvestee,
  }
];


@NgModule({
  imports: [
    SharedModule,FormsModule, NgSelectModule,ExtraSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddInvestee],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class AddInvesteeModule { }
