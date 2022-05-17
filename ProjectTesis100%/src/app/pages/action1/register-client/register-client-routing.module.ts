import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterClientPage } from './register-client.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterClientPageRoutingModule {}
