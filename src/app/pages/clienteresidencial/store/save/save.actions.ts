import { createAction, props } from '@ngrx/store';
import { ClienteConUsuarioDTO } from '@app/models/backend/clienteresidencial';
import { ClienteResidencial } from '@app/models/backend/clienteresidencial';


export const updateClient = createAction(
  '[Cliente] Update Client',
  props<{ id: number; client: ClienteResidencial }>()
);

export const updateClientSuccess = createAction(
  '[Cliente API] Update Client Success',
  props<{ client: ClienteResidencial }>()
);

export const updateClientFailure = createAction(
  '[Cliente API] Update Client Failure',
  props<{ error: any }>()
);

export const loadClientes = createAction(
  '[Cliente List] Load Clientes',
  props<{ page: number; size: number }>()
);

export const loadClientesSuccess = createAction(
  '[Cliente API] Load Clientes Success',
  props<{ 
    clientes: ClienteConUsuarioDTO[],
    currentPage: number,
    totalItems: number,
    totalPages: number 
  }>()
);

export const loadClientesFailure = createAction(
  '[Cliente API] Load Clientes Failure',
  props<{ error: any }>()
);

// Las acciones existentes para cargar clientes filtrados y por móvil se mantienen
// En save.actions.ts
export const loadClientesFiltrados = createAction(
  '[Cliente] Load Clientes Filtrados',
  props<{
    dniAsesor: string | null;
    nombreAsesor: string | null;
    numeroMovil: string | null;
    fecha: string | null;
    page: number;    // Agregar
    size: number;    // Agregar
  }>()
);

export const loadClienteByMobile = createAction(
  '[Cliente Detail] Load Cliente By Mobile',
  props<{ mobile: string }>()
);

export const loadClienteByMobileSuccess = createAction(
  '[Cliente API] Load Cliente By Mobile Success',
  props<{ cliente: any }>() // Ajusta el tipo según corresponda
);

export const loadClienteByMobileFailure = createAction(
  '[Cliente API] Load Cliente By Mobile Failure',
  props<{ error: any }>()
);
