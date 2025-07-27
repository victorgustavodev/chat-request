"use client";

import Link from "next/link";
import Button from "@/components/Button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="bg-white min-w-full min-h-full rounded-lg flex flex-col justify-evenly items-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-3">
            <Image
              src="/images/aligator_200.png"
              alt="logo"
              width={200}
              height={200}
            />
          </div>

          <h1 className="text-black text-4xl font-bold mb-2 text-center">
            CHAT REQUEST
          </h1>

          <p className="text-center text-gray-400">
            REALIZE E GERENCIE SEUS REQUERIMENTOS
          </p>
        </div>

        <div className="flex flex-col gap-4 w-4/5 md:w-4/6 lg:w-2/6">

          <Link href="/signin">
            <Button className="w-full bg-[#002415] hover:scale-[1.01] text-white">
              Acessar sua conta
            </Button>
          </Link>

          <Link href="/signup">
            <Button className="w-full bg-[#64B393] text-white border-2">
              Cadastre-se
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
