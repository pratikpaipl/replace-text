import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonError } from './common-error.page';

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CommonError,
  }
];
@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [CommonError]
})
export class CommonErrorModule { }
