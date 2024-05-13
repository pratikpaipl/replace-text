import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { IntroducePage } from './introduce.page';

const routes: Routes = [
  {
    path: '',
    component: IntroducePage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [IntroducePage]
})
export class IntroducePageModule { }
