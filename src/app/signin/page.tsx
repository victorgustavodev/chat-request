/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from 'react';
import Button from "@/components/button";
import TextField from "@/components/field/TextField";
import Link from "next/link";
import { useState } from 'react';
import { logarUsuario } from "@/services/userService";
import { useRouter } from 'next/navigation';
import { validateToken } from '@/services/userService';

export default function Signin() {
  const [form, setForm] = useState({
    cpf: "",
    password: "",
  });

  const [mensagem, setMensagem] = useState("");

  const router = useRouter();

// ... (seus imports e o início do componente)
useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('token');

    // Se não houver token, redireciona para o login
    if (token) {
      router.push('/home');
      return; // Interrompe a execução
    }

    try {
      const isValid = await validateToken(token);

      if (!isValid) {
        // Se o token for inválido, limpa e redireciona
        localStorage.removeItem('token');
        router.push('/signin');
      } else {
        // Se o token for VÁLIDO, apenas atualiza o estado para mostrar a página.
        // NÃO redirecione para a mesma página.
        setIsAuthChecked(true);
      }
    } catch (error) {
      // Se a validação der erro (ex: problema de rede), trata como inválido
      console.error("Erro ao validar token:", error);
      localStorage.removeItem('token');
      router.push('/signin');
    }
  };

  checkAuth();
}, []);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem("");

    try {
      // 1. Limpa a máscara do CPF antes de enviar
      const cpfLimpo = form.cpf.replace(/\D/g, "");

      // 2. Envia apenas os dados necessários para a função
      const response = await logarUsuario({
        cpf: cpfLimpo,
        password: form.password,
      });

      // 3. Verifica se a resposta contém o token e o salva
      if (response && response.token) {
        localStorage.setItem('token', response.token); // Salva o token
        setMensagem("Login realizado com sucesso!");
        router.push('/home'); // Redireciona para a página principal
      } else {
        // Fallback caso a API dê sucesso mas não retorne um token
        setMensagem("Erro: Token não recebido do servidor.");
      }
    } catch (error: any) {
      // O 'catch' agora exibirá a mensagem de erro vinda diretamente da API
      setMensagem(`Erro: ${error.message}`);
    }
  }

// ... (resto do seu return JSX)
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo - visual */}
      <div className="hidden md:flex flex-col justify-center items-center bg-[#002415] text-white w-full md:w-1/2 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Bem Vindo de Volta ao</h1>
          <h2 className="text-4xl font-bold mb-4">Chat Request!</h2>
          <p className="text-lg max-w-md">
            Faça login para acessar as ferramentas de gerenciamento e consulta de requerimentos.
          </p>
        </div>
          <img src="/images/aligator_200.png" alt="logo" className="w-40 h-40" />
      </div>

      {/* Lado direito - formulário */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="w-full max-w-md">

          <form className="flex flex-col gap-4 bg-white rounded-lg p-6 shadow-md" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-emerald-700 text-center">Entrar na Conta</h2>
          <p className="text-center text-sm text-gray-600">Para acessar seus requerimentos.</p>
            <TextField
              label="CPF"
              type="cpf"
              MaxLength={14}
              placeholder="000.000.000-00"
              iconRight={<img src="/images/cpf.svg" alt="CPF" className="w-4 h-4" />}
              required
              value={form.cpf}
              onChange={(value) => setForm((prev) => ({ ...prev, cpf: value }))}
            />

            <TextField
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              required
              value={form.password}
              onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
            />

            <div className="flex justify-end">
              <Link href="/recuperar-senha">
                <span className="text-sm text-emerald-600 hover:underline">
                  Esqueceu a senha?
                </span>
              </Link>
            </div>

            {mensagem && (
              <div className={`text-center text-sm ${mensagem.startsWith('Erro') ? 'text-red-600' : 'text-emerald-600'} mt-2`}>
                {mensagem}
              </div>
            )}

            <Button className="bg-[#002415] hover:bg-emerald-900 text-white font-semibold py-[10px] rounded-md">
              Acessar
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Ainda não tem uma conta?
            <Link href="/signup" className="text-emerald-600 font-medium hover:underline ml-1">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
