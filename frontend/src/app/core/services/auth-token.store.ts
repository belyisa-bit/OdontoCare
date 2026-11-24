import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const AUTH_TOKEN_KEY = 'odontocare.auth.token';

@Injectable({ providedIn: 'root' })
export class AuthTokenStore {
  private readonly window = inject(DOCUMENT).defaultView;
  private memory: string | null = null;
  private revision = 0;
  get version(): number {
    return this.revision;
  }
  private readonly invalidated = new Subject<void>();
  readonly invalidated$ = this.invalidated.asObservable();

  constructor() {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea === this.window?.localStorage && (event.key === AUTH_TOKEN_KEY || event.key === null)) {
        this.revision++;
        this.memory = null;
        this.invalidated.next();
      }
    };
    this.window?.addEventListener('storage', onStorage);
    inject(DestroyRef).onDestroy(() => this.window?.removeEventListener('storage', onStorage));
  }

  read(): string | null {
    try {
      return this.window?.localStorage.getItem(AUTH_TOKEN_KEY) ?? this.memory;
    } catch {
      return this.memory;
    }
  }

  save(token: string): void {
    this.revision++;
    this.memory = token;
    try {
      this.window?.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      /* Private browsing: keep only in memory. */
    }
  }

  clear(): void {
    this.revision++;
    this.memory = null;
    try {
      this.window?.localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      /* Storage may be unavailable. */
    }
    this.invalidated.next();
  }
}
