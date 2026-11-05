import type { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/detalhes/detalhes.page').then((m) => m.DetalhesPage),
  },
  {
    path: 'agendamentos',
    loadComponent: () => import('./pages/agendamentos/agendamentos.page').then((m) => m.AgendamentosPage),
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/sobre/sobre.page').then((m) => m.SobrePage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
