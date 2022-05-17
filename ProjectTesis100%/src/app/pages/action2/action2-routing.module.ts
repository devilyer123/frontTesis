import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Action2Page } from './action2.page';

const routes: Routes = [
  {
    path: '',
    component: Action2Page
  },
  {
    path: 'crear-distribucion',
    loadChildren: () => import('./crear-distribucion/crear-distribucion.module').then( m => m.CrearDistribucionPageModule)
  },
  {
    path: 'eliminar-distribucion',
    loadChildren: () => import('./eliminar-distribucion/eliminar-distribucion.module').then( m => m.EliminarDistribucionPageModule)
  },
  {
    path: 'entregar-distribucion/:idcli',
    loadChildren: () => import('./entregar-distribucion/entregar-distribucion.module').then( m => m.EntregarDistribucionPageModule)
  },
  {
    path: 'update-distribution/:iddis',
    loadChildren: () => import('./update-distribution/update-distribution.module').then( m => m.UpdateDistributionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Action2PageRoutingModule {}
