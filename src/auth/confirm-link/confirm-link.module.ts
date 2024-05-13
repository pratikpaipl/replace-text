import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { ConfirmLinkPage } from './confirm-link.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmLinkPage,
  }
];

@NgModule({
  imports: [
    SharedModule,FormsModule,
    RouterModule.forChild(routes)  ],
  declarations: [ConfirmLinkPage]
})
export class ConfirmLinkPageModule {}
