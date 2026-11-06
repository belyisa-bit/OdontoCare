import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AUTH_GATEWAY } from '../models/auth.model';
import type { AuthUser, LoginCredentials, Registration } from '../models/auth.model';

import { AuthTokenStore } from './auth-token.store';
import { NotificationsService } from './notifications.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly gateway = inject(AUTH_GATEWAY, { optional: true });
  private readonly notifications = inject(NotificationsService);
  private readonly tokens = inject(AuthTokenStore);
  private readonly account = signal<AuthUser | null>(null);
  private restoration?: Promise<void>;
  private requestVersion = 0;
  readonly user = this.account.asReadonly();
  readonly signedIn = computed(() => this.account() !== null);
  readonly available = !!this.gateway;

  constructor() {
    this.tokens.invalidated$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.requestVersion++;
      this.setUser(null);
      this.restoration = undefined;
    });
  }

  restore(force = false): Promise<void> {
    if (force) this.restoration = undefined;
    return (this.restoration ??= this.restoreSession());
  }

  private async restoreSession(): Promise<void> {
    const version = this.requestVersion;
    try {
      const user = (await this.gateway?.session()) ?? null;
      if (version === this.requestVersion) this.setUser(user);
    } catch {
      if (version === this.requestVersion) this.setUser(null);
      this.restoration = undefined;
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.restore();
    if (!this.gateway) throw new Error('Acesso temporariamente indisponível.');
    this.setUser(await this.gateway.login(credentials));
    this.requestVersion++;
    this.restoration = Promise.resolve();
  }

  async register(details: Registration): Promise<void> {
    await this.restore();
    if (!this.gateway) throw new Error('Cadastro temporariamente indisponível.');
    this.setUser(await this.gateway.register(details));
    this.requestVersion++;
    this.restoration = Promise.resolve();
  }

  async logout(): Promise<void> {
    this.requestVersion++;
    try {
      await this.gateway?.logout();
    } finally {
      this.setUser(null);
      this.restoration = Promise.resolve();
    }
  }

  private setUser(user: AuthUser | null): void {
    this.account.set(user);
    this.notifications.setSession(user?.id ?? null);
  }
}
