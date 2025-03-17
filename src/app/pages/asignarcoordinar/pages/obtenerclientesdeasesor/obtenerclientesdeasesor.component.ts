import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import * as CoordinadorActions from '@app/pages/asignarcoordinar/store/save/save.actions';
import * as fromCoordinador from '@app/pages/asignarcoordinar/store/save/save.selectors';

@Component({
  selector: 'app-obtenerclientesdeasesor',
  templateUrl: './obtenerclientesdeasesor.component.html',
  styleUrls: ['./obtenerclientesdeasesor.component.scss']
})
export class ObtenerclientesdeasesorComponent implements OnInit {
  clientes$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  asesorId!: number;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clientes$ = this.store.select(fromCoordinador.getClientesDeAsesor);
    this.loading$ = this.store.select(fromCoordinador.getCoordinadorLoading);
    this.error$ = this.store.select(fromCoordinador.getCoordinadorError);
  }

  ngOnInit(): void {
    // Obtener el ID del asesor de los parámetros de la ruta
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.asesorId = +params['id'];
        this.cargarClientesDeAsesor();
      }
    });
  }

  cargarClientesDeAsesor(): void {
    this.store.dispatch(CoordinadorActions.loadClientesDeAsesor({ asesorId: this.asesorId }));
  }

  // Añadir el método que falta
  verDetalleCliente(clienteId: number): void {
    // Navegar a la página de detalle del cliente
    this.router.navigate(['/clientes', clienteId]);
  }
}