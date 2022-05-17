import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearPedidoPage } from './crear-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: CrearPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearPedidoPageRoutingModule {}
