import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { FaqPage } from './faq-page.page';

const routes: Routes = [
  {
    path: '',
    component:FaqPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [FaqPage],schemas:[NO_ERRORS_SCHEMA]
})
export class FaqPageModule { }
