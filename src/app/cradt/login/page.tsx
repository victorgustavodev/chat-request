'use client';

import { useState } from "react";
import Button from "@/components/button";
import TextField from "@/components/field/TextField";
import Link from "next/link";

export default function SigninCradt() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo */}
      <div className="hidden md:flex flex-col justify-center items-center bg-emerald-950 text-white w-full md:w-1/2 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Bem Vindo de Volta</h1>
          <h2 className="text-4xl font-bold mb-4">ao Chat Request, CRADT!</h2>
          <p className="text-lg max-w-md">
            Faça login para acessar as ferramentas de gerenciamento e consulta de requerimentos.
          </p>
        </div>
        <img src="/images/aligator_200.png" alt="logo" width={200} height={200} />
      </div>

      {/* Lado direito */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="w-full max-w-md">
          <form className="flex flex-col gap-4 bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-emerald-700 text-center">Entrar na Conta</h2>
            <p className="text-center text-sm text-gray-600">Para acessar os requerimentos.</p>

            <TextField
              label="CPF"
              type="cpf"
              MaxLength={14}
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(val) => setCpf(val)}
              iconRight={<img src="/images/cpf.svg" alt="CPF" className="w-4 h-4" />}
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

            <div className="flex justify-end">
              <Link href="/recuperar-senha">
                <span className="text-sm text-emerald-600 hover:underline">
                  Esqueceu a senha?
                </span>
              </Link>
            </div>

            <Button className="bg-[#002415] hover:bg-emerald-900 text-white font-semibold py-[10px] rounded-md">
              Acessar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
