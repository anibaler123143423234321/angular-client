import { Action } from '@ngrx/store';
import {
  /* EmailPasswordCredentials */
  UsernamePasswordCredentials,
  UserResponse,
  UserPageResponse,
  UserCreate,
} from './user.models';
import { User } from '@app/models/backend';

export enum Types {
  INIT = '[User] Init: Start',
  INIT_AUTHORIZED = '[User] Init:Authorized',
  INIT_UNAUTHORIZED = '[User] Init: Unuthorized',
  INIT_ERROR = '[User] Init: Error',

  SIGIN_IN_EMAIL = '[User] Login: Start',
  SIGIN_IN_EMAIL_SUCCESS = '[User] Login: Success',
  SIGIN_IN_EMAIL_ERROR = '[User] Login: Error',

  REGISTER_USER = '[User] Register User',
  REGISTER_USER_SUCCESS = '[User] Register User Success',
  REGISTER_USER_ERROR = '[User] Register User Error',

  SIGN_OUT_EMAIL = '[User] Logout: Start',
  SIGIN_OUT_EMAIL_SUCCESS = '[User] Logout: Success',
  SIGIN_OUT_EMAIL_ERROR = '[User] Logout: Error',

  CARGA_MASIVA_ASESOR = '[User] Carga Masiva Usuarios ASESOR',
  CARGA_MASIVA_ASESOR_SUCCESS = '[User] Carga Masiva Usuarios ASESOR Success',
  CARGA_MASIVA_ASESOR_ERROR = '[User] Carga Masiva Usuarios ASESOR Error',

  CARGA_MASIVA_BACKOFFICE = '[User] Carga Masiva Usuarios BACKOFFICE',
  CARGA_MASIVA_BACKOFFICE_SUCCESS = '[User] Carga Masiva Usuarios BACKOFFICE Success',
  CARGA_MASIVA_BACKOFFICE_ERROR = '[User] Carga Masiva Usuarios BACKOFFICE Error',

  LOAD_USERS_PAGE = '[UserPageResponse] Load Users Page',
  LOAD_USERS_PAGE_SUCCESS = '[UserPageResponse] Load Users Page Success',
  LOAD_USERS_PAGE_ERROR = '[UserPageResponse] Load Users Page Error',

  // BÚSQUEDA GENÉRICA (por cualquier atributo)
  SEARCH_USERS = '[User] Search Users',
  SEARCH_USERS_SUCCESS = '[User] Search Users Success',
  SEARCH_USERS_ERROR = '[User] Search Users Error',

  UPDATE_USER = '[User] Update User',
  UPDATE_USER_SUCCESS = '[User] Update User Success',
  UPDATE_USER_ERROR = '[User] Update User Error',

  // Delete (Soft Delete) User
  DELETE_USER = '[User] Delete User',
  DELETE_USER_SUCCESS = '[User] Delete User Success',
  DELETE_USER_ERROR = '[User] Delete User Error',

  CHANGE_USER_ROLE = '[User] Change Role',
  CHANGE_USER_ROLE_SUCCESS = '[User] Change Role Success',
  CHANGE_USER_ROLE_ERROR = '[User] Change Role Error'
}


//INIT -> EL USUARIO ESTA EN SESION?
export class Init implements Action {
  readonly type = Types.INIT;
  constructor() {}
}

export class InitAuthorized implements Action {
  readonly type = Types.INIT_AUTHORIZED;
  constructor(public username: string, public user: UserResponse | null) {}
}

export class InitUnauthorized implements Action {
  readonly type = Types.INIT_UNAUTHORIZED;
  constructor() {}
}

export class InitError implements Action {
  readonly type = Types.INIT_ERROR;
  constructor(public error: string) {}
}

//LOGIN
export class SignInEmail implements Action {
  readonly type = Types.SIGIN_IN_EMAIL;
  constructor(public credentials: UsernamePasswordCredentials) {}
}

export class SignInEmailSuccess implements Action {
  readonly type = Types.SIGIN_IN_EMAIL_SUCCESS;
  constructor(public email: string, public user: UserResponse) {}
}

export class SignInEmailError implements Action {
  readonly type = Types.SIGIN_IN_EMAIL_ERROR;
  constructor(public error: string) {}
}

//SignUP o Registro de Usuarios

// SignUP o Registro de Usuarios
export class RegisterUser implements Action {
  readonly type = Types.REGISTER_USER;
  constructor(public user: UserCreate) {}  // Ahora recibe un objeto sin id y token
}


export class RegisterUserSuccess implements Action {
  readonly type = Types.REGISTER_USER_SUCCESS;
  constructor(public user: UserResponse) {}
}

export class RegisterUserError implements Action {
  readonly type = Types.REGISTER_USER_ERROR;
  constructor(public error: string) {}
}


//Salir de sesion o Logout

export class SignOut implements Action {
  readonly type = Types.SIGN_OUT_EMAIL;
  constructor() {}
}

