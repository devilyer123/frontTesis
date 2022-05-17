import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Action3Page } from './action3.page';

const routes: Routes = [
  {
    path: '',
    component: Action3Page
  },
  {
    path: 'cobrar-credito/:idsegcre',
    loadChildren: () => import('./cobrar-credito/cobrar-credito.module').then( m => m.CobrarCreditoPageModule)
  },
  {
    path: 'credits-client/:idcli',
    loadChildren: () => import('./credits-client/credits-client.module').then( m => m.CreditsClientPageModule)
  },
  {
    path: 'reports-client/:idcli',
    loadChildren: () => import('./reports-client/reports-client.module').then( m => m.ReportsClientPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Action3PageRoutingModule {}
