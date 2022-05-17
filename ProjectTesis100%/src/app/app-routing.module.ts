import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'action1',
    loadChildren: () => import('./pages/action1/action1.module').then( m => m.Action1PageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'action2',
    loadChildren: () => import('./pages/action2/action2.module').then( m => m.Action2PageModule)
  },
  {
    path: 'action3',
    loadChildren: () => import('./pages/action3/action3.module').then( m => m.Action3PageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule),
    //canActivate: [ UsuarioGuard ]
    //canLoad: [ UsuarioGuard ]
  },
  {
    path: 'crear-distribucion',
    loadChildren: () => import('./pages/action2/crear-distribucion/crear-distribucion.module').then( m => m.CrearDistribucionPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
