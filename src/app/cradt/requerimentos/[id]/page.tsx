/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Requerimento } from "../type"; // Ajuste o caminho para seus tipos
import { getRequerimentoById, updateRequerimentoStatus } from "@/services/userService"; // Verifique se a importação está correta
import Breadcrumb from "@/components/breadcrumb";

export default function RequerimentoDetalhePage() {
  const params = useParams();
  const id = Number(params.id);

  const [requerimento, setRequerimento] = useState<Requerimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // Estado para o loading dos botões
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para buscar os dados iniciais
  const fetchRequerimento = () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getRequerimentoById(id)
      .then((data) => {
        setRequerimento(data);
        setError(null);
      })
      .catch((err) =>
        setError(err.message || "Erro ao carregar o requerimento")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequerimento();
  }, [id]);

  // Handler para atualizar o status
  const handleUpdateStatus = async (newStatus: 'Deferido' | 'Indeferido') => {
    if (!requerimento) return;

    setIsUpdating(true);
    setError(null);

    try {
      const updatedRequerimento = await updateRequerimentoStatus(requerimento.id_requerimento, newStatus);
      setRequerimento(updatedRequerimento); // Atualiza o estado local com os novos dados
      alert(`Requerimento ${newStatus.toLowerCase()} com sucesso!`);
    } catch (err: any) {
      setError(err.message || "Não foi possível atualizar o status.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#002415]">
        <p className="text-white text-lg font-semibold">Carregando requerimento...</p>
      </div>
    );

  if (error && !requerimento) // Mostra erro fatal se não conseguir carregar nada
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
    <div className="min-h-screen bg-[#002415] p-6 overflow-auto">
      <div className="bg-white rounded shadow-lg max-w-3xl w-full mx-auto p-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/cradt/dashboard" },
            { label: "Detalhes do Requerimento" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-emerald-700 rounded py-3">
          Detalhes do Requerimento
        </h1>
        
        {/* Exibe erro de atualização, se houver */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><strong>Protocolo:</strong> {requerimento.protocolo}</div>
            <div><strong>Aluno:</strong> {requerimento.matricula.aluno.nome_completo}</div>
            <div><strong>Matrícula:</strong> {requerimento.matricula.numero_matricula}</div>
            <div>
              <strong>Data de Abertura:</strong> {new Date(requerimento.created_at).toLocaleDateString('pt-BR')}
            </div>
            <div className="md:col-span-2">
                <strong>Tipo de Requerimento:</strong> {requerimento.tipo_requerimento.nome_requerimento}
            </div>
             <div>
                <strong>Status:</strong>{" "}
                <span className={`px-2 py-1 rounded text-white ${
                    requerimento.status === "Em Análise" ? "bg-yellow-600"
                    : requerimento.status === "Indeferido" ? "bg-red-600"
                    : requerimento.status === "Deferido" ? "bg-green-600"
                    : "bg-gray-600"
                }`}>
                    {requerimento.status}
                </span>
            </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Anexo:</label>
          <img
            src="/images/atestado.jpg"
            alt="Atestado Médico"
            className="w-24 h-24 object-cover rounded cursor-pointer border border-gray-300 hover:brightness-90 transition"
            onClick={() => setIsModalOpen(true)}
            title="Clique para ampliar"
          />
        </div>

        <div className="mb-4">
          <strong>Observações:</strong>
          <p className="text-gray-700 bg-gray-50 p-2 border rounded mt-1">
            {requerimento.observacoes || "Nenhuma observação registrada."}
          </p>
        </div>
        
        {/* Mostra botões apenas se o status for "Em Análise" */}
        {requerimento.status === 'Em Análise' && (
            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="button"
                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => handleUpdateStatus('Deferido')}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Salvando...' : 'Deferir Requerimento'}
                </button>
                <button
                    type="button"
                    className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => handleUpdateStatus('Indeferido')}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Salvando...' : 'Indeferir Requerimento'}
                </button>
            </div>
        )}

        {isModalOpen && (
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer overflow-auto p-4"
            role="dialog"
            aria-modal="true"
          >
            <img
              src="/images/atestado.jpg"
              alt="Atestado Médico Ampliado"
              className="max-w-full max-h-[90vh] rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
}