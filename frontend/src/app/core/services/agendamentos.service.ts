import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { Agendamento } from '../models/agendamento.model';

const REQUEST_TIMEOUT_MS = 15_000;

@Injectable({ providedIn: 'root' })
export class AgendamentosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/agendamentos`;

  listar(): Promise<Agendamento[]> {
    return firstValueFrom(
      this.http.get<Agendamento[]>(this.url, {
        timeout: REQUEST_TIMEOUT_MS,
      }),
    );
  }

  buscarPorId(id: number): Promise<Agendamento> {
    return firstValueFrom(
      this.http.get<Agendamento>(`${this.url}/${id}`, {
        timeout: REQUEST_TIMEOUT_MS,
      }),
    );
  }
}