import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteResidencialListComponent } from './clienteResidencial-list.component';
import { ClienteResidencialListPageRoutingModule } from './clienteResidencial-list-routing.module';
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
import { ExportByDateDialogComponent } from './export-by-date-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SpinnerModule } from "../../../../shared/indicators/spinner/spinner.module";

@NgModule({
  declarations: [ClienteResidencialListComponent, ExportByDateDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    MatIconModule,
    ClienteResidencialListPageRoutingModule,
    StoreModule.forFeature('cliente', clienteReducer),
    EffectsModule.forFeature([ClienteEffects]),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
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
]
})
export class ClienteResidencialListModule { }
