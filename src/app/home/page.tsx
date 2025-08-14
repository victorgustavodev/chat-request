/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardMain } from "@/components/chat-bot/cards/cardMain";
import { CardOption } from "@/components/chat-bot/cards/cardOption";
import { Navbar } from "@/components/chat-bot/nav/Navbar";
import { MenuNav } from "./../../components/chat-bot/nav/MenuNav";
import {
  validateToken,
  getMinhasMatriculas,
  getTiposRequerimento,
  cadastrarRequerimento,
  getMeusRequerimentos, // Importe a nova função
  getMe
} from "@/services/userService";

// --- Interfaces ---
interface Matricula {
  id_matricula: number;
  numero_matricula: string;
  curso: { nome_curso: string };
}

interface AnexoExigido {
  id_tipo_anexo: number;
  nome_anexo: string;
}

interface TipoRequerimento {
  id_tipo_requerimento: number;
  nome_requerimento: string;
  anexos_exigidos: AnexoExigido[];
}

interface Requerimento {
    id_requerimento: number;
    protocolo: string;
    status: string;
    created_at: string;
    tipo_requerimento: {
        nome_requerimento: string;
    }
}

// --- Componentes Auxiliares ---

// NOVO COMPONENTE PARA LISTAR OS REQUERIMENTOS
const ConsultarRequerimentos = () => {
    const [requerimentos, setRequerimentos] = useState<Requerimento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequerimentos = async () => {
            try {
                const data = await getMeusRequerimentos();
                setRequerimentos(data);
            } catch (err: any) {
                setError(err.message || "Erro ao buscar requerimentos.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequerimentos();
    }, []);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Deferido': return 'bg-green-100 text-green-800';
            case 'Indeferido': return 'bg-red-100 text-red-800';
            case 'Aberto': return 'bg-blue-100 text-blue-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) return <div className="text-center p-4">Carregando seus requerimentos...</div>;
    if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

    return (
        <div className="w-full max-w-2xl p-4 sm:p-6 bg-white rounded-xl shadow-lg flex flex-col gap-4 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-800">Seus Requerimentos</h3>
            {requerimentos.length === 0 ? (
                <p className="text-gray-500">Você ainda não solicitou nenhum requerimento.</p>
            ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {requerimentos.map(req => (
                        <div key={req.id_requerimento} className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{req.tipo_requerimento.nome_requerimento}</p>
                                <p className="text-xs text-gray-500">Protocolo: {req.protocolo}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(req.status)}`}>
                                {req.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// (Seus outros componentes auxiliares como FileUploadStep, etc. continuam aqui)
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

const ObservationsStep = ({ onSubmit }: { onSubmit: (observations: string) => void; }) => {
    const [observations, setObservations] = useState("");

    const handleSubmit = () => {
        onSubmit(observations);
    };

    return (
        <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md flex flex-col gap-4 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-gray-800">Observações (Opcional)</h3>
            <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
                    Se desejar, adicione alguma observação à sua solicitação.
                </label>
                <textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: Solicito urgência na emissão do documento."
                />
            </div>
            <button
                onClick={handleSubmit}
                className="w-full bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-800 transition-colors"
            >
                Continuar
            </button>
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
  const [availableRegistrations, setAvailableRegistrations] = useState<Matricula[]>([]);
  const [requirementTypes, setRequirementTypes] = useState<TipoRequerimento[]>([]);
  const [userName, setUserName] = useState<string>("");
  
  const [requirementData, setRequirementData] = useState<{
      id_matricula?: number;
      id_tipo_requerimento?: number;
      observacoes?: string;
      tipo_requerimento_obj?: TipoRequerimento;
  }>({});

  const requirementDataRef = useRef(requirementData);
  useEffect(() => {
    requirementDataRef.current = requirementData;
  }, [requirementData]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }
      
      try {
        const isValid = await validateToken(token);
        if (!isValid) throw new Error("Token inválido");
        
        const [userData, matriculasData, tiposData] = await Promise.all([
            getMe(),
            getMinhasMatriculas(),
            getTiposRequerimento()
        ]);

        setUserName(userData.nome_completo);
        setAvailableRegistrations(matriculasData); 
        setRequirementTypes(tiposData);
        setIsAuthChecked(true);

      } catch (error) {
        console.error("Erro no setup inicial:", error);
        localStorage.removeItem('token');
        router.push('/signin');
      }
    };
    checkAuthAndFetchData();
  }, [router]);

  useEffect(() => {
    if (isAuthChecked) {
      startNewFlow();
    }
  }, [isAuthChecked]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Funções do Fluxo do Chat ---

  const startNewFlow = () => {
    setMessages([
        {
          id: Date.now() + 1,
          type: "options",
          options: ["Solicitar Requerimento", "Consultar Requerimentos"],
          handler: handleInitialOption,
          alignment: "center",
          layout: "grid grid-cols-1 sm:grid-cols-2",
          disabled: false,
        },
    ]);
  };

  const disableLastOptions = () => {
      setMessages(prev => prev.map(msg => msg.type === 'options' ? { ...msg, disabled: true } : msg));
  };

  const addUserMessage = (text: string) => {
    const userMessage = {
      id: Date.now(),
      component: <div className="bg-green-700 text-white p-3 rounded-lg max-w-xs shadow">{text}</div>,
      alignment: "end",
    };
    disableLastOptions();
    setMessages(prev => [...prev, userMessage]);
  };

  const handleInitialOption = (option: string) => {
    addUserMessage(option);
    setTimeout(() => {
      if (option === "Solicitar Requerimento") {
        askForRegistration();
      } else if (option === "Consultar Requerimentos") {
        showMyRequirements();
      }
    }, 800);
  };

  const showMyRequirements = () => {
      const botMessage = {
          id: Date.now(),
          component: <ConsultarRequerimentos />,
          alignment: 'start'
      };
      const restartOptions = {
          id: Date.now() + 1,
          type: "options",
          options: ["Solicitar Novo Requerimento", "Voltar ao Início"],
          handler: (opt: string) => {
              addUserMessage(opt);
              if (opt === "Solicitar Novo Requerimento") {
                  setTimeout(askForRegistration, 800);
              } else {
                  setTimeout(startNewFlow, 800);
              }
          },
          alignment: 'center',
          layout: 'grid grid-cols-1 sm:grid-cols-2',
          disabled: false
      };
      setMessages(prev => [...prev, botMessage, restartOptions]);
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
      options: availableRegistrations.map(reg => `${reg.numero_matricula} - ${reg.curso.nome_curso}`),
      handler: handleRegistrationSelect,
      alignment: 'center',
      layout: "grid grid-cols-1",
      disabled: false,
    };
    setMessages(prev => [...prev, botMessage, optionsMessage]);
  };

  const handleRegistrationSelect = (registrationText: string) => {
    const registrationNumber = registrationText.split(' - ')[0];
    const selectedRegistration = availableRegistrations.find(reg => reg.numero_matricula === registrationNumber);

    if (selectedRegistration) {
      setRequirementData(prev => ({ ...prev, id_matricula: selectedRegistration.id_matricula }));
      addUserMessage(registrationText);
      setTimeout(askForRequirementType, 800);
    }
  };

  const askForRequirementType = () => {
    const botMessage = {
      id: Date.now(),
      component: <RequirementTypeStep allTypes={requirementTypes.map(rt => rt.nome_requerimento)} onSelect={handleTypeSelect} />,
      alignment: "start",
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleTypeSelect = (typeName: string) => {
    const selectedType = requirementTypes.find(rt => rt.nome_requerimento === typeName);
    
    if (selectedType) {
      setRequirementData(prev => ({ ...prev, id_tipo_requerimento: selectedType.id_tipo_requerimento, tipo_requerimento_obj: selectedType }));
      addUserMessage(typeName);
      setTimeout(askForObservations, 800);
    }
  };
  
  const askForObservations = () => {
    const botMessage = {
        id: Date.now(),
        component: <ObservationsStep onSubmit={handleObservationsSubmit} />,
        alignment: 'start'
    };
    setMessages(prev => [...prev, botMessage]);
  };
  
  const handleObservationsSubmit = (observations: string) => {
      setRequirementData(prev => ({ ...prev, observacoes: observations }));
      addUserMessage(observations || "Nenhuma observação.");

      setTimeout(() => {
          const currentRequirement = requirementDataRef.current.tipo_requerimento_obj;
          if (currentRequirement?.anexos_exigidos && currentRequirement.anexos_exigidos.length > 0) {
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

  const finalizeRequirement = async (file: File | null) => {
    const fileMessageText = file ? `Arquivo "${file.name}" anexado.` : "Nenhum anexo necessário.";
    const userFileMessage = { id: Date.now(), component: <div className="bg-green-700 text-white p-3 rounded-lg max-w-xs shadow">{fileMessageText}</div>, alignment: "end" };
    
    const sendingMessage = { id: Date.now() + 1, component: <div className="bg-white p-3 rounded-lg text-gray-800 max-w-xs shadow">Enviando sua solicitação...</div>, alignment: 'start' };
    
    disableLastOptions();
    setMessages(prev => [...prev, userFileMessage, sendingMessage]);

    const currentData = requirementDataRef.current;
    const formData = new FormData();
    formData.append('id_matricula', String(currentData.id_matricula));
    formData.append('id_tipo_requerimento', String(currentData.id_tipo_requerimento));
    
    if (currentData.observacoes) {
        formData.append('observacoes', currentData.observacoes);
    }

    if (file && currentData.tipo_requerimento_obj?.anexos_exigidos[0]) {
        formData.append('anexos[0][file]', file);
        formData.append('anexos[0][id_tipo_anexo]', String(currentData.tipo_requerimento_obj.anexos_exigidos[0].id_tipo_anexo));
    }

    try {
        await cadastrarRequerimento(formData);
        const confirmationMessage = {
            id: Date.now() + 2,
            component: <div className="bg-white p-4 rounded-lg text-gray-800 max-w-md shadow text-center">✅<br/><strong>Requerimento enviado com sucesso!</strong><br/>O que deseja fazer agora?</div>,
            alignment: 'center'
        };
        setMessages(prev => [...prev.slice(0, -1), confirmationMessage]);
    } catch (error: any) {
        const errorMessage = {
            id: Date.now() + 2,
            component: <div className="bg-red-100 p-4 rounded-lg text-red-700 max-w-md shadow text-center">❌<br/><strong>Falha ao enviar!</strong><br/>{error.message}</div>,
            alignment: 'center'
        };
        setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
        setTimeout(() => {
            const restartOptions = {
                id: Date.now() + 3,
                type: "options",
                options: ["Solicitar Requerimento", "Consultar Requerimentos"],
                handler: handleInitialOption,
                alignment: "center",
                layout: "grid grid-cols-1 sm:grid-cols-2",
                disabled: false,
            };
            setMessages(prev => [...prev, restartOptions]);
        }, 2000);
    }
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
          {userName && (
              <div className="text-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-700">Olá, {userName}!</h2>
              </div>
          )}

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
                        onClick={msg.disabled ? () => {} : () => msg.handler(opt)}
                        disabled={msg.disabled}
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