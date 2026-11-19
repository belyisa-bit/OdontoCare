import type { Dentista } from './dentista.model';

export interface Agendamento {
  id: number;
  nomePaciente: string;
  cpfPaciente: string;
  telefonePaciente: string;
  dataHora: string;
  tratamento: string;
  status: string;
  dentistaId: number | null;
  dentista: Dentista | null;
}