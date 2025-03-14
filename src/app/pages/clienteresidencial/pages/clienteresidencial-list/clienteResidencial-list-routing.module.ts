import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteResidencialListComponent } from './clienteResidencial-list.component';

const routes: Routes = [
  {
    path: '',
    component:ClienteResidencialListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteResidencialListPageRoutingModule { }
