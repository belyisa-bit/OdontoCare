import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';

import type { AppointmentNotification, NotificationGateway } from '../models/notification.model';

export const NOTIFICATION_GATEWAY = new InjectionToken<NotificationGateway>('NOTIFICATION_GATEWAY');

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly gateway = inject(NOTIFICATION_GATEWAY, { optional: true });
  private readonly account = signal<string | null>(null);
  private readonly items = signal<AppointmentNotification[]>([]);
  private readonly loadingState = signal(false);
  private readonly savingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private requestVersion = 0;

  readonly signedIn = computed(() => this.account() !== null);
  readonly notifications = this.items.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly saving = this.savingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly unreadCount = computed(() => this.items().filter((item) => !item.read).length);

  /** Call from authentication on login, account switch, and logout (null). */
  setSession(accountId: string | null): void {
    if (accountId === this.account()) return;
    this.requestVersion++;
    this.account.set(accountId);
    this.items.set([]);
    this.errorState.set(null);
    this.loadingState.set(false);
    this.savingState.set(false);
  }

  async refresh(): Promise<void> {
    if (!this.signedIn() || this.saving()) return;
    if (!this.gateway) {
      this.errorState.set('Os lembretes ainda não estão disponíveis. Tente novamente mais tarde.');
      return;
    }
    const version = ++this.requestVersion;
    this.loadingState.set(true);
    this.errorState.set(null);
    try {
      const notifications = await this.gateway.load();
      if (version !== this.requestVersion) return;
      this.items.set(notifications.map((item) => ({ ...item })));
    } catch {
      if (version === this.requestVersion) this.errorState.set('Não foi possível atualizar os lembretes.');
    } finally {
      if (version === this.requestVersion) this.loadingState.set(false);
    }
  }

  async markRead(ids: string[]): Promise<void> {
    if (!this.gateway || !this.signedIn() || this.saving() || this.loading()) return;
    const pending = this.items()
      .filter((item) => !item.read && ids.includes(item.id))
      .map((item) => item.id);
    if (!pending.length) return;
    const version = this.requestVersion;
    this.savingState.set(true);
    this.errorState.set(null);
    try {
      await this.gateway.markRead(pending);
      if (version === this.requestVersion) {
        this.items.update((items) => items.map((item) => (pending.includes(item.id) ? { ...item, read: true } : item)));
      }
    } catch {
      if (version === this.requestVersion) this.errorState.set('Não foi possível marcar os lembretes como lidos.');
    } finally {
      if (version === this.requestVersion) this.savingState.set(false);
    }
  }

  markAllRead(): Promise<void> {
    return this.markRead(this.items().map((item) => item.id));
  }
}
