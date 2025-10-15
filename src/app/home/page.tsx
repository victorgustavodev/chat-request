/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ----------------------------------------------------------------------
// --- ÍCONES SVG INLINE (Substituindo 'lucide-react') ---
// ----------------------------------------------------------------------

// Componente base para todos os ícones inline
const BaseIcon = ({ children, className = "w-5 h-5", ...props }: any) => (
    <svg {...props} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

const LogOut = (props: any) => (<BaseIcon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></BaseIcon>);
const Menu = (props: any) => (<BaseIcon {...props}><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></BaseIcon>);
const User = (props: any) => (<BaseIcon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></BaseIcon>);
const AlertTriangle = (props: any) => (<BaseIcon {...props}><path d="M10.29 3.86L1.86 18.14A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.64-2.86L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></BaseIcon>);
const Loader = (props: any) => (<BaseIcon {...props} className={props.className || "w-5 h-5"}><path d="M12 2v4"/><path d="m16.2 7.8 2.8-2.8"/><path d="M22 12h-4"/><path d="m16.2 16.2 2.8 2.8"/><path d="M12 22v-4"/><path d="m7.8 16.2-2.8 2.8"/><path d="M2 12h4"/><path d="m7.8 7.8-2.8-2.8"/></BaseIcon>);
const HomeIcon = (props: any) => (<BaseIcon {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></BaseIcon>);
const Zap = (props: any) => (<BaseIcon {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></BaseIcon>);
const MessageSquare = (props: any) => (<BaseIcon {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></BaseIcon>);

// ----------------------------------------------------------------------
// --- MOCKS DE AUTENTICAÇÃO E DECODIFICAÇÃO (Para tornar o código completo e independente) ---
// ----------------------------------------------------------------------

// 1. Função Simplificada de Decodificação de JWT
const simpleJwtDecode = (token: string): { role?: string, exp?: number } => {
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) throw new Error("Payload not found.");
        
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return {};
    }
};

// ----------------------------------------------------------------------
// --- Constantes e Interfaces da API ---
// ----------------------------------------------------------------------

const BASE_URL = "http://localhost:8000/api";
const AUTH_URL = `${BASE_URL}`;
const REQUEST_URL = `${BASE_URL}/requests`; 
const REGISTRATION_URL = `${BASE_URL}/enrollment`; 
const TYPES_URL = `${BASE_URL}/type_requests`; 

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

interface UserData {
    nome_completo: string;
    email: string;
    id: number;
}


// ----------------------------------------------------------------------
// --- SIMULAÇÃO DE SERVIÇOS (com tratamento de erro aprimorado) ---
// ----------------------------------------------------------------------

/**
 * Função auxiliar para requisições com tratamento de erro e uso de token.
 */
async function apiFetch(url: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}), // Garante que headers existentes sejam incluídos
};

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
    ...options,
    headers: headers as HeadersInit, // Conversão de volta para o fetch
};

const response = await fetch(url, config);

    try {
        const response = await fetch(url, config);
        
        const isJson = response.headers.get('content-type')?.includes('application/json');
        
        let data: any;
        try {
             data = isJson ? await response.json() : await response.text();
        } catch (e) {
             data = `Resposta não-JSON ou vazia. Status: ${response.status}`;
        }

        if (!response.ok) {
            let message = (typeof data === 'object' && data.message) ? data.message : (typeof data === 'string' ? data : `Erro HTTP ${response.status}`);
            
            if (response.status === 401 || response.status === 403) {
                message = `Token Inválido ou Sessão Expirada. (Status ${response.status})`;
            } else if (response.status === 404) {
                 message = `Endpoint não encontrado (404) em: ${url}.`;
            }

            throw new Error(message);
        }

        return data;

    } catch (error: any) {
        const errorMessage = error.message.includes('Failed to fetch') 
                           ? `Erro de Conexão: O servidor (${BASE_URL}) está offline ou inacessível.`
                           : error.message;
        throw new Error(errorMessage);
    }
}

/**
 * Rota CORRIGIDA: Usa /api/me para validação e dados do usuário.
 */
const getMe = async (): Promise<UserData> => {
    // Rota: http://localhost:8000/api/me
    const data = await apiFetch(`${AUTH_URL}/me`);
    return data;
};

// Obter Matrículas (Ajustado para a rota Laravel)
const getMinhasMatriculas = async (): Promise<Matricula[]> => {
    // Rota: http://localhost:8000/api/enrollment (assumindo a rota apiResource)
    const data = await apiFetch(REGISTRATION_URL);
    // Assumindo que a resposta de apiResource retorna um objeto com uma chave 'data'
    return data.data || []; 
};

