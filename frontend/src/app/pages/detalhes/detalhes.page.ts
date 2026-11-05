import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader } from '@ionic/angular';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  imports: [PageHeaderComponent, SiteFooterComponent, IonContent, IonHeader, CommonModule, FormsModule],
})
export class DetalhesPage {}
