import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, arrowForwardOutline, eyeOutline, eyeOffOutline, lockClosedOutline } from 'ionicons/icons';

import { safeReturnUrl } from '../../../core/guards/auth.guard';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonButton, IonIcon, IonSpinner],
})
export class AuthFormComponent {
  readonly registerMode = input(false);
  readonly auth = inject(AuthService);
  private readonly builder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly visiblePassword = signal(false);
  readonly busy = signal(false);
  readonly submitted = signal(false);
  readonly error = signal('');
  readonly returnUrl = safeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl'));
  readonly registered = this.route.snapshot.queryParamMap.get('cadastro') === 'concluido';
  readonly form = this.builder.nonNullable.group({
    nome: ['', [Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    senha: ['', [Validators.required, Validators.maxLength(128)]],
    confirmacao: [''],
  });

  private readonly password = toSignal(this.form.controls.senha.valueChanges, { initialValue: '' });
  readonly passwordRequirements = computed(() => {
    const value = this.password();
    return [
      { label: 'De 8 a 128 caracteres', met: value.length >= 8 && value.length <= 128 },
      { label: 'Uma letra maiúscula', met: /\p{Lu}/u.test(value) },
      { label: 'Uma letra minúscula', met: /\p{Ll}/u.test(value) },
      { label: 'Um número', met: /\p{N}/u.test(value) },
      { label: 'Um símbolo (ex.: @, ! ou #)', met: /[^\p{L}\p{N}\s]/u.test(value) },
    ];
  });
  readonly requirementsMet = computed(() => this.passwordRequirements().filter((rule) => rule.met).length);

  constructor() {
    addIcons({ arrowBackOutline, arrowForwardOutline, eyeOutline, eyeOffOutline, lockClosedOutline });
  }

  invalid(field: 'nome' | 'email' | 'senha' | 'confirmacao'): boolean {
    const control = this.form.controls[field];
    if (!this.submitted() && !control.touched) return false;
    const value = control.value;
    if (this.registerMode()) {
      if (field === 'nome' && !value.trim()) return true;
      if (field === 'senha' && this.passwordRequirements().some((rule) => !rule.met)) return true;
      if (field === 'confirmacao' && value !== this.form.controls.senha.value) return true;
    }
    return control.invalid;
  }

  async submit(): Promise<void> {
    if (this.busy()) return;
    this.submitted.set(true);
    this.error.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid || (['nome', 'email', 'senha', 'confirmacao'] as const).some((field) => this.invalid(field)))
      return;
    this.busy.set(true);
    const { nome, email, senha } = this.form.getRawValue();
    try {
      if (this.registerMode()) {
        await this.auth.register({ nome: nome.trim(), email: email.trim(), senha });
        this.form.reset();
        await this.router.navigate(['/login'], { queryParams: { returnUrl: this.returnUrl, cadastro: 'concluido' } });
      } else {
        await this.auth.login({ email: email.trim(), senha });
        this.form.reset();
        await this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
      }
    } catch {
      this.form.controls.senha.reset();
      this.form.controls.confirmacao.reset();
      this.error.set(
        this.auth.available
          ? this.registerMode()
            ? 'Não foi possível criar a conta. Confira os dados e tente novamente.'
            : 'Não foi possível entrar. Confira suas credenciais e tente novamente.'
          : this.registerMode()
            ? 'Cadastro temporariamente indisponível. Tente novamente mais tarde.'
            : 'Acesso temporariamente indisponível. Tente novamente mais tarde.',
      );
    } finally {
      this.busy.set(false);
    }
  }
}
