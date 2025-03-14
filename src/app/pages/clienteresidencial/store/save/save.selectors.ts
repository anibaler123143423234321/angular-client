import { createSelector } from '@ngrx/store';
import { ClienteState } from './save.reducer';

export const getClienteState = (state: any) => state.cliente; // Ajusta según tu estructura

export const getPaginatedClientes = createSelector(
  getClienteState,
  (state: ClienteState) => ({
    clientes: state.clientes,  // Asegúrate de que state.clientes sea un array
    currentPage: state.currentPage,
    totalItems: state.totalItems,
    totalPages: state.totalPages
  })
);

// Otros selectores que ya tienes:
export const getClientes = createSelector(
  getClienteState,
  (state: ClienteState) => state.clientes
);

export const getLoading = createSelector(
  getClienteState,
  (state: ClienteState) => state.loading
);

export const getError = createSelector(
  getClienteState,
  (state: ClienteState) => state.error
);

export const getSelectedCliente = createSelector(
  getClienteState,
  (state: ClienteState) => state.selectedCliente
);
