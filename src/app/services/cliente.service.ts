import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Cliente } from '../interfaces/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${appsettings.apiUrl}usuario`;
  
    constructor(private http: HttpClient) { }
  
    getUsers(): Observable<Cliente[]> {
      return this.http.get<Cliente[]>(this.apiUrl).pipe(
        catchError(error => {
          console.error('Error al obtener usuarios:', error);
          return throwError(() => new Error(error));
        }),
        map((clientes: Cliente[]) => clientes)
      );
    }
  
    createUser(usuario: Cliente): Observable<{ usuario: Cliente, token: string }> {
    const token = localStorage.getItem('token');
    if (!token) return throwError(() => new Error('No se encontró el token JWT'));
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const decodedToken: any = jwtDecode(token);
    const idcreador = decodedToken.idusuario;
  
    const nuevoUsuario = {
      ...usuario,
      idcreador
    };
  
    return this.http.post<{ usuario: Cliente, token: string }>(this.apiUrl, nuevoUsuario, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear usuario:', error);
        return throwError(() => new Error(error?.error?.message || JSON.stringify(error)));
      })
    );
  }
  
  
    updateUser(id: number, cliente: Cliente): Observable<Cliente> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
      return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, cliente, { headers }).pipe(
        catchError(error => {
          console.error('Error al actualizar usuario:', error);
          return throwError(() => new Error(error?.error?.message || 'Error al actualizar usuario'));
        })
      );
    }
  
    deleteUser(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(error => {
          console.error('Error al eliminar usuario:', error);
          return throwError(() => new Error(error));
        })
      );
    }
  
    verifyEmail(token: string): Observable<any> {
      const url = `${this.apiUrl}/confirmarUsuario/${token}`;
      return this.http.get<any>(url).pipe(
        catchError(error => {
          console.error('Error al verificar el correo:', error);
          return throwError(() => new Error(error));
        })
      );
    }
  }