import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { environment } from '@src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import * as fromActions from './user.actions';
import { UserResponse } from './user.models';
import { UserPageResponse } from './user.models';
import { GeneralService } from '@app/services/general.service';
import { Store } from '@ngrx/store';

type Action = fromActions.All;

@Injectable()
export class UserEffects {
  constructor(
    private actions: Actions,
    private router: Router,
    private httpClient: HttpClient,
    private notification: NotificationService,
    public GeneralService: GeneralService,
    private store: Store
  ) {}

  private handleTokenExpiration(err: any): boolean {
    if (err.error?.error === 'TOKEN_EXPIRADO' || err.status === 401) {
      localStorage.clear();
      this.router.navigate(['/auth/login']);
      this.notification.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
      location.reload(); // Force page reload
      return true;
    }
    return false;
  }

  // Efecto para actualizar usuario
  updateUser$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.UPDATE_USER),
      switchMap((action: fromActions.UpdateUser) => {
        const token = localStorage.getItem('token');
        if (!token) {
          this.router.navigate(['/auth/login']);
          return of(new fromActions.UpdateUserError('No hay sesión activa'));
        }
  
        const url = `${environment.url}api/user/${action.id}`;
        return this.httpClient.put<UserResponse>(url, action.user).pipe(
          tap(() => this.notification.success('Usuario actualizado exitosamente')),
          map((updatedUser) => new fromActions.UpdateUserSuccess(updatedUser)),
          catchError((err) => {
            if (this.handleTokenExpiration(err)) {
              return of(new fromActions.InitUnauthorized());
            }
            this.notification.error('Error al actualizar usuario');
            return of(new fromActions.UpdateUserError(err.message));
          })
        );
      })
    )
  );

  // Efecto para eliminar usuario (hard delete)
  deleteUser$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.DELETE_USER),
      switchMap((action: fromActions.DeleteUser) => {
        const token = localStorage.getItem('token');
        if (!token) {
          this.router.navigate(['/auth/login']);
          return of(new fromActions.DeleteUserError('No hay sesión activa'));
        }
  
        const url = `${environment.url}api/user/soft/${action.id}`;
        return this.httpClient.delete(url, { responseType: 'text' }).pipe(
          tap(() => this.notification.success('Usuario eliminado exitosamente')),
          map(() => new fromActions.DeleteUserSuccess(action.id)),
          catchError((err) => {
            if (this.handleTokenExpiration(err)) {
              return of(new fromActions.InitUnauthorized());
            }
            this.notification.error('Error al eliminar usuario');
            return of(new fromActions.DeleteUserError(err.message));
          })
        );
      })
    )
  );
  


  // Efecto para listar usuarios paginados
  loadUsersPage: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.LOAD_USERS_PAGE),
      switchMap((action: fromActions.LoadUsersPage) => {
        const token = localStorage.getItem('token');
        if (!token) {
          this.router.navigate(['/auth/login']);
          return of(new fromActions.LoadUsersPageError('No hay sesión activa'));
        }
  
        const url = `${environment.url}api/user/listar?page=${action.page}&size=${action.size}`;
        return this.httpClient.get<UserPageResponse>(url).pipe(
          map((response) => new fromActions.LoadUsersPageSuccess(response)),
          catchError((err) => {
            if (this.handleTokenExpiration(err)) {
              return of(new fromActions.InitUnauthorized());
            }
            this.notification.error('Error al cargar usuarios');
            return of(new fromActions.LoadUsersPageError(err.message));
          })
        );
      })
    )
  );

  // Efecto para buscar usuarios (búsqueda genérica)
  searchUsers$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SEARCH_USERS),
      switchMap((action: fromActions.SearchUsers) => {
        const token = localStorage.getItem('token');
        if (!token) {
          this.router.navigate(['/auth/login']);
          return of(new fromActions.SearchUsersError('No hay sesión activa'));
        }
  
        const url = `${environment.url}api/user/buscar?query=${action.query}&page=${action.page}&size=${action.size}`;
        return this.httpClient.get<UserPageResponse>(url).pipe(
          map((response: UserPageResponse) => new fromActions.SearchUsersSuccess(response)),
          catchError((err) => {
            if (this.handleTokenExpiration(err)) {
              return of(new fromActions.InitUnauthorized());
            }
            this.notification.error('Error al buscar usuarios');
            return of(new fromActions.SearchUsersError(err.message));
          })
        );
      })
    )
  );

  // Efecto para iniciar sesión con username y password
  signInEmail: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SIGIN_IN_EMAIL),
      // Aquí se extrae el objeto de credenciales que ahora contendrá username y password
      map((action: fromActions.SignInEmail) => action.credentials),
      switchMap((credentials) =>
        this.httpClient
          .post<UserResponse>(
            `${environment.url}api/authentication/sign-in`,
            credentials
          )
          .pipe(
            tap((response: UserResponse) => {
              localStorage.setItem('token', response.token);
              const userRole = response.role
                ? response.role.trim().toUpperCase()
                : '';
              if (userRole === 'BACKOFFICE') {
                // Si es backoffice, redirige a listar
                this.router.navigate(['/clienteresidencial/listar']);
              } else {
                // Para ADMIN u otros roles, redirige a la ruta por defecto
                this.router.navigate(['/']);
              }
            }),
            // Se actualiza para utilizar response.username en lugar de response.email
            map(
              (response: UserResponse) =>
                new fromActions.SignInEmailSuccess(
                  response.username,
                  response || null
                )
            ),
            catchError((err) => {
              this.notification.error('Credenciales incorrectas');
              return of(new fromActions.SignInEmailError(err.message));
            })
          )
      )
    )
  );

  registerUser$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.REGISTER_USER),
      switchMap((action: fromActions.RegisterUser) => {
        const token = localStorage.getItem('token');
        if (!token) {
          this.router.navigate(['/auth/login']);
          return of(new fromActions.RegisterUserError('No hay sesión activa'));
        }
  
        return this.httpClient.post<UserResponse>(`${environment.url}api/user/registrar`, action.user)
          .pipe(
            tap(() => {
              this.notification.success('Usuario registrado exitosamente.');
              this.store.dispatch(new fromActions.Init());
            }),
            map((user: UserResponse) => new fromActions.RegisterUserSuccess(user)),
            catchError((err) => {
              if (this.handleTokenExpiration(err)) {
                return of(new fromActions.InitUnauthorized());
              }
              this.notification.error('Error al registrar el usuario.');
              return of(new fromActions.RegisterUserError(err.message));
            })
          );
      })
    )
  );

 // Efecto para inicializar usuario (Init)
 init: Observable<Action> = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.Types.INIT),
    switchMap(async () => localStorage.getItem('token')),
    switchMap((token) => {
      if (token) {
        return this.httpClient.get<UserResponse>(`${environment.url}api/user`).pipe(
          tap((user: UserResponse) => {
            localStorage.setItem('user', JSON.stringify(user));
            this.GeneralService.usuario$ = user;
          }),
          map((user: UserResponse) =>
            new fromActions.InitAuthorized(user.username, user || null)
          ),
          catchError((err) => {
            if (err.error?.error === 'TOKEN_EXPIRADO' || err.status === 401) {
              localStorage.clear();
              this.router.navigate(['/auth/login']);
              this.notification.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
            }
            return of(new fromActions.InitUnauthorized());
          })
        );
      } else {
        return of(new fromActions.InitUnauthorized());
      }
    })
  )
);


