import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationIndividualComponent } from './registrationindividual.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationIndividualComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationIndividualRoutingModule { }
