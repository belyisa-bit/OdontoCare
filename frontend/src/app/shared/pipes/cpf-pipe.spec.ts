
import { describe, expect, it } from 'vitest';

import { CpfPipe } from './cpf-pipe';

describe('CpfPipe', () => {
  const pipe = new CpfPipe();

  it('formata um CPF com 11 dígitos', () => {
    expect(pipe.transform('12345678900')).toBe('123.456.789-00');
  });

  it('mantém um CPF que já está formatado', () => {
    expect(pipe.transform('123.456.789-00')).toBe('123.456.789-00');
  });

  it('retorna uma string vazia para valores vazios', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('mantém o valor original quando não possui 11 dígitos', () => {
    expect(pipe.transform('123456')).toBe('123456');
  });
});