// Obter Tipos de Requerimento (Ajustado para a rota Laravel)
const getTiposRequerimento = async (): Promise<TipoRequerimento[]> => {
    // Rota: http://localhost:8000/api/type_requests
    const data = await apiFetch(TYPES_URL);
    return data.data || [];
};

// Cadastrar Requerimento
const cadastrarRequerimento = async (formData: FormData): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Token ausente para cadastro.");

    // Usa fetch nativo para que o navegador defina o Content-Type para FormData
    const response = await fetch(REQUEST_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json' 
        },
        body: formData,
    });
    
    let errorData: any;
    try {
        errorData = await response.json();
    } catch (e) {
        errorData = { message: `Erro HTTP ${response.status}: Resposta não JSON.` };
    }


    if (!response.ok) {
        const message = errorData.message || (errorData.errors ? JSON.stringify(errorData.errors) : `Erro HTTP ${response.status}`);
        throw new Error(message);
    }
    
    return errorData;
};


// ----------------------------------------------------------------------
// --- COMPONENTES DE UI/CHAT (Etapas do Fluxo) ---
// ----------------------------------------------------------------------

const Navbar = ({ toggleMenu }: { toggleMenu: () => void }) => (
    <header className="bg-[#002415] text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
            <HomeIcon className="w-5 h-5 mr-2" />
            <h1 className="text-xl font-bold">Portal de Requerimentos</h1>
        </div>
        <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-green-700 transition-colors">
            <Menu className="h-6 w-6" />
        </button>
    </header>
);

