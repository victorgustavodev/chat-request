import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatOption } from "./ChatOption";
import { ChatInput } from "./ChatInput";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type Message = {
  id: string;
  text: string;
  isBot: boolean;
};

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState(true);
  const [showRequerimentOptions, setShowRequerimentOptions] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome messages
    setMessages([
      {
        id: "1",
        text: "Olá, me chamo CrocoTalk! Seja bem-vindo ao Chat-Request, aqui você pode solicitar e consultar requerimentos de maneira . Selecione uma das opções abaixo",
        isBot: true,
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      let botResponse: Message;
      
      if (text === "Solicitar Requerimento") {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "Por favor, selecione o tipo de requerimento desejado:",
          isBot: true,
        };
        setShowOptions(false);
        setShowRequerimentOptions(true);
      } 
      else if (text === "Consultar Requerimento") {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "Por favor, insira o número da sua matrícula:",
          isBot: true,
        };
      }
      else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: `Você selecionou: ${text}`,
          isBot: true,
        };
        setShowOptions(false);
        setShowRequerimentOptions(false);
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
    setShowOptions(false);
  };

  const handleRequerimentOptionClick = (option: string) => {
    handleSendMessage(option);
    setShowRequerimentOptions(false);
  };

  const renderOptions = () => (
    <>
      <ChatOption
        label="Solicitar Requerimento"
        onClick={() => handleOptionClick("Solicitar Requerimento")}
      />
      <ChatOption
        label="Consultar Requerimento"
        onClick={() => handleOptionClick("Consultar Requerimento")}
      />
    </>
  );

  const renderRequerimentOptions = () => (
    <>
      <ChatOption
        label="Ementa da disciplina"
        onClick={() => handleRequerimentOptionClick("Ementa da disciplina")}
      />
      <ChatOption
        label="Cancelamento de matrícula"
        onClick={() => handleRequerimentOptionClick("Cancelamento de matrícula")}
      />
      <ChatOption
        label="Trancamento de Disciplina"
        onClick={() => handleRequerimentOptionClick("Trancamento de Disciplina")}
      />
      <ChatOption
        label="Declaração de Matrícula"
        onClick={() => handleRequerimentOptionClick("Declaração de Matrícula")}
      />
      <ChatOption
        label="Isenção de disciplina"
        onClick={() => handleRequerimentOptionClick("Isenção de disciplina")}
      />
      <ChatOption
        label="Declaração para Estágio"
        onClick={() => handleRequerimentOptionClick("Declaração para Estágio")}
      />
      <ChatOption
        label="Transfêrencia de Turno"
        onClick={() => handleRequerimentOptionClick("Transfêrencia de Turno")}
      />
      <ChatOption
        label="Abono de falta"
        onClick={() => handleRequerimentOptionClick("Abono de falta")}
      />
      <ChatOption
        label="Justificativa de 2ª Chamada"
        onClick={() => handleRequerimentOptionClick("Justificativa de 2ª Chamada")}
      />
    </>
  );

  return (
    <div className="flex h-screen bg-emerald-500">
      <Sidebar />
      
      <div className="flex flex-col flex-grow h-full lg:px-8 lg:py-6">
        <Header />
        
        <div className="flex-1 bg-white lg:rounded-lg lg:max-w-2xl lg:mx-auto w-full overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => {
              // Mostrar as opções apenas na última mensagem do bot
              const isLastBotMessage = index === messages.length - 1 && msg.isBot;
              
              if (msg.isBot && isLastBotMessage) {
                return (
                  <ChatMessage 
                    key={msg.id} 
                    isBot={msg.isBot} 
                    message={msg.text} 
                    showAvatar={index === 0 || (messages[index-1] && !messages[index-1].isBot)}
                  >
                    {showOptions && renderOptions()}
                    {showRequerimentOptions && renderRequerimentOptions()}
                  </ChatMessage>
                );
              }
              
              return (
                <ChatMessage 
                  key={msg.id} 
                  isBot={msg.isBot} 
                  message={msg.text} 
                  showAvatar={index === 0 || (messages[index-1] && !messages[index-1].isBot)}
                />
              );
            })}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 bg-white border-t">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}; 