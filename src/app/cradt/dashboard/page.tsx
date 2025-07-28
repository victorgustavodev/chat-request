"use client";

import { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";

interface Requerimento {
  id: number;
  status: string;
  matricula: string;
  observacoes: string;
  protocolo: number;
  data_atual: string;
  tipo: string;
}

export default function DashboardPage() {
  const [requerimentos, setRequerimentos] = useState<Requerimento[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setRequerimentos([
      {
        id: 1,
        status: "Em análise",
        matricula: "20230001",
        observacoes: "Aguardando documentação",
        protocolo: 123456789,
        data_atual: "2025-07-27",
        tipo: "Reabertura de matrícula",
      },
      {
        id: 2,
        status: "Aprovado",
        matricula: "20230002",
        observacoes: "Requerimento deferido",
        protocolo: 987654321,
        data_atual: "2025-07-25",
        tipo: "Trancamento",
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex md:w-64 bg-emerald-700 text-white flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">Painel</h2>
        <nav className="flex flex-col gap-4">
          <a href="#" className="hover:bg-emerald-800 p-2 rounded transition">Requerimentos</a>
          <a href="#" className="hover:bg-emerald-800 p-2 rounded transition">Configurações</a>
        </nav>
      </aside>

      {/* Header para mobile com botão de menu */}
      <header className="flex md:hidden items-center justify-between bg-emerald-700 text-white px-4 py-3">
        <h1 className="text-lg font-bold">CRADT</h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <HiMenu className="text-2xl" />
        </button>
      </header>

      {/* Sidebar Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-700 text-white p-4 flex flex-col gap-4">
          <a href="#" className="hover:bg-emerald-800 p-2 rounded transition">Requerimentos</a>
          <a href="#" className="hover:bg-emerald-800 p-2 rounded transition">Configurações</a>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-emerald-700 mb-4">
          Lista de Requerimentos
        </h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Matrícula</th>
                <th className="px-4 py-3 text-left font-semibold">Observações</th>
                <th className="px-4 py-3 text-left font-semibold">Protocolo</th>
                <th className="px-4 py-3 text-left font-semibold">Data</th>
                <th className="px-4 py-3 text-left font-semibold">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requerimentos.map((req) => (
                <tr key={req.id} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2">{req.id}</td>
                  <td className="px-4 py-2">{req.status}</td>
                  <td className="px-4 py-2">{req.matricula}</td>
                  <td className="px-4 py-2">{req.observacoes}</td>
                  <td className="px-4 py-2">{req.protocolo}</td>
                  <td className="px-4 py-2">{req.data_atual}</td>
                  <td className="px-4 py-2">{req.tipo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
