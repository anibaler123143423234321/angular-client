import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import * as fromRoot from '../../../../store';
import * as fromUser from '../../../../store/user';
import { User } from '@app/models/backend/user/index';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LocationService } from '@app/services/LocationService';
import { environment } from '@src/environments/environment';
import Swal from 'sweetalert2';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  @ViewChild('clienteForm') clienteForm!: NgForm;

  /* days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months = [
    { id: 1, name: 'Enero' },
    { id: 2, name: 'Febrero' },
    { id: 3, name: 'Marzo' },
    { id: 4, name: 'Abril' },
    { id: 5, name: 'Mayo' },
    { id: 6, name: 'Junio' },
    { id: 7, name: 'Julio' },
    { id: 8, name: 'Agosto' },
    { id: 9, name: 'Septiembre' },
    { id: 10, name: 'Octubre' },
    { id: 11, name: 'Noviembre' },
    { id: 12, name: 'Diciembre' }
  ];
  years: number[] = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
 */
  selectedDay: number | null = null;
  selectedMonth: number | null = null;
  selectedYear: number | null = null;

  isAuthorized: boolean = false;
  
  // Variables para permanencia
  selectedPermanencia: string = '';
  showDatePicker = false;

  // Listados fijos
  tiposFibra: string[] = ['No tiene', '300 Mbps', '600 Mbps', '1 Gbps'];
  operadores: string[] = [
    'Adamo', 'Alemobil', 'Avatel', 'Euskaltel', 'Finetwork', 'Gelpiu', 'Guuk',
    'Hits Mobile', 'Jazztel', 'Lowi', 'Másmóvil', 'Movistar', 'O2', 'Orange',
    'Pepephone', 'R Cable', 'Silbö', 'Simyo', 'Vodafone', 'Yoigo'
  ];

  // Localización
  ccaaList: any[] = [];
  provinciaList: any[] = [];
  municipioList: any[] = [];
  selectedCcaa: number | null = null;
  selectedProvincia: number | string | null = null;
  selectedMunicipio: string = '';

  // Usuario
  user$!: Observable<fromUser.UserResponse>;
  userData!: User | null;

  // Datos del formulario
  formData: {
    clienteResidencial: {
      movilContacto: string;
      campania: string;
      nombresApellidos: string;
      nifNie: string;
      tipoFibra: string;
      permanencia: string;
      promocion: string;
      fechaNacimiento: string;
      genero: string;
      numeroMoviles: string;
      planActual: string;
      codigoPostal: string;
      provincia: string;
      distrito: string;
      ciudad: string;
      direccion: string;
      horaInstalacion: string;
      fijoCompania: string;
      movilesAPortar: string[];
      tipoPlan: string;
      icc: string;
      usuarioId?: number;
      nacionalidad: string;
      correoElectronico: string;
      cuentaBancaria: string;
      autorizaSeguros: boolean;
      autorizaEnergias: boolean;
      ventaRealizada: boolean;
    };
  } = {
    clienteResidencial: {
      movilContacto: '',
      campania: '',
      nombresApellidos: '',
      nifNie: '',
      tipoFibra: '',
      permanencia: '',
      promocion: '',
      fechaNacimiento: '',
      genero: '',
      numeroMoviles: '',
      planActual: '',
      codigoPostal: '',
      provincia: '',
      distrito: '',
      ciudad: '',
      direccion: '',
      horaInstalacion: '',
      fijoCompania: '',
      movilesAPortar: [],
      tipoPlan: '',
      icc: '',
      usuarioId: undefined,
      nacionalidad: '',
      correoElectronico: '',
      cuentaBancaria: '',
      autorizaSeguros: false,
      autorizaEnergias: false,
      ventaRealizada: false,
    },
  };

  constructor(
    private http: HttpClient,
    private store: Store<fromRoot.State>,
    private router: Router,
    private locationService: LocationService,
    private dateAdapter: DateAdapter<any>,
  ) {
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    // Suscribirse a los datos del usuario
    this.user$ = this.store.pipe(select(fromUser.getUser)) as Observable<fromUser.UserResponse>;
    this.user$.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.formData.clienteResidencial.usuarioId = user.id;
      }
    });
  
    // Suscribirse a la autorización
    this.store.pipe(select(fromUser.getIsAuthorized))
      .subscribe((auth) => {
        this.isAuthorized = auth;
      });
  
    // Restaurar datos pendientes del sessionStorage (si existen)
    const pendingData = sessionStorage.getItem('pendingClienteData');
    if (pendingData) {
      try {
        this.formData = JSON.parse(pendingData);
        console.log("Se han restaurado los datos pendientes desde sessionStorage.");
        // Opcional: borrar los datos pendientes después de restaurarlos
        sessionStorage.removeItem('pendingClienteData');
      } catch (error) {
        console.error("Error al restaurar los datos pendientes:", error);
      }
    }
  
    // Cargar listado de CCAA (u otros datos de localización)
    this.locationService.getAllCcaa().subscribe((data) => {
      this.ccaaList = data;
    });
  }
  

  updateDate() {
    if (this.selectedDay && this.selectedMonth && this.selectedYear) {
      const day = this.selectedDay < 10 ? `0${this.selectedDay}` : this.selectedDay;
      const month = this.selectedMonth < 10 ? `0${this.selectedMonth}` : this.selectedMonth;
      this.formData.clienteResidencial.fechaNacimiento = `${this.selectedYear}-${month}-${day}`;
    }
  }

  // Manejo de cambios en localización
  onCcaaChange() {
    if (this.selectedCcaa) {
      this.locationService.getProvinciasByCcaa(this.selectedCcaa).subscribe((data) => {
        this.provinciaList = data;
        this.municipioList = [];
        this.selectedProvincia = null;
        this.selectedMunicipio = '';
        this.formData.clienteResidencial.provincia = '';
        this.formData.clienteResidencial.ciudad = '';
      });
    }
  }

  onProvinciaChange(event: any) {
    const value = event.value;
    if (value === 'otro') {
      this.municipioList = [];
      this.formData.clienteResidencial.provincia = '';
      this.selectedProvincia = 'otro';
      this.selectedMunicipio = '';
      this.formData.clienteResidencial.ciudad = '';
    } else {
      this.locationService.getMunicipiosByProvincia(value).subscribe((municipios) => {
        this.municipioList = municipios;
        this.selectedProvincia = value;
        const provinciaSeleccionada = this.provinciaList.find((p) => p.idProvincia === value);
        if (provinciaSeleccionada) {
          this.formData.clienteResidencial.provincia = provinciaSeleccionada.Provincia;
        }
        this.selectedMunicipio = '';
        this.formData.clienteResidencial.ciudad = '';
      });
    }
  }

  onMunicipioChange(event: any) {
    const value = event.value;
    if (value === 'otro') {
      this.selectedMunicipio = 'otro';
      this.formData.clienteResidencial.ciudad = '';
    } else {
      this.selectedMunicipio = value;
      this.formData.clienteResidencial.ciudad = value;
    }
  }

  // Manejo de permanencia
  onPermanenciaChange(value: string) {
    if (value === '') {
      this.showDatePicker = false;
      return;
    }
    if (this.isDateFormat(value)) {
      return;
    }
    if (value === 'No tiene permanencia') {
      this.showDatePicker = false;
      return;
    }
    if (value === 'si') {
      this.showDatePicker = true;
      this.formData.clienteResidencial.permanencia = '';
    }
  }
  
  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    const month = normalizedMonth.getMonth() + 1;
    const year = normalizedMonth.getFullYear();
    const formatted = (month < 10 ? '0' + month : month) + '/' + year;
    this.selectedPermanencia = formatted;
    this.formData.clienteResidencial.permanencia = formatted;
    this.showDatePicker = false;
    datepicker.close();
  }

  // Manejo de nacionalidad
  onNacionalidadChange(value: string) {
    const nacionalidadOtra = value === 'otra';
    if (nacionalidadOtra) {
      this.formData.clienteResidencial.nacionalidad = '';
    }
  }

  isDateFormat(value: string): boolean {
    return /^\d{2}\/\d{4}$/.test(value);
  }

  // Sign out
  onSignOut(): void {
    localStorage.removeItem('token');
    this.store.dispatch(new fromUser.SignOut());
    this.router.navigate(['/auth/login']);
  }

  isAdmin(): boolean {
    return this.userData?.role === 'ADMIN';
  }

  // Métodos para manejar la lista de móviles a portar
  addMovilAPortar() {
    this.formData.clienteResidencial.movilesAPortar.push('');
  }

  removeMovilAPortar(index: number) {
    this.formData.clienteResidencial.movilesAPortar.splice(index, 1);
  }

  hasMovilesAPortar(): boolean {
    return this.formData.clienteResidencial.movilesAPortar.length > 0;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.charCode || event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validatePaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(clipboardData)) {
      event.preventDefault();
    }
  }

  onMovilInput(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;
    value = value.replace(/\D/g, ''); // Solo números
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    this.formData.clienteResidencial.movilesAPortar[index] = value;
    inputElement.focus();
  }

  onSubmit() {
    const movilesAPortarFiltrados = this.formData.clienteResidencial.movilesAPortar.filter(
      numero => numero.trim() !== ''
    );
  
    const payload = {
      clienteResidencial: {
        ...this.formData.clienteResidencial,
        movilesAPortar: movilesAPortarFiltrados
      },
      usuarioId: this.userData?.id
    };
  
    this.http.post(`${environment.url}api/cliente-promocion`, payload)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Datos enviados correctamente',
            confirmButtonColor: '#3085d6'
          });
          this.resetFormData();
          // Si había datos pendientes almacenados, se borran al confirmar el envío
          sessionStorage.removeItem('pendingClienteData');
        },
        error: (error) => {
          if (error.status === 401) {
            // Guardar los datos actuales en sessionStorage para poder restaurarlos tras login
            sessionStorage.setItem('pendingClienteData', JSON.stringify(this.formData));
            // Remover token y cerrar sesión sin borrar el pendingClienteData
            localStorage.removeItem('token');
            this.store.dispatch(new fromUser.SignOut());
            this.router.navigate(['/auth/login']);
            Swal.fire({
              icon: 'warning',
              title: 'Sesión expirada',
              text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente. Los datos se han guardado y se restaurarán tras el inicio de sesión.',
              confirmButtonColor: '#3085d6'
            });
          } else if (error.status === 500) {
            // Tratamiento similar si se produce un error 500
            sessionStorage.setItem('pendingClienteData', JSON.stringify(this.formData));
            localStorage.removeItem('token');
            this.store.dispatch(new fromUser.SignOut());
            this.router.navigate(['/auth/login']);
            Swal.fire({
              icon: 'warning',
              title: 'Error de servidor',
              text: 'Ocurrió un error en el servidor. Por favor, inicia sesión nuevamente. Los datos se han guardado.',
              confirmButtonColor: '#3085d6'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al enviar los datos',
              confirmButtonColor: '#d33'
            });
          }
        }
      });
  }
  
  
  private resetFormData() {
    this.formData = {
      clienteResidencial: {
        movilContacto: '',
        campania: '',
        nombresApellidos: '',
        nifNie: '',
        tipoFibra: '',
        permanencia: '',
        promocion: '',
        fechaNacimiento: '',
        genero: '',
        numeroMoviles: '',
        planActual: '',
        codigoPostal: '',
        provincia: '',
        distrito: '',
        ciudad: '',
        direccion: '',
        horaInstalacion: '',
        fijoCompania: '',
        movilesAPortar: [],
        tipoPlan: '',
        icc: '',
        usuarioId: undefined,
        nacionalidad: '',
        correoElectronico: '',
        cuentaBancaria: '',
        autorizaSeguros: false,
        autorizaEnergias: false,
        ventaRealizada: false,
      }
    };
    
    if (this.clienteForm) {
      this.clienteForm.resetForm();
    }
  }
 /*  resetForm() {
    const confirmacion = confirm('¿Estás seguro de que deseas reiniciar el formulario?');
    if (confirmacion) {
      this.formData = {
        clienteResidencial: {
          movilContacto: '',
          campania: '',
          nombresApellidos: '',
          nifNie: '',
          tipoFibra: '',
          permanencia: '',
          promocion: '',
          fechaNacimiento: '',
          genero: '',
          numeroMoviles: '',
          planActual: '',
          codigoPostal: '',
          provincia: '',
          distrito: '',
          ciudad: '',
          direccion: '',
          horaInstalacion: '',
          fijoCompania: '',
          movilesAPortar: [''],
          tipoPlan: '',
          icc: '',
          usuarioId: undefined,
          nacionalidad: '',
          correoElectronico: '',
          cuentaBancaria: '',
          autorizaSeguros: false,
          autorizaEnergias: false,
          ventaRealizada: false,
        },
      };
      if (this.clienteForm) {
        this.clienteForm.resetForm();
      }
    }
  } */
}
