import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { UnauthGuard } from '@app/guards/unauth/unauth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canActivate: [UnauthGuard]
  },
  {
    path: 'registration', // 🔹 Debe existir esta ruta
    loadChildren: () => import('./pages/registration/registration.module').then(m => m.RegistrationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'registrationindividual', // 🔹 Debe existir esta ruta
    loadChildren: () => import('./pages/registrationindividual/registrationindividual.module').then(m => m.RegistrationIndividualModule),
    canActivate: [AuthGuard]
  }, 
  {
    path: 'listar', // 🔹 Debe existir esta ruta
    loadChildren: () => import('./pages/user-list/user-list.module').then(m => m.UserListModule),
    canActivate: [AuthGuard]
  }, 
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
