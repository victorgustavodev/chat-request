"use client";
import { CardMain } from "@/components/cards/cardMain";
import { CardOption } from "@/components/cards/cardOption";
import Image from "next/image";
import { FaPaperPlane } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";

// import { ChatBot } from "@/components/ChatBot";

export default function Home() {
  return (
    <div className="h-screen overflow-clip">
      <div className="flex h-full">
        {/* Sidebar for larger screens */}
        <div className="flex flex-col justify-between items-center h-full">
          <div className="hidden sm:block">
            <nav className="flex flex-col h-full w-[330px] text-white">
              <div className="bg-[#207352] min-w-1/7 border-b-1 border-black flex justify-center items-center p-8">
                <h1 className="uppercase font-bold text-xl">
                  chat
                  <span className="font-light"> request</span>
                </h1>
              </div>
              <aside className="bg-[#207352] h-full min-w-1/7 p-4">
                <ul className="w-full flex flex-col gap-2 justify-center items-center">
                  <li>
                    <a href="#" className="text-[14px] w-full text-center">
                      Voltar para o menu principal
                    </a>
                  </li>
                </ul>
              </aside>
            </nav>
          </div>

          <main className="h-full flex-col bg-[#D9D9D9]">
            <div className="w-full">
              <div className="flex justify-between items-center p-8">
                <button className="cursor-pointer text-3xl">
                  <IoMenu />
                </button>
                <span>
                  <Image
                    src="/images/user-profile.png"
                    width={40}
                    height={40}
                    alt="Picture of the author"
                  />
                </span>
              </div>
            </div>

            <section className="w-full h-full p-6 lg:p-24 justify-center items-center flex flex-col gap-5">
              <CardMain />

              <div className="flex flex-col justify-center items-center w-full">
                <CardOption
                title="Solicitar Requerimento"
                />
                <CardOption
                title="Consultar Requerimentos"
                />
              </div>

              <div className="flex border-1 border-[#0F553A] rounded-lg items-center w-full mb-20">
                <input
                  type="text"
                  placeholder="Send a message..."
                  className="w-full p-3 text-sm border-none outline-none bg-transparent"
                />
                <button className="bg-[#0F553A] p-4 rounded-md cursor-pointer text-white hover:bg-[#0F553A]/80 transition-colors">
                  <FaPaperPlane />
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
