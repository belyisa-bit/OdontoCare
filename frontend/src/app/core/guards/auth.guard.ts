import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export function safeReturnUrl(value: string | null): string {
  return value && !value.includes('\\') && /^\/(?:home|dentistas\/[^/?#]+|agendamentos|perfil)(?:[?#].*)?$/.test(value)
    ? value
    : '/perfil';
}

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.restore(true);
  return auth.signedIn() || router.createUrlTree(['/login'], { queryParams: { returnUrl: safeReturnUrl(state.url) } });
};
