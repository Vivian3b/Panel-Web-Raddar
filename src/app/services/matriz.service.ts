import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Matriz } from '../interfaces/Matriz';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatrizService {
  private apiUrl = `${appsettings.apiUrl}matriz`;

  constructor(private http: HttpClient) {}

  getMatrices(): Observable<Matriz[]> {
    return this.http.get<Matriz[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener matrices:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Crear o actualizar una matriz (con PATCH)
  guardarMatriz(matriz: Matriz): Observable<Matriz> {
    if (matriz.idmatriz) {
      // Usamos PATCH para actualización parcial
      return this.http.patch<Matriz>(`${this.apiUrl}/${matriz.idmatriz}`, matriz).pipe(
        catchError(this.handleError)
      );
    } else {
      // Crear nueva
      return this.http.post<Matriz>(this.apiUrl, matriz).pipe(
        catchError(this.handleError)
      );
    }
  }

  // Eliminar matriz
  eliminarMatriz(idmatriz: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idmatriz}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores global
  private handleError(error: any) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente o de la red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El servidor respondió con un código de estado que indica un error
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}