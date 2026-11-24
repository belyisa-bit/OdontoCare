import type { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'dentistas',
    loadComponent: () => import('./pages/dentistas/dentistas.page').then((m) => m.DentistasPage),
  },
  {
    path: 'dentistas/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/detalhes/detalhes.page').then((m) => m.DetalhesPage),
  },
  {
    path: 'agendamentos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/agendamentos/agendamentos.page').then((m) => m.AgendamentosPage),
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/sobre/sobre.page').then((m) => m.SobrePage),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then((m) => m.CadastroPage),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
