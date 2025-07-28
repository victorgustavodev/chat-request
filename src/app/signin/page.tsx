"use client";

import Button from "@/components/button/Button";
import TextField from "@/components/field/TextField";
import Link from "next/link";
import { IoDocumentText } from "react-icons/io5";

export default function Signin() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo - visual */}
      <div className="hidden md:flex flex-col justify-center items-center bg-emerald-600 text-white w-full md:w-1/2 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo de volta!</h1>
          <p className="text-lg max-w-md">
            Entre para acessar seus requerimentos de forma prática e segura.
          </p>
        </div>
      </div>

      {/* Lado direito - formulário */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-6">Entrar na conta</h2>

          <form className="flex flex-col gap-4 bg-white rounded-lg p-6 shadow-md">
            <TextField
              label="CPF"
              type="text"
              placeholder="000.000.000-00"
              iconRight={<IoDocumentText />}
              required
            />

            <TextField
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              required
            />

            <div className="flex justify-end">
              <Link href="/recuperar-senha">
                <span className="text-sm text-emerald-600 hover:underline">
                  Esqueceu a senha?
                </span>
              </Link>
            </div>

            <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded">
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
