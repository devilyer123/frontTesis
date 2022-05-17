import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CobrarCreditoPage } from './cobrar-credito.page';

const routes: Routes = [
  {
    path: '',
    component: CobrarCreditoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CobrarCreditoPageRoutingModule {}
