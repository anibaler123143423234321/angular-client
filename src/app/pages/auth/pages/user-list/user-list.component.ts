import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as fromActions from '@app/store/user/user.actions';
import { UserPageResponse } from '@app/store/user/user.models';
import { State } from '@app/store/index';
import {
  getPaginatedUsers,
  getLoadingPage,
  getErrorPage,
  getLoading,
} from '@app/store/user/user.selectors';
import { User } from '@app/models/backend/user';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationIndividualComponent } from '@app/pages/auth/pages/registrationindividual/registrationindividual.component';
import { EditUserDialogComponent } from './EditUserDialogComponent';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  // Observables para la paginación y la búsqueda
  usersPage$: Observable<UserPageResponse | null>;
  loadingPage$: Observable<boolean>;
  errorPage$: Observable<string | null>;
  // Variable para almacenar el rol original antes de editar
  originalRole: string = '';
  // Variables para paginación
  currentPage = 0;
  pageSize = 8;
  loading$!: Observable<boolean | null>;
  // Variable para la búsqueda
  searchTerm = '';
  // Usuario que se está editando
  editingUser: User | null = null;
  // Columnas de la tabla
  displayedColumns: string[] = [
    'nombre',
    'username',
    'sede',
    'email',
    'estado',
    'accion',
  ];

  // Subject para manejar los cambios en el input de búsqueda con debounce
  private searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private store: Store<State>,
    public dialog: MatDialog
  ) {
    this.usersPage$ = this.store.select(getPaginatedUsers);
    this.loadingPage$ = this.store.select(getLoadingPage);
    this.errorPage$ = this.store.select(getErrorPage);
    this.loading$ = this.store.pipe(select(getLoading));
  }

  ngOnInit(): void {
    // Cargamos la primera página sin filtro
    this.loadUsers(this.currentPage, this.pageSize);

    // Suscribimos al subject con debounceTime de 2 segundos
    this.searchSubject.pipe(debounceTime(2000)).subscribe((term: string) => {
      if (term.trim().length === 0) {
        // Si el campo está vacío, reiniciamos la búsqueda cargando la lista completa
        this.currentPage = 0;
        this.loadUsers(this.currentPage, this.pageSize);
      }
    });
  }

  loadUsers(page: number, size: number): void {
    if (this.searchTerm.trim().length === 0) {
      this.store.dispatch(new fromActions.LoadUsersPage(page, size));
    } else {
      this.store.dispatch(new fromActions.SearchUsers(this.searchTerm, page, size));
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadUsers(this.currentPage, this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers(this.currentPage, this.pageSize);
    }
  }

  // Método que se dispara cuando cambia el input de búsqueda
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadUsers(this.currentPage, this.pageSize);
  }

  startEdit(user: User): void {
    this.editingUser = { ...user };
    this.originalRole = user.role ?? '';
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  saveEdit(): void {
    if (this.editingUser) {
      if (this.editingUser.role && this.editingUser.role !== this.originalRole) {
        this.store.dispatch(
          new fromActions.ChangeUserRole(this.editingUser.id, this.editingUser.role)
        );
      }
      this.store.dispatch(
        new fromActions.UpdateUser(this.editingUser.id, this.editingUser)
      );
      this.editingUser = null;
    }
  }

  verUsuario(user: User): void {
    console.log('Ver usuario:', user);
  }

  modificarUsuario(user: User): void {
    const updatedData: Partial<User> = {
      nombre: user.nombre,
      apellido: user.apellido,
      username: user.username,
      telefono: user.telefono,
      email: user.email,
      sede: user.sede,
      role: user.role,
      estado: user.estado,
    };
    this.store.dispatch(new fromActions.UpdateUser(user.id, updatedData));
  }

  eliminarUsuario(user: User): void {
    if (confirm(`¿Está seguro de eliminar al usuario ${user.nombre}?`)) {
      this.store.dispatch(new fromActions.DeleteUser(user.id));
    }
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(RegistrationIndividualComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Diálogo cerrado', result);
      this.loadUsers(this.currentPage, this.pageSize);
    });
  }

  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '600px',
      disableClose: true,
      data: user
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.role && result.role !== user.role) {
          this.store.dispatch(new fromActions.ChangeUserRole(result.id, result.role));
        }
        this.store.dispatch(new fromActions.UpdateUser(result.id, result));
      }
    });
  }
}
