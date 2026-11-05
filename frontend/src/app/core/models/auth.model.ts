import { InjectionToken } from '@angular/core';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
}
export interface LoginCredentials {
  email: string;
  senha: string;
}
export interface Registration extends LoginCredentials {
  nome: string;
}
/** An adapter must validate the server session. Never implement this using a local flag. */
export interface AuthGateway {
  session(): Promise<AuthUser | null>;
  login(credentials: LoginCredentials): Promise<AuthUser>;
  register(details: Registration): Promise<void>;
  logout(): Promise<void>;
}
export const AUTH_GATEWAY = new InjectionToken<AuthGateway>('AUTH_GATEWAY');
