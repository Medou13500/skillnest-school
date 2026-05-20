import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/AuthService';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next.handle(authReq).pipe(
      catchError((err: any) => {
        if (err && err.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            // no refresh token -> logout
            void this.authService.logout();
            return throwError(() => err);
          }

          // call refresh endpoint using fetch to avoid circular DI with HttpClient
          const url = `${environment.apiUrl}/api/auth/auth/refresh`;

          return from(
            fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refreshToken }),
              credentials: 'include'
            })
              .then(async (res) => {
                if (!res.ok) {
                  throw new Error('Refresh failed');
                }
                return res.json();
              })
          ).pipe(
            switchMap((data: any) => {
              if (!data || !data.access_token) {
                void this.authService.logout();
                return throwError(() => err);
              }

              // save new tokens
              localStorage.setItem('authToken', data.access_token);
              if (data.refresh_token) {
                localStorage.setItem('refreshToken', data.refresh_token);
              }

              // retry original request with new token
              const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${data.access_token}` } });
              return next.handle(retryReq);
            }),
            catchError((refreshErr) => {
              void this.authService.logout();
              return throwError(() => refreshErr);
            })
          );
        }

        return throwError(() => err);
      })
    );
  }
}
