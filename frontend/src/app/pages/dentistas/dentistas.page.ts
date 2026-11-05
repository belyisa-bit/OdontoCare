import type { OnInit } from '@angular/core';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon, IonSearchbar, IonSkeletonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, arrowBackOutline, searchOutline, refreshOutline } from 'ionicons/icons';
import { Subject, debounceTime } from 'rxjs';

import type { Dentista } from '../../core/models/dentista.model';
import { ESPECIALIDADES } from '../../core/models/especialidade.model';
import { DentistasService } from '../../core/services/dentistas.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

@Component({
  selector: 'app-dentistas',
  templateUrl: './dentistas.page.html',
  styleUrls: ['./dentistas.page.scss'],
  imports: [
    PageHeaderComponent,
    SiteFooterComponent,
    RouterLink,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonSearchbar,
    IonSkeletonText,
  ],
})
export class DentistasPage implements OnInit {
  private readonly service = inject(DentistasService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchChanges = new Subject<void>();
  private requestVersion = 0;

  readonly dentistas = signal<Dentista[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly search = signal('');
  readonly failedPhotos = signal<Set<number>>(new Set());
  readonly specialty = signal('');
  readonly filtersActive = computed(() => !!this.search().trim() || !!this.specialty());
  readonly specialties = computed(() => {
    const names: string[] = ESPECIALIDADES.map((item) => item.name);
    if (this.specialty() && !names.includes(this.specialty())) names.push(this.specialty());
    return names;
  });
  readonly filteredDentists = computed(() => {
    const words = normalize(this.search()).split(/\s+/).filter(Boolean);
    const specialty = normalize(this.specialty());
    return this.dentistas().filter((dentista) => {
      const text = normalize(`${dentista.nome} ${dentista.especialidade} ${dentista.cro ?? ''}`);
      return (
        (!specialty || normalize(dentista.especialidade) === specialty) && words.every((word) => text.includes(word))
      );
    });
  });
  readonly resultLabel = computed(() => {
    const count = this.filteredDentists().length;
    return count === 1 ? '1 profissional encontrado' : `${count} profissionais encontrados`;
  });

  constructor() {
    addIcons({ arrowForwardOutline, arrowBackOutline, searchOutline, refreshOutline });
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.search.set((params.get('q') ?? '').slice(0, 120));
      const selected = (params.get('especialidade') ?? '').trim();
      this.specialty.set(ESPECIALIDADES.find((item) => normalize(item.name) === normalize(selected))?.name ?? selected);
    });
    this.searchChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.persistFilters());
  }

  ngOnInit(): void {
    void this.loadDentists();
  }

  async loadDentists(): Promise<void> {
    const version = ++this.requestVersion;
    this.loading.set(true);
    this.error.set(false);
    try {
      const dentists = await this.service.listar();
      if (version === this.requestVersion && !this.destroyRef.destroyed) this.dentistas.set(dentists);
    } catch {
      if (version === this.requestVersion && !this.destroyRef.destroyed) this.error.set(true);
    } finally {
      if (version === this.requestVersion && !this.destroyRef.destroyed) this.loading.set(false);
    }
  }

  onSearch(event: Event): void {
    const value = (event as CustomEvent<{ value?: string | null }>).detail.value ?? '';
    this.search.set(value.slice(0, 120));
    this.searchChanges.next();
  }

  selectSpecialty(specialty: string): void {
    this.specialty.set(specialty);
    this.persistFilters();
  }

  clearFilters(): void {
    this.search.set('');
    this.specialty.set('');
    this.persistFilters();
  }

  onPhotoError(id: number): void {
    this.failedPhotos.update((ids) => new Set([...ids, id]));
  }

  initials(name: string): string {
    const parts = name
      .replace(/^dra?\.?\s+/i, '')
      .trim()
      .split(/\s+/);
    return `${parts[0]?.[0] ?? ''}${parts.length > 1 ? parts[parts.length - 1][0] : ''}`.toLocaleUpperCase('pt-BR');
  }

  private persistFilters(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.search().trim() || null, especialidade: this.specialty() || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
