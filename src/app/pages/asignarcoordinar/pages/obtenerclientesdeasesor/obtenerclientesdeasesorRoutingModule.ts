import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObtenerclientesdeasesorComponent } from './obtenerclientesdeasesor.component';

const routes: Routes = [
  { path: '', component: ObtenerclientesdeasesorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObtenerclientesdeasesorRoutingModule { }
