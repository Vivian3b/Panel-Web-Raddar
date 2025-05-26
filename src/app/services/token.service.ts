import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) return 0;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.id || 0;
  }
}
