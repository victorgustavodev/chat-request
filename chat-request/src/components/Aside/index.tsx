// components/Aside.tsx

"use client";

import React from "react";
import Image from "next/image";
import Button from "../Button";
import { useRouter } from "next/navigation";

interface AsideProps {
  title?: string;
  subtitle?: string;
  footerText?: string;
  footerButtonText?: string;
}

export default function Aside({
  title = "Seja Bem-Vindo ao Chat Request!",
  subtitle = "ANÁLISE E SOLICITAÇÃO DE REQUERIMENTOS",
  footerText = '"Já tem uma conta?"',
  footerButtonText = "Faça login",
}: AsideProps) {
  const router = useRouter();

  const handleClick = () => {
    if (footerButtonText.toLowerCase().includes("login")) {
      router.push("/signin");
    } else {
      router.push("/signup");
    }
  };

  return (
    <aside className="w-150 h-130 bg-dark-green text-white p-6 shadow-lg rounded-l-lg flex flex-col gap-4">
      <div className="w-full text-left mb-8">
        <h2 className="text-5xl font-semibold leading-tight whitespace-pre-line">
          {title}
        </h2>
        <p className="text-base mt-2 text-white/50">{subtitle}</p>
      </div>

      <div className="flex-1" />

      <div className="flex items-center justify-center w-full gap-6">
        <Image
          src="/aligator-70.svg"
          alt="Logo Chat Request"
          width={180}
          height={180}
        />
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-sm mb-2 font-bold text-white">{footerText}</p>
          <Button
            onClick={handleClick}
            className="w-fit min-w-[120px] text-sm px-4 py-2 bg-transparent border border-white text-white hover:bg-white hover:text-dark-green transition-colors duration-200 cursor-pointer"
          >
            {footerButtonText}
          </Button>
        </div>
      </div>
    </aside>
  );
}
