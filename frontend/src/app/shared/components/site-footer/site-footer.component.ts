import { Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  template: `<footer>
    <strong>Odonto<span>Care</span></strong>
    <p>Um novo motivo para sorrir.</p>
    <small>© {{ year }} OdontoCare</small>
  </footer>`,
  styles: `
    :host {
      display: block;
      background: #f2f7ff;
      color: #61778f;
    }
    footer {
      margin: 0 24px;
      padding: 25px 12px 30px;
      border-top: 1px solid #dfe9f6;
      text-align: center;
    }
    strong {
      color: #253c5e;
      font-size: 15px;
      letter-spacing: -0.4px;
    }
    strong span {
      color: #169ee8;
    }
    p {
      font-size: 12px;
      margin: 8px 0;
    }
    small {
      font-size: 10px;
      color: #73879d;
    }
  `,
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();
}
