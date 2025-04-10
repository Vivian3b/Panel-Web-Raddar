import { Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Categoria } from '../interfaces/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${appsettings.apiUrl}categoria`;

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener categorías:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Crear una nueva categoría
  createCategoria(categoria: Categoria): Observable<Categoria> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<Categoria>(this.apiUrl, categoria, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear categoría:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Actualizar una categoría existente
  updateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const categoriaActualizada = {
      ...categoria,
      fechacreacion: new Date(categoria.fechacreacion).toISOString(),
      fechaactualizacion: new Date().toISOString(),
    };

    return this.http.patch<Categoria>(`${this.apiUrl}/${id}`, categoriaActualizada, { headers }).pipe(
      catchError((error) => {
        const mensajeError = error.error?.message || JSON.stringify(error);
        console.error('Error al actualizar categoría:', mensajeError);
        return throwError(() => mensajeError);
      })
    );
  }

  // Eliminar una categoría
  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar categoría:', error);
        return throwError(() => new Error(error));
      })
    );
  }
}