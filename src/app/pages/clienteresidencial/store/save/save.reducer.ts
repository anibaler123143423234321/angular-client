import { ClienteConUsuarioDTO, ClienteResidencial } from '@app/models/backend/clienteresidencial';
import * as ClienteActions from './save.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface ClienteState {
  clientes: ClienteConUsuarioDTO[];
  selectedCliente: ClienteResidencial | null;
  loading: boolean;
  error: any;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export const initialState: ClienteState = {
  clientes: [],
  selectedCliente: null,
  loading: false,
  error: null,
  currentPage: 0,
  totalItems: 0,
  totalPages: 0
};

const _clienteReducer = createReducer(
  initialState,
  on(ClienteActions.loadClientes, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClienteActions.loadClientesSuccess, (state, { clientes, currentPage, totalItems, totalPages }) => ({
    ...state,
    clientes,
    currentPage,
    totalItems,
    totalPages,
    loading: false
  })),
  on(ClienteActions.loadClientesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ClienteActions.loadClienteByMobileSuccess, (state, { cliente }) => ({
    ...state,
    selectedCliente: cliente,
    error: null
  })),
  on(ClienteActions.loadClienteByMobileFailure, (state, { error }) => ({
    ...state,
    selectedCliente: null,
    error
  })),
  // Add these handlers for update actions
  on(ClienteActions.updateClient, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClienteActions.updateClientSuccess, (state, { client }) => ({
    ...state,
    // Update the selected cliente with the updated data
    selectedCliente: client,
    // Also update the client in the list if it exists there
    clientes: state.clientes.map(c => 
      c.numeroMovil === client.movilContacto 
        ? { ...c } // If you need to update list properties, add them here
        : c
    ),
    loading: false
  })),
  on(ClienteActions.updateClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function clienteReducer(state: ClienteState | undefined, action: Action) {
  return _clienteReducer(state, action);
}