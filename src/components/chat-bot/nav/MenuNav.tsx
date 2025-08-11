import { IoClose } from "react-icons/io5";
import { useRouter } from 'next/navigation';

type MenuNavProps = {
    isVisible: boolean;
    onClose: () => void;
};

export function MenuNav({ isVisible, onClose }: MenuNavProps) {
    const router = useRouter();
    function handleLogout() {
        localStorage.removeItem('token');
        router.push('/signin');
    }
    return (
        <div
            className={`fixed z-10 top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform transform ${
                isVisible ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <nav className="p-4">
                <ul className="space-y-2 flex flex-col justify-between">
                    <li>
                        <button
                            onClick={onClose}
                            className="cursor-pointer w-full flex justify-end text-gray-700 hover:text-gray-900"
                        >
                            <IoClose />
                        </button>
                    </li>
                    <li className="mt-10 sm:mt-0">
                        <a href="/home" className="text-gray-700 hover:text-gray-900">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/minhas-matriculas" className="text-gray-700 hover:text-gray-900">
                            Minhas Matrículas
                        </a>
                    </li>
                    <li>
                        <button onClick={handleLogout} className=" cursor-pointer text-red-700 hover:text-red-900 w-full text-left">
                            Realizar Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}