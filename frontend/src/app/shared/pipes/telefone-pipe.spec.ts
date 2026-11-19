import { describe, expect, it } from 'vitest';

import { TelefonePipe } from './telefone-pipe';

describe('TelefonePipe', () => {
  const pipe = new TelefonePipe();

  it('formata telefones celulares com 11 dígitos', () => {
    expect(pipe.transform('81999999999')).toBe('(81) 99999-9999');
  });

  it('formata telefones fixos com 10 dígitos', () => {
    expect(pipe.transform('8133334444')).toBe('(81) 3333-4444');
  });

  it('formata telefones que já possuem máscara', () => {
    expect(pipe.transform('(81) 99999-9999')).toBe('(81) 99999-9999');
  });

  it('retorna uma string vazia para valores vazios', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('mantém o valor original quando a quantidade de dígitos é inválida', () => {
    expect(pipe.transform('819999999')).toBe('819999999');
  });
});
