interface Requerimento {
  id: number;
  status: string;
  matricula: string;
  observacoes: string;
  protocolo: number;
  data_atual: string;
  tipo: string;
}

export type { Requerimento };