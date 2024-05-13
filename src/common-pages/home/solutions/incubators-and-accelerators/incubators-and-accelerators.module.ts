import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { IncubatorsAndAccelerators } from './incubators-and-accelerators.page';

const routes: Routes = [
  {
    path: '',
    component:IncubatorsAndAccelerators,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [IncubatorsAndAccelerators],
  schemas:[NO_ERRORS_SCHEMA]
})
export class IncubatorsAndAcceleratorsModule { }
