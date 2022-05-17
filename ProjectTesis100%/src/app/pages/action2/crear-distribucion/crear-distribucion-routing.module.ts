import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearDistribucionPage } from './crear-distribucion.page';

const routes: Routes = [
  {
    path: '',
    component: CrearDistribucionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearDistribucionPageRoutingModule {}
