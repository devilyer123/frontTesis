import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { ThousandsPipe } from './thousands.pipe';



@NgModule({
  declarations: [
    FiltroPipe,
    ThousandsPipe
  ],
  exports: [
    FiltroPipe,
    ThousandsPipe
  ]
})
export class PipesModule { }
