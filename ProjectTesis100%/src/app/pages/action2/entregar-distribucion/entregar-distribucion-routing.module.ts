import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntregarDistribucionPage } from './entregar-distribucion.page';

const routes: Routes = [
  {
    path: '',
    component: EntregarDistribucionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntregarDistribucionPageRoutingModule {}
