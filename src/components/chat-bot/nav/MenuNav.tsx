import { IoClose } from "react-icons/io5";
import { FiHome, FiFileText, FiLogOut } from "react-icons/fi"; // Ícones adicionados
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Use o Link do Next.js para navegação
import Image from "next/image";

type MenuNavProps = {
    isVisible: boolean;
    onClose: () => void;
};

export function MenuNav({ isVisible, onClose }: MenuNavProps) {
    const router = useRouter();

    function handleLogout() {
        // Adicione aqui a lógica de confirmação se desejar
        localStorage.removeItem('token');
        router.push('/signin');
    }

    return (
        <div
            className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-xl transition-transform transform ${
                isVisible ? "translate-x-0" : "-translate-x-full"
            } flex flex-col`}
        >
            {/* Cabeçalho do Menu */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/aligator_200.png"
                        alt="logo"
                        width={32}
                        height={32}
                    />
                    <span className="font-bold text-lg text-gray-800">Chat Request</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    aria-label="Fechar menu"
                >
                    <IoClose size={24} />
                </button>
            </div>

            {/* Links de Navegação */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    <li>
                        <Link href="/home" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                            <FiHome size={20} />
                            <span className="font-medium">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/minhas-matriculas" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                            <FiFileText size={20} />
                            <span className="font-medium">Minhas Matrículas</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Rodapé do Menu (Logout) */}
            <div className="p-4 border-t border-gray-200">
                <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 p-3  cursor-pointer rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                    <FiLogOut size={20} />
                    <span className="font-medium">Realizar Logout</span>
                </button>
            </div>
        </div>
    );
}