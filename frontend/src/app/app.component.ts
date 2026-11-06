import { DOCUMENT } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  MenuController,
  IonContent,
  IonHeader,
  IonFooter,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  peopleOutline,
  calendarOutline,
  informationCircleOutline,
  personOutline,
  logOutOutline,
} from 'ionicons/icons';

import { AuthService } from './core/services/auth.service';
import { SidebarService } from './core/services/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonContent,
    IonHeader,
    IonFooter,
    IonItem,
    IonIcon,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuToggle,
    IonRouterOutlet,
    IonSplitPane,
    IonTitle,
    IonToolbar,
  ],
})
export class AppComponent {
  readonly sidebar = inject(SidebarService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  logoutError = '';

  async logout(): Promise<void> {
    this.logoutError = '';
    try {
      await this.auth.logout();
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch {
      this.logoutError = 'Não foi possível sair. Tente novamente.';
    }
  }
  private readonly menus = inject(MenuController);
  private readonly document = inject(DOCUMENT);
  private menuOpener: HTMLElement | null = null;

  rememberMenuFocus(): void {
    let active = this.document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    this.menuOpener = active instanceof HTMLElement ? active : null;
  }

  focusMenu(event: Event): void {
    this.menuLinks(event.target as HTMLElement)[0]?.focus();
  }

  restoreMenuFocus(): void {
    const opener = this.menuOpener;
    this.menuOpener = null;
    requestAnimationFrame(() => {
      const trigger = Array.from(this.document.querySelectorAll('ion-menu-button')).find(
        (item) => item.getClientRects().length > 0,
      );
      const button = trigger?.shadowRoot?.querySelector<HTMLButtonElement>('button');
      if (button) button.focus();
      else if (opener?.getClientRects().length) opener.focus();
    });
  }

  private menuLinks(menu: HTMLElement): HTMLElement[] {
    return Array.from(menu.querySelectorAll<HTMLElement>('ion-item, .logout-button'))
      .map((item) => (item.matches('.logout-button') ? item : item.shadowRoot?.querySelector<HTMLElement>('a, button')))
      .filter((item): item is HTMLElement => !!item);
  }

  onMenuKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const menu = event.currentTarget as HTMLElement;
    if (!menu.classList.contains('show-menu')) return;
    const links = this.menuLinks(menu);
    const current = event.composedPath()[0];
    const first = links[0];
    const last = links[links.length - 1];
    if (event.shiftKey && current === first) {
      event.preventDefault();
      last?.focus();
    }
    if (!event.shiftKey && current === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  @HostListener('document:keydown.escape')
  async closeMenuWithEscape(): Promise<void> {
    const menu = await this.menus.getOpen();
    if (menu) await menu.close();
  }
  constructor() {
    void this.auth.restore();
    addIcons({ homeOutline, peopleOutline, calendarOutline, informationCircleOutline, personOutline, logOutOutline });
  }
}
