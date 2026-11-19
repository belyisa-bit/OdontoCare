
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import type { Agendamento } from '../../core/models/agendamento.model';
import { AgendamentosService } from '../../core/services/agendamentos.service';

import { AgendamentosPage } from './agendamentos.page';

const agendamentos: Agendamento[] = [
  {
    id: 1,
    nomePaciente: 'Maria Silva',
    cpfPaciente: '12345678900',
    telefonePaciente: '81999999999',
    dataHora: '2026-11-20T14:00:00',
    tratamento: 'Limpeza',
    status: 'CONFIRMADO',
    dentistaId: 1,
    dentista: {
      id: 1,
      nome: 'Dra. Ana Bezerra',
      especialidade: 'Ortodontia',
      cro: null,
      telefone: null,
      email: null,
    },
  },
];

async function setup(fails = false) {
  const source = { listar: vi.fn<() => Promise<Agendamento[]>>() };

  if (fails) {
    source.listar.mockRejectedValue(new Error('offline'));
  } else {
    source.listar.mockResolvedValue(agendamentos);
  }

  await TestBed.configureTestingModule({
    imports: [AgendamentosPage],
    providers: [
      provideRouter([]),
      { provide: AgendamentosService, useValue: source },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AgendamentosPage);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return {
    fixture,
    component: fixture.componentInstance,
    source,
  };
}

describe('AgendamentosPage', () => {
  it('cria a página corretamente', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('carrega e exibe os agendamentos', async () => {
    const { component, fixture, source } = await setup();

    expect(source.listar).toHaveBeenCalled();
    expect(component.agendamentos()).toEqual(agendamentos);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(false);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Limpeza');
    expect(fixture.nativeElement.textContent).toContain('Dra. Ana Bezerra');
  });

  it('trata erros e permite tentar novamente', async () => {
    const { component, source } = await setup(true);

    expect(component.error()).toBe(true);
    expect(component.loading()).toBe(false);

    source.listar.mockResolvedValue([]);
    await component.loadAgendamentos();

    expect(component.error()).toBe(false);
    expect(component.loading()).toBe(false);
    expect(component.agendamentos()).toEqual([]);
  });

  it('permite exibir uma lista vazia', async () => {
    const { component, source } = await setup();

    source.listar.mockResolvedValue([]);
    await component.loadAgendamentos();

    expect(component.agendamentos()).toEqual([]);
    expect(component.error()).toBe(false);
  });
});
