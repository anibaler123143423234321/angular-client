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

// Interfaz para la respuesta genérica
interface GenericResponse<T> {
  rpta: number;  // 1 para éxito, 0 para error
  msg: string;   // Mensaje de respuesta
  data: T;       // Datos de respuesta
}

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
        return this.httpClient.put<GenericResponse<UserResponse>>(url, action.user).pipe(
          tap((response) => {
            if (response.rpta === 1) {
              this.notification.success(response.msg || 'Usuario actualizado exitosamente');
            } else {
              this.notification.error(response.msg || 'Error al actualizar usuario');
            }
          }),
          map((response) => {
            if (response.rpta === 1) {
              return new fromActions.UpdateUserSuccess(response.data);
            } else {
              return new fromActions.UpdateUserError(response.msg);
            }
          }),
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

  // Efecto para eliminar usuario (soft delete)
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
        return this.httpClient.delete<GenericResponse<string>>(url).pipe(
          tap((response) => {
            if (response.rpta === 1) {
              this.notification.success(response.msg || 'Usuario eliminado exitosamente');
            } else {
              this.notification.error(response.msg || 'Error al eliminar usuario');
            }
          }),
          map((response) => {
            if (response.rpta === 1) {
              return new fromActions.DeleteUserSuccess(action.id);
            } else {
              return new fromActions.DeleteUserError(response.msg);
            }
          }),
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
      return this.httpClient.get(url, { responseType: 'text' }).pipe(
        tap((responseText: string) =>
          console.log('Respuesta del servidor:', responseText)
        ),
        map((responseText: string) => {
          let response: GenericResponse<UserPageResponse>;
          try {
            response = JSON.parse(responseText);
          } catch (e) {
            this.notification.error('Error al parsear la respuesta del servidor.');
            throw new Error('Error al parsear la respuesta del servidor.');
          }
          if (response.rpta === 1) {
            return new fromActions.LoadUsersPageSuccess(response.data);
          } else {
            this.notification.error(response.msg || 'Error al cargar usuarios');
            return new fromActions.LoadUsersPageError(response.msg);
          }
        }),
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
        return this.httpClient.get<GenericResponse<UserPageResponse>>(url).pipe(
          map((response) => {
            if (response.rpta === 1) {
              return new fromActions.SearchUsersSuccess(response.data);
            } else {
              this.notification.error(response.msg || 'Error al buscar usuarios');
              return new fromActions.SearchUsersError(response.msg);
            }
          }),
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
      map((action: fromActions.SignInEmail) => action.credentials),
      switchMap((credentials) =>
        this.httpClient
          .post<GenericResponse<UserResponse>>(
            `${environment.url}api/authentication/sign-in`,
            credentials
          )
          .pipe(
            tap((response) => {
              if (response.rpta === 1) {
                localStorage.setItem('token', response.data.token);
                const userRole = response.data.role
                  ? response.data.role.trim().toUpperCase()
                  : '';
                
                // Manejo de redirección según el rol
                switch (userRole) {
                  case 'BACKOFFICE':
                    this.router.navigate(['/clienteresidencial/listar']);
                    break;
                  case 'COORDINADOR':
                    this.router.navigate(['/clienteresidencial/listar']);
                    break;
                  case 'ASESOR':
                    this.router.navigate(['/']);
                    break;
                  case 'ADMIN':
                    this.router.navigate(['/home']);
                    break;
                  default:
                    this.router.navigate(['/']);
                    break;
                }
              } else {
                this.notification.error(response.msg || 'Credenciales incorrectas');
              }
            }),
            map((response) => {
              if (response.rpta === 1) {
                return new fromActions.SignInEmailSuccess(
                  response.data.username,
                  response.data || null
                );
              } else {
                return new fromActions.SignInEmailError(response.msg);
              }
            }),
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
  
        return this.httpClient.post<GenericResponse<UserResponse>>(
          `${environment.url}api/user/registrar`, 
          action.user
        ).pipe(
          tap((response) => {
            if (response.rpta === 1) {
              this.notification.success(response.msg || 'Usuario registrado exitosamente.');
              this.store.dispatch(new fromActions.Init());
            } else {
              this.notification.error(response.msg || 'Error al registrar el usuario.');
            }
          }),
          map((response) => {
            if (response.rpta === 1) {
              return new fromActions.RegisterUserSuccess(response.data);
            } else {
              return new fromActions.RegisterUserError(response.msg);
            }
          }),
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
          return this.httpClient.get<GenericResponse<UserResponse>>(
            `${environment.url}api/user`
          ).pipe(
            tap((response) => {
              if (response.rpta === 1) {
                localStorage.setItem('user', JSON.stringify(response.data));
                this.GeneralService.usuario$ = response.data;
              }
            }),
            map((response) => {
              if (response.rpta === 1) {
                return new fromActions.InitAuthorized(response.data.username, response.data || null);
              } else {
                localStorage.clear();
                return new fromActions.InitUnauthorized();
              }
            }),
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
          .post<GenericResponse<string>>(
            `${environment.url}api/user/crear-masivo`, 
            formData
          )
          .pipe(
            tap((response) => {
              if (response.rpta === 1) {
                this.notification.success(response.msg || 'Usuarios ASESOR creados exitosamente');
              } else {
                this.notification.error(response.msg || 'Error al subir archivo para usuarios ASESOR');
              }
            }),
            map((response) => {
              if (response.rpta === 1) {
                return new fromActions.CargaMasivaAsesorSuccess(response.data);
              } else {
                return new fromActions.CargaMasivaAsesorError(response.msg);
              }
            }),
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
        .post<GenericResponse<string>>(
          `${environment.url}api/user/crear-masivo-backoffice`, 
          formData
        )
        .pipe(
          tap((response) => {
            if (response.rpta === 1) {
              this.notification.success(response.msg || 'Usuarios BACKOFFICE creados exitosamente');
            } else {
              this.notification.error(response.msg || 'Error al subir archivo para usuarios BACKOFFICE');
            }
          }),
          map((response) => {
            if (response.rpta === 1) {
              return new fromActions.CargaMasivaBackOfficeSuccess(response.data);
            } else {
              return new fromActions.CargaMasivaBackOfficeError(response.msg);
            }
          }),
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
        return this.httpClient.put<GenericResponse<string>>(url, null).pipe(
          tap((response) => {
            if (response.rpta === 1) {
              this.notification.success(response.msg || 'Rol actualizado correctamente');
            } else {
              this.notification.error(response.msg || 'Error al actualizar el rol');
            }
          }),
          map((response) => {
            if (response.rpta === 1) {
              return new fromActions.ChangeUserRoleSuccess(action.userId, action.role);
            } else {
              return new fromActions.ChangeUserRoleError(response.msg);
            }
          }),
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