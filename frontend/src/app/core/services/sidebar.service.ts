import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly collapsedState = signal(false);
  readonly collapsed = this.collapsedState.asReadonly();

  toggle(): void {
    this.collapsedState.update((collapsed) => !collapsed);
  }
}
