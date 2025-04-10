import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Modulo } from '../interfaces/Modulo';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private apiUrl = `${appsettings.apiUrl}modulo`; // Asegúrate de que la URL sea la correcta

  constructor(private http: HttpClient) { }

  // Obtener todos los módulos
  getModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener módulos:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Crear un nuevo módulo
  createModulo(modulo: Modulo): Observable<Modulo> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<Modulo>(this.apiUrl, modulo, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear módulo:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Actualizar un módulo existente
  updateModulo(id: number, modulo: Modulo): Observable<Modulo> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.patch<Modulo>(`${this.apiUrl}/actualizarModulo/${id}`, modulo, { headers }).pipe(
      catchError((error) => {
        const mensajeError = error.error?.message || JSON.stringify(error);
        console.error('Error al actualizar módulo:', mensajeError);
        return throwError(() => mensajeError);
      })
    );
  }

  // Eliminar un módulo
  deleteModulo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarModulo/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar módulo:', error);
        return throwError(() => new Error(error));  
      })
    );
  }
}