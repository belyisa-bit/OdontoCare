import { computed, inject, Injectable, signal } from '@angular/core';

import { AUTH_GATEWAY } from '../models/auth.model';
import type { AuthUser, LoginCredentials, Registration } from '../models/auth.model';

import { NotificationsService } from './notifications.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly gateway = inject(AUTH_GATEWAY, { optional: true });
  private readonly notifications = inject(NotificationsService);
  private readonly account = signal<AuthUser | null>(null);
  private restoration?: Promise<void>;
  readonly user = this.account.asReadonly();
  readonly signedIn = computed(() => this.account() !== null);
  readonly available = !!this.gateway;

  restore(): Promise<void> {
    return (this.restoration ??= this.restoreSession());
  }

  private async restoreSession(): Promise<void> {
    try {
      this.setUser((await this.gateway?.session()) ?? null);
    } catch {
      this.setUser(null);
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.restore();
    if (!this.gateway) throw new Error('Acesso temporariamente indisponível. Tente novamente mais tarde.');
    const user = await this.gateway.login(credentials);
    this.setUser(user);
  }

  async register(details: Registration): Promise<void> {
    if (!this.gateway) throw new Error('Cadastro temporariamente indisponível. Tente novamente mais tarde.');
    await this.gateway.register(details);
  }

  async logout(): Promise<void> {
    await this.restore();
    await this.gateway?.logout();
    this.setUser(null);
    this.restoration = Promise.resolve();
  }

  private setUser(user: AuthUser | null): void {
    this.account.set(user);
    this.notifications.setSession(user?.id ?? null);
  }
}
