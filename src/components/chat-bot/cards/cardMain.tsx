/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

export function CardMain(props: { bodyText?: string }) {
  return (
    <div className="
      w-full 
      max-w-2xl 
      bg-white 
      rounded-xl // Bordas mais suaves
      shadow-lg // Sombra um pouco mais pronunciada
      p-4 sm:p-6  // Padding responsivo e consistente
      flex 
      items-start // Alinha o ícone e o texto ao topo
      gap-4       // Espaçamento entre o ícone e o texto
      animate-fade-in-up
    ">
      
      {/* Container do Ícone */}
      <div className="flex-shrink-0">
        <img
          src="/images/Bot-icon.png"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-sm" // Ícone circular
        />
      </div>

      {/* Bloco de Texto */}
      <div>
        <h3 className="font-bold text-gray-800 text-base sm:text-lg">
          Assistente Virtual
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          {props.bodyText || "Olá! Sou seu assistente para requerimentos. Como posso te ajudar hoje?"}
        </p>
      </div>
      
    </div>
  );
}