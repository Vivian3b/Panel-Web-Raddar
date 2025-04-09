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
      map((usuarios: Usuario[]) => {
        return usuarios;
      })
    );
  }
  

  createUser(usuario: Usuario): Observable<Usuario> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Obtener el token JWT del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Decodificar el token JWT para obtener el id del creador
      const decodedToken: any = jwtDecode(token);
      const idcreador = decodedToken.idusuario;  // Asegúrate de que el token contiene el id del usuario autenticado

      // Agregar el idcreador al objeto usuario
      const usuarioConCreador = { ...usuario, idcreador };

      // Realizar la solicitud POST al backend con el idcreador incluido
      return this.http.post<Usuario>(this.apiUrl, usuario, { headers }).pipe(
        catchError(error => {
          console.error('Error al crear usuario:', error);
          return throwError(() => new Error(error));  
        })
      );
    } else {
      console.error('No se encontró el token JWT');
      return throwError(() => new Error('No se encontró el token JWT'));
    }
  }

  updateUser(id: number, usuario: Usuario): Observable<Usuario> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, usuario, { headers }).pipe(
      catchError(error => {
        console.error('Error al actualizar usuario:', error);
        return throwError(() => new Error(error));  
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
}
