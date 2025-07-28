"use client";

import Link from "next/link";
import Button from "@/components/button/Button";
import Image from "next/image";
import Footer from './../components/layout/footer/Footer';

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col bg-white items-center justify-between w-full">
      <div className="text-center flex flex-col items-center justify-center flex-1 p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/ifpe-logo.png"
            alt="logo"
            width={200}
            height={200}
          />
        </div>

        {/* Mensagem de Erro Principal */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-[#002415] tracking-wider">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-black mt-2 mb-4">
          Página Não Encontrada
        </h2>
        
        <p className="text-md md:text-lg text-gray-500 mb-8">
          Oops! A página que você está procurando não existe ou foi movida.
        </p>

        {/* Botão de Ação */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <Link href="/">
              <Button className="w-full bg-[#002415] hover:scale-[1.01] text-white">
                Voltar para o Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}