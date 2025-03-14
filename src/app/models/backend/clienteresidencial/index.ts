// src/app/models/cliente-con-usuario.dto.ts
export class ClienteConUsuarioDTO {
  constructor(
    public dni: string,
    public nombres: string,
    public fechaIngresado: string, // o string, según prefieras
    public numeroMovil: string
  ) {}
}

// cliente-residencial.model.ts

export interface ClienteResidencial {
  id: number;
  campania?: string;
  nombresApellidos?: string;
  nifNie?: string;
  nacionalidad?: string;
  fechaNacimiento?: string; // Formato ISO (YYYY-MM-DD)
  genero?: string;
  correoElectronico?: string;
  cuentaBancaria?: string;
  permanencia?: string;
  direccion?: string;
  tipoFibra?: string;
  movilContacto: string;
  fijoCompania?: string;
  planActual?: string;
  codigoPostal?: string;
  provincia?: string;
  distrito?: string;
  ciudad?: string;
  tipoPlan?: string;
  icc?: string;
  movilesAPortar?: string[];
  // Para el usuario, puedes definir otra interfaz o usar 'any'
  usuario?: any;
  autorizaSeguros?: boolean;
  autorizaEnergias?: boolean;
  ventaRealizada?: boolean;
  fechaCreacion: string; // Formato ISO (YYYY-MM-DDTHH:mm:ss)
  nombres?: string; 
}
