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
  }))
);

export function clienteReducer(state: ClienteState | undefined, action: Action) {
  return _clienteReducer(state, action);
}
