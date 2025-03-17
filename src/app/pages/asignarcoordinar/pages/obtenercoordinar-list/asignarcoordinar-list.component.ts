import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CoordinadorActions from '@app/pages/asignarcoordinar/store/save/save.actions';
import { getAllCoordinadores, getCoordinadorLoading, getCoordinadorError } from '@app/pages/asignarcoordinar/store/save/save.selectors';
import { Observable } from 'rxjs';
import { CoordinadorDTO } from '@app/models/backend/dto/coordinador.dto';
import { AsignacionAsesorDTO } from '@app/models/backend/dto/asignacion-asesor.dto';
import { AsesorDTO } from '@app/models/backend/dto/asesor.dto';
import { getAsesoresDisponibles } from '@app/pages/asignarcoordinar/store/save/save.selectors';

@Component({
  selector: 'app-asignarcoordinar-list',
  templateUrl: './asignarcoordinar-list.component.html',
  styleUrls: ['./asignarcoordinar-list.component.scss']
})
export class AsignarcoordinarListComponent implements OnInit {
  coordinadores$!: Observable<CoordinadorDTO[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<any>;
  
  isModalOpen = false;
  selectedCoordinatorId: number | null = null;
  asesoresDisponibles$!: Observable<AsesorDTO[]>;
  
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(CoordinadorActions.loadCoordinadores());
    this.coordinadores$ = this.store.select(getAllCoordinadores);
    this.loading$ = this.store.select(getCoordinadorLoading);
    this.error$ = this.store.select(getCoordinadorError);
  }

  asignarAsesores(asignacion: AsignacionAsesorDTO): void {
    this.store.dispatch(CoordinadorActions.asignarAsesores({ asignacion }));
  }

  // Abre el modal y carga los asesores disponibles
  openModal(coordinatorId: number): void {
    this.selectedCoordinatorId = coordinatorId;
    this.isModalOpen = true;
    this.store.dispatch(CoordinadorActions.loadAsesoresDisponibles());
    this.asesoresDisponibles$ = this.store.select(getAsesoresDisponibles);
  }

  // Cierra el modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Al seleccionar un asesor, asigna ese asesor al coordinador y cierra el modal
  onSelectAsesor(asesorId: number): void {
    if (this.selectedCoordinatorId !== null) {
      this.store.dispatch(CoordinadorActions.asignarAsesorIndividual({
        coordinadorId: this.selectedCoordinatorId,
        asesorId
      }));
      this.closeModal();
    }
  }
}
