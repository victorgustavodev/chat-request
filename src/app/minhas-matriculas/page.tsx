// file: components/MinhasMatriculas.tsx

"use client"; // ESSENCIAL: Marca este como um Componente de Cliente

import { useState, useEffect } from 'react';
import { getMinhasMatriculas } from '../../services/userService'; // Ajuste o caminho se necessário

// Defina uma interface para o objeto de matrícula para ter um código mais seguro e com autocompletar
// Interface para o objeto 'curso' aninhado
interface Curso {
  id_curso: number;
  nome_curso: string;
  modalidade: string;
}

// Interface para o objeto 'campus' aninhado
interface Campus {
  id_campus: number;
  nome_campus: string;
  cidade: string | null; // Pode ser string ou nulo
}

// Interface principal da Matrícula
interface Matricula {
  id_matricula: number;
  numero_matricula: string;
  periodo_ingresso: string;
  turno: string;
  status_matricula: string;
  curso: Curso;   // Usando a interface aninhada
  campus: Campus; // Usando a interface aninhada
}

export default function MinhasMatriculas() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMinhasMatriculas();
        setMatriculas(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Carregando suas matrículas...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 bg-red-100 rounded-lg">Erro: {error}</div>;
  }

  // Função para determinar a cor do status da matrícula
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'matriculado':
        return 'bg-green-100 text-green-800';
      case 'trancado':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Minhas Matrículas</h1>

      {matriculas.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">Você ainda não possui matrículas ativas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {matriculas.map((matricula) => (
            <div key={matricula.id_matricula} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-blue-700">{matricula.curso.nome_curso}</h2>
                        <p className="text-sm text-gray-500">{matricula.campus.nome_campus} - {matricula.curso.modalidade}</p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(matricula.status_matricula)}`}
                    >
                      {matricula.status_matricula}
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-gray-500 font-semibold">Nº Matrícula</p>
                        <p className="text-gray-800">{matricula.numero_matricula}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">Ingresso</p>
                        <p className="text-gray-800">{matricula.periodo_ingresso}</p>
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
    </div>
  );
}