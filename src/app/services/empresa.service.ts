import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../interfaces/Empresa';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${appsettings.apiUrl}empresa`;

  constructor(private http: HttpClient) { }

  // Obtener todas las empresas
    getEmpresas(): Observable<Empresa[]> {
      return this.http.get<Empresa[]>(this.apiUrl).pipe(
        catchError(error => {
          console.error('Error al obtener empresas:', error);
          return throwError(() => new Error(error)); 
        })
      );
    }

    eliminarEmpresa(idempresa: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${idempresa}`);
    }
}
