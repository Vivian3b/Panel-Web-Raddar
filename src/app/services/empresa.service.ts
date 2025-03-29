import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

    actualizarEmpresa(empresa: Empresa): Observable<Empresa> {
      return this.http.patch<Empresa>(`${this.apiUrl}/${empresa.idempresa}`, empresa).pipe(
        catchError(error => {
          // Imprime un error más descriptivo
          if (error instanceof HttpErrorResponse) {
            console.error('Error al actualizar la empresa:', error.message);  // Mensaje de error
            console.error('Detalles del error:', error.error);  // Cuerpo del error
          } else {
            console.error('Error desconocido:', error);
          }
          return throwError(() => new Error(error.message || 'Error desconocido'));
        })
      );
    }
    

    eliminarEmpresa(idempresa: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${idempresa}`);
    }
}
