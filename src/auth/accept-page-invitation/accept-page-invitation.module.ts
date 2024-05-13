import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AcceptInvitationPage } from './accept-page-invitation.page';

const routes: Routes = [
  {
    path: '',
    component: AcceptInvitationPage,
  }
];

@NgModule({
  imports: [
    SharedModule,FormsModule,
    RouterModule.forChild(routes)  ],
  declarations: [AcceptInvitationPage]
})
export class AcceptInvitationPageModule {}
