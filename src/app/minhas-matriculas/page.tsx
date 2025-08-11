/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { getMinhasMatriculas } from "../../services/userService"; // Ajuste o caminho se necessário
import { MenuNav } from "./../../components/chat-bot/nav/MenuNav";
import { HiMenu } from "react-icons/hi"; // Ícone para o menu
import { useRouter } from "next/navigation";

// --- Interfaces (sem alterações) ---
interface Curso {
  id_curso: number;
  nome_curso: string;
  modalidade: string;
}

interface Campus {
  id_campus: number;
  nome_campus: string;
  cidade: string | null;
}

interface Matricula {
  id_matricula: number;
  numero_matricula: string;
  periodo_ingresso: string;
  turno: string;
  status_matricula: string;
  curso: Curso;
  campus: Campus;
}

export default function MinhasMatriculas() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Estado para controlar a visibilidade do menu ---
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Inicia aberto no desktop
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/signin');
            return;
        }
        const data = await getMinhasMatriculas();
        setMatriculas(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando suas matrículas...</div>;
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-center p-8 text-red-500 bg-red-100 rounded-lg">
        Erro: {error}
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "matriculado":
        return "bg-green-100 text-green-800";
      case "trancado":
        return "bg-yellow-100 text-yellow-800";
      case "desvinculado":
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* O MenuNav agora é chamado aqui, fora do fluxo principal */}
      <MenuNav isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />

      {/* --- Conteúdo Principal que será deslocado --- */}
      {/* A margem à esquerda (ml-64) só é aplicada em telas médias ou maiores (md) e quando o menu está visível */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isMenuVisible ? "md:ml-64" : "md:ml-0"
        }`}
      >
        {/* --- Header Fixo --- */}
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-md">
          <div className="flex items-center gap-4">
            {/* Botão para abrir/fechar o menu */}
            <button onClick={() => setIsMenuVisible(!isMenuVisible)} className="p-2 rounded-full hover:bg-gray-100">
              <HiMenu className="text-2xl text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
              Minhas Matrículas
            </h1>
          </div>
          {/* Você pode adicionar outros itens no header aqui, como um ícone de perfil */}
        </header>

        {/* --- Container do Conteúdo da Página --- */}
        <main className="p-4 md:p-6">
          {matriculas.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">
                Você ainda não possui matrículas ativas.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {matriculas.map((matricula) => (
                <div
                  key={matricula.id_matricula}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-blue-700">
                          {matricula.curso.nome_curso}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {matricula.campus.nome_campus} -{" "}
                          {matricula.curso.modalidade}
                        </p>
                      </div>
                      <span
                        className={`mt-2 sm:mt-0 text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(
                          matricula.status_matricula
                        )}`}
                      >
                        {matricula.status_matricula}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-gray-500 font-semibold">
                          Nº Matrícula
                        </p>
                        <p className="text-gray-800 font-mono">
                          {matricula.numero_matricula}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-semibold">Ingresso</p>
                        <p className="text-gray-800">
                          {matricula.periodo_ingresso}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-semibold">Turno</p>
                        <p className="text-gray-800">{matricula.turno}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}