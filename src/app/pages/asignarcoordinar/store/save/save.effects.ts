import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClienteActions from './save.actions';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '@src/environments/environment';
import { ClienteConUsuarioDTO } from '@app/models/backend/clienteresidencial';

@Injectable()
export class ClienteEffects {

/*   loadClientes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClienteActions.loadClientes),
      mergeMap(action => {
        // Configurar parámetros de paginación para la petición HTTP
        const params = new HttpParams()
          .set('page', action.page.toString())
          .set('size', action.size.toString());

        // Se espera que el endpoint retorne un objeto con las propiedades:
        // clientes, currentPage, totalItems y totalPages.
        return this.http.get<{
          clientes: ClienteConUsuarioDTO[],
          currentPage: number,
          totalItems: number,
          totalPages: number
        }>(`${environment.url}api/clientes/con-usuario`, { params }).pipe(
          tap(response => console.log('Clientes paginados:', response)),
          map(response =>
            ClienteActions.loadClientesSuccess({
              clientes: response.clientes,
              currentPage: response.currentPage,
              totalItems: response.totalItems,
              totalPages: response.totalPages
            })
          ),
          catchError(error => of(ClienteActions.loadClientesFailure({ error })))
        );
      })
    )
  ); */

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
        return this.http.get<{
          clientes: ClienteConUsuarioDTO[],
          currentPage: number,
          totalItems: number,
          totalPages: number
        }>(`${environment.url}api/clientes/con-usuario-filtrados-fecha`, { params }).pipe(
          tap(response => console.log('Clientes paginados (fecha actual):', response)),
          map(response =>
            ClienteActions.loadClientesSuccess({
              clientes: response.clientes,
              currentPage: response.currentPage,
              totalItems: response.totalItems,
              totalPages: response.totalPages
            })
          ),
          catchError(error => of(ClienteActions.loadClientesFailure({ error })))
        );
      })
    )
  );

  // Los demás efectos se mantienen (como loadClientesFiltrados y loadClienteByMobile)
// En cliente.effects.ts
// En cliente.effects.ts
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
      return this.http.get<{
        clientes: ClienteConUsuarioDTO[],
        currentPage: number,
        totalItems: number,
        totalPages: number
      }>(`${environment.url}api/clientes/con-usuario-filtrados`, { params }).pipe(
        map(response =>
          ClienteActions.loadClientesSuccess({
            clientes: response.clientes,
            currentPage: response.currentPage,
            totalItems: response.totalItems,
            totalPages: response.totalPages
          })
        ),
        catchError(error => of(ClienteActions.loadClientesFailure({ error })))
      );
    })
  )
);

  loadClienteByMobile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClienteActions.loadClienteByMobile),
      mergeMap(action =>
        this.http.get<any>(`${environment.url}api/cliente-promocion/movil/${action.mobile}`)
          .pipe(
            map(cliente => ClienteActions.loadClienteByMobileSuccess({ cliente })),
            catchError(error => of(ClienteActions.loadClienteByMobileFailure({ error })))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}
