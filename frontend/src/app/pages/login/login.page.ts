import { Component } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular';

import { AuthFormComponent } from '../../shared/components/auth-form/auth-form.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent, PageHeaderComponent, SiteFooterComponent, IonContent, IonHeader],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {}
