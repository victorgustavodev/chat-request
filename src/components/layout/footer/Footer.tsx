// src/components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#002415] text-white w-full">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Seção Superior: Logo e Navegação */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/aligator_200.png"
              alt="Chat Request Logo"
              width={60}
              height={60}
              className="h-auto"
            />
            <span className="text-2xl font-bold">CHAT REQUEST</span>
          </Link>
          
          <nav>
            <ul className="flex flex-wrap justify-center gap-6 md:gap-8">
              <li>
                <Link href="/signin" className="hover:text-[#64B393] transition-colors duration-300">
                  Acessar
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#64B393] transition-colors duration-300">
                  Cadastrar
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#64B393] transition-colors duration-300">
                  Termos
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Divisor */}
        <hr className="my-8 border-gray-700" />

        {/* Seção Inferior: Copyright e Redes Sociais */}
        <div className="flex flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-400">
            © {currentYear} CHAT REQUEST. Todos os direitos reservados.
          </p>

          <div className="flex justify-center gap-6">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaTwitter size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaGithub size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;