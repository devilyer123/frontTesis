import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateDistributionPageRoutingModule } from './update-distribution-routing.module';

import { UpdateDistributionPage } from './update-distribution.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateDistributionPageRoutingModule
  ],
  declarations: [UpdateDistributionPage]
})
export class UpdateDistributionPageModule {}
