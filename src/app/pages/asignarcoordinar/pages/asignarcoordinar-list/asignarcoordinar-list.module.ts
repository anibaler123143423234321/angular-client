import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { clienteReducer } from '../../store/save';
import { ClienteEffects } from '../../store/save';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SpinnerModule } from "../../../../shared/indicators/spinner/spinner.module";
import { AsignarCoordinadorListPageRoutingModule } from './asignarcoordinar-list-routing.module';
import { AsignarcoordinarListComponent } from './asignarcoordinar-list.component';

@NgModule({
  declarations: [
    AsignarcoordinarListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    MatIconModule,
    AsignarCoordinadorListPageRoutingModule,
    StoreModule.forFeature('cliente', clienteReducer),
    EffectsModule.forFeature([ClienteEffects]),
    FormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SpinnerModule
  ],
  exports: [
    AsignarcoordinarListComponent
  ]
})
export class AsignarCoordinadorListModule { }
