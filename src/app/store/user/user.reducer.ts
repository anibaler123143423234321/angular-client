import { UserResponse } from './user.models';
import { UserPageResponse } from './user.models';
import * as fromActions from './user.actions';

export interface UserState {
  entity: UserResponse | null;
  id: string | null;
  username: string | null;
  loading: boolean | null;
  error: string | null;
  // Estados separados para carga masiva de ASESOR y BACKOFFICE
  cargaMasivaAsesorSuccess: boolean;
  cargaMasivaAsesorError: string | null;

  cargaMasivaBackofficeSuccess: boolean;
  cargaMasivaBackofficeError: string | null;

  paginatedUsers: UserPageResponse | null;
  loadingPage: boolean;
  errorPage: string | null;
  deleting: boolean; // Nueva propiedad para eliminar
  errorDelete: string | null; // Nueva propiedad para error en eliminación
}

const initialState: UserState = {
  entity: null,
  id: null,
  username: null,
  loading: null,
  error: null,
  // Inicializa los estados separados
  cargaMasivaAsesorSuccess: false,
  cargaMasivaAsesorError: null,

  cargaMasivaBackofficeSuccess: false,
  cargaMasivaBackofficeError: null,

  paginatedUsers: null,
  loadingPage: false,
  errorPage: null,
  deleting: false, // Inicialmente no se está eliminando
  errorDelete: null, // Sin error de eliminación
};

export function reducer(
  state = initialState,
  action: fromActions.All | any
): UserState {
  switch (action.type) {
    // INIT
    case fromActions.Types.INIT: {
      return { ...state, loading: true };
    }
    case fromActions.Types.INIT_AUTHORIZED: {
      return {
        ...state,
        loading: false,
        entity: action.user,
        username: action.username,
        error: null,
      };
    }
    case fromActions.Types.INIT_UNAUTHORIZED: {
      return {
        ...state,
        loading: false,
        entity: null,
        username: null,
        error: null,
      };
    }
    case fromActions.Types.INIT_ERROR: {
      return {
        ...state,
        loading: false,
        entity: null,
        username: null,
        error: action.error,
      };
    }

    // LOGIN
    case fromActions.Types.SIGIN_IN_EMAIL: {
      return {
        ...state,
        loading: true,
        entity: null,
        username: null,
        error: null,
      };
    }
    case fromActions.Types.SIGIN_IN_EMAIL_SUCCESS: {
      return {
        ...state,
        loading: false,
        entity: action.user,
        username: action.email !== undefined ? action.email : state.username,
        error: null,
      };
    }
    case fromActions.Types.SIGIN_IN_EMAIL_ERROR: {
      return {
        ...state,
        loading: false,
        entity: null,
        username: null,
        error: action.error,
      };
    }

    // REGISTRO de usuarios (nuevos casos REGISTER_USER)
    case fromActions.Types.REGISTER_USER: {
      return {
        ...state,
        loading: true,
        entity: null,
        username: null,
        error: null,
      };
    }
    case fromActions.Types.REGISTER_USER_SUCCESS: {
      return {
        ...state,
        loading: false,
        // No actualizamos la entidad ni el username para preservar la sesión actual
        error: null,
      };
    }
    

    case fromActions.Types.REGISTER_USER_ERROR: {
      return {
        ...state,
        loading: false,
        entity: null,
        username: null,
        error: action.error,
      };
    }

    // LOGOUT o Salir de Sesión
    case fromActions.Types.SIGN_OUT_EMAIL: {
      return { ...initialState };
    }
    case fromActions.Types.SIGIN_OUT_EMAIL_SUCCESS: {
      return { ...initialState };
    }
    case fromActions.Types.SIGIN_OUT_EMAIL_ERROR: {
      return {
        ...state,
        loading: false,
        entity: null,
        username: null,
        error: action.error,
      };
    }

    // Carga masiva de ASESOR
    case fromActions.Types.CARGA_MASIVA_ASESOR_SUCCESS:
      return {
        ...state,
        cargaMasivaAsesorSuccess: true,
        cargaMasivaAsesorError: null,
      };
    case fromActions.Types.CARGA_MASIVA_ASESOR_ERROR:
      return {
        ...state,
        cargaMasivaAsesorSuccess: false,
        cargaMasivaAsesorError: action.error,
      };

    // Carga masiva de BACKOFFICE
    case fromActions.Types.CARGA_MASIVA_BACKOFFICE_SUCCESS:
      return {
        ...state,
        cargaMasivaBackofficeSuccess: true,
        cargaMasivaBackofficeError: null,
      };
    case fromActions.Types.CARGA_MASIVA_BACKOFFICE_ERROR:
      return {
        ...state,
        cargaMasivaBackofficeSuccess: false,
        cargaMasivaBackofficeError: action.error,
      };

    // Cargar usuarios paginados
    case fromActions.Types.LOAD_USERS_PAGE: {
      return {
        ...state,
        loadingPage: true,
        errorPage: null,
      };
    }
    case fromActions.Types.LOAD_USERS_PAGE_SUCCESS: {
      return {
        ...state,
        loadingPage: false,
        paginatedUsers: action.payload,
      };
    }
    case fromActions.Types.LOAD_USERS_PAGE_ERROR: {
      return {
        ...state,
        loadingPage: false,
        errorPage: action.error,
      };
    }
    // Búsqueda genérica
    case fromActions.Types.SEARCH_USERS: {
      return { ...state, loadingPage: true, errorPage: null };
    }
    case fromActions.Types.SEARCH_USERS_SUCCESS: {
      return { ...state, loadingPage: false, paginatedUsers: action.payload };
    }
    case fromActions.Types.SEARCH_USERS_ERROR: {
      return { ...state, loadingPage: false, errorPage: action.error };
    }
    // UpdateUser
    case fromActions.Types.UPDATE_USER: {
      return { ...state, loading: true };
    }
    case fromActions.Types.UPDATE_USER_SUCCESS: {
      if (state.paginatedUsers) {
        const updatedUsers = state.paginatedUsers.users.map((u) =>
          u.id === action.updatedUser.id ? action.updatedUser : u
        );
        return {
          ...state,
          loading: false,
          paginatedUsers: { ...state.paginatedUsers, users: updatedUsers },
        };
      }
      return { ...state, loading: false };
    }
    case fromActions.Types.UPDATE_USER_ERROR: {
      return { ...state, loading: false, error: action.error };
    }
    // DeleteUser
    case fromActions.Types.DELETE_USER: {
      return {
        ...state,
        deleting: true,
        errorDelete: null,
      };
    }
    case fromActions.Types.DELETE_USER_SUCCESS: {
      let updatedPaginatedUsers = state.paginatedUsers;
      if (state.paginatedUsers) {
        updatedPaginatedUsers = {
          ...state.paginatedUsers,
          users: state.paginatedUsers.users.map((u) =>
            u.id === action.id ? { ...u, estado: 'I' } : u
          ),
        };
      }
      return {
        ...state,
        deleting: false,
        paginatedUsers: updatedPaginatedUsers,
      };
    }
    case fromActions.Types.DELETE_USER_ERROR: {
      return {
        ...state,
        deleting: false,
        errorDelete: action.error,
      };
    }
    default: {
      return state;
    }
  }
}
