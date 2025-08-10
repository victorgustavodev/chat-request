/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiMenu } from 'react-icons/hi';
import DialogAlert from '@/components/dialogAlert';
// Importe a função e o tipo do seu arquivo de serviço
import { listarRequerimentos, ApiRequerimento } from '@/services/userService';

export default function DashboardPage() {
  // Estado para os requerimentos, agora usando o tipo da API
  const [requerimentos, setRequerimentos] = useState<ApiRequerimento[]>([]);
  // Estados para controlar o carregamento e erros da API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados existentes para o controle da UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  // useEffect para buscar os dados da API quando o componente carregar
  useEffect(() => {
    async function carregarDados() {
      try {
        // Define o estado inicial antes da chamada
        setIsLoading(true);
        setError(null);
        
        const dadosDaApi = await listarRequerimentos();
        setRequerimentos(dadosDaApi);

      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro desconhecido.');
        // Se o erro for de autenticação, redireciona para o login após um tempo
        if (err.message.includes('Token') || err.message.includes('sessão')) {
          setTimeout(() => {
            router.push('/signin');
          }, 3000);
        }
      } finally {
        // Garante que o estado de carregamento seja desativado ao final
        setIsLoading(false);
      }
    }

    carregarDados();
  }, [router]); // Dependência do router para o redirecionamento

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const confirmLogout = () => {
    setDialogOpen(false);
    localStorage.removeItem('token'); // Limpa o token ao sair
    router.push('/signin');
  };

  const cancelLogout = () => {
    setDialogOpen(false);
  };

  // Se estiver carregando, mostra uma mensagem de carregamento
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="animate-pulse text-xl font-semibold text-emerald-700">
          Carregando requerimentos...
        </p>
      </div>
    );
  }

  // Se ocorrer um erro, mostra a mensagem de erro
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-xl font-bold text-red-600">Ocorreu um Erro</p>
        <p className="text-md text-gray-700">{error}</p>
      </div>
    );
  }

  // Se tudo ocorrer bem, renderiza a dashboard
  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* --- SIDebar para Desktop --- */}
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
            {sidebarOpen ? 'Sair' : <img src="/images/logout.svg" alt="logout" width={16} height={16} />}
          </button>
        </aside>

        {/* --- Header para Mobile --- */}
        <header className="flex md:hidden items-center justify-between bg-[#002415] text-white px-4 py-3">
          <img src="/images/aligator_200.png" alt="logo" width={40} height={40} />
          <h1 className="text-lg font-bold">CRADT</h1>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <HiMenu className="text-2xl" />
          </button>
        </header>

        {/* --- Menu Mobile --- */}
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

        {/* --- Conteúdo Principal --- */}
        <main className="flex-1 p-4 bg-gray-50">
          <h1 className="text-2xl font-bold text-emerald-700 mb-4">Lista de Requerimentos</h1>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  {/* Cabeçalhos da tabela ajustados para os dados da API */}
                  <th className="px-4 py-3 text-left font-semibold">Protocolo</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Matrícula</th>
                  <th className="px-4 py-3 text-left font-semibold">Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requerimentos.length > 0 ? (
                  requerimentos.map((req) => (
                    <tr key={req.protocol} className="hover:bg-gray-100 transition">
                      {/* Células da tabela usando os nomes de campos da API */}
                      <td className="px-4 py-2">{req.protocol}</td>
                      <td className="px-4 py-2">{req.status}</td>
                      <td className="px-4 py-2">{req.enrollment}</td>
                      <td className="px-4 py-2">{req.observations}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
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