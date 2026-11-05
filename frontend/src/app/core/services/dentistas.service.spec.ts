import { TestBed } from '@angular/core/testing';

import { DentistasService } from './dentistas.service';

describe('DentistasService', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('rejeita uma resposta HTTP com erro', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(TestBed.inject(DentistasService).listar()).rejects.toThrow('Falha ao carregar');
  });

  it('rejeita uma lista de dados inválidos', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] }));
    await expect(TestBed.inject(DentistasService).listar()).rejects.toThrow('Lista de dentistas inválida');
  });
});
