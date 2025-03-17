import { createReducer, on, Action } from '@ngrx/store';
import * as CoordinadorActions from './save.actions';
import { CoordinadorDTO } from '@app/models/backend/dto/coordinador.dto';
import { AsesorDTO } from '@app/models/backend/dto/asesor.dto';

// Actualizar la interfaz del estado
export interface CoordinadorState {
  coordinadores: CoordinadorDTO[];
  selectedCoordinador: CoordinadorDTO | null;
  loading: boolean;
  error: any;
  asesoresDisponibles: AsesorDTO[];
  clientesDeAsesor: any[]; // NUEVO
  selectedAsesorId: number | null; // NUEVO
}

// Actualizar el estado inicial
export const initialState: CoordinadorState = {
  coordinadores: [],
  selectedCoordinador: null,
  loading: false,
  error: null,
  asesoresDisponibles: [],
  clientesDeAsesor: [], // NUEVO
  selectedAsesorId: null // NUEVO
};

const _coordinadorReducer = createReducer(
  initialState,
  on(CoordinadorActions.loadCoordinadores, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CoordinadorActions.loadCoordinadoresSuccess, (state, { coordinadores }) => ({
    ...state,
    coordinadores,
    loading: false
  })),
  on(CoordinadorActions.loadCoordinadoresFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CoordinadorActions.asignarAsesores, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CoordinadorActions.asignarAsesoresSuccess, (state, { coordinador }) => {
    const updatedCoordinadores = state.coordinadores.map(c =>
      c.id === coordinador.id ? coordinador : c
    );
    return {
      ...state,
      coordinadores: updatedCoordinadores,
      selectedCoordinador: coordinador,
      loading: false
    };
  }),
  on(CoordinadorActions.asignarAsesoresFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CoordinadorActions.loadAsesoresDisponibles, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CoordinadorActions.loadAsesoresDisponiblesSuccess, (state, { asesores }) => ({
    ...state,
    asesoresDisponibles: asesores,
    loading: false
  })),
  on(CoordinadorActions.loadAsesoresDisponiblesFailure, (state, { error }) => ({
    ...state,
    asesoresDisponibles: [],
    loading: false,
    error
  })),
  on(CoordinadorActions.asignarAsesorIndividual, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CoordinadorActions.asignarAsesorIndividualSuccess, (state, { coordinador }) => {
    const updatedCoordinadores = state.coordinadores.map(c =>
      c.id === coordinador.id ? coordinador : c
    );
    return {
      ...state,
      coordinadores: updatedCoordinadores,
      selectedCoordinador: coordinador,
      loading: false
    };
  }),
  on(CoordinadorActions.asignarAsesorIndividualFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CoordinadorActions.loadClientesDeAsesor, (state, { asesorId }) => ({
    ...state,
    loading: true,
    error: null,
    selectedAsesorId: asesorId
  })),
  
  on(CoordinadorActions.loadClientesDeAsesorSuccess, (state, { clientes }) => ({
    ...state,
    clientesDeAsesor: clientes,
    loading: false
  })),
  
  on(CoordinadorActions.loadClientesDeAsesorFailure, (state, { error }) => ({
    ...state,
    clientesDeAsesor: [],
    loading: false,
    error
  }))
);

export function coordinadorReducer(state: CoordinadorState | undefined, action: Action) {
  return _coordinadorReducer(state, action);
}
