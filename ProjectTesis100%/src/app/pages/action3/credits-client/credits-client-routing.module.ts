import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditsClientPage } from './credits-client.page';

const routes: Routes = [
  {
    path: '',
    component: CreditsClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditsClientPageRoutingModule {}
