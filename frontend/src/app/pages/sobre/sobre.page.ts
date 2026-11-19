import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  imports: [
    PageHeaderComponent,
    SiteFooterComponent,
    RouterLink,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
  ],
})
export class SobrePage {
  constructor() {
    addIcons({ arrowForwardOutline });
  }
}