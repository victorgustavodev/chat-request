import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import { ReactNode } from "react";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Chatbot de Requerimentos",
  description: "Sistema de solicitação e consulta de requerimentos acadêmicos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" className={poppins.className}>
      <body>{children}</body>
    </html>
  );
}
