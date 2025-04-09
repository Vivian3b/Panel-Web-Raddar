import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Movimiento } from '../interfaces/Movimiento';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiUrl = `${appsettings.apiUrl}movimiento`;

  constructor(private http: HttpClient) { }

  // Obtener todos los movimientos
  getMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener movimientos:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Eliminar un movimiento
  deleteMovimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar movimiento:', error);
        return throwError(() => new Error(error));  
      })
    );
  }
}