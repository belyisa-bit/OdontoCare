import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthTokenStore } from '../services/auth-token.store';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokens = inject(AuthTokenStore);
  const router = inject(Router);
  const isApi = request.url.startsWith(`${environment.apiUrl}/`);
  const isCredentials =
    request.url === `${environment.apiUrl}/auth/login` || request.url === `${environment.apiUrl}/auth/register`;
  const token = isApi && !isCredentials ? tokens.read() : null;
  if (!token) return next(request);
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && tokens.read() === token) {
        tokens.clear();
        const returnUrl = router.url;
        if (/^\/(?:perfil|agendamentos|dentistas\/[^/?#]+)(?:[?#]|$)/.test(returnUrl)) {
          void router.navigate(['/login'], { queryParams: { returnUrl }, replaceUrl: true });
        }
      }
      return throwError(() => error);
    }),
  );
};
