import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthPage } from './auth.page';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
  }
];

@NgModule({
  imports: [
    SharedModule,FormsModule,NgSelectModule,
    RouterModule.forChild(routes)],
  declarations: [AuthPage]
})
export class AuthPageModule {}
