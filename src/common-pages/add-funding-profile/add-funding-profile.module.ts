import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AddFundingProfilePage } from './add-funding-profile.page';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AddFundingProfilePage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddFundingProfilePage],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class AddFundingProfilePageModule { }
