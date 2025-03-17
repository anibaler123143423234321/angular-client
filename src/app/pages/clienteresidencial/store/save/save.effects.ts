import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClienteActions from './save.actions';
import { mergeMap, map, catchError, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '@src/environments/environment';
import { ClienteConUsuarioDTO, ClienteResidencial } from '@app/models/backend/clienteresidencial';

// Interfaz para la respuesta genérica
interface GenericResponse<T> {
  rpta: number;  // 1 para éxito, 0 para error
  msg: string;   // Mensaje de respuesta
  data: T;       // Datos de respuesta
}

// Interfaz para la respuesta paginada de clientes
interface ClientePaginadoResponse {
  clientes: ClienteConUsuarioDTO[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

@Injectable()
export class ClienteEffects {

  // Efecto para cargar clientes al iniciar, utilizando el endpoint filtrado por CURRENT_DATE
  loadClientes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClienteActions.loadClientes),
      mergeMap(action => {
        // Configurar parámetros de paginación
        const params = new HttpParams()
          .set('page', action.page.toString())
          .set('size', action.size.toString());
          
        // Se utiliza el endpoint que retorna datos filtrados por la fecha actual
        return this.http.get<GenericResponse<ClientePaginadoResponse>>(
          `${environment.url}api/clientes/con-usuario-filtrados-fecha`, 
          { params }
        ).pipe(
          tap(response => {
            if (response.rpta === 1) {
              console.log('Clientes paginados (fecha actual):', response.data);
            } else {
              console.error('Error al cargar clientes:', response.msg);
            }
          }),
          map(response => {
            if (response.rpta === 1) {
              return ClienteActions.loadClientesSuccess({
                clientes: response.data.clientes,
                currentPage: response.data.currentPage,
                totalItems: response.data.totalItems,
                totalPages: response.data.totalPages
              });
            } else {
              return ClienteActions.loadClientesFailure({ error: response.msg });
            }
          }),
          catchError(error => of(ClienteActions.loadClientesFailure({ error: error.message })))
        );
      })
    )
  );

  // Efecto para cargar clientes filtrados
  loadClientesFiltrados$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClienteActions.loadClientesFiltrados),
      mergeMap(action => {
        const dniAsesor = action.dniAsesor?.trim() || '';
        const nombreAsesor = action.nombreAsesor?.trim() || '';
        const numeroMovil = action.numeroMovil?.trim() || '';
        // Si se envía fecha, se envía; si no, se manda cadena vacía.
        const fecha = action.fecha ? action.fecha.toString() : '';

        const params = new HttpParams()
          .set('page', action.page.toString())
          .set('size', action.size.toString())
          .set('dniAsesor', dniAsesor)
          .set('nombreAsesor', nombreAsesor)
          .set('numeroMovil', numeroMovil)
          .set('fecha', fecha);

        // Se llama siempre al endpoint para filtrado manual (/con-usuario-filtrados)
        return this.http.get<GenericResponse<ClientePaginadoResponse>>(
          `${environment.url}api/clientes/con-usuario-filtrados`, 
          { params }
        ).pipe(
          tap(response => {
            if (response.rpta === 1) {
              console.log('Clientes filtrados:', response.data);
            } else {
              console.error('Error al filtrar clientes:', response.msg);
            }
          }),
          map(response => {
            if (response.rpta === 1) {
              return ClienteActions.loadClientesSuccess({
                clientes: response.data.clientes,
                currentPage: response.data.currentPage,
                totalItems: response.data.totalItems,
                totalPages: response.data.totalPages
              });
            } else {
              return ClienteActions.loadClientesFailure({ error: response.msg });
            }
          }),
          catchError(error => of(ClienteActions.loadClientesFailure({ error: error.message })))
        );
      })
    )
  );

  // Efecto para cargar cliente por número móvil
  loadClienteByMobile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClienteActions.loadClienteByMobile),
      mergeMap(action =>
        this.http.get<GenericResponse<any>>(
          `${environment.url}api/cliente-promocion/movil/${action.mobile}`
        ).pipe(
          map(response => {
            if (response.rpta === 1) {
              return ClienteActions.loadClienteByMobileSuccess({ cliente: response.data });
            } else {
              return ClienteActions.loadClienteByMobileFailure({ error: response.msg });
            }
          }),
          catchError(error => of(ClienteActions.loadClienteByMobileFailure({ error: error.message })))
        )
      )
    )
  );

  // Efecto para actualizar cliente
  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClienteActions.updateClient),
      switchMap(action =>
        this.http.put<GenericResponse<ClienteResidencial>>(
          `${environment.url}api/clientes/${action.id}`, 
          action.client
        ).pipe(
          tap(response => {
            if (response.rpta === 1) {
              console.log('Cliente actualizado:', response.data);
            } else {
              console.error('Error al actualizar cliente:', response.msg);
            }
          }),
          map(response => {
            if (response.rpta === 1) {
              return ClienteActions.updateClientSuccess({ client: response.data });
            } else {
              return ClienteActions.updateClientFailure({ error: response.msg });
            }
          }),
          catchError(error => of(ClienteActions.updateClientFailure({ error: error.message })))
        )
      )
    )
  );
  
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}