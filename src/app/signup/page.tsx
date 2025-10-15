/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextField from "@/components/field/TextField";
import Button from "@/components/button";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    cpf: "",
    phone: "",
    birthday: "",
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
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      cpf: form.cpf.replace(/\D/g, ""), // remove pontos e traços
      phone: form.phone.replace(/\D/g, ""), // remove parênteses e hífens
      birthday: form.birthday, // formato YYYY-MM-DD
    };

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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

      console.log("Token de acesso:", data.access_token);
      setMensagem("Usuário cadastrado com sucesso!");
      router.push("/signin");
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
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao</h1>
        <h2 className="text-4xl font-bold mb-4">Chat Request!</h2>
        <p className="text-lg text-center max-w-md">
          Cadastre-se para acessar nosso serviço de gerenciamento e consulta de
          requerimentos.
        </p>
        <img
          src="/images/aligator_200.png"
          alt="logo"
          className="w-40 h-40 mt-8"
        />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4"
          >
            <h2 className="text-2xl font-semibold text-emerald-700 text-center">
              Criar Conta
            </h2>
            <p className="text-center text-sm text-gray-600">
              Para acessar nosso serviço de forma rápida e segura.
            </p>

            <TextField
              label="Nome Completo"
              type="text"
              placeholder="Digite seu nome completo"
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
              required
              error={errors.name ? errors.name[0] : undefined}
              iconRight={
                <img src="/images/user.svg" alt="User" className="w-4 h-4" />
              }
            />

            <TextField
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              required
              error={errors.email ? errors.email[0] : undefined}
              iconRight={
                <img src="/images/email.svg" alt="Email" className="w-4 h-4" />
              }
            />

            <TextField
              label="CPF"
              type="text"
              MaxLength={14}
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(value) => setForm({ ...form, cpf: value })}
              required
              error={errors.cpf ? errors.cpf[0] : undefined}
              iconRight={
                <img src="/images/cpf.svg" alt="CPF" className="w-4 h-4" />
              }
            />

            <TextField
              label="Telefone"
              type="text"
              MaxLength={15}
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
              required
              error={errors.phone ? errors.phone[0] : undefined}
              iconRight={
                <img
                  src="/images/phone.svg"
                  alt="telefone"
                  className="w-4 h-4"
                />
              }
            />

            <TextField
              label="Data de Nascimento"
              type="date"
              placeholder="Selecione sua data de nascimento"
              value={form.birthday}
              onChange={(value) => setForm({ ...form, birthday: value })}
              required
              error={errors.birthday ? errors.birthday[0] : undefined}
            />

            <TextField
              label="Senha"
              type="password"
              placeholder="Crie uma senha (mín. 8 caracteres)"
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              required
              error={errors.password ? errors.password[0] : undefined}
            />

            <TextField
              label="Confirme a senha"
              type="password"
              placeholder="Confirme a senha"
              value={form.password_confirmation}
              onChange={(value) =>
                setForm({ ...form, password_confirmation: value })
              }
              required
              error={
                errors.password_confirmation
                  ? errors.password_confirmation[0]
                  : undefined
              }
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#002415] hover:bg-emerald-900 text-white font-semibold py-[10px] rounded-md disabled:bg-gray-400"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>

            {mensagem && (
              <p
                className={`text-center text-sm ${
                  errors && Object.keys(errors).length > 0
                    ? "text-red-600"
                    : "text-emerald-600"
                } mt-2`}
              >
                {mensagem}
              </p>
            )}
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Já tem uma conta?
            <Link
              href="/signin"
              className="text-emerald-600 font-medium hover:underline ml-1"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
