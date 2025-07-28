"use client";
import { useRef, useEffect, useState } from 'react';
import { CardMain } from "@/components/chat-bot/cards/cardMain";
import { CardOption } from "@/components/chat-bot/cards/cardOption";
import { Navbar } from "@/components/chat-bot/nav/Navbar";
import { InputMain } from "@/components/chat-bot/input/InputMain";
import { MenuNav } from './../../components/chat-bot/nav/MenuNav';

export default function Home() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuVisible(false);
      }
    }
    if (isMenuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuVisible]);

  return (
    <div className="h-screen">
      <div className="flex h-full w-full">
        {/* Sidebar for larger screens */}
        <div className="flex flex-col h-full w-full">
          <main className="h-full flex-col bg-[#D9D9D9]">
            <Navbar function={toggleMenu}/>
            {/* Adicione a ref no wrapper do MenuNav */}
            <div ref={menuRef}>
              <MenuNav isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
            </div>
            <section className="w-full h-full p-6 lg:p-24 justify-evenly items-center flex flex-col gap-5">
              <div className="flex flex-col w-full gap-5 items-center">
                <div className="flex w-full lg:w-1/2 justify-center items-center">
                  <CardMain />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 justify-items-center gap-1 lg:gap-4 w-full lg:w-1/2 justify-center items-center">
                  <CardOption title="Solicitar Requerimento" />
                  <CardOption title="Consultar Requerimentos" />
                </div>
              </div>
              <div className="w-full">
                <InputMain placeholder="" />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
