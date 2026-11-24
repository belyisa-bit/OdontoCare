import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DentistasService } from './dentistas.service';

describe('DentistasService', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta a lista de dentistas na API', async () => {
    const result = TestBed.inject(DentistasService).listar();
    http.expectOne('/api/dentistas').flush([
      {
        id: 1,
        nome: 'Dra. Ana Bezerra',
        especialidade: 'Ortodontia',
        cro: null,
        telefone: null,
        email: null,
        fotoUrl: '/assets/images/retratos/ana-bezerra.webp',
      },
    ]);

    await expect(result).resolves.toHaveLength(1);
  });

  it('rejeita uma lista com dados inválidos', async () => {
    const result = TestBed.inject(DentistasService).listar();
    http.expectOne('/api/dentistas').flush([{ id: 1 }]);
    await expect(result).rejects.toThrow('Lista de dentistas inválida');
  });

  it('busca um dentista pelo id e devolve undefined em 404', async () => {
    const service = TestBed.inject(DentistasService);
    const result = service.buscarPorId(999);
    http.expectOne('/api/dentistas/999').flush({}, { status: 404, statusText: 'Not Found' });
    await expect(result).resolves.toBeUndefined();
  });
});
