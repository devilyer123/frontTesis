import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearPedidoPageRoutingModule } from './crear-pedido-routing.module';

import { CrearPedidoPage } from './crear-pedido.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearPedidoPageRoutingModule,
    PipesModule
  ],
  declarations: [CrearPedidoPage]
})
export class CrearPedidoPageModule {}
