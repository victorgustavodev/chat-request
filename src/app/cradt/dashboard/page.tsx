/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import DialogAlert from "@/components/dialogAlert";
import {
  listarTodosRequerimentos,
  validateToken,
} from "@/services/userService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";

// Interface para os dados do requerimento
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

// Função auxiliar para formatar a data
const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Função para estilizar o status
const getStatusClass = (status: string) => {
  switch (status) {
    case "Deferido":
      return "bg-green-100 text-green-800";
    case "Indeferido":
      return "bg-red-100 text-red-800";
    case "Aberto":
      return "bg-blue-100 text-blue-800";
    case "Em Análise":
    case "Pendente":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function DashboardPage() {
  const [requerimentos, setRequerimentos] = useState<ApiRequerimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Inicia aberto
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const isValid = await validateToken(token);
        if (!isValid) throw new Error("Token inválido");

        setIsAuthChecked(true);
      } catch (error) {
        console.error("Erro no setup inicial:", error);
        // localStorage.removeItem("token");
        // router.push("/signin");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    async function carregarDados() {
      try {
        setIsLoading(true);
        setError(null);

        // **CORREÇÃO APLICADA AQUI**
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error(
            "Token de administrador não encontrado. Faça login como admin."
          );
        }

        const dadosDaApi = await listarTodosRequerimentos(token);

        // A API retorna um objeto de paginação, os dados estão na chave 'data'
        setRequerimentos(dadosDaApi.data);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro desconhecido.");
        if (
          err.message.includes("Token") ||
          err.message.includes("autorizado")
        ) {
          setTimeout(() => {
            // Redireciona para o login de admin
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
    localStorage.removeItem("token");
    router.push("/cradt/login"); // Ajuste a rota se necessário
  };

  const cancelLogout = () => {
    setDialogOpen(false);
  };

  const handleRowClick = (id: number) => {
    router.push(`/cradt/requerimentos/${id}`); // Rota para a página de detalhes
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

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar para Desktop */}
        <aside
          className={`hidden md:flex ${
            sidebarOpen ? "w-64" : "w-20"
          } bg-[#002415] text-white flex-col justify-between p-4 transition-all duration-300 ease-in-out`}
        >
          <div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 mb-6 p-2 rounded-md hover:bg-emerald-800 w-full"
              aria-label={sidebarOpen ? "Recolher menu" : "Expandir menu"}
            >
              <img
                src="/images/aligator_200.png"
                alt="logo"
                className="w-8 h-8 flex-shrink-0"
              />
              {sidebarOpen && (
                <h2 className="text-2xl font-bold whitespace-nowrap">Painel</h2>
              )}
            </button>
            {sidebarOpen && <div className="border-t border-white/30 mb-4" />}
            <nav className="flex flex-col gap-4">
              {/* Links da Navegação */}
            </nav>
          </div>
          <button
            onClick={handleLogoutClick}
            className="hover:bg-emerald-800 text-white rounded-md transition whitespace-nowrap flex items-center justify-center gap-2 p-3"
            title="Sair"
          >
            <img
              src="/images/logout.svg"
              alt="logout"
              className="w-5 h-5 flex-shrink-0"
            />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </aside>

        {/* Header para Mobile */}
        <header className="flex md:hidden items-center justify-between bg-[#002415] text-white px-4 py-3">
          <img
            src="/images/aligator_200.png"
            alt="logo"
            width={40}
            height={40}
          />
          <h1 className="text-lg font-bold">CRADT</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
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
          <h1 className="text-2xl font-bold text-emerald-700 mb-4">
            Lista de Requerimentos
          </h1>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    Protocolo
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Aluno</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Tipo de Requerimento
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Data de Criação
                  </th>
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
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                            req.status
                          )}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {req.matricula.aluno.nome_completo}
                      </td>
                      <td className="px-4 py-3">
                        {req.tipo_requerimento.nome_requerimento}
                      </td>
                      <td className="px-4 py-3">
                        {formatarData(req.created_at)}
                      </td>
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
function setIsAuthChecked(arg0: boolean) {
  throw new Error("Function not implemented.");
}
