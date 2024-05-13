import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { ComposeMailPage } from './compose-mail.page';

const routes: Routes = [
  {
    path: '',
    component: ComposeMailPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [ComposeMailPage]
})
export class ComposeMailPageModule { }
