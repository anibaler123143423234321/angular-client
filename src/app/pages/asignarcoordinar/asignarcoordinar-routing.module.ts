import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'listar',
    loadChildren: () => import('./pages/obtenercoordinar-list/asignarcoordinar-list.module').then(m=>m.AsignarCoordinadorListModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'obtenerclientesdeasesor',
    loadChildren: () => import('./pages/obtenerclientesdeasesor/obtenerclientesdeasesor.module').then(m=>m.ObtenerclientesdeasesorModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'list'
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignarcoordinarRoutingModule { }
