import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Empresa } from '../interfaces/Empresa';
import { catchError, Observable, throwError } from 'rxjs';
import { Matriz } from '../interfaces/Matriz';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${appsettings.apiUrl}empresa`;
  private apiMatrizUrl = `${appsettings.apiUrl}matriz`;

  constructor(private http: HttpClient) {}

  crearEmpresa(empresa: Empresa): Observable<Empresa> {
    // Verificar que las coordenadas no estén indefinidas
    if (!empresa.ubicacion || !empresa.ubicacion.y || !empresa.ubicacion.x) {
      console.error('Coordenadas inválidas');
      return throwError('Coordenadas inválidas');
    }

    const body = {
      nombre: empresa.nombre,
      descripcion: empresa.descripcion,
      ubicacion: { lat: empresa.ubicacion.y, lng: empresa.ubicacion.x }, // Convertir a lat/lng
      usuario_idusuario: empresa.usuario_idusuario,
      matriz_idmatriz: empresa.matriz_idmatriz, // Aquí se usa el id de la matriz seleccionada
      eliminado: empresa.eliminado
    };

    console.log('Enviando POST:', body);

    return this.http.post<Empresa>(this.apiUrl, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
        return throwError(error);
      })
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
    // Verificar que las coordenadas no estén indefinidas
    if (!empresa.ubicacion || !empresa.ubicacion.y || !empresa.ubicacion.x) {
      console.error('Coordenadas inválidas');
      return throwError('Coordenadas inválidas');
    }

    const body = {
      idempresa: empresa.idempresa,
      nombre: empresa.nombre,
      descripcion: empresa.descripcion,
      ubicacion: { lat: empresa.ubicacion.y, lng: empresa.ubicacion.x },
      usuario_idusuario: empresa.usuario_idusuario,
      matriz_idmatriz: empresa.matriz_idmatriz,
      eliminado: empresa.eliminado
    };

    console.log('Enviando PATCH:', body);

    return this.http.patch<Empresa>(`${this.apiUrl}/${empresa.idempresa}`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
        return throwError(error);
      })
    );
  }

  eliminarEmpresa(idempresa: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idempresa}`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerMatrices(): Observable<Matriz[]> {
    return this.http.get<Matriz[]>(this.apiMatrizUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error.message);
    return throwError(() => error);
  }
}