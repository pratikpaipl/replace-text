import { SharedModule } from 'src/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExplorePage } from './explore.page';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: ExplorePage
  },
];

@NgModule({
  imports: [ SharedModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [ExplorePage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ExplorePageModule {}