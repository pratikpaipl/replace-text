import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordPage } from './forgot-password.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordPage,
  }
];

@NgModule({
  imports: [
    SharedModule,FormsModule,
    RouterModule.forChild(routes)  ],
  declarations: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {}
