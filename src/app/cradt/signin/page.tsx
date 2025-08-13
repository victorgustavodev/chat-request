/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from "react";
import Button from "@/components/button";
import TextField from "@/components/field/TextField";
import { useRouter } from 'next/navigation';
import Link from "next/link";
// Supondo que a função para logar o admin esteja no seu userService
import { logarUsuarioComEmail } from "@/services/userService"; 

export default function SigninCradt() {
  const [email, setEmail] = useState(""); // Pré-preenchido para facilitar o teste
  const [password, setPassword] = useState(""); // Pré-preenchido para facilitar o teste
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem("");

    try {
      // Chama a função do seu service para fazer o login do admin
      const response = await logarUsuarioComEmail({ email, password });
      
      // Salva o token de admin no localStorage
      localStorage.setItem('token', response.access_token);
      
      setMensagem("Login realizado com sucesso! Redirecionando...");
      
      // Redireciona para o painel de admin após o sucesso
      router.push('/cradt/dashboard'); 
    } catch (error: any) {
      setMensagem(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo */}
      <div className="hidden md:flex flex-col justify-center items-center bg-slate-800 text-white w-full md:w-1/2 p-8">
        <div className="text-center max-w-sm">
          <h2 className="text-4xl font-bold mb-4">Painel Administrativo</h2>
          <p className="text-lg text-slate-300">
            Acesso exclusivo para gerenciamento de requerimentos, alunos e matrículas do sistema.
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 bg-gray-100">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/images/aligator_200.png" alt="logo" className="w-24 h-24 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-gray-800">Acesso CRADT</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-lg p-8 shadow-lg">
            
            <TextField
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(val) => setEmail(val)}
              iconRight={<img src="/images/email.svg" alt="Email" className="w-4 h-4" />}
              required
            />

            <TextField
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(val) => setPassword(val)}
              required
            />

            {mensagem && (
              <p className={`text-center text-sm ${mensagem.startsWith('Erro') ? 'text-red-600' : 'text-green-600'}`}>
                {mensagem}
              </p>
            )}
            <Link href="/cradt/dashboard">
            
            <Button 
              
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md w-full transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Acessando...' : 'Acessar Painel'}
            </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}