export class SignOutSuccess implements Action {
  readonly type = Types.SIGN_OUT_EMAIL;
  constructor() {}
}

export class SignOutError implements Action {
  readonly type = Types.SIGIN_OUT_EMAIL_ERROR;
  constructor(public error: string) {}
}

// Acciones para carga masiva de ASESOR
export class CargaMasivaAsesor implements Action {
  readonly type = Types.CARGA_MASIVA_ASESOR;
  constructor(public file: File) {}
}

export class CargaMasivaAsesorSuccess implements Action {
  readonly type = Types.CARGA_MASIVA_ASESOR_SUCCESS;
  constructor(public message: string) {}
}

export class CargaMasivaAsesorError implements Action {
  readonly type = Types.CARGA_MASIVA_ASESOR_ERROR;
  constructor(public error: string) {}
}

// Acciones para carga masiva de BACKOFFICE
export class CargaMasivaBackOffice implements Action {
  readonly type = Types.CARGA_MASIVA_BACKOFFICE;
  constructor(public file: File) {}
}

export class CargaMasivaBackOfficeSuccess implements Action {
  readonly type = Types.CARGA_MASIVA_BACKOFFICE_SUCCESS;
  constructor(public message: string) {}
}

export class CargaMasivaBackOfficeError implements Action {
  readonly type = Types.CARGA_MASIVA_BACKOFFICE_ERROR;
  constructor(public error: string) {}
}

// Cargar usuarios paginados
export class LoadUsersPage implements Action {
  readonly type = Types.LOAD_USERS_PAGE;
  constructor(public page: number, public size: number) {}
}

export class LoadUsersPageSuccess implements Action {
  readonly type = Types.LOAD_USERS_PAGE_SUCCESS;
  constructor(public payload: UserPageResponse) {}
}

export class LoadUsersPageError implements Action {
  readonly type = Types.LOAD_USERS_PAGE_ERROR;
  constructor(public error: string) {}
}

// BÚSQUEDA GENÉRICA
export class SearchUsers implements Action {
  readonly type = Types.SEARCH_USERS;
  constructor(public query: string, public page: number, public size: number) {}
}

export class SearchUsersSuccess implements Action {
  readonly type = Types.SEARCH_USERS_SUCCESS;
  constructor(public payload: UserPageResponse) {}
}

export class SearchUsersError implements Action {
  readonly type = Types.SEARCH_USERS_ERROR;
  constructor(public error: string) {}
}

// Actualización de usuario
export class UpdateUser implements Action {
  readonly type = Types.UPDATE_USER;
  constructor(public id: number, public user: Partial<UserResponse>) {} 
  // Partial permite enviar sólo los campos a actualizar
}

export class UpdateUserSuccess implements Action {
  readonly type = Types.UPDATE_USER_SUCCESS;
  constructor(public updatedUser: UserResponse) {}
}

export class UpdateUserError implements Action {
  readonly type = Types.UPDATE_USER_ERROR;
  constructor(public error: string) {}
}

// Eliminación (Soft Delete) de usuario
export class DeleteUser implements Action {
  readonly type = Types.DELETE_USER;
  constructor(public id: number) {}
}

export class DeleteUserSuccess implements Action {
  readonly type = Types.DELETE_USER_SUCCESS;
  constructor(public id: number) {}
}

export class DeleteUserError implements Action {
  readonly type = Types.DELETE_USER_ERROR;
  constructor(public error: string) {}
}

// Acción para cambiar el rol
export class ChangeUserRole implements Action {
  readonly type = Types.CHANGE_USER_ROLE;
  constructor(public userId: number, public role: string) {}
}

export class ChangeUserRoleSuccess implements Action {
  readonly type = Types.CHANGE_USER_ROLE_SUCCESS;
  constructor(public userId: number, public role: string) {}
}

export class ChangeUserRoleError implements Action {
  readonly type = Types.CHANGE_USER_ROLE_ERROR;
  constructor(public error: string) {}
}


export type All =
  | Init
  | InitAuthorized
  | InitUnauthorized
  | InitError
  | SignInEmail
  | SignInEmailSuccess
  | SignInEmailError
  | RegisterUser
  | RegisterUserSuccess
  | RegisterUserError
  | SignOut
  | SignOutSuccess
  | SignOutError
  | LoadUsersPage
  | LoadUsersPageSuccess
  | LoadUsersPageError
  | SearchUsers
  | SearchUsersSuccess
  | SearchUsersError
  | UpdateUser
  | UpdateUserSuccess
  | UpdateUserError
  | DeleteUser
  | DeleteUserSuccess
  | DeleteUserError
  | ChangeUserRole
  | ChangeUserRoleSuccess
  | ChangeUserRoleError
  | CargaMasivaBackOffice
  | CargaMasivaBackOfficeSuccess
  | CargaMasivaBackOfficeError
  | CargaMasivaAsesor
  | CargaMasivaAsesorSuccess
  | CargaMasivaAsesorError;
