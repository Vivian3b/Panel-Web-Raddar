import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Notificacion } from '../interfaces/Notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private apiUrl = `${appsettings.apiUrl}notificacion`;

  constructor(private http: HttpClient) { }

  // Obtener todas las notificaciones
  getNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener notificaciones:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Crear una nueva notificación
  createNotificacion(notificacion: Notificacion): Observable<Notificacion> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<Notificacion>(this.apiUrl, notificacion, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear notificación:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Actualizar una notificación existente
  updateNotificacion(id: number, notificacion: Notificacion): Observable<Notificacion> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.patch<Notificacion>(`${this.apiUrl}/${id}`, notificacion, { headers }).pipe(
      catchError((error) => {
        const mensajeError = error.error?.message || JSON.stringify(error);
        console.error('Error al actualizar notificación:', mensajeError);
        return throwError(() => mensajeError);
      })
    );
  }

  // Eliminar una notificación
  deleteNotificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar notificación:', error);
        return throwError(() => new Error(error));  
      })
    );
  }
}
