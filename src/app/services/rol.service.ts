import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Rol } from '../interfaces/Rol';
import { jwtDecode } from 'jwt-decode';

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
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return throwError(() => new Error('Token no encontrado'));
    }

    let idactualizacion: number;
    try {
      const decoded: any = jwtDecode(token);
      idactualizacion = decoded.idusuario;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return throwError(() => new Error('Token inválido'));
    }

    const body = {
      nombre: rol.nombre,
      idactualizacion: idactualizacion,
      fechaactualizacion: new Date().toISOString().split('T')[0],
      eliminado: rol.eliminado
    };

    return this.http.patch<Rol>(`${this.apiUrl}/${id}`, body).pipe(
      catchError(this.handleError)
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

    private handleError(error: HttpErrorResponse) {
        console.error('Error en la solicitud:', error.message);
        return throwError(() => error);
      }
  }