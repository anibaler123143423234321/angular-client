import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'clienteresidencial',
        loadChildren: () => import('./pages/clienteresidencial/clienteResidencialComponent.module').then(m=>m.ClienteResidencialComponentModule)
      },
      {
        path: 'coordinador',
        loadChildren: () => import('./pages/asignarcoordinar/asignarcoordinar.module').then(m=>m.AsignarcoordinarModule)
      },
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthModule)
      },
      {
        path: 'static',
        loadChildren: () => import('./pages/static/static.module').then(m=>m.StaticModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m=>m.HomeModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'static/welcome'
      }
    ]
  },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'static/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
