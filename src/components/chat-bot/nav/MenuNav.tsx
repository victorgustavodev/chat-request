import { IoClose } from "react-icons/io5";

type MenuNavProps = {
    isVisible: boolean;
    onClose: () => void;
};

export function MenuNav({ isVisible, onClose }: MenuNavProps) {
    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform transform ${
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
                    <li>
                        <a href="./" className="text-gray-700 hover:text-gray-900">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-gray-700 hover:text-gray-900">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-gray-700 hover:text-gray-900">
                            Logout
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}