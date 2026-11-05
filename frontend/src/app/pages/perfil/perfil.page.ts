import { Component } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [PageHeaderComponent, SiteFooterComponent, IonContent, IonHeader],
})
export class PerfilPage {}
