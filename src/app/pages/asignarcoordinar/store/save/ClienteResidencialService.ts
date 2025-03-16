import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteConUsuarioDTO } from '@app/models/backend/clienteresidencial';

@Injectable({
  providedIn: 'root'
})
export class ClienteResidencialService {

  private baseUrl = 'http://localhost:9039/api/clientes'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  obtenerClientesConUsuario(): Observable<ClienteConUsuarioDTO[]> {
    return this.http.get<ClienteConUsuarioDTO[]>(`${this.baseUrl}/con-usuario`);
  }
}
