import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsClientPageRoutingModule } from './reports-client-routing.module';

import { ReportsClientPage } from './reports-client.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsClientPageRoutingModule
  ],
  declarations: [ReportsClientPage]
})
export class ReportsClientPageModule {}
