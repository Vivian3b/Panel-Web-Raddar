import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Permiso } from '../interfaces/Permiso';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private apiUrl = `${appsettings.apiUrl}permiso`; // Asegúrate de que la URL sea la correcta

  constructor(private http: HttpClient) { }

  // Obtener todos los permisos
  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener permisos:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Crear un nuevo permiso
  createPermiso(permiso: Permiso): Observable<Permiso> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<Permiso>(this.apiUrl, permiso, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear permiso:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Actualizar un permiso existente
  updatePermiso(id: number, permiso: Permiso): Observable<Permiso> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.patch<Permiso>(`${this.apiUrl}/actualizarPermiso/${id}`, permiso, { headers }).pipe(
      catchError((error) => {
        const mensajeError = error.error?.message || JSON.stringify(error);
        console.error('Error al actualizar permiso:', mensajeError);
        return throwError(() => mensajeError);
      })
    );
  }

  // Eliminar un permiso
  deletePermiso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarPermiso/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar permiso:', error);
        return throwError(() => new Error(error));  
      })
    );
  }
}