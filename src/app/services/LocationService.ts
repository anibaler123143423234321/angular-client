import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
/*   private baseUrl = 'http://localhost:9039/api'; // Ajusta el puerto según tu config
 */  private dataUrl = 'assets/data.json';

  constructor(private http: HttpClient) {}

  // 1) Listar CCAA
/*   getAllCcaa() {
    return this.http.get<any[]>(`${this.baseUrl}/ccaa`);
  } */

  // 2) Provincias por CCAA
/*   getProvinciasByCcaa(ccaaId: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/provincias?ccaa=${ccaaId}`
    );
  } */

  // 3) Municipios por Provincia
/*   getMunicipiosByProvincia(provinciaId: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/municipios?provincia=${provinciaId}`
    );
  } */

     /**
   * Devuelve todas las CCAA.
   */
  getAllCcaa(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.CCAA) // El JSON tiene la clave "CCAA"
    );
  }

  /**
   * Devuelve las provincias filtradas por idCCAA.
   */
  getProvinciasByCcaa(idCcaa: number): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data =>
        data.PROVINCIAS.filter((prov: any) => prov.idCCAA === idCcaa)
      )
    );
  }

  /**
   * Devuelve los municipios filtrados por idProvincia.
   */
  getMunicipiosByProvincia(idProvincia: number): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data =>
        data.MUNICIPIOS.filter((mun: any) => mun.idProvincia === idProvincia)
      )
    );
  }
}
