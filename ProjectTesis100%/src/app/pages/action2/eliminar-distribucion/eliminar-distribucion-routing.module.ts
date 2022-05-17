import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliminarDistribucionPage } from './eliminar-distribucion.page';

const routes: Routes = [
  {
    path: '',
    component: EliminarDistribucionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EliminarDistribucionPageRoutingModule {}
