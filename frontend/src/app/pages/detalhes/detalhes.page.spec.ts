import { vi, describe, beforeEach, it, expect, } from 'vitest';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { DetalhesPage } from './detalhes.page';
import { DentistasService } from '../../core/services/dentistas.service';

describe('DetalhesPage', () => {
  let component: DetalhesPage;
  let fixture: ComponentFixture<DetalhesPage>;

  const dentistasServiceMock = {
    buscarPorId: vi.fn().mockResolvedValue({
      id: 1,
      nome: 'Dra. Ana Bezerra',
      especialidade: 'Ortodontia',
      cro: null,
      telefone: null,
      email: null,
      fotoUrl: 'assets/images/retratos/ana-bezerra.webp',
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        {
          provide: DentistasService,
          useValue: dentistasServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});