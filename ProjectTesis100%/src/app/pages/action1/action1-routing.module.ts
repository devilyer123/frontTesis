import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Action1Page } from './action1.page';

const routes: Routes = [
  {
    path: '',
    component: Action1Page
  },
  {
    path: 'crear-pedido/:idcli',
    loadChildren: () => import('./crear-pedido/crear-pedido.module').then( m => m.CrearPedidoPageModule)
  },
  {
    path: 'register-client',
    loadChildren: () => import('./register-client/register-client.module').then( m => m.RegisterClientPageModule)
  },
  {
    path: 'orders-client/:idcli',
    loadChildren: () => import('./orders-client/orders-client.module').then( m => m.OrdersClientPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class Action1PageRoutingModule {}
