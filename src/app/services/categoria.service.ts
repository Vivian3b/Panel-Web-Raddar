import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Categoria } from '../interfaces/Categoria';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${appsettings.apiUrl}categoria`;

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return throwError(() => new Error('Token no encontrado'));
    }

    let idcreador: number;
    try {
      const decoded: any = jwtDecode(token);
      idcreador = decoded.idusuario;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return throwError(() => new Error('Token inválido'));
    }

    const body = {
      nombre: categoria.nombre,
      idcreador: idcreador,
      fechacreacion: new Date().toISOString().split('T')[0],
      eliminado: categoria.eliminado ?? 0
    };

    return this.http.post<Categoria>(this.apiUrl, body).pipe(
      catchError(this.handleError)
    );
  }

  actualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
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
      nombre: categoria.nombre,
      idactualizacion: idactualizacion,
      fechaactualizacion: new Date().toISOString().split('T')[0],
      eliminado: categoria.eliminado
    };

    return this.http.patch<Categoria>(`${this.apiUrl}/${id}`, body).pipe(
      catchError(this.handleError)
    );
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error.message);
    return throwError(() => error);
  }
}