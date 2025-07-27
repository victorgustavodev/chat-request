"use client";
import { FaToggleOff } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";

// import { ChatBot } from "@/components/ChatBot";

export default function Home() {
  return (
    <div className="h-screen text-white overflow-clip">
      <div className="flex h-full">
        <nav className="flex flex-col h-full w-1/8">
          <div className="bg-[#207352] min-w-1/7 border-b-2 border-black flex justify-center items-center p-8">
            <h1 className="uppercase font-bold text-xl">
              chat
              <span className="font-light"> request</span>
            </h1>
          </div>
          <aside className="bg-[#207352] h-full min-w-1/7 p-4">
            <ul>
              <li>
                <a href="#" className="text-sm text-center">
                  Voltar para o menu principal
                </a>
              </li>
            </ul>
          </aside>
        </nav>

        <main className="h-full flex-col">

          <div className="w-full">
            <div className="flex gap-2 bg-amber-950 text-3xl justify-end items-center p-8">
              <button className="cursor-pointer">
                <FaToggleOff />
              </button>
              <span>
                <IoPersonCircleOutline />
              </span>
            </div>
          </div>

          <section className="w-full h-full">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio,
              nihil at laudantium sequi expedita cupiditate deleniti porro ex
              doloremque labore earum quibusdam repudiandae vel distinctio
              animi. Architecto omnis at reprehenderit.
            </p>
          </section>
          
        </main>
      </div>
    </div>
  );
}
