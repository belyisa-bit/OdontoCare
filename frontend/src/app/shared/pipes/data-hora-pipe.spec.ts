import { describe, expect, it } from 'vitest';

import { DataHoraPipe } from './data-hora-pipe';

describe('DataHoraPipe', () => {
  const pipe = new DataHoraPipe();

  it('formata uma data e hora corretamente', () => {
    expect(pipe.transform('2026-11-20T14:00:00'))
      .toBe('20/11/2026 às 14:00');
  });

  it('retorna uma string vazia para valores vazios', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('mantém o valor original quando a data é inválida', () => {
    expect(pipe.transform('data inválida')).toBe('data inválida');
  });
});