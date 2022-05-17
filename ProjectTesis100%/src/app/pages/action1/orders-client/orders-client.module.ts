import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersClientPageRoutingModule } from './orders-client-routing.module';

import { OrdersClientPage } from './orders-client.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersClientPageRoutingModule,
    PipesModule
  ],
  declarations: [OrdersClientPage]
})
export class OrdersClientPageModule {}
