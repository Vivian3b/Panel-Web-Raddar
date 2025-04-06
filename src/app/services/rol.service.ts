import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Rol } from '../interfaces/Rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = `${appsettings.apiUrl}rol`;
  
    constructor(private http: HttpClient) { }
  
    getRoles(): Observable<Rol[]> {
      return this.http.get<Rol[]>(this.apiUrl).pipe(
        catchError(error => {
          console.error('Error al obtener roles:', error);
          return throwError(() => new Error(error));
        })
      );
    }
  
    // Crear un nuevo rol
    createRol(rol: Rol): Observable<Rol> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      return this.http.post<Rol>(this.apiUrl, rol, { headers }).pipe(
        catchError(error => {
          console.error('Error al crear rol:', error);
          return throwError(() => new Error(error));
        })
      );
    }
  
    // Actualizar un rol existente
    updateRol(id: number, rol: Rol): Observable<Rol> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      return this.http.patch<Rol>(`${this.apiUrl}/${id}`, rol, { headers }).pipe(
        catchError(error => {
          const mensajeError = error.error?.message || JSON.stringify(error);
          console.error('Error al actualizar rol:', mensajeError);
          return throwError(() => mensajeError);
        })
      );
    }
  
    // Eliminar un rol
    deleteRol(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(error => {
          console.error('Error al eliminar rol:', error);
          return throwError(() => new Error(error));
        })
      );
    }
  }