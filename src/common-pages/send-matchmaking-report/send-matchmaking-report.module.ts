import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { SendMatchmakingReportPage } from './send-matchmaking-report.page';

const routes: Routes = [
  {
    path: '',
    component: SendMatchmakingReportPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [SendMatchmakingReportPage]
})
export class SendMatchmakingReportPageModule { }
