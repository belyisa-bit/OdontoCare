import { Injectable } from '@angular/core';

import type { Dentista } from '../models/dentista.model';

@Injectable({ providedIn: 'root' })
export class DentistasService {
  /** Replace this demo source with the authenticated API adapter when available. */
  async listar(): Promise<Dentista[]> {
    const response = await fetch('assets/data/dentistas-demo.json');
    if (!response.ok) throw new Error('Falha ao carregar dentistas.');
    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data.every((item: unknown) => this.isDentista(item))) {
      throw new Error('Lista de dentistas inválida.');
    }
    return data as Dentista[];
  }
  /**Adicionado */
  async buscarPorId(id: number): Promise<Dentista | undefined> {
  const dentistas = await this.listar();
  return dentistas.find((dentista) => dentista.id === id);
}

  private isDentista(value: unknown): value is Dentista {
    if (!value || typeof value !== 'object') return false;
    const item = value as Partial<Dentista>;
    return (
      typeof item.id === 'number' &&
      Number.isInteger(item.id) &&
      item.id > 0 &&
      typeof item.nome === 'string' &&
      !!item.nome.trim() &&
      typeof item.especialidade === 'string' &&
      !!item.especialidade.trim()
    );
  }
}
