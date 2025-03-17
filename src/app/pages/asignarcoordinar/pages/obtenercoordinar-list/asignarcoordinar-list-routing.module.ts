import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignarcoordinarListComponent } from './asignarcoordinar-list.component';

const routes: Routes = [
  {
    path: '',
    component:AsignarcoordinarListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignarCoordinadorListPageRoutingModule { }
