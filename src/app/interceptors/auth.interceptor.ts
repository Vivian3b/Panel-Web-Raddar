import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AccesoService } from '../services/acceso.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const accesoService = inject(AccesoService);
  const router = inject(Router);
  const token = localStorage.getItem("token");

  if (req.url.includes('/refresh-token')) {
    return next(req); // No interceptar la solicitud de refresh token
  }

  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedRequest).pipe(
    catchError(error => {
      if (error.status === 401) { // Si el token ha expirado
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          accesoService.logout();
          router.navigateByUrl("");
          return throwError(() => new Error("Unauthorized"));
        }

        return accesoService.refreshToken(refreshToken).pipe(
          switchMap((response: any) => {
            if (!response.accessToken) {
              accesoService.logout();
              router.navigateByUrl("");
              return throwError(() => new Error("Session expired"));
            }
        
            localStorage.setItem("token", response.accessToken); // Actualizamos el accessToken
            // No tocamos el refreshToken, solo actualizamos el accessToken

            // Clonamos la solicitud y la reenviamos con el nuevo access token
            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            });

            return next(newRequest); // Intentamos la solicitud con el nuevo token
          }),
          catchError((err) => {
            accesoService.logout();
            router.navigateByUrl("");
            return throwError(() => new Error("Session expired"));
          })
        );
      }

      return throwError(() => error);
    })
  );
};
