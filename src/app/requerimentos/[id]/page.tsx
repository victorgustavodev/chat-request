'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Requerimento } from '../type';
import { getRequerimentoById } from '@/services/userService';
import Breadcrumb from '@/components/breadcrumb';

export default function RequerimentoDetalhePage() {
  const params = useParams();
  const id = Number(params.id);

  const [requerimento, setRequerimento] = useState<Requerimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [observacao, setObservacao] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getRequerimentoById(id)
      .then((json) => {
        const data = json.data || json;
        setRequerimento(data);
        setObservacao(data.observacao_cradt || '');
        setError(null);
      })
      .catch((err) => setError(err.message || 'Erro ao carregar o requerimento'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#002415]">
        <p className="text-white text-lg font-semibold">Carregando requerimento...</p>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#002415]">
        <p className="text-red-400 text-lg font-semibold">Erro: {error}</p>
      </div>
    );

  if (!requerimento)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#002415]">
        <p className="text-white text-lg font-semibold">Requerimento não encontrado.</p>
      </div>
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#002415] p-4 z-50 overflow-auto">
      <div className="bg-white rounded shadow-lg max-w-3xl w-full p-6 relative">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/cradt/dashboard' },
            { label: 'Detalhes do Requerimento' },
          ]}
        />

        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-emerald-700 rounded py-3">
          Detalhes do Requerimento
        </h1>

        <div className="mb-4">
          <strong>Protocolo:</strong> {requerimento.protocolo}
        </div>
        <div className="mb-4">
          <strong>Status:</strong>{' '}
          <span
            className={`px-2 py-1 rounded text-white ${
              requerimento.status === 'Aceito'
                ? 'bg-green-600'
                : requerimento.status === 'Recusado'
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
          <strong>Matrícula:</strong> {requerimento.matricula.numero_matricula}
        </div>
        <div className="mb-4">
          <strong>Tipo de Requerimento:</strong> {requerimento.tipo_requerimento.nome_requerimento}
        </div>

        {/* Campo de Anexo movido aqui */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Anexo:</label>
          <img
            src="/images/atestado-medico.jpg"
            alt="Atestado Médico"
            className="w-24 h-24 object-cover rounded cursor-pointer border border-gray-300 hover:brightness-90 transition"
            onClick={() => setIsModalOpen(true)}
            title="Clique para ampliar"
          />
        </div>

        {/* Campo de Observação */}
        <div className="mb-6">
          <label htmlFor="observacao" className="block font-semibold mb-1">
            Observação (opcional):
          </label>
          <textarea
            id="observacao"
            rows={4}
            className="w-full border border-gray-300 rounded p-2 resize-none focus:outline-emerald-500"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Digite uma observação..."
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition cursor-pointer"
            onClick={() => {}}
          >
            Aceito
          </button>
          <button
            type="button"
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition cursor-pointer"
            onClick={() => {}}
          >
            Recusado
          </button>
        </div>

        {/* Modal de imagem */}
        {isModalOpen && (
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer overflow-auto p-4"
            role="dialog"
            aria-modal="true"
          >
            <img
              src="/images/atestado-medico.jpg"
              alt="Atestado Médico Ampliado"
              className="max-w-full max-h-[90vh] rounded shadow-lg"
              onClick={(e) => e.stopPropagation()} // evitar fechar ao clicar na imagem
            />
          </div>
        )}
      </div>
    </div>
  );
}
