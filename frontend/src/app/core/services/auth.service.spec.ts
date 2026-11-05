import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { authGuard, safeReturnUrl } from '../guards/auth.guard';
import { AUTH_GATEWAY } from '../models/auth.model';
import type { AuthGateway } from '../models/auth.model';

import { AuthService } from './auth.service';
import { NotificationsService } from './notifications.service';

const user = { id: '1', nome: 'Paciente', email: 'paciente@exemplo.com' };
function setup() {
  const gateway = {
    session: vi.fn<AuthGateway['session']>().mockResolvedValue(null),
    login: vi.fn<AuthGateway['login']>().mockResolvedValue(user),
    register: vi.fn<AuthGateway['register']>().mockResolvedValue(undefined),
    logout: vi.fn<AuthGateway['logout']>().mockResolvedValue(undefined),
  };
  TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AUTH_GATEWAY, useValue: gateway }] });
  return { gateway, auth: TestBed.inject(AuthService) };
}

describe('Autenticação', () => {
  it('visitantes são enviados ao login com o destino original', async () => {
    const { auth } = setup();
    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/dentistas/12' } as RouterStateSnapshot),
    );
    expect(TestBed.inject(Router).serializeUrl(result as ReturnType<Router['createUrlTree']>)).toBe(
      '/login?returnUrl=%2Fdentistas%2F12',
    );
    expect(auth.signedIn()).toBe(false);
  });
  it('login confirmado libera a rota e conecta os lembretes; logout limpa a sessão', async () => {
    const { auth, gateway } = setup();
    await auth.login({ email: user.email, senha: 'senha-exemplo' });
    expect(auth.user()).toEqual(user);
    expect(TestBed.inject(NotificationsService).signedIn()).toBe(true);
    expect(
      await TestBed.runInInjectionContext(() =>
        authGuard({} as ActivatedRouteSnapshot, { url: '/perfil' } as RouterStateSnapshot),
      ),
    ).toBe(true);
    await auth.logout();
    expect(auth.user()).toBeNull();
    expect(TestBed.inject(NotificationsService).signedIn()).toBe(false);
    expect(gateway.logout).toHaveBeenCalledOnce();
  });
  it('não autentica quando o servidor rejeita as credenciais', async () => {
    const { auth, gateway } = setup();
    gateway.login.mockRejectedValue(new Error('unauthorized'));
    await expect(auth.login({ email: user.email, senha: 'errada' })).rejects.toThrow();
    expect(auth.signedIn()).toBe(false);
  });
  it('restaura a sessão confirmada pelo servidor uma única vez', async () => {
    const { auth, gateway } = setup();
    gateway.session.mockResolvedValue(user);
    await Promise.all([auth.restore(), auth.restore()]);
    expect(gateway.session).toHaveBeenCalledOnce();
    expect(auth.signedIn()).toBe(true);
  });
  it('cadastro não cria uma sessão automaticamente', async () => {
    const { auth, gateway } = setup();
    await auth.register({ ...user, senha: 'senha-exemplo' });
    expect(gateway.register).toHaveBeenCalledOnce();
    expect(auth.signedIn()).toBe(false);
  });
  it('sem integração, falha explicitamente e não cria login fictício', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const auth = TestBed.inject(AuthService);
    await expect(auth.login({ email: user.email, senha: 'senha-exemplo' })).rejects.toThrow('indisponível');
    expect(auth.signedIn()).toBe(false);
  });
  it('recusa destinos externos e rotas de autenticação como retorno', () => {
    for (const value of ['https://outro.site', '//outro.site', '/login', '/cadastro', '/perfil/../../login'])
      expect(safeReturnUrl(value)).toBe('/perfil');
    expect(safeReturnUrl('/dentistas/12')).toBe('/dentistas/12');
    expect(safeReturnUrl('/agendamentos')).toBe('/agendamentos');
  });
});