// Efecto para carga masiva de ASESOR
cargaMasivaAsesor$: Observable<Action> = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.Types.CARGA_MASIVA_ASESOR),
    switchMap((action: fromActions.CargaMasivaAsesor) => {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/auth/login']);
        return of(new fromActions.CargaMasivaAsesorError('No hay sesión activa'));
      }

      const formData = new FormData();
      formData.append('file', action.file);

      return this.httpClient
        .post(`${environment.url}api/user/crear-masivo`, formData, {
          responseType: 'text',
        })
        .pipe(
          tap(() => this.notification.success('Usuarios ASESOR creados exitosamente')),
          map((response) => new fromActions.CargaMasivaAsesorSuccess(response)),
          catchError((err) => {
            if (this.handleTokenExpiration(err)) {
              return of(new fromActions.InitUnauthorized());
            }
            this.notification.error('Error al subir archivo para usuarios ASESOR');
            return of(new fromActions.CargaMasivaAsesorError(err.message));
          })
        );
    })
  )
);

// Efecto para carga masiva de BACKOFFICE
cargaMasivaBackoffice$: Observable<Action> = createEffect(() =>
  this.actions.pipe(
    ofType(fromActions.Types.CARGA_MASIVA_BACKOFFICE),
    switchMap((action: fromActions.CargaMasivaBackOffice) => {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/auth/login']);
        return of(new fromActions.CargaMasivaBackOfficeError('No hay sesión activa'));
      }

      const formData = new FormData();
      formData.append('file', action.file);

      return this.httpClient
        .post(`${environment.url}api/user/crear-masivo-backoffice`, formData, {
          responseType: 'text',
        })
        .pipe(
          tap(() => this.notification.success('Usuarios BACKOFFICE creados exitosamente')),
          map((response) => new fromActions.CargaMasivaBackOfficeSuccess(response)),
          catchError((err) => {
            if (this.handleTokenExpiration(err)) {
              return of(new fromActions.InitUnauthorized());
            }
            this.notification.error('Error al subir archivo para usuarios BACKOFFICE');
            return of(new fromActions.CargaMasivaBackOfficeError(err.message));
          })
        );
    })
  )
);


  // Efecto para cambiar el rol de un usuario
  changeUserRole$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.CHANGE_USER_ROLE),
      switchMap((action: fromActions.ChangeUserRole) => {
        const token = localStorage.getItem('token');
        if (!token) {
          this.router.navigate(['/auth/login']);
          return of(new fromActions.ChangeUserRoleError('No hay sesión activa'));
        }
  
        const url = `${environment.url}api/user/change/${action.role}/${action.userId}`;
        return this.httpClient.put(url, null, { responseType: 'text' }).pipe(
          tap(() => this.notification.success('Rol actualizado correctamente')),
          map(() => new fromActions.ChangeUserRoleSuccess(action.userId, action.role)),
          catchError((err) => {
            if (this.handleTokenExpiration(err)) {
              return of(new fromActions.InitUnauthorized());
            }
            this.notification.error('Error al actualizar el rol');
            return of(new fromActions.ChangeUserRoleError(err.message));
          })
        );
      })
    )
  );
  

}
