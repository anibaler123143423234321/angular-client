import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromUser from '@app/store/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  // Variables para carga masiva de usuarios ASESOR
  selectedFileAsesor: File | null = null;
  uploadSuccessAsesor$: Observable<boolean>;
  uploadErrorAsesor$: Observable<string | null>;

  // Variables para carga masiva de usuarios BACKOFFICE
  selectedFileBackoffice: File | null = null;
  uploadSuccessBackoffice$: Observable<boolean>;
  uploadErrorBackoffice$: Observable<string | null>;

  constructor(private store: Store) {
    this.uploadSuccessAsesor$ = this.store.select(fromUser.getCargaMasivaAsesorSuccess);
    this.uploadErrorAsesor$ = this.store.select(fromUser.getCargaMasivaAsesorError);

    this.uploadSuccessBackoffice$ = this.store.select(fromUser.getCargaMasivaBackofficeSuccess);
    this.uploadErrorBackoffice$ = this.store.select(fromUser.getCargaMasivaBackofficeError);
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      if (type === 'asesor') {
        this.selectedFileAsesor = file;
      } else if (type === 'backoffice') {
        this.selectedFileBackoffice = file;
      }
    }
  }

  uploadAsesorFile() {
    if (!this.selectedFileAsesor) return;
    this.store.dispatch(new fromUser.CargaMasivaAsesor(this.selectedFileAsesor));
  
    this.uploadSuccessAsesor$.subscribe(success => {
      if (success) {
        setTimeout(() => {
          this.selectedFileAsesor = null;
          (document.querySelector('#asesorFileInput') as HTMLInputElement).value = '';
        }, 3000);
      }
    });
  }
  
  uploadBackofficeFile() {
    if (!this.selectedFileBackoffice) return;
    this.store.dispatch(new fromUser.CargaMasivaBackOffice(this.selectedFileBackoffice));
  
    this.uploadSuccessBackoffice$.subscribe(success => {
      if (success) {
        setTimeout(() => {
          this.selectedFileBackoffice = null;
          (document.querySelector('#backofficeFileInput') as HTMLInputElement).value = '';
        }, 3000);
      }
    });
  }
  
}