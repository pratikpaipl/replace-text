import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { FeaturesPage } from './features-page.page';

const routes: Routes = [
  {
    path: '',
    component:FeaturesPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [FeaturesPage],schemas:[NO_ERRORS_SCHEMA]
})
export class FeaturesPageModule { }
