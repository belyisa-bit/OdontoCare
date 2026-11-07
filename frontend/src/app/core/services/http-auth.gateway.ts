import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, TimeoutError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthApiError } from '../models/auth-api-error';
import type { AuthGateway, AuthUser, LoginCredentials, Registration } from '../models/auth.model';

import { AuthTokenStore } from './auth-token.store';

const AUTH_REQUEST_TIMEOUT_MS = 15_000;

@Injectable({ providedIn: 'root' })
export class HttpAuthGateway implements AuthGateway {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(AuthTokenStore);
  private readonly url = `${environment.apiUrl}/auth`;

  async session(): Promise<AuthUser | null> {
    const token = this.tokens.read();
    if (!token) return null;
    try {
      const data = await firstValueFrom(this.http.get<unknown>(`${this.url}/me`, { timeout: AUTH_REQUEST_TIMEOUT_MS }));
      return this.tokens.read() === token ? this.userFrom(data) : null;
    } catch (error) {
      // Older API versions returned 403 for an invalid JWT on /me.
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        if (this.tokens.read() === token) this.tokens.clear();
        return null;
      }
      throw this.apiError(error, false);
    }
  }

  login(credentials: LoginCredentials): Promise<AuthUser> {
    return this.authenticate('login', credentials);
  }
  register(details: Registration): Promise<AuthUser> {
    return this.authenticate('register', details);
  }

  async logout(): Promise<void> {
    // The current backend has no logout endpoint or JWT revocation.
    this.tokens.clear();
  }

  private async authenticate(action: 'login' | 'register', body: LoginCredentials | Registration): Promise<AuthUser> {
    const version = this.tokens.version;
    try {
      const data = await firstValueFrom(
        this.http.post<unknown>(`${this.url}/${action}`, body, { timeout: AUTH_REQUEST_TIMEOUT_MS }),
      );
      const user = this.userFrom(data);
      const token = (data as Record<string, unknown>)['token'];
      if (typeof token !== 'string' || !token.trim()) throw new Error('Resposta de autenticação inválida.');
      if (version !== this.tokens.version)
        throw new AuthApiError(409, 'A sessão mudou durante a solicitação. Tente entrar novamente.');
      this.tokens.save(token);
      return user;
    } catch (error) {
      throw this.apiError(error, action === 'register');
    }
  }

  private userFrom(data: unknown): AuthUser {
    if (!data || typeof data !== 'object') throw new Error('Resposta de autenticação inválida.');
    const user = data as Record<string, unknown>;
    const id = user['id'];
    if (
      !((typeof id === 'number' && Number.isSafeInteger(id) && id > 0) || (typeof id === 'string' && !!id.trim())) ||
      typeof user['nome'] !== 'string' ||
      !user['nome'].trim() ||
      typeof user['email'] !== 'string' ||
      !user['email'].trim()
    )
      throw new Error('Resposta de autenticação inválida.');
    return { id: String(id), nome: user['nome'], email: user['email'] };
  }

  private apiError(error: unknown, registration: boolean): AuthApiError {
    if (error instanceof AuthApiError) return error;
    const status = error instanceof HttpErrorResponse ? error.status : error instanceof TimeoutError ? 0 : -1;
    let message: string;
    switch (status) {
      case 0:
        message = 'Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.';
        break;
      case 409:
        message = registration
          ? 'Este e-mail já está cadastrado. Entre na sua conta ou use outro e-mail.'
          : 'Não foi possível concluir a solicitação. Tente novamente mais tarde.';
        break;
      case 401:
      case 403:
        message = registration
          ? 'Não foi possível criar a conta. Confira os dados ou tente entrar se já possui cadastro.'
          : 'E-mail ou senha incorretos.';
        break;
      case 400:
        message = 'Confira os dados informados e os requisitos da senha.';
        break;
      default:
        message = 'Não foi possível concluir a solicitação. Tente novamente mais tarde.';
    }
    return new AuthApiError(status, message);
  }
}
