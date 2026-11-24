import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { Dentista } from '../models/dentista.model';

@Injectable({ providedIn: 'root' })
export class DentistasService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/dentistas`;

  async listar(): Promise<Dentista[]> {
    const data = await firstValueFrom(this.http.get<unknown>(this.url));
    if (!Array.isArray(data)) {
      throw new Error('Lista de dentistas inválida.');
    }

    const dentists: Dentista[] = [];
    for (const item of data) {
      if (!this.isDentista(item)) throw new Error('Lista de dentistas inválida.');
      dentists.push(item);
    }
    return dentists;
  }

  async buscarPorId(id: number): Promise<Dentista | undefined> {
    try {
      const data = await firstValueFrom(this.http.get<unknown>(`${this.url}/${id}`));
      if (!this.isDentista(data)) throw new Error('Dentista inválido.');
      return data;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) return undefined;
      throw error;
    }
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
      !!item.especialidade.trim() &&
      (item.cro === null || typeof item.cro === 'string') &&
      (item.telefone === null || typeof item.telefone === 'string') &&
      (item.email === null || typeof item.email === 'string') &&
      (item.fotoUrl === undefined || item.fotoUrl === null || typeof item.fotoUrl === 'string')
    );
  }
}
