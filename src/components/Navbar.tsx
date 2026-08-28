import React from 'react';
import Link from 'next/link';
import { ShieldCheck, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onReset?: () => void;
  showReset?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, showReset = false }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/30 group-hover:scale-105 transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-white text-lg leading-tight block tracking-tight">
              GuiaVacinas <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Adulto</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium block">
              Orientação Clínica de Imunização
            </span>
          </div>
        </Link>

        {showReset && onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-purple-950/60 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-purple-600 transition"
            title="Reiniciar Questionário"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span>Recomeçar</span>
          </button>
        )}
      </div>
    </header>
  );
};
