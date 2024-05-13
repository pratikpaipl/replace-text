import { SharedModule } from 'src/shared/shared.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonPage } from './common-page.page';

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CommonPage,
  }
];
@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [CommonPage]
})
export class CommonPageModule { }
