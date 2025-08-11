export interface Requerimento {
  id_requerimento: number;
  protocolo: string;
  status: string;
  created_at: string;
  observacao_cradt?: string;
  matricula: {
    numero_matricula: string;
    aluno: {
      nome_completo: string;
    };
  };
  tipo_requerimento: {
    nome_requerimento: string;
  };
}
