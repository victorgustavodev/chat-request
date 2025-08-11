/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';


// --- FUNÇÃO AUXILIAR PARA MÁSCARAS ---
const applyMask = (value: string, type?: 'cpf' | 'phone') => {
  if (!type) return value;

  if (type === 'cpf') {
    return value
      .replace(/\D/g, '') 
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  if (type === 'phone') {
    let v = value.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{5})(\d{4})$/, '$1-$2');
    return v;
  }

  return value;
};


// --- COMPONENTE DE CAMPO DE TEXTO ATUALIZADO ---
interface TextFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  iconRight?: React.ReactNode;
  error?: string | string[];
  maskType?: 'cpf' | 'phone';
}

const TextField: React.FC<TextFieldProps> = ({ label, error, maskType, onChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Aplica a máscara antes de atualizar o estado
    const maskedValue = applyMask(e.target.value, maskType);
    onChange(maskedValue);
  };

  // Define o comprimento máximo com base na máscara
  const maxLength = maskType === 'cpf' ? 14 : maskType === 'phone' ? 15 : undefined;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          {...props}
          value={props.value}
          onChange={handleChange}
          maxLength={maxLength}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
          }`}
        />
        {props.iconRight && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">{props.iconRight}</div>}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
  );
};


// --- COMPONENTE PRINCIPAL DE CADASTRO ---
export default function Signup() {


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    cpf: "",
    phone: "",
    identidade: "",
    orgao_expedidor: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMensagem("");
    setErrors({});

    const payload = {
      nome_completo: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      cpf: form.cpf.replace(/\D/g, ""),
      telefone: form.phone.replace(/\D/g, ""),
      identidade: form.identidade,
      orgao_expedidor: form.orgao_expedidor,
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors);
          setMensagem("Por favor, corrija os erros indicados.");
        } else {
          setMensagem(data.message || "Ocorreu um erro no cadastro.");
        }
        return;
      }
      console.log('Token de acesso:', data.access_token);
      setMensagem("Usuário cadastrado com sucesso!");
      router.push('/signin');
      // localStorage.setItem('auth_token', data.access_token);
      // window.location.href = '/dashboard';

    } catch (error: any) {
      setMensagem("Erro de conexão: Não foi possível conectar à API.");
      console.error("Erro de rede ou API:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex flex-col justify-center items-center bg-[#002415] text-white w-full md:w-1/2 p-8">
        <h1 className="text-4xl font-bold mb-4">Bem Vindo ao</h1>
        <h2 className="text-4xl font-bold mb-4">Chat Request!</h2>
        <p className="text-lg text-center max-w-md">
          Cadastre-se para acessar nosso serviço de gerenciamento e consulta de requerimentos.
        </p>
        <img src="/images/aligator_200.png" alt="logo" className="w-40 h-40 mt-8" />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4"
          >
            <h2 className="text-2xl font-semibold text-emerald-700 text-center">Criar Conta</h2>
            <p className="text-center text-sm text-gray-600 ">Para acessar nosso serviço de forma rápida e segura.</p>

            <TextField
              label="Nome Completo"
              type="text"
              placeholder="Digite seu nome completo"
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
              required
              error={errors.nome_completo}
            />
            <TextField
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              required
              error={errors.email}
            />
             <TextField
              label="CPF"
              type="text"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(value) => setForm({ ...form, cpf: value })}
              required
              maskType="cpf" // Adicionado
              error={errors.cpf}
            />
             <TextField
              label="Telefone"
              type="tel" // Alterado para 'tel' para semântica
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
              maskType="phone" // Adicionado
              error={errors.telefone}
            />
            <TextField
              label="Nº Identidade (RG)"
              type="text"
              placeholder="Digite o número da sua identidade"
              value={form.identidade}
              onChange={(value) => setForm({ ...form, identidade: value })}
              required
              error={errors.identidade}
            />
            <TextField
              label="Órgão Expedidor"
              type="text"
              placeholder="Ex: SDS/PE"
              value={form.orgao_expedidor}
              onChange={(value) => setForm({ ...form, orgao_expedidor: value })}
              required
              error={errors.orgao_expedidor}
            />
            <TextField
              label="Senha"
              type="password"
              placeholder="Crie uma senha (mín. 8 caracteres)"
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              required
              error={errors.password}
            />
            <TextField
              label="Confirme a senha"
              type="password"
              placeholder="Confirme a senha"
              value={form.password_confirmation}
              onChange={(value) => setForm({ ...form, password_confirmation: value })}
              required
              error={errors.password_confirmation}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#002415] hover:bg-emerald-900 transition-all text-white font-semibold py-2 rounded-md disabled:bg-gray-400"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>

            {mensagem && (
              <p className={`text-center text-sm ${errors && Object.keys(errors).length > 0 ? 'text-red-600' : 'text-emerald-600'} mt-2`}>
                {mensagem}
              </p>
            )}
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Já tem uma conta?
            <Link href="/signin" className="text-emerald-600 font-medium hover:underline ml-1">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
