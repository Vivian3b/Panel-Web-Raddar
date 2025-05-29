import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Usuario } from '../interfaces/Usuario';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${appsettings.apiUrl}usuario`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener usuarios:', error);
        return throwError(() => new Error(error));
      }),
      map((usuarios: Usuario[]) => usuarios)
    );
  }
/*
  createUser(usuario: Usuario): Observable<{ usuario: Usuario, token: string }> {
  const token = localStorage.getItem('token');
  if (!token) return throwError(() => new Error('No se encontró el token JWT'));

  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const decodedToken: any = jwtDecode(token);
  const idcreador = decodedToken.idusuario;

  const nuevoUsuario = {
    ...usuario,
    idcreador
  };

  return this.http.post<{ usuario: Usuario, token: string }>(this.apiUrl, nuevoUsuario, { headers }).pipe(
    catchError(error => {
      console.error('Error al crear usuario:', error);
      return throwError(() => new Error(error?.error?.message || JSON.stringify(error)));
    })
  );
}
  */


  updateUser(id: number, usuario: Usuario): Observable<Usuario> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, usuario, { headers }).pipe(
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

  crearVendedor(data: any): Observable<any> {
    return this.http.post<any>(`${appsettings.apiUrl}vendedor`, data).pipe(
      catchError(error => {
        console.error('Error al crear vendedor:', error);
        return throwError(() => new Error(error?.error?.message || JSON.stringify(error)));
      })
    );
  }

  crearAdministrador(data: any): Observable<any> {
    return this.http.post<any>(`${appsettings.apiUrl}administrador`, data).pipe(
      catchError(error => {
        console.error('Error al crear administrador:', error);
        return throwError(() => new Error(error?.error?.message || JSON.stringify(error)));
      })
    );
  }

  resetPasswordRequest(email: string): Observable<any> {
    return this.http.post(`${appsettings.apiUrl}resetpassword-request`, { email }).pipe(
      catchError(error => {
        console.error('Error al enviar solicitud de restablecimiento:', error);
        return throwError(() => new Error(error?.error?.message || JSON.stringify(error)));
      })
    );
  }


}