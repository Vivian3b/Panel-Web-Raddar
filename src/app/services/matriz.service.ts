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

  // Obtener matrices
  getMatrices(): Observable<Matriz[]> {
    return this.http.get<Matriz[]>(this.apiUrl);
  }

  // Guardar (crear o actualizar) matriz con PATCH
  guardarMatriz(matriz: Matriz): Observable<Matriz> {
    if (matriz.idmatriz) {
      // Si tiene ID, actualizamos
      const body = {
        idmatriz: matriz.idmatriz,
        nombre: matriz.nombre,
        ubicacion: {
          lat: matriz.ubicacion.y,  // Cambiar 'lat' por 'y'
          lng: matriz.ubicacion.x   // Cambiar 'lng' por 'x'
        },
        telefono: matriz.telefono,
        email: matriz.email
      };

      return this.http.patch<Matriz>(`${this.apiUrl}/${matriz.idmatriz}`, body);
    } else {
      // Si no tiene ID, creamos
      const body = {
        nombre: matriz.nombre,
        ubicacion: {
          lat: matriz.ubicacion.y,  // Cambiar 'lat' por 'y'
          lng: matriz.ubicacion.x   // Cambiar 'lng' por 'x'
        },
        telefono: matriz.telefono,
        email: matriz.email
      };
      return this.http.post<Matriz>(this.apiUrl, body);
    }
  }

  // Eliminar matriz
  eliminarMatriz(idmatriz: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idmatriz}`);
  }
}