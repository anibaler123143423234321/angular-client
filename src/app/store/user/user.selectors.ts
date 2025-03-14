import { createSelector, createFeatureSelector } from "@ngrx/store";
import {UserState} from './user.reducer';

export const getUserState = createFeatureSelector<UserState>('user');

export const getUser = createSelector(
  getUserState,
  (state) => state.entity
)

export const getLoading = createSelector(
  getUserState,
  (state) => state.loading
)

export const getIsAuthorized = createSelector(
  getUserState,
  (state) => !!state.username
)

export const getCargaMasivaAsesorSuccess = createSelector(
  getUserState,
  (state: UserState) => state.cargaMasivaAsesorSuccess
);

export const getCargaMasivaAsesorError = createSelector(
  getUserState,
  (state: UserState) => state.cargaMasivaAsesorError
);

export const getCargaMasivaBackofficeSuccess = createSelector(
  getUserState,
  (state: UserState) => state.cargaMasivaBackofficeSuccess
);

export const getCargaMasivaBackofficeError = createSelector(
  getUserState,
  (state: UserState) => state.cargaMasivaBackofficeError
);
// ----- NUEVOS SELECTORES PARA LA PAGINACIÓN ----- //

export const getPaginatedUsers = createSelector(
  getUserState,
  (state: UserState) => state.paginatedUsers
);

export const getLoadingPage = createSelector(
  getUserState,
  (state: UserState) => state.loadingPage
);

export const getErrorPage = createSelector(
  getUserState,
  (state: UserState) => state.errorPage
);

// ----- NUEVOS SELECTORES PARA LA ELIMINACIÓN -----

export const getDeleting = createSelector(
  getUserState,
  (state: UserState) => state.deleting
);

export const getDeleteError = createSelector(
  getUserState,
  (state: UserState) => state.errorDelete
);