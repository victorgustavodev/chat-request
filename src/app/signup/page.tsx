"use client";

import TextField from "@/components/Field/TextField";
import Button from "@/components/Button";
import Aside from "@/components/Aside";
import Image from "next/image";

export default function Signup() {
  return (
    <div className="min-h-screen bg-emerald-500 flex items-center justify-center">
        <Aside
        footerButtonText="Faça login"
        />
      <div className="bg-white w-130 h-130 rounded-lg shadow-lg p-6">
        <h1 className="text-black text-3xl font-bold mb-2 text-center">Bem Vindo!</h1>
        <p className="text-center text-gray-400">Cadastre-se para acessar o nosso serviço.</p>
        <TextField
          label="Nome"
          type="text"
          placeholder="Digite seu nome e sobrenome"
          icon={<Image src="/user.svg" alt="nome" width={24} height={24} />}
        />
        <TextField
          label="CPF"
          type="cpf"
          placeholder="000.000.000-00"
          icon={<Image src="/cpf.svg" alt="cpf" width={24} height={24} />}
        />
        <TextField
          label="Telefone"
          type="phone"
          placeholder="(00) 00000-0000"
          icon={<Image src="/phone.svg" alt="telefone" width={24} height={24} />}
        />
        <TextField
          label="Email"
          type="email"
          placeholder="exemplo@gmail.com"
          icon={<Image src="/email.svg" alt="email" width={24} height={24} />}
        />
        <TextField
          label="Senha"
          type="password"
          placeholder="Crie sua senha"
        />
        <TextField
          label="Confirma Senha"
          type="password"
          placeholder="Digite novamente sua senha"
          />
      <Button className="w-full mt-4 cursor-pointer">Cadastrar</Button>
      </div>
    </div>
  );
}
