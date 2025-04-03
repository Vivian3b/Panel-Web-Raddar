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

  crearMatriz(matriz: Matriz): Observable<Matriz> {
    // Verificar que las coordenadas no estén indefinidas
    if (!matriz.ubicacion || !matriz.ubicacion.y || !matriz.ubicacion.x) {
      console.error('Coordenadas inválidas');
      return throwError('Coordenadas inválidas');
    }

    const body = {
      nombre: matriz.nombre,
      ubicacion: { lat: matriz.ubicacion.y, lng: matriz.ubicacion.x }, // Convertir a lat/lng
      telefono: matriz.telefono,
      email: matriz.email,
      eliminado: matriz.eliminado
    };

    console.log('Enviando POST:', body);

    return this.http.post<Matriz>(this.apiUrl, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
        return throwError(error);
      })
    );
  }

  getMatrices(): Observable<Matriz[]> {
    return this.http.get<Matriz[]>(this.apiUrl);
  }

  guardarMatriz(matriz: Matriz): Observable<Matriz> {
    if (!matriz.ubicacion || !matriz.ubicacion.y || !matriz.ubicacion.x) {
      console.error('Coordenadas inválidas');
      return throwError('Coordenadas inválidas');
    }

    const body = {
      idmatriz: matriz.idmatriz,
      nombre: matriz.nombre,
      ubicacion: { lat: matriz.ubicacion.y, lng: matriz.ubicacion.x }, 
      telefono: matriz.telefono,
      email: matriz.email,
      eliminado: matriz.eliminado
    };

    console.log('Enviando PATCH:', body);

    return this.http.patch<Matriz>(`${this.apiUrl}/${matriz.idmatriz}`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
        return throwError(error);
      })
    );
  }

  eliminarMatriz(idmatriz: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idmatriz}`);
  }
}