import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ViewTeaser } from './view-teaser.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';

const routes: Routes = [
  {
    path: '',
    component: ViewTeaser
  },
];

@NgModule({
  imports: [
    SharedModule,PdfViewerModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [ViewTeaser],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewTeaserModule { }
