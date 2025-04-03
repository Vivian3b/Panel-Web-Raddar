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

  constructor(private http: HttpClient) {}

  crearEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa).pipe(
      catchError(this.handleError)
    );
  }

  obtenerEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  obtenerEmpresa(idempresa: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${idempresa}`).pipe(
      catchError(this.handleError)
    );
  }

  actualizarEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.http.patch<Empresa>(`${this.apiUrl}/${empresa.idempresa}`, empresa).pipe(
      catchError(this.handleError)
    );
  }

  eliminarEmpresa(idempresa: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idempresa}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error.message);
    return throwError(() => error);
  }
}