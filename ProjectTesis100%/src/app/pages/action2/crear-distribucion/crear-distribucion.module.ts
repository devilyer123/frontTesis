import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearDistribucionPageRoutingModule } from './crear-distribucion-routing.module';

import { CrearDistribucionPage } from './crear-distribucion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearDistribucionPageRoutingModule
  ],
  declarations: [CrearDistribucionPage]
})
export class CrearDistribucionPageModule {}
