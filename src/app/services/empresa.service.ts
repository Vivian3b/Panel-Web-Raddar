import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Empresa } from '../interfaces/Empresa';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${appsettings.apiUrl}empresa`;

  constructor(private http: HttpClient) {}

  crearEmpresa(empresa: Empresa): Observable<Empresa> {
    if (!empresa.ubicacion || !empresa.ubicacion.y || !empresa.ubicacion.x) {
      console.error('Coordenadas inválidas');
      return throwError(() => new Error('Coordenadas inválidas'));
    }

    const body = {
      usuario_idusuario: empresa.usuario_idusuario,
      matriz_idmatriz: empresa.matriz_idmatriz,
      nombre: empresa.nombre,
      descripcion: empresa.descripcion,
      ubicacion: { lat: empresa.ubicacion.y, lng: empresa.ubicacion.x }
    };

    return this.http.post<Empresa>(this.apiUrl, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
        return throwError(() => error);
      })
    );
  }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl);
  }

  actualizarEmpresa(empresa: Empresa): Observable<Empresa> {
    if (!empresa.ubicacion || !empresa.ubicacion.y || !empresa.ubicacion.x) {
      console.error('Coordenadas inválidas');
      return throwError(() => new Error('Coordenadas inválidas'));
    }

    const body = {
      usuario_idusuario: empresa.usuario_idusuario,
      nombre: empresa.nombre,
      descripcion: empresa.descripcion,
      ubicacion: { lat: empresa.ubicacion.y, lng: empresa.ubicacion.x }
    };

    return this.http.patch<Empresa>(`${this.apiUrl}/${empresa.idempresa}`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error.message);
        return throwError(() => error);
      })
    );
  }

  eliminarEmpresa(idempresa: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idempresa}`);
  }
}