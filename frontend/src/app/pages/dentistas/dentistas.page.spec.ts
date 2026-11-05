import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { Dentista } from '../../core/models/dentista.model';
import { DentistasService } from '../../core/services/dentistas.service';

import { DentistasPage } from './dentistas.page';

const dentists: Dentista[] = [
  { id: 1, nome: 'Dra. Ana Bezerra', especialidade: 'Ortodontia', cro: null, telefone: null, email: null },
  { id: 2, nome: 'Dr. André Ribeiro', especialidade: 'Clínico geral', cro: 'EXEMPLO', telefone: null, email: null },
];

async function setup(fails = false) {
  const source = { listar: vi.fn<() => Promise<Dentista[]>>() };
  if (fails) source.listar.mockRejectedValue(new Error('offline'));
  else source.listar.mockResolvedValue(dentists);
  await TestBed.configureTestingModule({
    imports: [DentistasPage],
    providers: [provideRouter([]), { provide: DentistasService, useValue: source }],
  }).compileComponents();
  const fixture = TestBed.createComponent(DentistasPage);
  fixture.detectChanges();
  await fixture.whenStable();
  return { fixture, component: fixture.componentInstance, source };
}

describe('DentistasPage', () => {
  it('busca ignora acentos e espaços e aceita nome ou especialidade', async () => {
    const { component } = await setup();
    component.search.set('  andre  clinico ');
    expect(component.filteredDentists().map((item) => item.id)).toEqual([2]);
    component.search.set('ortodontia');
    expect(component.filteredDentists().map((item) => item.id)).toEqual([1]);
  });

  it('combina a busca com o filtro e permite limpar', async () => {
    const { component } = await setup();
    component.search.set('Ana');
    component.specialty.set('Clínico geral');
    expect(component.filteredDentists()).toEqual([]);
    component.clearFilters();
    expect(component.filteredDentists()).toHaveLength(2);
    expect(component.filtersActive()).toBe(false);
  });

  it('separa erro de carregamento de uma lista vazia e permite tentar novamente', async () => {
    const { component, source } = await setup(true);
    expect(component.error()).toBe(true);
    expect(component.loading()).toBe(false);
    source.listar.mockResolvedValue([]);
    await component.loadDentists();
    expect(component.error()).toBe(false);
    expect(component.filteredDentists()).toEqual([]);
  });
});
