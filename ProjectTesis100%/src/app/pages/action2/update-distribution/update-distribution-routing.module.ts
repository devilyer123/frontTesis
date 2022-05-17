import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateDistributionPage } from './update-distribution.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateDistributionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateDistributionPageRoutingModule {}
