import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { appsettings } from '../settings/appsettings';
import { Promocion } from '../interfaces/Promocion';

@Injectable({
  providedIn: 'root'
})
export class PromocionService {
  private apiUrl = `${appsettings.apiUrl}promocion`;

  constructor(private http: HttpClient) { }

  // Obtener todas las promociones
  getPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener promociones:', error);
        return throwError(() => new Error(error));  // Propaga el error
      })
    );
  }

  // Crear una nueva promoción
  createPromocion(promocion: Promocion): Observable<Promocion> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<Promocion>(this.apiUrl, promocion, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear promoción:', error);
        return throwError(() => new Error(error));  // Propaga el error
      })
    );
  }

  // Actualizar una promoción existente
  updatePromocion(id: number, promocion: Promocion): Observable<Promocion> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    // Asegurarse de que las fechas no sean convertidas automáticamente a objetos Date
    const promocionConFechasCorrectas = {
      ...promocion,
      vigenciainicio: new Date(promocion.vigenciainicio).toISOString().split('T')[0],
      vigenciafin: new Date(promocion.vigenciafin).toISOString().split('T')[0],
    };
  
    return this.http.patch<Promocion>(`${this.apiUrl}/${id}`, promocionConFechasCorrectas, { headers }).pipe(
      catchError((error) => {
        const mensajeError = error.error?.message || JSON.stringify(error);
        console.error('Error al actualizar promoción:', mensajeError);
        return throwError(() => mensajeError);
      })
    );
  }
  

  // Eliminar una promoción
  deletePromocion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar promoción:', error);
        return throwError(() => new Error(error));  // Propaga el error
      })
    );
  }
}
