import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserListRoutingModule } from './user-list-routing.module';
import { UserListComponent } from './user-list.component';

import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';

// Otros módulos que uses (por ejemplo, FlexLayout, SpinnerModule, etc.)
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '@app/shared/indicators';
import { MatSelectModule } from '@angular/material/select';
import { EditUserDialogComponent } from './EditUserDialogComponent';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    UserListComponent,
    EditUserDialogComponent
  ],
  imports: [
    CommonModule,
    UserListRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    SpinnerModule,
    MatDividerModule,
    MatTableModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSelectModule,
    MatDialogModule
  ]
})
export class UserListModule { }
