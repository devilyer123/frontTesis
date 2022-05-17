import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CobrarCreditoPageRoutingModule } from './cobrar-credito-routing.module';

import { CobrarCreditoPage } from './cobrar-credito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CobrarCreditoPageRoutingModule
  ],
  declarations: [CobrarCreditoPage]
})
export class CobrarCreditoPageModule {}
