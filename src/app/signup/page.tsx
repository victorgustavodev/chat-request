/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import TextField from "@/components/field/TextField";
import Link from "next/link";
import { useState } from "react";
import { cadastrarUsuario } from "@/services/userService";

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem("");
    try {
      const response = await cadastrarUsuario(form);
      console.log(response);
      setMensagem("Usuário cadastrado com sucesso!");
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
    } catch (error: any) {
      setMensagem("Erro: " + (error.message || "Não foi possível cadastrar."));
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo visual */}
      <div className="hidden md:flex flex-col justify-center items-center bg-emerald-600 text-white w-full md:w-1/2 p-8">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo!</h1>
        <p className="text-lg text-center max-w-md">
          Cadastre-se para acessar sua conta personalizada de forma rápida e segura.
        </p>
      </div>

      {/* Lado direito - formulário */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4"
          >
            <h2 className="text-2xl font-semibold text-emerald-700 mb-2">Criar conta</h2>

            <TextField
              label="Nome"
              type="text"
              placeholder="Digite seu nome completo"
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
              required
            />
            <TextField
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              required
            />
            <TextField
              label="CPF"
              MaxLength={11}
              type="text"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(value) => setForm({ ...form, cpf: value })}
              required
            />
            <TextField
              label="Telefone"
              type="text"
              MaxLength={11}
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
              required
            />
            <TextField
              label="Data de nascimento"
              type="date"
              value={form.birthday}
              onChange={(value) => setForm({ ...form, birthday: value })}
              required
            />
            <TextField
              label="Senha"
              type="password"
              placeholder="Crie uma senha"
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              required
            />
            <TextField
              label="Confirme a senha"
              type="password"
              placeholder="Confirme a senha"
              value={form.password_confirmation}
              onChange={(value) => setForm({ ...form, password_confirmation: value })}
              required
            />

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 transition-all text-white font-semibold py-2 rounded"
            >
              Cadastrar
            </button>

            {mensagem && (
              <p className="text-sm text-center text-emerald-700 font-medium mt-2">
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
