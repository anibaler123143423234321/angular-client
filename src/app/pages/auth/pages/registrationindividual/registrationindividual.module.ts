import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationIndividualRoutingModule } from './registrationindividual-routing.module';
import { RegistrationIndividualComponent } from './registrationindividual.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '@app/shared/indicators';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    RegistrationIndividualComponent
  ],
  imports: [
    CommonModule,
    RegistrationIndividualRoutingModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    SpinnerModule,
    MatDividerModule,
    MatToolbarModule,
    MatSelectModule

  ]
})
export class RegistrationIndividualModule { }
