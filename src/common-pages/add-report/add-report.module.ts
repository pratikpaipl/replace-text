import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { RouterModule, Routes } from '@angular/router';
import { AddReportPage } from './add-report.page';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AddReportPage,
  }
];


@NgModule({
  imports: [
    SharedModule, FormsModule,NgSelectModule,RouterModule.forChild(routes)
  ],
  declarations: [AddReportPage],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class AddReportPageModule { }
