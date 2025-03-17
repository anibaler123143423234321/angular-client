import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsignarcoordinarRoutingModule } from './asignarcoordinar-routing.module';
import { AsignarCoordinadorListModule } from './pages/obtenercoordinar-list/asignarcoordinar-list.module';


@NgModule({
  imports: [
    CommonModule,
    AsignarCoordinadorListModule
  ],
  exports: [
    AsignarCoordinadorListModule,
    AsignarcoordinarRoutingModule,
  ]
})
export class AsignarcoordinarModule { }
