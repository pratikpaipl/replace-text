import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { HowItWorksPage } from './how-it-works-page.page';
const routes: Routes = [
  {
    path: '',
    component:HowItWorksPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [HowItWorksPage],schemas:[NO_ERRORS_SCHEMA]
})
export class HowItWorksPageModule { }
