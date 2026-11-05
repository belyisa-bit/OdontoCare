import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [PageHeaderComponent, SiteFooterComponent, RouterLink, IonButton, IonContent, IonHeader, IonIcon],
})
export class HomePage {
  readonly specialties = [
    { name: 'Clínico geral', icon: 'tooth' },
    { name: 'Ortodontia', icon: 'braces' },
    { name: 'Implantodontia', icon: 'implant' },
    { name: 'Endodontia', icon: 'root-canal' },
    { name: 'Periodontia', icon: 'gum' },
    { name: 'Odontopediatria', icon: 'child' },
    { name: 'Cirurgia bucomaxilofacial', icon: 'surgery' },
    { name: 'Prótese dentária', icon: 'crown' },
    { name: 'Dentística', icon: 'restoration' },
    { name: 'Radiologia odontológica', icon: 'xray' },
  ];

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
