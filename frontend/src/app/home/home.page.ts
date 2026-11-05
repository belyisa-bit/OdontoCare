import { Component } from '@angular/core';
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
  ];

  constructor() {
    addIcons({ arrowForwardOutline });
  }
}
