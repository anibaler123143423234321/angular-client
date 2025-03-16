import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as fromClienteActions from '../../store/save/save.actions';
import * as fromClienteSelectors from '../../store/save/save.selectors';
import {
  ClienteConUsuarioDTO,
  ClienteResidencial,
} from '@app/models/backend/clienteresidencial';
import * as fromRoot from '@app/store';
import { Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import * as fromUser from '@app/store/user';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { ExportByDateDialogComponent } from './export-by-date-dialog.component';
import { filter, skip } from 'rxjs/operators';

interface ClientePageResponse {
  clientes: ClienteConUsuarioDTO[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface Filter {
  dniAsesor: string | null;
  nombreAsesor: string | null;
  numeroMovil: string | null;
  fecha: string | null;
}

@Component({
  selector: 'app-cliente-residencial-list',
  templateUrl: './clienteResidencial-list.component.html',
  styleUrls: ['./clienteResidencial-list.component.scss'],
})
export class ClienteResidencialListComponent implements OnInit {
  clientesPage$!: Observable<ClientePageResponse>;
  selectedCliente$!: Observable<ClienteResidencial | null>;
  loading$!: Observable<boolean>;
  user$!: Observable<fromUser.UserResponse>;
  // Variable para controlar el spinner
  exportLoading = false;

  currentPage = 0;
  pageSize = 10;
  selectedAdvisorName!: string;
  filterForm!: FormGroup;
  currentFilters: Filter | null = null;
  modalVisible = false;
  // Agrega estas propiedades al inicio de la clase
  editMode: boolean = false;
  editForm!: FormGroup;

  constructor(
    private store: Store<fromRoot.State>,
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(
      select(fromUser.getUser)
    ) as Observable<fromUser.UserResponse>;

    this.editForm = this.fb.group({
      id: [''],
      campania: [''],
      nombresApellidos: [''],
      nifNie: [''],
      nacionalidad: [''],
      fechaNacimiento: [''],
      genero: [''],
      correoElectronico: [''],
      cuentaBancaria: [''],
      permanencia: [''],
      direccion: [''],
      tipoFibra: [''],
      movilContacto: [''],
      fijoCompania: [''],
      planActual: [''],
      codigoPostal: [''],
      provincia: [''],
      distrito: [''],
      ciudad: [''],
      tipoPlan: [''],
      icc: [''],
      autorizaSeguros: [false],
      autorizaEnergias: [false],
      ventaRealizada: [false],
    });
    
    this.filterForm = this.fb.group({
      dniAsesor: [''],
      nombreAsesor: [''],
      numeroMovil: [''],
      fecha: [''],
    });

    // Carga inicial: se utiliza el endpoint que filtra por la fecha actual
    this.loadClientesPage(this.currentPage, this.pageSize);
    this.loading$ = this.store.pipe(select(fromClienteSelectors.getLoading));
    this.clientesPage$ = this.store.pipe(
      select(fromClienteSelectors.getPaginatedClientes)
    );
    this.selectedCliente$ = this.store.pipe(
      select(fromClienteSelectors.getSelectedCliente)
    );
  }

  loadClientesPage(page: number, size: number): void {
    if (this.currentFilters) {
      this.store.dispatch(
        fromClienteActions.loadClientesFiltrados({
          dniAsesor: this.currentFilters.dniAsesor,
          nombreAsesor: this.currentFilters.nombreAsesor,
          numeroMovil: this.currentFilters.numeroMovil,
          fecha: this.currentFilters.fecha,
          page,
          size,
        })
      );
    } else {
      this.store.dispatch(fromClienteActions.loadClientes({ page, size }));
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadClientesPage(this.currentPage, this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadClientesPage(this.currentPage, this.pageSize);
    }
  }

  goToFirstPage(): void {
    this.currentPage = 0;
    this.loadClientesPage(this.currentPage, this.pageSize);
  }

  goToLastPage(): void {
    this.clientesPage$.pipe(take(1)).subscribe((pageData) => {
      if (pageData.totalPages > 0) {
        this.currentPage = pageData.totalPages - 1;
        this.loadClientesPage(this.currentPage, this.pageSize);
      }
    });
  }

  aplicarFiltros(): void {
    const { dniAsesor, nombreAsesor, numeroMovil, fecha } =
      this.filterForm.value;
    this.currentFilters = {
      dniAsesor: dniAsesor?.trim() || null,
      nombreAsesor: nombreAsesor?.trim() || null,
      numeroMovil: numeroMovil?.trim() || null,
      fecha: fecha ? fecha.toString() : null,
    };
    this.currentPage = 0;
    this.store.dispatch(
      fromClienteActions.loadClientesFiltrados({
        dniAsesor: this.currentFilters.dniAsesor,
        nombreAsesor: this.currentFilters.nombreAsesor,
        numeroMovil: this.currentFilters.numeroMovil,
        fecha: this.currentFilters.fecha,
        page: this.currentPage,
        size: this.pageSize,
      })
    );
  }

  limpiarFiltros(): void {
    this.filterForm.reset();
    this.currentFilters = null;
    this.currentPage = 0;
    this.loadClientesPage(this.currentPage, this.pageSize);
  }

  openDetails(movil: string): void {
    this.clientesPage$.pipe(take(1)).subscribe((pageData) => {
      const foundCliente = pageData.clientes.find(
        (cliente) => cliente.numeroMovil === movil
      );
      if (foundCliente) {
        this.selectedAdvisorName = foundCliente.nombres;
      }
    });
    this.store.dispatch(
      fromClienteActions.loadClienteByMobile({ mobile: movil })
    );
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  downloadAllExcel(): void {
    const url = `${environment.url}api/clientes/exportar-excel-masivo`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => this.downloadFile(blob, 'Clientes_Masivo.xlsx'),
      error: (err) => console.error('Error al descargar Excel masivo', err),
    });
  }

  downloadIndividualExcel(movil: string): void {
    if (!movil) {
      console.error('Número de móvil no definido para la descarga individual.');
      return;
    }
    const url = `${environment.url}api/clientes/exportar-excel-individual/${movil}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => this.downloadFile(blob, `Cliente_${movil}.xlsx`),
      error: (err) => console.error('Error al descargar Excel individual', err),
    });
  }

  private downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Función para abrir el diálogo y exportar Excel por fecha integrando el spinner
  downloadExcelByDate(): void {
    this.exportLoading = true;

    const dialogRef = this.dialog.open(ExportByDateDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((selectedDate: Date | null) => {
      if (selectedDate) {
        const formattedDate = formatDate(selectedDate, 'yyyy-MM-dd', 'en-US');
        const url = `${
          environment.url
        }api/clientes/exportar-excel-por-fecha?fecha=${encodeURIComponent(
          formattedDate
        )}`;

        this.http.get(url, { responseType: 'blob' }).subscribe({
          next: (blob) => {
            this.downloadFile(blob, `Clientes_${formattedDate}.xlsx`);
            // Cerramos el spinner solo cuando el Excel se ha generado exitosamente
            this.exportLoading = false;
          },
          error: (err) => {
            console.error('Error al descargar Excel por fecha', err);
            this.exportLoading = false;
          },
        });
      } else {
        this.exportLoading = false;
      }
    });
  }


  // Activa el modo edición y rellena el formulario con los valores actuales
enableEdit(): void {
  this.editMode = true;
  this.selectedCliente$.pipe(take(1)).subscribe((cliente) => {
    if (cliente) {
      this.editForm.patchValue({
        id: cliente.id,
        campania: cliente.campania,
        nombresApellidos: cliente.nombresApellidos,
        nifNie: cliente.nifNie,
        nacionalidad: cliente.nacionalidad,
        fechaNacimiento: cliente.fechaNacimiento
          ? formatDate(cliente.fechaNacimiento, 'yyyy-MM-dd', 'en-US')
          : '',
        genero: cliente.genero,
        correoElectronico: cliente.correoElectronico,
        cuentaBancaria: cliente.cuentaBancaria,
        permanencia: cliente.permanencia,
        direccion: cliente.direccion,
        tipoFibra: cliente.tipoFibra,
        movilContacto: cliente.movilContacto,
        fijoCompania: cliente.fijoCompania,
        planActual: cliente.planActual,
        codigoPostal: cliente.codigoPostal,
        provincia: cliente.provincia,
        distrito: cliente.distrito,
        ciudad: cliente.ciudad,
        tipoPlan: cliente.tipoPlan,
        icc: cliente.icc,
        autorizaSeguros: cliente.autorizaSeguros,
        autorizaEnergias: cliente.autorizaEnergias,
        ventaRealizada: cliente.ventaRealizada,
      });
    }
  });
}

// Cancela la edición y vuelve a modo lectura
cancelEdit(): void {
  this.editMode = false;
}

// Al guardar, despacha la acción para actualizar vía PUT
// Modify your onUpdateSubmit method to use the loading$ observable
onUpdateSubmit(): void {
  if (this.editForm.valid) {
    const updatedClient: ClienteResidencial = this.editForm.value;
    
    // Dispatch the update action
    this.store.dispatch(
      fromClienteActions.updateClient({
        id: updatedClient.id,
        client: updatedClient
      })
    );
    
    // Use the loading$ observable to detect when the update completes
    const subscription = this.loading$.pipe(
      // Skip the initial loading=true state
      skip(1),
      // Take the next loading state (should be false when update completes)
      take(1)
    ).subscribe(() => {
      // Update completed
      this.editMode = false;
      
      // Refresh the client details
      if (updatedClient.movilContacto) {
        this.store.dispatch(
          fromClienteActions.loadClienteByMobile({
            mobile: updatedClient.movilContacto
          })
        );
      }
      
      // Refresh the list
      this.loadClientesPage(this.currentPage, this.pageSize);
      
      // Clean up
      subscription.unsubscribe();
    });
  }
}

}
