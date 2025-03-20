import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AccesoService } from '../services/acceso.service';
import { of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem("token");
  const router = inject(Router);
  const accesoService = inject(AccesoService);

  if (!token) {
    router.navigate([""]);
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        accesoService.logout();
        return false;
      }

      return accesoService.refreshToken(refreshToken).pipe(
        switchMap((response) => {
          if (response.accessToken) {
            localStorage.setItem("token", response.accessToken); // Solo actualizamos el accessToken
            return of(true); // Token actualizado correctamente
          } else {
            accesoService.logout(); // Si no hay accessToken, se desloguea
            return of(false);
          }
        })
      );
    }

    return true; // Si el accessToken no ha caducado
  } catch (error) {
    accesoService.logout(); // En caso de error
    return false;
  }
};
