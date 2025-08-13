'use client';

import Link from "next/link";
import Image from "next/image";
import { FiMessageSquare, FiFileText, FiCheckSquare, FiPieChart, FiUsers } from 'react-icons/fi';

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* --- Header & Navegação --- */}
      <header className="sticky top-0 z-30 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/aligator_200.png"
              alt="Chat Request Logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold text-[#002415]">Chat Request</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="hover:text-emerald-700 transition-colors">Funcionalidades</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">Como Funciona</a>
            <Link href="/cradt/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
              Acesso CRADT
            </Link>
          </nav>
          <div className="md:hidden">
            <Link href="/signin">
              <button className="bg-[#002415] hover:bg-emerald-800 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                Entrar
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* --- Seção Principal (Hero) --- */}
        <section className="bg-gray-50 py-10">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left px-6 py-20">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#002415] leading-tight mb-4">
                Gerencie Seus Requerimentos de Forma Simples e Rápida
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Com o Chat Request, você solicita e acompanha seus requerimentos acadêmicos através de um chat inteligente, sem burocracia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/signin">
                  <button className="w-full sm:w-auto bg-[#002415] hover:bg-emerald-800 text-white font-bold py-3 px-8 rounded-lg text-lg cursor-pointer transition-transform hover:scale-105">
                    Acessar sua Conta
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="w-full sm:w-auto bg-white text-[#002415] border-2 border-[#002415] font-bold py-3 px-8 rounded-lg cursor-pointer text-lg transition-transform hover:scale-105">
                    Cadastre-se
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- Seção de Funcionalidades --- */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Tudo que você precisa em um só lugar</h2>
            <p className="text-gray-600 mt-2">Simplifique sua vida acadêmica com nossas ferramentas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg border border-gray-100">
              <FiMessageSquare className="text-4xl text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chat Inteligente</h3>
              <p className="text-gray-600">Solicite seus requerimentos através de uma conversa guiada, rápida e intuitiva.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg border border-gray-100">
              <FiFileText className="text-4xl text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Anexo de Documentos</h3>
              <p className="text-gray-600">Envie atestados, comprovantes e outros arquivos necessários diretamente pelo chat.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg border border-gray-100">
              <FiCheckSquare className="text-4xl text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Acompanhamento de Status</h3>
              <p className="text-gray-600">Veja em tempo real se seu pedido foi aberto, está em análise, foi deferido ou indeferido.</p>
            </div>
          </div>
        </section>

        {/* --- Seção "Como Funciona" --- */}
        <section id="how-it-works" className="bg-gray-50">
          <div className="container mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Como Funciona?</h2>
              <p className="text-gray-600 mt-2">Em poucos passos, seu requerimento está a caminho.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="text-center max-w-xs">
                <div className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold">Acesse sua Conta</h3>
                <p className="text-gray-600">Entre com seu CPF e senha ou cadastre-se gratuitamente.</p>
              </div>
              <div className="text-gray-300 hidden md:block">→</div>
              <div className="text-center max-w-xs">
                <div className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold">Inicie o Chat</h3>
                <p className="text-gray-600">Escolha "Solicitar Requerimento" e siga as instruções do nosso assistente.</p>
              </div>
              <div className="text-gray-300 hidden md:block">→</div>
              <div className="text-center max-w-xs">
                <div className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold">Acompanhe</h3>
                <p className="text-gray-600">Consulte o status de todos os seus pedidos em um painel organizado.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* --- Seção para Administradores --- */}
        <section className="container mx-auto px-6 py-20">
            <div className="bg-slate-800 text-white rounded-lg p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">Painel Exclusivo para o CRADT</h2>
                    <p className="text-slate-300 mb-6">Centralize, gerencie e responda a todos os requerimentos em uma plataforma unificada, otimizando o tempo e a comunicação com os alunos.</p>
                    <Link href="/cradt/login">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Acessar Painel de Admin
                        </button>
                    </Link>
                </div>
                <div className="md:w-1/2 grid grid-cols-2 gap-6 text-center">
                    <div className="bg-slate-700 p-4 rounded-lg">
                        <FiPieChart className="text-4xl text-blue-400 mx-auto mb-2"/>
                        <p>Dashboard Intuitiva</p>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                        <FiUsers className="text-4xl text-blue-400 mx-auto mb-2"/>
                        <p>Gestão de Alunos</p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#002415] text-white">
        <div className="container mx-auto text-center p-6">
          <p>&copy; {new Date().getFullYear()} Chat Request. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}