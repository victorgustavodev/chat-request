/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiMenu } from 'react-icons/hi';
import DialogAlert from '@/components/dialogAlert';
import { listarTodosRequerimentos } from '@/services/userService';

interface ApiRequerimento {
  id_requerimento: number;
  protocolo: string;
  status: string;
  created_at: string;
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

const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function DashboardPage() {
  const [requerimentos, setRequerimentos] = useState<ApiRequerimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function carregarDados() {
      try {
        setIsLoading(true);
        setError(null);

        const dadosDaApi = await listarTodosRequerimentos();

        setRequerimentos(dadosDaApi.data);
      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro desconhecido.');
        if (err.message.includes('Token') || err.message.includes('autorizado')) {
          setTimeout(() => {
            router.push('/login-adm');
          }, 3000);
        }
      } finally {
        setIsLoading(false);
      }
    }

    carregarDados();
  }, [router]);

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const confirmLogout = () => {
    setDialogOpen(false);
    localStorage.removeItem('admin_token');
    router.push('/login-adm');
  };

  const cancelLogout = () => {
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="animate-pulse text-xl font-semibold text-emerald-700">
          Carregando requerimentos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <p className="text-xl font-bold text-red-600">Ocorreu um Erro</p>
        <p className="text-md text-gray-700">{error}</p>
      </div>
    );
  }

  const handleRowClick = (id: number) => {
    router.push(`/requerimentos/${id}`);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar para Desktop */}
        <aside
          className={`hidden md:flex ${
            sidebarOpen ? 'w-64' : 'w-16'
          } bg-[#002415] text-white flex-col justify-between p-4 transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 mb-6"
            >
              <img
                src="/images/aligator_200.png"
                alt="logo"
                width={40}
                height={40}
                className="cursor-pointer"
              />
              {sidebarOpen && <h2 className="text-2xl font-bold">Painel</h2>}
            </button>
            {sidebarOpen && <div className="border-t border-white/30 mb-4" />}
            <nav className="flex flex-col gap-4">
              {/* Links da Navegação */}
            </nav>
          </div>
          <button
            onClick={handleLogoutClick}
            className="hover:bg-emerald-800 text-white p-2 rounded transition whitespace-nowrap flex items-center gap-2"
          >
            {sidebarOpen ? (
              'Sair'
            ) : (
              <img src="/images/logout.svg" alt="logout" width={16} height={16} />
            )}
          </button>
        </aside>

        {/* Header para Mobile */}
        <header className="flex md:hidden items-center justify-between bg-[#002415] text-white px-4 py-3">
          <img src="/images/aligator_200.png" alt="logo" width={40} height={40} />
          <h1 className="text-lg font-bold">CRADT</h1>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <HiMenu className="text-2xl" />
          </button>
        </header>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="md:hidden bg-[#002415] text-white p-4 flex flex-col gap-4">
            {/* Links da Navegação Mobile */}
            <button
              onClick={handleLogoutClick}
              className="hover:bg-emerald-800 p-2 rounded transition text-left"
            >
              Sair
            </button>
          </div>
        )}

        {/* Conteúdo Principal */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-emerald-700 mb-4">Lista de Requerimentos</h1>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Protocolo</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Aluno</th>
                  <th className="px-4 py-3 text-left font-semibold">Tipo de Requerimento</th>
                  <th className="px-4 py-3 text-left font-semibold">Data de Criação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requerimentos.length > 0 ? (
                  requerimentos.map((req) => (
                    <tr
                      key={req.id_requerimento}
                      className="hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => handleRowClick(req.id_requerimento)}
                    >
                      <td className="px-4 py-3 font-mono">{req.protocolo}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            req.status === 'Deferido'
                              ? 'bg-green-100 text-green-800'
                              : req.status === 'Indeferido'
                              ? 'bg-red-100 text-red-800'
                              : req.status === 'Aberto'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{req.matricula.aluno.nome_completo}</td>
                      <td className="px-4 py-3">{req.tipo_requerimento.nome_requerimento}</td>
                      <td className="px-4 py-3">{formatarData(req.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum requerimento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <DialogAlert
        isOpen={dialogOpen}
        onConfirmAction={confirmLogout}
        onCancelAction={cancelLogout}
        message="Você tem certeza que deseja sair do sistema?"
      />
    </>
  );
}
