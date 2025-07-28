import { FaPaperPlane } from "react-icons/fa";

export function InputMain(props: { placeholder: string;}) {
  return (
    <div className="flex border-1 border-[#0F553A] rounded-lg items-center w-full mb-20">
      <input
        type="text"
        placeholder={props.placeholder || "Insira uma mensagem..."}
        className="w-full p-3 text-sm border-none outline-none bg-transparent"
      />
      <button className="bg-[#0F553A] p-4 rounded-md cursor-pointer text-white hover:bg-[#0F553A]/80 transition-colors">
        <FaPaperPlane />
      </button>
    </div>
  );
}
