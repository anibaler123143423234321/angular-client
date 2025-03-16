import * as fromList from './save/save.reducer';
import { ClienteEffects } from './save';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { ClienteConUsuarioDTO ,ClienteResidencial} from '@app/models/backend/clienteresidencial';


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



