// coordinador.dto.ts

import { AsesorDTO } from "./asesor.dto";

  
  export interface CoordinadorDTO {
    id: number;
    nombre: string;
    apellido: string;
    username: string;
    dni: string;
    email: string;
    telefono: string;
    sede: string;
    asesores: AsesorDTO[];
  }
  