'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RotateCcw, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onReset?: () => void;
  showReset?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, showReset = false }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#080612]/95 backdrop-blur-xl border-b border-[#2B1C58]/60 shadow-xl">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* LOGO TRIVAX COM ÍCONE TRANSPARENTE */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#3D1E78] to-[#7B28E2] p-0.5 shadow-md shadow-[#7B28E2]/40 group-hover:scale-105 transition duration-300">
            <div className="w-full h-full rounded-full bg-[#080612] flex items-center justify-center p-1">
              <Image
                src="/trivax-symbol-v3.png"
                alt="TRIVAX Ícone"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-2xl tracking-wider text-white leading-none">
              TRIVA<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B387F7] to-[#2D67FF]">X</span>
            </span>
            <span className="text-[8px] sm:text-[9.5px] tracking-[0.18em] uppercase font-bold text-[#AAB0C6] mt-0.5 leading-none">
              TRÊS ESCOLHAS. UMA PROTEÇÃO.
            </span>
          </div>
        </Link>

        {/* MENU DE NAVEGAÇÃO DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#AAB0C6]">
          <Link href="/#como-funciona" className="hover:text-[#F2F3F7] transition">
            Como funciona
          </Link>
          <Link href="/#sobre" className="hover:text-[#F2F3F7] transition">
            Sobre
          </Link>
          <Link href="/#duvidas" className="hover:text-[#F2F3F7] transition">
            Dúvidas
          </Link>
        </nav>

        {/* AÇÕES (RECOMEÇAR OU COMEÇAR) */}
        <div className="flex items-center gap-2 shrink-0">
          {showReset && onReset ? (
            <button
              onClick={onReset}
              className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-[#AAB0C6] hover:text-white bg-[#130E2A] hover:bg-[#2B1C58] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#2B1C58] transition"
              title="Reiniciar Questionário"
            >
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B387F7]" />
              <span className="hidden xs:inline">Recomeçar</span>
            </button>
          ) : (
            <Link
              href="/questionario"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white text-xs font-bold hover:opacity-90 transition shadow-md shadow-[#7B28E2]/30"
            >
              <span>Começar</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
