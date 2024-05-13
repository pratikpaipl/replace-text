import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { PlansAndPricingPage } from './plans-and-pricing.page';

const routes: Routes = [
  {
    path: '',
    component: PlansAndPricingPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [PlansAndPricingPage]
})
export class PlansAndPricingPageModule { }
