import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Action3PageRoutingModule } from './action3-routing.module';

import { Action3Page } from './action3.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Action3PageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [Action3Page]
})
export class Action3PageModule {}
