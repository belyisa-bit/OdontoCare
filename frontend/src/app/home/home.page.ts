import { Component } from '@angular/core';
import { IonButtons, IonMenuButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButtons, IonMenuButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {}
