import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Empresa } from '../interfaces/Empresa';
import { catchError, Observable, throwError } from 'rxjs';
import { Matriz } from '../interfaces/Matriz';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${appsettings.apiUrl}empresa`;
  private apiMatrizUrl = `${appsettings.apiUrl}matriz`;

  constructor(private http: HttpClient) {}

  crearEmpresa(empresa: Empresa): Observable<Empresa> {
    if (!empresa.ubicacion || !empresa.ubicacion.y || !empresa.ubicacion.x) {
      console.error('Coordenadas inválidas');
      return throwError('Coordenadas inválidas');
    }

    // Obtener el token y decodificar
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return throwError(() => new Error('Token no encontrado'));
    }

    let idusuario: number;
    try {
      const decoded: any = jwtDecode(token);
      idusuario = decoded.idusuario;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return throwError(() => new Error('Token inválido'));
    }

    const body = {
      nombre: empresa.nombre,
      descripcion: empresa.descripcion,
      ubicacion: { lat: empresa.ubicacion.y, lng: empresa.ubicacion.x },
      usuario_idusuario: idusuario, // Asignación automática desde el token
      matriz_idmatriz: empresa.matriz_idmatriz,
      eliminado: empresa.eliminado
    };

    console.log('Enviando POST:', body);

    return this.http.post<Empresa>(this.apiUrl, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
        return throwError(error);
      })
    );
  }

  obtenerEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  obtenerEmpresa(idempresa: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${idempresa}`).pipe(
      catchError(this.handleError)
    );
  }

  actualizarEmpresa(empresa: Empresa): Observable<Empresa> {
    if (!empresa.ubicacion || !empresa.ubicacion.y || !empresa.ubicacion.x) {
      console.error('Coordenadas inválidas');
      return throwError('Coordenadas inválidas');
    }

    const body = {
      idempresa: empresa.idempresa,
      nombre: empresa.nombre,
      descripcion: empresa.descripcion,
      ubicacion: { lat: empresa.ubicacion.y, lng: empresa.ubicacion.x },
      usuario_idusuario: empresa.usuario_idusuario,
      matriz_idmatriz: empresa.matriz_idmatriz,
      eliminado: empresa.eliminado
    };

    console.log('Enviando PATCH:', body);

    return this.http.patch<Empresa>(`${this.apiUrl}/${empresa.idempresa}`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
        return throwError(error);
      })
    );
  }

  eliminarEmpresa(idempresa: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idempresa}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
        return throwError(error);  // Manejamos el error si ocurre
      })
    );
  }
  

  obtenerMatrices(): Observable<Matriz[]> {
    return this.http.get<Matriz[]>(this.apiMatrizUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error.message);
    return throwError(() => error);
  }
}