// coordinador.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import * as CoordinadorActions from './save.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CoordinadorDTO } from '@app/models/backend/dto/coordinador.dto';
import { AsesorDTO } from '@app/models/backend/dto/asesor.dto';

@Injectable()
export class CoordinadorEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  loadCoordinadores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoordinadorActions.loadCoordinadores),
      mergeMap(() =>
        this.http.get<CoordinadorDTO[]>(`${environment.url}api/coordinadores`).pipe(
          map(coordinadores =>
            CoordinadorActions.loadCoordinadoresSuccess({ coordinadores })
          ),
          catchError(error =>
            of(CoordinadorActions.loadCoordinadoresFailure({ error }))
          )
        )
      )
    )
  );

  asignarAsesores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoordinadorActions.asignarAsesores),
      mergeMap(action =>
        this.http.post<CoordinadorDTO>(`${environment.url}api/coordinadores/asignar-asesores`, action.asignacion).pipe(
          map(coordinador =>
            CoordinadorActions.asignarAsesoresSuccess({ coordinador })
          ),
          catchError(error =>
            of(CoordinadorActions.asignarAsesoresFailure({ error }))
          )
        )
      )
    )
  );

// Efecto para cargar asesores disponibles
loadAsesoresDisponibles$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CoordinadorActions.loadAsesoresDisponibles),
    mergeMap(() =>
      this.http.get<AsesorDTO[]>(`${environment.url}api/coordinadores/asesores-disponibles`).pipe(
        map(asesores =>
          CoordinadorActions.loadAsesoresDisponiblesSuccess({ asesores })
        ),
        catchError(error =>
          of(CoordinadorActions.loadAsesoresDisponiblesFailure({ error }))
        )
      )
    )
  )
);

// Efecto para asignar un asesor individual
asignarAsesorIndividual$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CoordinadorActions.asignarAsesorIndividual),
    mergeMap(action =>
      this.http.post<CoordinadorDTO>(
        `${environment.url}api/coordinadores/asignar-asesores`,
        {
          coordinadorId: action.coordinadorId,
          asesorIds: [action.asesorId]  // Enviamos el asesor individual en un array
        }
      ).pipe(
        map(coordinador =>
          CoordinadorActions.asignarAsesorIndividualSuccess({ coordinador })
        ),
        catchError(error =>
          of(CoordinadorActions.asignarAsesorIndividualFailure({ error }))
        )
      )
    )
  )
);

// Efecto para cargar clientes de un asesor
loadClientesDeAsesor$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CoordinadorActions.loadClientesDeAsesor),
    mergeMap(action =>
      this.http.get<any[]>(`${environment.url}api/asesores/${action.asesorId}/clientes`).pipe(
        map(clientes =>
          CoordinadorActions.loadClientesDeAsesorSuccess({ clientes })
        ),
        catchError(error =>
          of(CoordinadorActions.loadClientesDeAsesorFailure({ error }))
        )
      )
    )
  )
);
}
