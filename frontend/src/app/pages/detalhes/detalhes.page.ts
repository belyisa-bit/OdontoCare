
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent, IonHeader } from '@ionic/angular';

import type { Dentista } from '../../core/models/dentista.model';
import { DentistasService } from '../../core/services/dentistas.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    SiteFooterComponent,
    IonContent,
    IonHeader,
  ],
})
export class DetalhesPage {
  private readonly route = inject(ActivatedRoute);
  private readonly dentistasService = inject(DentistasService);

  readonly dentista = signal<Dentista | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly error = signal(false);

  constructor() {
    void this.carregarDentista();
  }

  async carregarDentista(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    this.notFound.set(false);

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || !Number.isInteger(id) || id <= 0) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    try {
      const resultado = await this.dentistasService.buscarPorId(id);

      if (!resultado) {
        this.notFound.set(true);
        return;
      }

      this.dentista.set(resultado);
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
/**Código alterado (utilizar o ID recebido pela rota
 *  /dentistas/:id e consultar o serviço existente) */