import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const AUTH_TOKEN_KEY = 'odontocare.auth.token';

@Injectable({ providedIn: 'root' })
export class AuthTokenStore {
  private readonly window = inject(DOCUMENT).defaultView;
  private memory: string | null = null;
  private readonly invalidated = new Subject<void>();
  readonly invalidated$ = this.invalidated.asObservable();

  constructor() {
    this.window?.addEventListener('storage', (event) => {
      if ((event.key === AUTH_TOKEN_KEY && !event.newValue) || event.key === null) {
        this.memory = null;
        this.invalidated.next();
      }
    });
  }

  read(): string | null {
    try {
      return this.window?.localStorage.getItem(AUTH_TOKEN_KEY) ?? this.memory;
    } catch {
      return this.memory;
    }
  }

  save(token: string): void {
    this.memory = token;
    try {
      this.window?.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      /* Private browsing: keep only in memory. */
    }
  }

  clear(): void {
    this.memory = null;
    try {
      this.window?.localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      /* Storage may be unavailable. */
    }
    this.invalidated.next();
  }
}
