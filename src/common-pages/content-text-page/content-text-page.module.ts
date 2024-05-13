import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentTextPage } from './content-text-page.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ContentTextPage
  },
];

@NgModule({
  imports: [
    SharedModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [ContentTextPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentTextPageModule { }
