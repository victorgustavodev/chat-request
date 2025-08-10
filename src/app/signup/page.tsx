/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import TextField from "@/components/field/TextField";
import Link from "next/link";
import { useState } from "react";
import { cadastrarUsuario } from "@/services/userService";
import React from "react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    cpf: "",
    birthday: "",
    phone: "",
    user_type: "student",
  });

  const [mensagem, setMensagem] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function validarCampos() {
    const newErrors: { [key: string]: string } = {};

    // Nome
    if (!form.name.trim()) newErrors.name = "Nome é obrigatório.";

    // Email
    if (!form.email.trim()) {
      newErrors.email = "E-mail é obrigatório.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "E-mail inválido.";
    }

    // CPF
    if (!form.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório.";
    } else if (!/^\d{11}$/.test(form.cpf.replace(/\D/g, ""))) {
      newErrors.cpf = "CPF deve conter 11 dígitos numéricos.";
    }

    // Telefone
    if (!form.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório.";
    } else if (!/^\d{10,11}$/.test(form.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Telefone deve conter 10 ou 11 dígitos numéricos.";
    }

    // Data de nascimento
    if (!form.birthday.trim()) {
      newErrors.birthday = "Data de nascimento é obrigatória.";
    }

    // Senha
    if (!form.password) {
      newErrors.password = "Senha é obrigatória.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}/.test(form.password)
    ) {
      newErrors.password =
        "Senha deve ter ao menos 8 caracteres, incluindo maiúsculas, minúsculas, número e caractere especial.";
    }

    // Confirmação de senha
    if (form.password_confirmation !== form.password) {
      newErrors.password_confirmation = "As senhas não coincidem.";
    }

    return newErrors;
  }


 // Coloque esta função auxiliar fora do seu componente
function formatarDataParaAPI(data: string): string {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return data; // Retorna original se não estiver no formato esperado
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}`;
}

// Dentro do seu componente Signup
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setMensagem("");
  const validationErrors = validarCampos();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    setMensagem("Por favor, corrija os erros antes de continuar.");
    return;
  }

  // Crie um payload com os dados formatados corretamente
  const payload = {
    ...form,
    cpf: form.cpf.replace(/\D/g, ""), // Remove a máscara do CPF
    phone: form.phone.replace(/\D/g, ""), // Remove a máscara do telefone
    birthday: formatarDataParaAPI(form.birthday), // Converte a data
  };

  try {
    const response = await cadastrarUsuario(payload); // Envia o payload formatado
    console.log(response);
    setMensagem("Usuário cadastrado com sucesso!");
    // Limpa o formulário após o sucesso
    setForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      cpf: "",
      birthday: "",
      phone: "",
      user_type: "student",
    });
    setErrors({});
  } catch (error: any) {
    // Agora o catch receberá os erros da API
    setMensagem("Erro: " + (error.message || "Não foi possível cadastrar."));
  }
}

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo visual */}
      <div className="hidden md:flex flex-col justify-center items-center bg-[#002415] text-white w-full md:w-1/2 p-8">
        <h1 className="text-4xl font-bold mb-4">Bem Vindo ao</h1>
        <h2 className="text-4xl font-bold mb-4">Chat Request!</h2>
        <p className="text-lg text-center max-w-md">
          Cadastre-se para acessar nosso serviço de gerenciamento e consulta de requerimentos.
        </p>
        <img src="/images/aligator_200.png" alt="logo" className="w-40 h-40 mt-8" />
      </div>

      {/* Lado direito - formulário */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4"
          >
            <h2 className="text-2xl font-semibold text-emerald-700 text-center">Criar Conta</h2>
            <p className="text-center text-sm text-gray-600 ">Para acessar nosso serviço de forma rápida e segura.</p>

            <TextField
              label="Nome"
              type="text"
              placeholder="Digite seu nome completo"
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
              required
              iconRight={<img src="/images/user.svg" alt="Nome" className="w-4 h-4" />}
              error={errors.name}
            />
            <TextField
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              required
              iconRight={<img src="/images/email.svg" alt="E-mail" className="w-4 h-4" />}
              error={errors.email}
            />
            <TextField
              label="CPF"
              MaxLength={14}
              type="cpf"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(value) => setForm({ ...form, cpf: value })}
              required
              iconRight={<img src="/images/cpf.svg" alt="CPF" className="w-4 h-4" />}
              error={errors.cpf}
            />
            <TextField
              label="Telefone"
              type="phone"
              MaxLength={15}
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
              required
              iconRight={<img src="/images/phone.svg" alt="Telefone" className="w-4 h-4" />}
              error={errors.phone}
            />
            <TextField
              label="Data de nascimento"
              type="birthdate"
              placeholder="dd/mm/aaaa"
              value={form.birthday}
              onChange={(value) => setForm({ ...form, birthday: value })}
              required
              iconRight={<img src="/images/date.svg" alt="Data" className="w-5 h-5" />}
              error={errors.birthday}
            />
            <TextField
              label="Senha"
              type="password"
              placeholder="Crie uma senha"
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
              className="bg-[#002415] hover:bg-emerald-900 transition-all text-white font-semibold py-2 rounded-md"
            >
              Cadastrar
            </button>

            {mensagem && (
              <p className={`text-center text-sm ${mensagem.startsWith('Erro') ? 'text-red-600' : 'text-emerald-600'} mt-2`}>
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
