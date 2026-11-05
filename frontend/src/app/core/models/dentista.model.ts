export interface Dentista {
  id: number;
  nome: string;
  especialidade: string;
  cro: string | null;
  telefone: string | null;
  email: string | null;
  fotoUrl?: string;
}
