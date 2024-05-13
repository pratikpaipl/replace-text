import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { InvestmentAdvisorsFundraisers } from './investment-advisors-fundraisers.page';

const routes: Routes = [
  {
    path: '',
    component:InvestmentAdvisorsFundraisers,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [InvestmentAdvisorsFundraisers],
  schemas:[NO_ERRORS_SCHEMA]
})
export class InvestmentAdvisorsFundraisersModule { }
