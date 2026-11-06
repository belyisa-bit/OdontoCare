import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { AuthGateway, AuthUser, LoginCredentials, Registration } from '../models/auth.model';

import { AuthTokenStore } from './auth-token.store';

export class AuthApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

@Injectable({ providedIn: 'root' })
export class HttpAuthGateway implements AuthGateway {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(AuthTokenStore);
  private readonly url = `${environment.apiUrl}/auth`;

  async session(): Promise<AuthUser | null> {
    const token = this.tokens.read();
    if (!token) return null;
    try {
      const data = await firstValueFrom(this.http.get<unknown>(`${this.url}/me`));
      return this.tokens.read() === token ? this.userFrom(data) : null;
    } catch (error) {
      // This backend can return 403 instead of 401 for an invalid JWT on /me.
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
    try {
      const data = await firstValueFrom(this.http.post<unknown>(`${this.url}/${action}`, body));
      const user = this.userFrom(data);
      const token = (data as Record<string, unknown>)['token'];
      if (typeof token !== 'string' || !token.trim()) throw new Error('Resposta de autenticação inválida.');
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
    const status = error instanceof HttpErrorResponse ? error.status : -1;
    const message =
      status === 0
        ? 'Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.'
        : status === 409 && registration
          ? 'Este e-mail já está cadastrado. Entre na sua conta ou use outro e-mail.'
          : status === 401 || status === 403
            ? registration
              ? 'Não foi possível criar a conta. Confira os dados ou tente entrar se já possui cadastro.'
              : 'E-mail ou senha incorretos.'
            : status === 400
              ? 'Confira os dados informados e os requisitos da senha.'
              : 'Não foi possível concluir a solicitação. Tente novamente mais tarde.';
    return new AuthApiError(status, message);
  }
}
