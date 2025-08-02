'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiMenu } from 'react-icons/hi';
import DialogAlert from '@/components/dialogAlert';
import { Requerimento } from './type';

export default function DashboardPage() {
  const [requerimentos, setRequerimentos] = useState<Requerimento[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setRequerimentos([
      {
        id: 1,
        status: 'Em análise',
        matricula: '20230001',
        observacoes: 'Aguardando documentação',
        protocolo: 123456789,
        data_atual: '2025-07-27',
        tipo: 'Reabertura de matrícula',
      },
      {
        id: 2,
        status: 'Aprovado',
        matricula: '20230002',
        observacoes: 'Requerimento deferido',
        protocolo: 987654321,
        data_atual: '2025-07-25',
        tipo: 'Trancamento',
      },
    ]);
  }, []);

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const confirmLogout = () => {
    setDialogOpen(false);
    router.push('/');
  };

  const cancelLogout = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
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
              <a
                href="#"
                className="hover:bg-emerald-800 p-2 rounded transition whitespace-nowrap flex items-center gap-2"
              >
                {sidebarOpen ? (
                  'Requerimentos'
                ) : (
                  <img src="/images/request.svg" alt="logo" width={16} height={16} />
                )}
              </a>
              <a
                href="#"
                className="hover:bg-emerald-800 p-2 rounded transition whitespace-nowrap flex items-center gap-2"
              >
                {sidebarOpen ? (
                  'Configurações'
                ) : (
                  <img src="/images/settings.svg" alt="logo" width={16} height={16} />
                )}
              </a>

              <button
                onClick={handleLogoutClick}
                className="hover:bg-emerald-800 text-white p-2 rounded transition whitespace-nowrap flex items-center gap-2"
              >
                {sidebarOpen ? 'Sair' : <img src="/images/logout.svg" alt="logout" width={16} height={16} />}
              </button>
            </nav>
          </div>
        </aside>

        <header className="flex md:hidden items-center justify-between bg-[#002415] text-white px-4 py-3">
          <img src="/images/aligator_200.png" alt="logo" width={40} height={40} />
          <h1 className="text-lg font-bold">CRADT</h1>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <HiMenu className="text-2xl" />
          </button>
        </header>

        {menuOpen && (
          <div className="md:hidden bg-[#002415] text-white p-4 flex flex-col gap-4">
            <a href="#" className="hover:bg-emerald-800 p-2 rounded transition">
              Requerimentos
            </a>
            <a href="#" className="hover:bg-emerald-800 p-2 rounded transition">
              Configurações
            </a>
            <button
              onClick={handleLogoutClick}
              className="hover:bg-emerald-800 p-2 rounded transition text-left"
            >
              Sair
            </button>
          </div>
        )}

        <main className="flex-1 p-4 bg-gray-50">
          <h1 className="text-2xl font-bold text-emerald-700 mb-4">Lista de Requerimentos</h1>

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

      <DialogAlert
        isOpen={dialogOpen}
        onConfirmAction={confirmLogout}
        onCancelAction={cancelLogout}
      />
    </>
  );
}
