import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersClientPage } from './orders-client.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersClientPageRoutingModule {}
