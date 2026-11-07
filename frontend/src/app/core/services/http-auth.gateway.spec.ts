import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { authInterceptor } from '../interceptors/auth.interceptor';

import { AUTH_TOKEN_KEY, AuthTokenStore } from './auth-token.store';
import { HttpAuthGateway } from './http-auth.gateway';

const account = { id: 7, nome: 'Maria Souza', email: 'maria@exemplo.com' };
describe('Integração HTTP da autenticação', () => {
  let http: HttpTestingController;
  let gateway: HttpAuthGateway;
  let tokens: AuthTokenStore;
  beforeEach(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    gateway = TestBed.inject(HttpAuthGateway);
    tokens = TestBed.inject(AuthTokenStore);
  });
  afterEach(() => {
    http.verify();
    localStorage.removeItem(AUTH_TOKEN_KEY);
  });

  it('envia cadastro sem bearer antigo, normaliza o id e guarda somente o token', async () => {
    tokens.save('old');
    const result = gateway.register({ nome: account.nome, email: account.email, senha: 'Sorriso@2026' });
    const request = http.expectOne('/api/auth/register');
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.has('Authorization')).toBe(false);
    expect(request.request.body).toEqual({ nome: account.nome, email: account.email, senha: 'Sorriso@2026' });
    request.flush({ ...account, token: 'new-token' });
    expect(await result).toEqual({ ...account, id: '7' });
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('new-token');
  });

  it('recupera a sessão com bearer e limpa JWT rejeitado em /me', async () => {
    tokens.save('saved-token');
    const result = gateway.session();
    const request = http.expectOne('/api/auth/me');
    expect(request.request.headers.get('Authorization')).toBe('Bearer saved-token');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(await result).toBeNull();
    expect(tokens.read()).toBeNull();
  });

  it('não envia token a serviços externos e não faz logout inexistente', async () => {
    tokens.save('private-token');
    const result = firstValueFrom(TestBed.inject(HttpClient).get('https://other.example/api/test'));
    const request = http.expectOne('https://other.example/api/test');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
    await result;
    await gateway.logout();
    expect(tokens.read()).toBeNull();
    http.expectNone('/api/auth/logout');
  });

  it.each([400, 401, 409, 500])('trata HTTP %s sem guardar token', async (status) => {
    const result = gateway.register({ nome: account.nome, email: account.email, senha: 'Sorriso@2026' });
    const assertion = expect(result).rejects.toMatchObject({ status });
    http.expectOne('/api/auth/register').flush({}, { status, statusText: 'Error' });
    await assertion;
    expect(tokens.read()).toBeNull();
  });

  it('recusa resposta de sucesso sem token', async () => {
    const result = gateway.login({ email: account.email, senha: 'Sorriso@2026' });
    const assertion = expect(result).rejects.toThrow();
    http.expectOne('/api/auth/login').flush(account);
    await assertion;
    expect(tokens.read()).toBeNull();
  });

  it('não guarda token de um login que terminou depois de sair da conta', async () => {
    const pending = gateway.login({ email: account.email, senha: 'Sorriso@2026' });
    const assertion = expect(pending).rejects.toThrow('sessão mudou');
    const request = http.expectOne('/api/auth/login');
    await gateway.logout();
    request.flush({ ...account, token: 'late-token' });
    await assertion;
    expect(tokens.read()).toBeNull();
  });

  it('troca de conta em outra aba invalida a identidade anterior', () => {
    tokens.save('account-a');
    const changed = vi.fn();
    const subscription = tokens.invalidated$.subscribe(changed);
    localStorage.setItem(AUTH_TOKEN_KEY, 'account-b');
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: AUTH_TOKEN_KEY,
        oldValue: 'account-a',
        newValue: 'account-b',
        storageArea: localStorage,
      }),
    );
    expect(changed).toHaveBeenCalledOnce();
    expect(tokens.read()).toBe('account-b');
    subscription.unsubscribe();
  });

  it('um 401 de uma requisição antiga não apaga um token mais recente', async () => {
    tokens.save('old-token');
    const pending = firstValueFrom(TestBed.inject(HttpClient).get('/api/agendamentos'));
    const assertion = expect(pending).rejects.toMatchObject({ status: 401 });
    const request = http.expectOne('/api/agendamentos');
    tokens.save('new-token');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    await assertion;
    expect(tokens.read()).toBe('new-token');
  });
});