const MenuNav = ({ isVisible, onClose, onLogout }: { isVisible: boolean; onClose: () => void; onLogout: () => void }) => {
    return (
        <div 
            className={`fixed inset-0 z-20 transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className={`absolute top-0 right-0 w-64 h-full bg-white shadow-xl transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 flex flex-col h-full">
                    <button onClick={onClose} className="self-end p-2 text-gray-700 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Menu</h2>
                    <ul className="flex-1 space-y-4">
                        <li><a href="#" onClick={onClose} className="text-gray-600 hover:text-green-700 transition-colors flex items-center"><HomeIcon className="w-4 h-4 mr-2" /> Início</a></li>
                        <li><a href="#" onClick={onClose} className="text-gray-600 hover:text-green-700 transition-colors flex items-center"><User className="w-4 h-4 mr-2" /> Perfil</a></li>
                    </ul>
                    <button 
                        onClick={onLogout} 
                        className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors mt-4 flex items-center justify-center"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Sair
                    </button>
                </div>
            </div>
        </div>
    );
};


const CardOption = ({ title, onClick, disabled }: { title: string; onClick: () => void; disabled?: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full p-4 rounded-xl shadow-md text-sm font-semibold transition-all duration-200 
            ${disabled 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                : 'bg-white text-green-700 border-2 border-green-700 hover:bg-green-700 hover:text-white hover:shadow-lg'
            }`}
    >
        {title}
    </button>
);


const ConsultarRequerimentos = () => {
    const [requerimentos, setRequerimentos] = useState<Requerimento[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null); 

    useEffect(() => {
        const fetchRequerimentos = async () => {
            setLoading(true);
            setStatusError(null); 
            try {
                // Rota: /api/requests (com autenticação)
                const data = await apiFetch(REQUEST_URL); 
                setRequerimentos(data.data || []);
            } catch (err: any) {
                setStatusError(err.message || "Erro desconhecido ao carregar requerimentos.");
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

    if (loading) return <div className="text-center p-4"><Loader className="w-6 h-6 animate-spin inline-block mr-2 text-gray-500" /> Carregando seus requerimentos...</div>;
    
    if (statusError) return (
        <div className="text-center p-6 bg-red-100 border border-red-400 rounded-xl text-red-700 shadow-lg">
            <h4 className="font-bold mb-2">Falha no Acesso aos Requerimentos</h4>
            <p className="text-sm">{statusError}</p>
        </div>
    );
    
    if (requerimentos && requerimentos.length === 0) {
        return (
            <div className="w-full max-w-2xl p-4 sm:p-6 bg-yellow-50 rounded-xl shadow-lg flex flex-col gap-4">
                <h3 className="text-lg font-bold text-gray-800">Seus Requerimentos</h3>
                <p className="text-gray-500">Você ainda não solicitou nenhum requerimento.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl p-4 sm:p-6 bg-white rounded-xl shadow-lg flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-800">Seus Requerimentos</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {requerimentos?.map(req => (
                    <div key={req.id_requerimento} className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{req.tipo_requerimento.nome_requerimento}</p>
                            <p className="text-xs text-gray-500">Protocolo: {req.protocolo}</p>
                            <p className="text-xs text-gray-500">Data: {new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(req.status)}`}>
                            {req.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FileUploadStep = ({
    tipoAnexo,
    onSubmit,
}: {
    tipoAnexo: AnexoExigido;
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
            <p className="text-sm text-gray-600">Documento exigido: **{tipoAnexo.nome_anexo}**</p>
            <div>
                <label
                    htmlFor="attachment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Selecione o arquivo:
                </label>
                <input
                    type="file"
                    id="attachment"
                    name="attachment"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="w-full bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400"
                disabled={!file}
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
    allTypes: TipoRequerimento[];
    onSelect: (type: string) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTypes = allTypes.filter((type) =>
        type.nome_requerimento.toLowerCase().includes(searchTerm.toLowerCase().trim())
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
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            <div className="max-h-[22rem] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredTypes.length > 0 ? (
                        filteredTypes.map((type) => (
                            <CardOption
                                key={type.id_tipo_requerimento}
                                title={type.nome_requerimento}
                                onClick={() => onSelect(type.nome_requerimento)}
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
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
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


// ----------------------------------------------------------------------
// --- COMPONENTE PRINCIPAL (Home) ---
// ----------------------------------------------------------------------

export default function Home() {
    
    // FIX: Remove 'navigate' helper function as it caused the SyntaxError
    // const navigate = (path: string) => { window.location.href = path; }; 

    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [authError, setAuthError] = useState<string | null>(null);

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

    /**
     * FIX: Nova função de logout segura que atualiza o estado em vez de usar window.location.href
     */
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setIsAuthChecked(false);
        setAuthError("Sessão encerrada. Por favor, faça login novamente.");
        // Removido: window.location.href = '/login';
    }, []); 

    /**
     * Efeito para carregar dados iniciais e verificar autenticação.
     */
    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setAuthError("Token de autenticação não encontrado. Por favor, faça login.");
                // FIX: Chama o handleLogout para forçar o estado de deslogado/erro
                handleLogout(); 
                return;
            }
            
            try {
                // 1. Tenta obter os dados do usuário na rota CORRIGIDA /api/me.
                const userData = await getMe(); 
                
                // 2. Se for bem-sucedido, carrega o restante dos dados.
                const [matriculasData, tiposData] = await Promise.all([
                    getMinhasMatriculas(),
                    getTiposRequerimento()
                ]);

                setUserName(userData.nome_completo);
                setAvailableRegistrations(matriculasData); 
                setRequirementTypes(tiposData);
                setAuthError(null);
                setIsAuthChecked(true);

            } catch (error: any) {
                console.error("Erro no setup inicial:", error);
                
                setAuthError(error.message);
                
                if (error.message.includes('Token Inválido') || error.message.includes('Sessão Expirada')) {
                     // FIX: Chama o handleLogout
                     handleLogout(); 
                }
            }
        };
        checkAuthAndFetchData();
    }, [handleLogout]); // Dependência atualizada para handleLogout

    /**
     * Inicia o fluxo do chat após a autenticação.
     */
    useEffect(() => {
        if (isAuthChecked) {
            startNewFlow();
        }
    }, [isAuthChecked]);

    /**
     * Rola para o final das mensagens.
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- Funções do Fluxo do Chat ---

    const startNewFlow = () => {
        setMessages([
             {
                id: Date.now() + 0,
                component: <div className="bg-white p-3 rounded-lg text-gray-800 max-w-xs shadow">Olá, **{userName}**! Como posso te ajudar hoje?</div>,
                alignment: "start",
            },
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
        setMessages(prev => prev.map(msg => msg.type === 'options' && !msg.disabled ? { ...msg, disabled: true } : msg));
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
            if (option.includes("Solicitar")) {
                askForRegistration();
            } else if (option.includes("Consultar")) {
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
                if (opt.includes("Novo")) {
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
        if (availableRegistrations.length === 0) {
             const noRegMessage = {
                id: Date.now(),
                component: <div className="bg-yellow-100 p-3 rounded-lg text-yellow-800 max-w-xs shadow">Atenção: Não encontramos nenhuma matrícula ativa para o seu usuário. Não é possível solicitar um requerimento.</div>,
                alignment: 'start'
            };
            setMessages(prev => [...prev, noRegMessage]);
            setTimeout(startNewFlow, 2000);
            return;
        }

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
            component: <RequirementTypeStep allTypes={requirementTypes} onSelect={handleTypeSelect} />,
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
                askForAttachment(currentRequirement.anexos_exigidos[0]);
            } else {
                finalizeRequirement(null);
            }
        }, 800);
    };

    const askForAttachment = (tipoAnexo: AnexoExigido) => {
        const botMessage = {
            id: Date.now(),
            component: <FileUploadStep tipoAnexo={tipoAnexo} onSubmit={finalizeRequirement} />,
            alignment: "start",
        };
        setMessages((prev) => [...prev, botMessage]);
    };

    const finalizeRequirement = async (file: File | null) => {
        const fileMessageText = file ? `Arquivo "${file.name}" anexado.` : "Nenhum anexo necessário.";
        const userFileMessage = { id: Date.now(), component: <div className="bg-green-700 text-white p-3 rounded-lg max-w-xs shadow">{fileMessageText}</div>, alignment: "end" };
        
        const sendingMessage = { id: Date.now() + 1, component: <div className="bg-white p-3 rounded-lg text-gray-800 max-w-xs shadow"><Loader className="w-4 h-4 animate-spin inline-block mr-2" /> Enviando sua solicitação...</div>, alignment: 'start' };
        
        disableLastOptions();
        setMessages(prev => [...prev, userFileMessage, sendingMessage]);

        const currentData = requirementDataRef.current;
        const formData = new FormData();
        
        if (!currentData.id_matricula || !currentData.id_tipo_requerimento) {
            const errorMessage = {
                 id: Date.now() + 2, 
                 component: <div className="bg-red-100 p-4 rounded-lg text-red-700 max-w-md shadow text-center">❌<br/><strong>Falha na Solicitação!</strong><br/>Dados incompletos. Reinicie o processo.</div>,
                 alignment: 'center'
             };
             setMessages(prev => [...prev.slice(0, -1), errorMessage]);
             setTimeout(startNewFlow, 2000);
             return;
        }

        formData.append('id_matricula', String(currentData.id_matricula));
        formData.append('id_tipo_requerimento', String(currentData.id_tipo_requerimento));
        
        if (currentData.observacoes) {
            formData.append('observacoes', currentData.observacoes);
        }

        if (file && currentData.tipo_requerimento_obj?.anexos_exigidos[0]) {
            // Ajuste o nome do campo se seu backend Laravel esperar algo diferente de 'anexos[0][file]'
            formData.append('anexos[0][file]', file); 
            formData.append('anexos[0][id_tipo_anexo]', String(currentData.tipo_requerimento_obj.anexos_exigidos[0].id_tipo_anexo));
        }

        try {
            const result = await cadastrarRequerimento(formData);
            const confirmationMessage = {
                id: Date.now() + 2,
                component: <div className="bg-white p-4 rounded-lg text-gray-800 max-w-md shadow text-center">✅<br/><strong>Requerimento enviado com sucesso!</strong><br/>Protocolo: **{result.protocolo || 'N/A'}**</div>,
                alignment: 'center'
            };
            setMessages(prev => [...prev.slice(0, -1), confirmationMessage]); 
        } catch (error: any) {
            const errorMessage = {
                id: Date.now() + 2,
                component: <div className="bg-red-100 p-4 rounded-lg text-red-700 max-w-md shadow text-center">❌<br/><strong>Falha ao enviar!</strong><br/>{error.message || "Erro desconhecido."}</div>,
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

    // --- Renderização Condicional de Estado ---
    if (!isAuthChecked || authError) {
        return (
            <div className="flex flex-col h-screen w-full items-center justify-center bg-[#002415] p-6">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
                    {authError ? (
                        <>
                            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                            <p className="text-red-600 font-bold mb-4 text-lg">
                                Erro de Inicialização ou Sessão Expirada
                            </p>
                            <p className="text-gray-700 text-sm mb-4 break-words">
                                {authError}
                            </p>
                            <p className="text-xs text-gray-500">
                                Para continuar, você precisará fazer login na aplicação original e garantir que seu servidor esteja ativo em **`http://localhost:8000`** com a rota **`/api/me`** funcionando.
                            </p>
                            <button onClick={handleLogout} className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                Sair/Tentar Novamente
                            </button>
                        </>
                    ) : (
                        <>
                           <Loader className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
                           <p className="text-gray-700 font-semibold">Carregando dados de autenticação...</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // --- Renderização Principal (Chat) ---
    return (
        <div className="h-screen flex flex-col bg-[#D9D9D9] font-sans">
            <Navbar toggleMenu={toggleMenu} />
            <div ref={menuRef}>
                <MenuNav
                    isVisible={isMenuVisible}
                    onClose={() => setIsMenuVisible(false)}
                    onLogout={handleLogout} // Chama a função de logout segura
                />
            </div>
            <main className="flex-1 overflow-y-auto p-4 flex flex-col">
                <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto">
                    {messages.map((msg) => {
                        const containerClasses = `flex w-full justify-${
                            msg.alignment === "start" ? "start" : msg.alignment === "end" ? "end" : "center"
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
