import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Tarjeta } from '../interfaces/Tarjeta';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  private apiUrl = `${appsettings.apiUrl}tarjeta`;

  constructor(private http: HttpClient) { }

  // Obtener todas las tarjetas
  getTarjetas(): Observable<Tarjeta[]> {
    return this.http.get<Tarjeta[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener tarjetas:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Crear una nueva tarjeta
  createTarjeta(tarjeta: Tarjeta): Observable<Tarjeta> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<Tarjeta>(this.apiUrl, tarjeta, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear tarjeta:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Actualizar una tarjeta existente
  updateTarjeta(id: number, tarjeta: Tarjeta): Observable<Tarjeta> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    return this.http.patch<Tarjeta>(`${this.apiUrl}/${id}`, tarjeta, { headers }).pipe(
      catchError((error) => {
        const mensajeError = error.error?.message || JSON.stringify(error);
        console.error('Error al actualizar tarjeta:', mensajeError);
        return throwError(() => mensajeError);
      })
    );
  }

  // Eliminar una tarjeta
  deleteTarjeta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar tarjeta:', error);
        return throwError(() => new Error(error));  
      })
    );
  }
}