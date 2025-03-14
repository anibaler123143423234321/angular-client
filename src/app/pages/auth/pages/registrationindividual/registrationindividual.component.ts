import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromUser from '@app/store/user';
import { UserCreate } from '@app/store/user/user.models';

@Component({
  selector: 'app-registrationindividual',
  templateUrl: './registrationindividual.component.html',
  styleUrls: ['./registrationindividual.component.scss'],
})
export class RegistrationIndividualComponent implements OnInit {
  hidePassword = true;

  constructor(private store: Store) {}

  ngOnInit(): void {}

  registrarUsuario(form: NgForm): void {
    if (form.valid) {
      const user: UserCreate = {
        nombre: form.value.nombre,
        apellido: form.value.apellidos,
        username: form.value.username,
        password: form.value.password,
        sede: form.value.sede,
        dni: form.value.dni,
        email: form.value.email || '',
        role: form.value.role && form.value.role.trim() !== '' ? form.value.role : 'ASESOR',
      };
  
      this.store.dispatch(new fromUser.RegisterUser(user));
      form.reset();  // Limpiar los campos del formulario
    }
  }
  
}
