import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MetodoPago } from '../interfaces/Metodopago';

@Injectable({
  providedIn: 'root'
})
export class MetodopagoService {
  private apiUrl = `${appsettings.apiUrl}metododepago`;

  constructor(private http: HttpClient) { }

  // Obtener todos los métodos de pago
  getMetodosDePago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener métodos de pago:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Crear un nuevo método de pago
  createMetodoDePago(metodoDePago: MetodoPago): Observable<MetodoPago> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<MetodoPago>(this.apiUrl, metodoDePago, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear método de pago:', error);
        return throwError(() => new Error(error));  
      })
    );
  }

  // Actualizar un método de pago existente
  updateMetodoDePago(idmetododepago: number, metodoDePago: MetodoPago): Observable<MetodoPago> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.patch<MetodoPago>(`${this.apiUrl}/${idmetododepago}`, metodoDePago, { headers }).pipe(
      catchError((error) => {
        const mensajeError = error.error?.message || JSON.stringify(error);
        console.error('Error al actualizar método de pago:', mensajeError);
        return throwError(() => mensajeError);
      })
    );
  }

  // Eliminar un método de pago
  deleteMetodoDePago(idmetododepago: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idmetododepago}`).pipe(
      catchError(error => {
        console.error('Error al eliminar método de pago:', error);
        return throwError(() => new Error(error));  
      })
    );
  }
}