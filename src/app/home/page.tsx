/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardMain } from "@/components/chat-bot/cards/cardMain";
import { CardOption } from "@/components/chat-bot/cards/cardOption";
import { Navbar } from "@/components/chat-bot/nav/Navbar";
import { MenuNav } from "./../../components/chat-bot/nav/MenuNav";
import { validateToken } from "@/services/userService";
import { getMinhasMatriculas } from "../../services/userService"; // Ajuste o caminho se necessário

// Defina uma interface para o objeto de matrícula para ter um código mais seguro e com autocompletar
interface Matricula {
  id: number;
  course_name: string; // Exemplo de campos, ajuste conforme seu JSON real
  status: string;
  registration_date: string;
}

// --- COMPONENTE DE UPLOAD (SEM ALTERAÇÕES) ---
const FileUploadStep = ({
  onSubmit,
}: {
  onSubmit: (file: File | null) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };
  const handleSubmit = () => onSubmit(file);

  return (
    <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md flex flex-col gap-4 animate-fade-in-up">
      <h3 className="text-lg font-semibold text-gray-800">Anexar Documento</h3>
      <div>
        <label
          htmlFor="attachment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Anexe o documento necessário para sua solicitação.
        </label>
        <input
          type="file"
          id="attachment"
          name="attachment"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-800 transition-colors"
      >
        Finalizar Solicitação
      </button>
    </div>
  );
};

