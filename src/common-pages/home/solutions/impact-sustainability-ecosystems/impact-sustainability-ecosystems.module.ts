import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { ImpactSustainabilityEcosystemsClubs } from './impact-sustainability-ecosystems.page';

const routes: Routes = [
  {
    path: '',
    component:ImpactSustainabilityEcosystemsClubs,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [ImpactSustainabilityEcosystemsClubs],
  schemas:[NO_ERRORS_SCHEMA]
})
export class ImpactSustainabilityEcosystemsClubsModule { }
