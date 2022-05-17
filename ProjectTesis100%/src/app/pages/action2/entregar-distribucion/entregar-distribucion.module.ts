import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntregarDistribucionPageRoutingModule } from './entregar-distribucion-routing.module';

import { EntregarDistribucionPage } from './entregar-distribucion.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntregarDistribucionPageRoutingModule,
    PipesModule
  ],
  declarations: [EntregarDistribucionPage]
})
export class EntregarDistribucionPageModule {}
