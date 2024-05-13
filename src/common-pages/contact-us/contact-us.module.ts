import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { ContactUsPage } from './contact-us.page';

const routes: Routes = [
  {
    path: '',
    component: ContactUsPage,
  }
];

@NgModule({
  imports: [
    SharedModule, FormsModule,
    RouterModule.forChild(routes)],
  declarations: [ContactUsPage]
})
export class ContactUsPageModule { }
