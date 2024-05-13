import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorPage } from './error-page.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ErrorPage
  },
];

@NgModule({
  imports: [
    SharedModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [ErrorPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ErrorPagePageModule { }
