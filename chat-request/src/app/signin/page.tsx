"use client";

import TextField from "@/components/Field/TextField";
import Button from "@/components/Button";
import Aside from "@/components/Aside";

export default function Signin() {
  return (
    <div className="min-h-screen bg-emerald-500 flex items-center justify-center">
        <Aside
            title="Bem-vindo de volta! Acesse o Chat Request"
            subtitle="ANÁLISE E SOLICITAÇÃO DE REQUERIMENTOS"
            footerText='"Ainda não tem uma conta?"'
            footerButtonText="Cadastra-se"
        />
      <div className="bg-white w-130 h-100 rounded-lg shadow-lg p-6 flex flex-col justify-center">
        <h1 className="text-black text-3xl font-bold mb-2 text-center">Bem Vindo de Volta!</h1>
        <p className="text-center text-gray-400">Entre para acessar nossos serviços.</p>
        <TextField
          label="CPF"
          type="cpf"
          placeholder="000.000.000-00"
          icon={<img src="/cpf.svg" alt="cpf" />}
        />
        <TextField
          label="Senha"
          type="password"
          placeholder="Crie sua senha"
        />  
      <Button className="w-full mt-4 cursor-pointer">Cadastrar</Button>
      </div>
    </div>
  );
}
