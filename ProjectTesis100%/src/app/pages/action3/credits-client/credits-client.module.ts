import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditsClientPageRoutingModule } from './credits-client-routing.module';

import { CreditsClientPage } from './credits-client.page';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditsClientPageRoutingModule,
    PipesModule
  ],
  declarations: [CreditsClientPage]
})
export class CreditsClientPageModule {}
