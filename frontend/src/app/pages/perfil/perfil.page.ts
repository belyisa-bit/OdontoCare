import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TelefonePipe } from '../../shared/pipes/telefone-pipe';
import { CpfPipe } from '../../shared/pipes/cpf-pipe';
import { IonContent, IonHeader } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [
    PageHeaderComponent,
    SiteFooterComponent,
    IonContent,
    IonHeader,
    RouterLink,
    DatePipe,
    TelefonePipe,
    CpfPipe,
    ReactiveFormsModule,
  ],
})
export class PerfilPage {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly leaving = signal(false);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly today = new Date().toLocaleDateString('en-CA');
  readonly form = inject(FormBuilder).nonNullable.group({
    telefone: ['', Validators.pattern(/^$|^[0-9()\s+.-]{10,20}$/)],
    dataNascimento: [''],
    cpf: ['', Validators.pattern(/^$|^[0-9.\s-]{11,14}$/)],
  });

  edit(): void {
    const user = this.auth.user();
    this.form.reset({
      telefone: user?.telefone ?? '',
      cpf: user?.cpf ?? '',
      dataNascimento: user?.dataNascimento ?? '',
    });
    this.message.set('');
    this.error.set('');
    this.editing.set(true);
  }

  async save(): Promise<void> {
    if (this.saving()) return;
    this.error.set('');
    const raw = this.form.getRawValue();
    const telefone = raw.telefone.replace(/\D/g, '');
    const cpf = raw.cpf.replace(/\D/g, '');
    if (this.form.controls.cpf.invalid || (cpf && cpf.length !== 11)) {
      this.error.set('Informe um CPF com 11 números.');
      return;
    }
    if (this.form.invalid || (telefone && !/^\d{10,11}$/.test(telefone))) {
      this.error.set('Informe um telefone com DDD e 10 ou 11 números.');
      return;
    }
    if (raw.dataNascimento && raw.dataNascimento >= this.today) {
      this.error.set('A data de nascimento deve ser anterior a hoje.');
      return;
    }
    this.saving.set(true);
    try {
      await this.auth.updateProfile({ telefone, cpf, dataNascimento: raw.dataNascimento || null });
      this.editing.set(false);
      this.message.set('Dados atualizados com sucesso.');
    } catch {
      this.error.set('Não foi possível salvar. Confira os dados e tente novamente.');
    } finally {
      this.saving.set(false);
    }
  }
  readonly initials = computed(() => {
    const names = this.auth.user()?.nome.trim().split(/\s+/).filter(Boolean) ?? [];
    return (
      names.length > 1 ? names[0][0] + names[names.length - 1][0] : (names[0]?.slice(0, 2) ?? 'OC')
    ).toUpperCase();
  });

  async logout(): Promise<void> {
    if (this.leaving()) return;
    this.leaving.set(true);
    try {
      await this.auth.logout();
    } finally {
      this.leaving.set(false);
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
}
