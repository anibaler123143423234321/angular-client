import { createSelector } from '@ngrx/store';
import { CoordinadorState } from './save.reducer';

export const getCoordinadorState = (state: any) => state.coordinador;

export const getAllCoordinadores = createSelector(
  getCoordinadorState,
  (state: CoordinadorState) => state.coordinadores
);

export const getCoordinadorLoading = createSelector(
  getCoordinadorState,
  (state: CoordinadorState) => state.loading
);

export const getCoordinadorError = createSelector(
  getCoordinadorState,
  (state: CoordinadorState) => state.error
);

// <-- Nuevo selector para asesores disponibles -->
export const getAsesoresDisponibles = createSelector(
  getCoordinadorState,
  (state: CoordinadorState) => state.asesoresDisponibles
);

// Selectores para clientes de asesor
export const getClientesDeAsesor = createSelector(
  getCoordinadorState,
  (state: CoordinadorState) => state.clientesDeAsesor
);

export const getSelectedAsesorId = createSelector(
  getCoordinadorState,
  (state: CoordinadorState) => state.selectedAsesorId
);