import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsPage } from './products.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage
  },
  {
    path: 'register-product',
    loadChildren: () => import('./register-product/register-product.module').then( m => m.RegisterProductPageModule)
  },
  {
    path: 'update-product/:idpro',
    loadChildren: () => import('./update-product/update-product.module').then( m => m.UpdateProductPageModule)
  },
  {
    path: 'graphics-products',
    loadChildren: () => import('./graphics-products/graphics-products.module').then( m => m.GraphicsProductsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
