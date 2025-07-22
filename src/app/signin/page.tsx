"use client";

import TextField from "@/components/Field/TextField";
import Button from "@/components/Button";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import Aside from "@/components/Aside";

export default function Signin() {
  return (
    <>
    <div className="hidden lg:block ">

      <div className="min-h-screen bg-emerald-500 flex items-center justify-center">
        <Aside
          title="Bem-vindo de volta! Acesse o Chat Request"
          subtitle="ANÁLISE E SOLICITAÇÃO DE REQUERIMENTOS"
          footerText='"Ainda não tem uma conta?"'
          footerButtonText="Cadastra-se" />
        <div className="bg-white w-130 h-100 rounded-lg shadow-lg p-6 flex flex-col justify-center">
          <h1 className="text-black text-3xl font-bold mb-2 text-center">Bem Vindo de Volta!</h1>
          <p className="text-center text-gray-400">Entre para acessar nossos serviços.</p>
          <TextField
            label="CPF"
            type="cpf"
            placeholder="000.000.000-00"
            icon={<IoDocumentText />} />
          <TextField
            label="Senha"
            type="password"
            placeholder="Crie sua senha" />
          <Button className="w-full mt-4 cursor-pointer bg-teste">Cadastrar</Button>
        </div>
      </div>
    
    </div>
    
    <div className="lg:hidden">
        <div className="h-screen bg-white flex flex-col items-center">
          <div className="w-full h-auto flex flex-col justify-center items-center p-6 bg-emerald-500">
            <div className="w-4/5">
              <div className="w-full flex justify-end">
                <Link href="/" className="p-2">
                  <FaArrowLeft />
                </Link>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <h1 className="text-xl sm:text-3xl font-bold">Bem-vindo de volta!</h1>
                <p className="text-xs sm:text-2xl font-light pb-5 sm:pb-20">
                  Entre para realizar seus requerimentos.
                </p>
                <br />
                <br />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col h-auto justify-center bg-white">


          <div className="w-full flex justify-end relative bottom-[20%] sm:bottom-[25%] left-0">
              <img src="/images/aligator_200.png" alt="" className="w-[120px] sm:w-[200px] scale-x-[-1]" />
                </div>

            <div className="bg-white rounded-lg flex flex-col sm:gap-3 justify-center items-center">
              <TextField

                label="CPF"
                type="cpf"
                placeholder="000.000.000-00"
                icon={<IoDocumentText />} />

              <TextField
                label="Senha"
                type="password"
                placeholder="Crie sua senha" />

              <div className="w-2/3 flex justify-end mt-2">
                <span className="text-sm text-emerald-500">Esqueceu a senha?</span>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-3 sm:gap-5">
              <Button className="mt-4 w-2/3 cursor-pointer bg-[#002415]">
                Acessar
              </Button>
              <p className="text-[#656262] font-semibold text-xs text-center sm:text-sm w-2/3">
                Ainda não tem uma conta?
                <Link href="/signup">
                  <span className="text-emerald-500"> Cadastre-se</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div></>
  );
}
