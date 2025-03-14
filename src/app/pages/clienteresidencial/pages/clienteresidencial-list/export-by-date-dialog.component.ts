// export-by-date-dialog.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export-by-date-dialog',
  template: `
    <h2 mat-dialog-title>Exportar por Fecha</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline">
        <mat-label>Seleccione una fecha</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker startView="month"></mat-datepicker>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onExport()" [disabled]="!selectedDate">
        Exportar
      </button>
    </mat-dialog-actions>
  `
})
export class ExportByDateDialogComponent {
  selectedDate: Date | null = null;

  constructor(private dialogRef: MatDialogRef<ExportByDateDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onExport(): void {
    // Cierra el diálogo y retorna la fecha seleccionada
    if (this.selectedDate) {
      this.dialogRef.close(this.selectedDate);
    }
  }
}
