import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EliminarDistribucionPageRoutingModule } from './eliminar-distribucion-routing.module';

import { EliminarDistribucionPage } from './eliminar-distribucion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EliminarDistribucionPageRoutingModule
  ],
  declarations: [EliminarDistribucionPage]
})
export class EliminarDistribucionPageModule {}
