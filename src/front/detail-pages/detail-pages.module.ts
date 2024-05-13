import { SharedModule } from 'src/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailPages } from './detail-pages.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPages,
  }
];

@NgModule({
  imports: [ SharedModule,FormsModule, RouterModule.forChild(routes)],
  declarations: [DetailPages],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailPageModule {}
