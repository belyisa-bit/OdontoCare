import { Component } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular';

import { AuthFormComponent } from '../../shared/components/auth-form/auth-form.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent, PageHeaderComponent, SiteFooterComponent, IonContent, IonHeader],
  template:
    '<ion-header class="ion-no-border"><app-page-header></app-page-header></ion-header><ion-content><app-auth-form [registerMode]="false"></app-auth-form><app-site-footer></app-site-footer></ion-content>',
  styles: 'ion-content { --background: #f2f7ff; }',
})
export class LoginPage {}
