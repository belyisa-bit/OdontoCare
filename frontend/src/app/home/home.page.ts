import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

import { ESPECIALIDADES } from '../core/models/especialidade.model';
import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [PageHeaderComponent, SiteFooterComponent, RouterLink, IonButton, IonContent, IonHeader, IonIcon],
})
export class HomePage {
  readonly specialties = ESPECIALIDADES;

  readonly specialtiesExpanded = signal(false);
  readonly visibleSpecialties = computed(() =>
    this.specialtiesExpanded() ? this.specialties : this.specialties.slice(0, 3),
  );

  toggleSpecialties(): void {
    this.specialtiesExpanded.update((expanded) => !expanded);
  }

  constructor() {
    addIcons({ arrowForwardOutline });
  }
}
