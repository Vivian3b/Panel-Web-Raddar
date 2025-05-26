import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { appsettings } from '../settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) { }

  solicitarCambioPassword(email: string): Observable<any> {
    const url = `${appsettings.apiUrl}resetpassword-request`;

    return this.http.post<any>(url, { email }).pipe(
      catchError(error => {
        console.error('Error al solicitar cambio de contraseña:', error);
        return throwError(() => new Error(error?.error?.message || 'Error al solicitar cambio de contraseña'));
      })
    );
  }

  cambiarPassword(token: string, nuevaPassword: string): Observable<any> {
    const url = `${appsettings.apiUrl}reset-password`;
    return this.http.post<any>(url, { token, password: nuevaPassword }).pipe(
      catchError(error => {
        console.error('Error al cambiar la contraseña:', error);
        return throwError(() => new Error(error?.error?.message || 'Error al cambiar la contraseña'));
      })
    );
  }
}
