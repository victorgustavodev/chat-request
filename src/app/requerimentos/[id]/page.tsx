'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Requerimento } from '../type';
import { buscarRequerimentoPorId, atualizarStatusRequerimento } from '../service';

export default function RequerimentoDetalhePage() {
  const params = useParams();
  const id = Number(params.id);

  const [requerimento, setRequerimento] = useState<Requerimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [observacao, setObservacao] = useState('');
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    buscarRequerimentoPorId(id)
      .then((data) => {
        setRequerimento(data);
        setObservacao(data.observacao_cradt || '');
        setError(null);
      })
      .catch((err) => setError(err.message || 'Erro ao carregar o requerimento'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAtualizarStatus = async (novoStatus: string) => {
    if (!requerimento) return;
    setAtualizando(true);
    setError(null);
    try {
      await atualizarStatusRequerimento(requerimento.id_requerimento, novoStatus, observacao);
      setRequerimento({ ...requerimento, status: novoStatus, observacao_cradt: observacao });
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status');
    } finally {
      setAtualizando(false);
    }
  };

  if (loading) return <p>Carregando requerimento...</p>;
  if (error) return <p className="text-red-600">Erro: {error}</p>;
  if (!requerimento) return <p>Requerimento não encontrado.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Requerimento</h1>

      <div className="mb-4">
        <strong>Protocolo:</strong> {requerimento.protocolo}
      </div>
      <div className="mb-4">
        <strong>Status:</strong>{' '}
        <span
          className={`px-2 py-1 rounded text-white ${
            requerimento.status === 'Deferido'
              ? 'bg-green-600'
              : requerimento.status === 'Indeferido'
              ? 'bg-red-600'
              : requerimento.status === 'Aberto'
              ? 'bg-blue-600'
              : 'bg-gray-600'
          }`}
        >
          {requerimento.status}
        </span>
      </div>
      <div className="mb-4">
        <strong>Aluno:</strong> {requerimento.matricula.aluno.nome_completo}
      </div>
      <div className="mb-4">
        <strong>Tipo de Requerimento:</strong> {requerimento.tipo_requerimento.nome_requerimento}
      </div>
      <div className="mb-4">
        <strong>Data de Criação:</strong> {new Date(requerimento.created_at).toLocaleDateString('pt-BR')}
      </div>

      <div className="mb-4">
        <label htmlFor="observacao" className="block font-semibold mb-1">
          Observação CRADT
        </label>
        <textarea
          id="observacao"
          rows={4}
          className="w-full border border-gray-300 rounded p-2"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          disabled={atualizando}
        />
      </div>

      <div className="flex gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={atualizando}
          onClick={() => handleAtualizarStatus('Deferido')}
        >
          Aceitar
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          disabled={atualizando}
          onClick={() => handleAtualizarStatus('Indeferido')}
        >
          Recusar
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
