import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraphicsProductsPageRoutingModule } from './graphics-products-routing.module';

import { GraphicsProductsPage } from './graphics-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphicsProductsPageRoutingModule
  ],
  declarations: [GraphicsProductsPage]
})
export class GraphicsProductsPageModule {}
