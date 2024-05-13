import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { HomePage } from './home-page.page';

const routes: Routes = [
  {
    path: '',
    component:HomePage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [HomePage],schemas:[NO_ERRORS_SCHEMA]
})
export class HomePageModule { }
