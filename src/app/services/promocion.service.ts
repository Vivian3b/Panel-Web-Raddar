import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  subirImagenes(promocionId: number, imagenes: File[]): Observable<any> {
  const formData = new FormData();
  formData.append('promocion_id', promocionId.toString());
  imagenes.forEach(imagen => formData.append('images', imagen));
  return this.http.post(`${appsettings.apiUrl}upload`, formData);
}
  eliminarImagenPorUrl(url: string): Observable<any> {
    const params = new HttpParams().set('url', url);
    return this.http.delete(`${appsettings.apiUrl}imagen`, { params }).pipe(
      catchError(error => {
        console.error('Error al eliminar imagen por URL:', error);
        return throwError(() => new Error(error?.message || 'Error al eliminar imagen'));
      })
    );
  }

  // Obtener todas las promociones
  getPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener promociones:', error);
        return throwError(() => new Error(error));  
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
        return throwError(() => new Error(error));  
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
  
  deletePromocion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar promoción:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Obtener los tipos de promociones ('Informativa', 'Venta')
  getTipos(): string[] {
    return ['Informativa', 'Venta']; // Los valores que provienen del ENUM en la base de datos
  }

  getPromocionPorId(id: number): Observable<Promocion> {
    return this.http.get<Promocion>(`${this.apiUrl}/${id}`);
  }

}
