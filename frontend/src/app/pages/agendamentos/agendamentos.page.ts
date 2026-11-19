
import type { OnInit } from '@angular/core';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon, IonSkeletonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, refreshOutline } from 'ionicons/icons';

import type { Agendamento } from '../../core/models/agendamento.model';
import { AgendamentosService } from '../../core/services/agendamentos.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-agendamentos',
  templateUrl: './agendamentos.page.html',
  styleUrls: ['./agendamentos.page.scss'],
  imports: [
    PageHeaderComponent,
    SiteFooterComponent,
    RouterLink,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonSkeletonText,
  ],
})
export class AgendamentosPage implements OnInit {
  private readonly service = inject(AgendamentosService);
  private readonly destroyRef = inject(DestroyRef);
  private requestVersion = 0;

  readonly agendamentos = signal<Agendamento[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    addIcons({ arrowBackOutline, calendarOutline, refreshOutline });
  }

  ngOnInit(): void {
    void this.loadAgendamentos();
  }

  async loadAgendamentos(): Promise<void> {
    const version = ++this.requestVersion;
    this.loading.set(true);
    this.error.set(false);

    try {
      const data = await this.service.listar();

      if (version === this.requestVersion && !this.destroyRef.destroyed) {
        this.agendamentos.set(data);
      }
    } catch {
      if (version === this.requestVersion && !this.destroyRef.destroyed) {
        this.error.set(true);
      }
    } finally {
      if (version === this.requestVersion && !this.destroyRef.destroyed) {
        this.loading.set(false);
      }
    }
  }
}
