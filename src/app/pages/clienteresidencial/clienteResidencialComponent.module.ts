import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteResidencialListModule } from './pages/clienteresidencial-list/clienteResidencial-list.module';
import { ClienteResidencialRoutingModule } from './clienteResidencialComponent-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ClienteResidencialListModule 
  ],
  exports: [
    ClienteResidencialListModule,
    ClienteResidencialRoutingModule
  ]
})
export class ClienteResidencialComponentModule { }
