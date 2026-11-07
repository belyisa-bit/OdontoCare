import { Component } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular';

import { AuthFormComponent } from '../../shared/components/auth-form/auth-form.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-cadastro',
  imports: [AuthFormComponent, PageHeaderComponent, SiteFooterComponent, IonContent, IonHeader],
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage {}
