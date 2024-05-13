import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { MsgScreenPage } from './msg-screen.page';

const routes: Routes = [
  {
    path: '',
    component: MsgScreenPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [MsgScreenPage]
})
export class MsgScreenPageModule { }
