// coordinador.actions.ts
import { createAction, props } from '@ngrx/store';
import { CoordinadorDTO } from '@app/models/backend/dto/coordinador.dto'; 
import { AsignacionAsesorDTO } from '@app/models/backend/dto/asignacion-asesor.dto';
import { AsesorDTO } from '@app/models/backend/dto/asesor.dto';

export const loadCoordinadores = createAction(
  '[Coordinador List] Load Coordinadores'
);

export const loadCoordinadoresSuccess = createAction(
  '[Coordinador API] Load Coordinadores Success',
  props<{ coordinadores: CoordinadorDTO[] }>()
);

export const loadCoordinadoresFailure = createAction(
  '[Coordinador API] Load Coordinadores Failure',
  props<{ error: any }>()
);

export const asignarAsesores = createAction(
  '[Coordinador Detail] Asignar Asesores',
  props<{ asignacion: AsignacionAsesorDTO }>()
);

export const asignarAsesoresSuccess = createAction(
  '[Coordinador API] Asignar Asesores Success',
  props<{ coordinador: CoordinadorDTO }>()
);

export const asignarAsesoresFailure = createAction(
  '[Coordinador API] Asignar Asesores Failure',
  props<{ error: any }>()
);

// --- Nuevas acciones para el modal ---

// Cargar asesores disponibles
export const loadAsesoresDisponibles = createAction(
  '[Coordinador Modal] Load Asesores Disponibles'
);

export const loadAsesoresDisponiblesSuccess = createAction(
  '[Coordinador API] Load Asesores Disponibles Success',
  props<{ asesores: AsesorDTO[] }>()
);

export const loadAsesoresDisponiblesFailure = createAction(
  '[Coordinador API] Load Asesores Disponibles Failure',
  props<{ error: any }>()
);

// Asignar un asesor individual a un coordinador
export const asignarAsesorIndividual = createAction(
  '[Coordinador Modal] Asignar Asesor Individual',
  props<{ coordinadorId: number; asesorId: number }>()
);

export const asignarAsesorIndividualSuccess = createAction(
  '[Coordinador API] Asignar Asesor Individual Success',
  props<{ coordinador: CoordinadorDTO }>()
);

export const asignarAsesorIndividualFailure = createAction(
  '[Coordinador API] Asignar Asesor Individual Failure',
  props<{ error: any }>()
);

// Acciones para obtener clientes de un asesor
export const loadClientesDeAsesor = createAction(
  '[Asesor Clientes] Load Clientes De Asesor',
  props<{ asesorId: number }>()
);

export const loadClientesDeAsesorSuccess = createAction(
  '[Asesor API] Load Clientes De Asesor Success',
  props<{ clientes: any[] }>()
);

export const loadClientesDeAsesorFailure = createAction(
  '[Asesor API] Load Clientes De Asesor Failure',
  props<{ error: any }>()
);