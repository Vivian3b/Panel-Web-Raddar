import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseAcceso } from '../interfaces/ResponseAcceso';
import { Login } from '../interfaces/Login';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;

  login(objeto: Login): Observable<ResponseAcceso> {
    return this.http.post<ResponseAcceso>(`${this.baseUrl}usuario/login`, objeto, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  refreshToken(refreshToken: string): Observable<{ accessToken: string, refreshToken: string }> {
    return this.http.post<{ accessToken: string, refreshToken: string }>(
      `${this.baseUrl}usuario/refresh-token`, 
      { refreshToken }
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem("refreshToken");
  
    if (refreshToken) {
      this.http.post(`${this.baseUrl}usuario/logout`, { refreshToken }).subscribe({
        next: () => this.limpiarSesion(),
        error: () => this.limpiarSesion()
      });
    } else {
      this.limpiarSesion();
    }
  }
  
  private limpiarSesion(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    location.reload();
  }
}