// --- NOVO COMPONENTE PARA BUSCA DE REQUERIMENTOS ---
const RequirementTypeStep = ({
  allTypes,
  onSelect,
}: {
  allTypes: string[];
  onSelect: (type: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica de filtro simplificada: sempre filtra a lista completa.
  // Se o campo de busca estiver vazio, todos os itens passam pelo filtro.
  const filteredTypes = allTypes.filter((type) =>
    type.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="w-full max-w-2xl p-4 sm:p-6 bg-white rounded-xl shadow-lg flex flex-col gap-4 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-800">
          Qual o tipo de requerimento?
        </h3>
        <p className="text-sm text-gray-500">
          Selecione uma opção da lista ou digite para buscar.
        </p>
      </div>
      <input
        type="text"
        placeholder="Ex: Histórico Escolar, Trancamento..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
      {/* Container da lista com scroll e layout responsivo */}
      <div className="max-h-[22rem] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTypes.length > 0 ? (
            filteredTypes.map((type) => (
              <CardOption
                key={type}
                title={type}
                onClick={() => onSelect(type)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full py-4">
              Nenhum requerimento encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA (MODIFICADO) ---
export default function Home() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [requirementData, setRequirementData] = useState<any>({});

  const availableRegistrations = [
    "MAT-2025-001",
    "MAT-2025-002",
    "MAT-2025-003",
  ];

  // --- LISTA DE REQUERIMENTOS ATUALIZADA ---
  const requirementTypes = [
    "Admissão por Transferência e Análise Curricular (anexos)",
    "Ajuste de Matrícula Semestral",
    "Autorização para cursar disciplinas em outras IES (especifique)",
    "Cancelamento de Matrícula",
    "Cancelamento de Disciplina",
    "Certificado de Conclusão",
    "Certidão - Autenticidade (especifique)",
    "Complementação de Matrícula (especifique)",
    "Cópia Xerox de Documento (especifique)",
    "Declaração de Colação de Grau e Tramitação de Diploma",
    "Declaração de Matrícula ou Matrícula Vínculo",
    "Declaração de Monitoria",
    "Declaração para Estágio",
    "Diploma 1ª ou 2ª via",
    "Dispensa da prática de Educação Física (anexos)",
    "Declaração Tramitação de Diploma (técnico)",
    "Ementa de disciplina (especifique)",
    "Guia de Transferência",
    "Histórico Escolar",
    "Isenção de disciplinas cursadas (anexo)",
    "Justificativa de falta(s) ou prova 2ª chamada (anexos)",
    "Matriz curricular",
    "Reabertura de Matrícula",
    "Reintegração",
    "Reintegração para Cursar",
    "Solicitação de Conselho de Classe",
    "Trancamento de Matrícula",
    "Transferência de Turno (especifique turno)",
  ];

  // --- LÓGICA DE ANEXO: Define quais tipos exigem anexo ---
  const typesNeedingAttachment = requirementTypes.filter((type) =>
    type.toLowerCase().includes("(anexo")
  );

  // --- BUSCA DE MATRÍCULAS COM TRATAMENTO DE ERRO E LOADING ---
  useEffect(() => {
    // Função async dentro do useEffect para buscar os dados
    const fetchData = async () => {
      try {
        const data = await getMinhasMatriculas();
        setMatriculas(data);
        setError(null); // Limpa erros anteriores em caso de sucesso
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false); // Garante que o loading termine, com sucesso ou erro
      }
    };

    fetchData();
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez

  // Efeitos e handlers iniciais (sem grandes alterações)
  useEffect(() => {
    setMessages([
      { id: 1, component: <CardMain />, alignment: "center" },
      {
        id: 2,
        type: "options",
        options: ["Solicitar Requerimento", "Consultar Requerimentos"],
        handler: handleInitialOption,
        alignment: "center",
        layout: "grid grid-cols-1 sm:grid-cols-2 w-full",
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addUserMessage = (text: string, prevMessages: any[]) => {
    const userMessage = {
      id: Date.now(),
      component: (
        <div className="bg-green-700 text-white p-3 rounded-lg max-w-xs shadow">
          {text}
        </div>
      ),
      alignment: "end",
    };
    return [...prevMessages.slice(0, -1), userMessage];
  };

  const handleInitialOption = (option: string) => {
    setMessages((prev) => addUserMessage(option, prev));
    setTimeout(() => {
      if (option === "Solicitar Requerimento") {
        askForRegistration();
      } else {
        const botResponse = {
          id: Date.now() + 1,
          component: (
            <div className="bg-white p-3 rounded-lg text-gray-800 max-w-xs shadow">
              A funcionalidade de consulta ainda está em desenvolvimento.
            </div>
          ),
          alignment: "start",
        };
        setMessages((prev) => [...prev, botResponse]);
      }
    }, 800);
  };

  const askForRegistration = () => {
    const botMessage = {
      id: Date.now(),
      component: (
        <div className="bg-white p-3 rounded-lg text-gray-800 max-w-xs shadow">
          Ok! Primeiro, selecione sua matrícula:
        </div>
      ),
      alignment: "start",
    };
    const optionsMessage = {
      id: Date.now() + 1,
      type: "options",
      options: availableRegistrations,
      handler: handleRegistrationSelect,
      alignment: "center",
      layout: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    };
    setMessages((prev) => [...prev, botMessage, optionsMessage]);
  };

  const handleRegistrationSelect = (registration: string) => {
    setRequirementData((prev) => ({ ...prev, registration }));
    setMessages((prev) => addUserMessage(registration, prev));
    setTimeout(askForRequirementType, 800);
  };

  // --- ETAPA DE TIPO DE REQUERIMENTO MODIFICADA ---
  const askForRequirementType = () => {
    const botMessage = {
      id: Date.now(),
      // Usa o novo componente de busca
      component: (
        <RequirementTypeStep
          allTypes={requirementTypes}
          onSelect={handleTypeSelect}
        />
      ),
      alignment: "start",
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  // --- HANDLER MODIFICADO PARA LÓGICA CONDICIONAL DE ANEXO ---
  const handleTypeSelect = (type: string) => {
    // Atualiza os dados e a mensagem do usuário
    setRequirementData((prev) => ({ ...prev, type }));
    setMessages((prev) => addUserMessage(type, prev));

    setTimeout(() => {
      // Verifica se o tipo selecionado precisa de anexo
      if (typesNeedingAttachment.includes(type)) {
        askForAttachment();
      } else {
        // Se não precisar, finaliza o requerimento sem arquivo
        finalizeRequirement(null);
      }
    }, 800);
  };

  const askForAttachment = () => {
    const botMessage = {
      id: Date.now(),
      component: <FileUploadStep onSubmit={finalizeRequirement} />,
      alignment: "start",
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  // --- FUNÇÃO DE FINALIZAÇÃO CENTRALIZADA ---
  const finalizeRequirement = (file: File | null) => {
    // Coleta todos os dados, incluindo o arquivo (que pode ser null)
    const finalData = { ...requirementData, file };
    setRequirementData(finalData);

    // Log para ver os dados coletados (você enviaria para a API aqui)
    console.log("Dados Finais do Requerimento:", finalData);

    const confirmationMessage = {
      id: Date.now(),
      component: (
        <div className="bg-white p-4 rounded-lg text-gray-800 max-w-md shadow text-center">
          ✅<br />
          <strong>Requerimento enviado com sucesso!</strong>
          <br />
          Consulte o status na opção "Consultar Requerimentos".
        </div>
      ),
      alignment: "center",
    };

    // Remove a última etapa (busca ou upload) e adiciona a confirmação
    setMessages((prev) => [...prev.slice(0, -1), confirmationMessage]);
  };

  // ... O resto do seu código (toggleMenu, useEffects de auth, return com o JSX) continua o mesmo.
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsMenuVisible(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuVisible]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }
      try {
        const isValid = await validateToken(token);
        if (!isValid) {
          localStorage.removeItem("token");
          router.push("/signin");
        } else {
          setIsAuthChecked(true);
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        localStorage.removeItem("token");
        router.push("/signin");
      }
    };
    checkAuth();
  }, [router]);

  if (!isAuthChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#002415] text-white">
        Carregando...
      </div>
    );
  }

  if (loading) {
    return <div className="text-center p-8">Carregando suas matrículas...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 bg-red-100 rounded-lg">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#D9D9D9]">
      <Navbar function={toggleMenu} />
      <div ref={menuRef}>
        <MenuNav
          isVisible={isMenuVisible}
          onClose={() => setIsMenuVisible(false)}
        />
      </div>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto">
          {messages.map((msg) => {
            const containerClasses = `flex w-full justify-${
              msg.alignment || "center"
            }`;
            return (
              <div key={msg.id} className={containerClasses}>
                {msg.type === "options" ? (
                  <div
                    className={`gap-4 w-full animate-fade-in-up ${
                      msg.layout || "grid grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {msg.options.map((opt: string) => (
                      <CardOption
                        key={opt}
                        title={opt}
                        onClick={() => msg.handler(opt)}
                      />
                    ))}
                  </div>
                ) : (
                  msg.component
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>
    </div>
  );
}
