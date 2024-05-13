import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { ImpactInvestorClubs } from './impact-investor-clubs.page';

const routes: Routes = [
  {
    path: '',
    component:ImpactInvestorClubs,
  
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [ImpactInvestorClubs],
  schemas:[NO_ERRORS_SCHEMA]
})
export class ImpactInvestorClubsModule { }
