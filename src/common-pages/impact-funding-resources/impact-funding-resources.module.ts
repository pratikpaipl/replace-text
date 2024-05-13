import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { ImpactFundingResourcesPage } from './impact-funding-resources.page';

const routes: Routes = [
  {
    path: '',
    component: ImpactFundingResourcesPage,
  }
];
@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [ImpactFundingResourcesPage]
})

export class ImpactFundingResourcesPageModule { }
