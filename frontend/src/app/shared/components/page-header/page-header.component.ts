import { Component, inject } from '@angular/core';
import { IonButton, IonIcon, IonMenuButton, IonPopover, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { notificationsOutline } from 'ionicons/icons';

import { NotificationsService } from '../../../core/services/notifications.service';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';

@Component({
  selector: 'app-page-header',
  imports: [NotificationPanelComponent, IonButton, IonIcon, IonMenuButton, IonPopover, IonToolbar],
  template: `
    <ion-toolbar>
      <div class="header-row">
        <ion-menu-button aria-label="Abrir menu"></ion-menu-button>
        <span class="brand" aria-label="OdontoCare">
          <svg viewBox="0 0 40 44" aria-hidden="true">
            <path d="M20 7C10-1 2 5 4 17c1 7 5 22 9 22 4 0 2-15 7-15s3 15 7 15c4 0 8-15 9-22C38 5 30-1 20 7Z" />
            <path d="m20 7 7 3" />
          </svg>
          <span>Odonto<span class="accent">Care</span></span>
        </span>
        <ion-button
          class="reminder-button"
          fill="clear"
          [attr.aria-label]="
            notifications.unreadCount() ? notifications.unreadCount() + ' lembretes não lidos' : 'Abrir lembretes'
          "
          aria-haspopup="dialog"
          [attr.aria-expanded]="remindersOpen"
          (click)="openReminders($event)"
        >
          <ion-icon slot="icon-only" name="notifications-outline" aria-hidden="true"></ion-icon>
          @if (notifications.unreadCount() > 0) {
            <span class="unread-badge">{{ notifications.unreadCount() > 9 ? '9+' : notifications.unreadCount() }}</span>
          }
        </ion-button>
      </div>
    </ion-toolbar>
    <ion-popover [isOpen]="remindersOpen" [event]="reminderEvent" (didDismiss)="remindersOpen = false">
      <ng-template>
        <app-notification-panel (closePanel)="remindersOpen = false"></app-notification-panel>
      </ng-template>
    </ion-popover>
  `,
  styles: `
    :host {
      display: block;
      background: #f2f7ff;
    }
    ion-toolbar {
      --background: #f2f7ff;
      --color: #090d3d;
      --min-height: 78px;
      padding-inline: 14px;
    }
    .header-row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 78px;
      padding-inline: 8px;
    }
    ion-menu-button {
      flex: 0 0 44px;
      width: 44px;
      height: 44px;
      margin: 0;
      --color: #169ee8;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 25px;
      font-weight: 750;
      letter-spacing: -0.8px;
    }
    svg {
      flex-shrink: 0;
      width: 37px;
      height: 42px;
      fill: none;
      stroke: #169ee8;
      stroke-width: 2.6;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .accent {
      color: #169ee8;
    }
    .reminder-button {
      flex: 0 0 44px;
      width: 44px;
      height: 44px;
      margin: 0 0 0 auto;
      --padding-start: 10px;
      --padding-end: 10px;
      --border-radius: 15px;
      --background: #ffffffb3;
      --color: #101b46;
    }
    .unread-badge {
      position: absolute;
      top: 2px;
      right: 0;
      min-width: 16px;
      padding: 2px;
      border-radius: 10px;
      color: white;
      background: #087aba;
      font-size: 9px;
    }
    .reminder-button ion-icon {
      font-size: 25px;
    }
    ion-popover {
      --background: #f5f9ff;
      --width: min(340px, calc(100vw - 24px));
      --box-shadow: 0 8px 32px #193e6b26;
      --backdrop-opacity: 0.12;
    }
    .reminders h2 {
      margin: 0 0 15px;
      font-size: 18px;
      font-weight: 700;
    }
    .reminders span {
      display: block;
      font-size: 12px;
      line-height: 1.6;
      color: #61778f;
    }
    @media (max-width: 380px) {
      .brand {
        font-size: 20px;
        gap: 5px;
      }
      .header-row {
        gap: 6px;
        padding-inline: 2px;
      }
    }
    @media (max-width: 760px) {
      ion-toolbar {
        padding-inline: 3px;
      }
      .brand {
        font-size: 23px;
        gap: 7px;
      }
      svg {
        width: 32px;
        height: 38px;
      }
    }
    @media (max-width: 380px) {
      .brand {
        font-size: 20px;
        gap: 5px;
      }
    }
  `,
})
export class PageHeaderComponent {
  readonly notifications = inject(NotificationsService);
  remindersOpen = false;
  reminderEvent?: Event;

  constructor() {
    addIcons({ notificationsOutline });
  }

  openReminders(event: Event): void {
    this.reminderEvent = event;
    this.remindersOpen = true;
    if (!this.notifications.saving()) void this.notifications.refresh();
  }
}
