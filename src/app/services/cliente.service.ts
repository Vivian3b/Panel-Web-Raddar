import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from '../interfaces/Cliente';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${appsettings.apiUrl}cliente`;

  constructor(private http: HttpClient) { }

    getClientes(): Observable<Cliente[]> {
      return this.http.get<Cliente[]>(this.apiUrl).pipe(
        catchError(error => {
          console.error('Error al obtener clientes:', error);
          return throwError(() => new Error(error)); 
        })
      );
    }
  
    createCliente(cliente: Cliente): Observable<Cliente> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      return this.http.post<Cliente>(this.apiUrl, cliente, { headers }).pipe(
        catchError(error => {
          console.error('Error al crear cliente:', error);
          return throwError(() => new Error(error));  // Propaga el error
        })
      );
    }

      updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
      
        // Asegurarse de que las fechas no sean convertidas automáticamente a objetos Date
        const clienteConFechasCorrectas = {
          ...cliente,
        };
      
        return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, clienteConFechasCorrectas, { headers }).pipe(
          catchError((error) => {
            const mensajeError = error.error?.message || JSON.stringify(error);
            console.error('Error al actualizar cliente:', mensajeError);
            return throwError(() => mensajeError);
          })
        );
      }

    
  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar cliente:', error);
        return throwError(() => new Error(error));  // Propaga el error
      })
    );
  }
}
