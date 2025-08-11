/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardMain } from "@/components/chat-bot/cards/cardMain";
import { CardOption } from "@/components/chat-bot/cards/cardOption";
import { Navbar } from "@/components/chat-bot/nav/Navbar";
import { MenuNav } from "./../../components/chat-bot/nav/MenuNav";
import { validateToken, getMinhasMatriculas } from "@/services/userService";

// --- (Seus componentes auxiliares como FileUploadStep e RequirementTypeStep continuam aqui) ---
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

const RequirementTypeStep = ({
  allTypes,
  onSelect,
}: {
  allTypes: string[];
  onSelect: (type: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

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


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function Home() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [requirementData, setRequirementData] = useState<any>({});
  const [availableRegistrations, setAvailableRegistrations] = useState<any[]>([]);

  // A lista de tipos de requerimento (pode ser buscada da API no futuro)
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

  const typesNeedingAttachment = requirementTypes.filter((type) =>
    type.toLowerCase().includes("(anexo")
  );

  // Efeito principal para autenticação e busca de dados
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }
      
      try {
        const isValid = await validateToken(token);
        if (!isValid) {
          throw new Error("Token inválido");
        }
        
        const matriculasData = await getMinhasMatriculas();
        console.log('JSON completo das matrículas:', matriculasData);
        setAvailableRegistrations(matriculasData); 
        setIsAuthChecked(true); // Marca que a autenticação e o fetch foram concluídos

      } catch (error) {
        console.error("Erro no setup inicial:", error);
        localStorage.removeItem('token');
        router.push('/signin');
      }
    };
    checkAuthAndFetchData();
  }, [router]);

  // Efeito para montar a mensagem inicial APENAS QUANDO a autenticação estiver verificada
  useEffect(() => {
    if (isAuthChecked) {
      setMessages([
        { id: 1, component: <CardMain />, alignment: "center" },
        {
          id: 2,
          type: "options",
          options: ["Solicitar Requerimento", "Consultar Requerimentos"],
          handler: handleInitialOption,
          alignment: "center",
          layout: "grid grid-cols-1 sm:grid-cols-2",
        },
      ]);
    }
  }, [isAuthChecked]); // Depende do isAuthChecked

  // Efeito para scroll automático
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
    // Remove a última mensagem (que contém as opções) antes de adicionar a do usuário
    return [...prevMessages.slice(0, -1), userMessage];
  };

  const handleInitialOption = (option: string) => {
    setMessages((prev) => addUserMessage(option, prev));
    setTimeout(() => {
      if (option === "Solicitar Requerimento") {
        askForRegistration();
      } else {
        // Lógica para consultar requerimentos
      }
    }, 800);
  };

  const askForRegistration = () => {
    const botMessage = {
      id: Date.now(),
      component: <div className="bg-white p-3 rounded-lg text-gray-800 max-w-xs shadow">Ok! Primeiro, selecione sua matrícula:</div>,
      alignment: 'start'
    };
    const optionsMessage = {
      id: Date.now() + 1,
      type: 'options',
      options: availableRegistrations.map(reg => reg.numero_matricula),
      handler: handleRegistrationSelect,
      alignment: 'center',
      layout: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    };
    setMessages(prev => [...prev, botMessage, optionsMessage]);
  };

  const handleRegistrationSelect = (registration: string) => {
    setRequirementData((prev:any) => ({ ...prev, registration }));
    setMessages((prev) => addUserMessage(registration, prev));
    setTimeout(askForRequirementType, 800);
  };

  const askForRequirementType = () => {
    const botMessage = {
      id: Date.now(),
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

  const handleTypeSelect = (type: string) => {
    setRequirementData((prev:any) => ({ ...prev, type }));
    setMessages((prev) => addUserMessage(type, prev));
    setTimeout(() => {
      if (typesNeedingAttachment.includes(type)) {
        askForAttachment();
      } else {
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

  const finalizeRequirement = (file: File | null) => {
    const finalData = { ...requirementData, file };
    setRequirementData(finalData);
    console.log("Dados Finais do Requerimento:", finalData);

    const confirmationMessage = {
      id: Date.now(),
      component: (
        <div className="bg-white p-4 rounded-lg text-gray-800 max-w-md shadow text-center">
          ✅<br />
          <strong>Requerimento enviado com sucesso!</strong>
          <br />
          Consulte o status na opção de Consultar Requerimentos.
        </div>
      ),
      alignment: "center",
    };
    setMessages((prev) => [...prev.slice(0, -1), confirmationMessage]);
  };

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

  if (!isAuthChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#002415] text-white">
        Carregando...
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