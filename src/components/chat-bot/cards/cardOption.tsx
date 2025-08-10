// src/components/chat-bot/cards/cardOption.tsx

"use client";

// Defina uma interface para as props do componente
interface CardOptionProps {
  title: string;
  onClick: () => void; // A prop onClick agora é uma função que não retorna nada
}

export const CardOption = ({ title, onClick }: CardOptionProps) => {
  return (
    <div
      onClick={onClick} // Aqui está a mágica! Executamos a função recebida no clique.
      className="
        w-full
        p-4
        bg-white
        rounded-lg
        shadow-md
        cursor-pointer
        text-center
        font-semibold
        text-gray-700
        transition-all
        duration-200
        ease-in-out
        hover:bg-green-100
        hover:shadow-lg
        hover:scale-105
        active:scale-100
      "
    >
      {title}
    </div>
  );
};