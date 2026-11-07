import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

import { AuthFormComponent } from './auth-form.component';

describe('Senha do cadastro', () => {
  async function setup(registerMode = true) {
    await TestBed.configureTestingModule({
      imports: [AuthFormComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(AuthFormComponent);
    fixture.componentRef.setInput('registerMode', registerMode);
    fixture.detectChanges();
    fixture.componentInstance.form.controls.senha.markAsTouched();
    return fixture.componentInstance;
  }

  it.each([
    'abc123!x',
    'ABC123!X',
    'Abcdefg!',
    'Abcdef12',
    'Ab1!',
    'Abcdef1 ',
    'Árvore!123',
    'Abcdef1#',
    'Aa1!' + 'x'.repeat(125),
  ])('recusa senha sem todos os requisitos: %s', async (senha) => {
    const component = await setup();
    component.form.controls.senha.setValue(senha);
    expect(component.invalid('senha')).toBe(true);
  });

  it.each(['Sorriso@2026', 'Arvore!123', 'Abcde1!x'])('aceita senha com todos os requisitos: %s', async (senha) => {
    const component = await setup();
    component.form.controls.senha.setValue(senha);
    expect(component.invalid('senha')).toBe(false);
  });

  it('impede enviar um cadastro com senha fraca', async () => {
    const component = await setup();
    const register = vi.spyOn(TestBed.inject(AuthService), 'register');
    component.form.setValue({
      nome: 'Maria Souza',
      email: 'maria@exemplo.com',
      senha: 'senhafraca',
      confirmacao: 'senhafraca',
    });
    await component.submit();
    expect(register).not.toHaveBeenCalled();
  });

  it('no login, permite enviar a senha existente para o servidor validar', async () => {
    const component = await setup(false);
    component.form.controls.senha.setValue('senha-existente');
    expect(component.invalid('senha')).toBe(false);
  });
});
