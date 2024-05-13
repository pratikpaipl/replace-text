import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AboutPage } from './about-page.page';

const routes: Routes = [
  {
    path: '',
    component:AboutPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [AboutPage],schemas:[NO_ERRORS_SCHEMA]
})
export class AboutPageModule { }
