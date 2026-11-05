import { DatePipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-notification-panel',
  imports: [DatePipe, RouterLink],
  template: `
    <section aria-label="Lembretes" [attr.aria-busy]="notifications.loading()">
      <h2>Lembretes</h2>
      @if (!notifications.signedIn()) {
        <div class="empty">
          <strong>Seus lembretes, em um só lugar</strong>
          <p>Entre na sua conta para acompanhar os avisos das suas consultas.</p>
        </div>
      } @else {
        @if (notifications.loading()) {
          <p role="status">Atualizando lembretes…</p>
        }
        @if (notifications.error(); as error) {
          <p class="error" role="alert">{{ error }}</p>
          <button
            type="button"
            [disabled]="notifications.loading() || notifications.saving()"
            (click)="notifications.refresh()"
          >
            Tentar novamente
          </button>
        }
        @if (notifications.unreadCount() > 0) {
          <button
            type="button"
            class="mark-all"
            [disabled]="notifications.saving() || notifications.loading()"
            (click)="notifications.markAllRead()"
          >
            Marcar todas como lidas
          </button>
        }
        @if (!notifications.loading() && !notifications.error() && notifications.notifications().length === 0) {
          <div class="empty">
            <strong>Tudo em dia!</strong>
            <p>Você ainda não tem lembretes. Os avisos das suas consultas aparecerão aqui.</p>
          </div>
        }
        <ul>
          @for (notification of notifications.notifications(); track notification.id) {
            <li [class.unread]="!notification.read">
              <strong>{{ notification.title }}</strong>
              @if (!notification.read) {
                <span class="new-label">Não lido</span>
              }
              <p>{{ notification.message }}</p>
              <time [attr.datetime]="notification.createdAt">{{
                notification.createdAt | date: 'dd/MM/yyyy HH:mm' : '-0300'
              }}</time>
              @if (!notification.read) {
                <button
                  type="button"
                  [disabled]="notifications.saving() || notifications.loading()"
                  (click)="notifications.markRead([notification.id])"
                >
                  Marcar como lido
                </button>
              }
            </li>
          }
        </ul>
        <a routerLink="/agendamentos" (click)="closePanel.emit()">Ver agendamentos →</a>
        <p class="push-note">
          Os avisos no celular serão opcionais. A ativação estará disponível após a integração da conta.
        </p>
      }
    </section>
  `,
  styles: `
    section {
      padding: 22px;
      color: #101b46;
      max-height: 65dvh;
      overflow-y: auto;
    }
    h2 {
      font-size: 19px;
      margin: 0 0 20px;
      font-weight: 700;
    }
    p {
      color: #61778f;
      line-height: 1.6;
      font-size: 13px;
      margin: 9px 0;
    }
    strong {
      font-size: 14px;
    }
    .empty {
      padding: 12px 0;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      padding: 16px 12px;
      border-bottom: 1px solid #e1ebf7;
      border-radius: 10px;
      margin: 8px 0;
    }
    li.unread {
      background: #e7f3ff;
    }
    .new-label {
      display: inline-block;
      color: #116da7;
      background: #d2eaff;
      padding: 3px 6px;
      font-size: 10px;
      border-radius: 6px;
      margin-left: 6px;
    }
    time {
      display: block;
      color: #61778f;
      font-size: 11px;
      margin-top: 10px;
    }
    button,
    a {
      font: inherit;
      font-size: 12px;
      color: #087aba;
      background: transparent;
      border: 0;
      cursor: pointer;
      padding: 10px 0;
      text-align: left;
      text-decoration: none;
      display: block;
    }
    button:disabled {
      opacity: 0.5;
      cursor: wait;
    }
    button:focus-visible,
    a:focus-visible {
      outline: 2px solid #169ee8;
      outline-offset: 2px;
    }
    .mark-all {
      margin-bottom: 6px;
    }
    .error {
      color: #a22c3b;
    }
    .push-note {
      border-top: 1px solid #e1ebf7;
      padding-top: 12px;
      font-size: 11px;
    }
  `,
})
export class NotificationPanelComponent {
  readonly notifications = inject(NotificationsService);
  readonly closePanel = output<void>();
}
