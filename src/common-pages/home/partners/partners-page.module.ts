import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { PartnersPage } from './partners-page.page';

const routes: Routes = [
  {
    path: '',
    component:PartnersPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [PartnersPage],schemas:[NO_ERRORS_SCHEMA]
})
export class PartnersPageModule { }
