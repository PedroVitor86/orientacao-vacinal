import React from 'react';
import Link from 'next/link';
import { AlertCircle, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-400 border-t border-slate-800 py-8 px-4 print:hidden">
      <div className="max-w-4xl mx-auto space-y-5 text-xs">
        <div className="flex items-start gap-3.5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-slate-300 shadow-xs">
          <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Aviso Ético e Legal:</p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Esta plataforma digital tem finalidade puramente educativa e de apoio à decisão em saúde para o público adulto. As orientações fornecidas baseiam-se em critérios clínicos e epidemiológicos de fontes públicas oficiais (Programa Nacional de Imunizações - PNI e Sociedade Brasileira de Imunizações - SBIm). <strong className="text-slate-200">Não substitui a consulta médica nem constitui prescrição ou diagnóstico.</strong> Consulte sempre um profissional de saúde ou dirija-se à Unidade Básica de Saúde com sua caderneta de vacinação em mãos.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} GuiaVacinas Adulto • Proteção e Saúde Pública.</p>
          <div className="flex items-center gap-3">
            <p>Conforme diretrizes vigentes do PNI e SBIm.</p>
            <span className="text-slate-700">•</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-purple-400 font-semibold transition"
            >
              <Lock className="w-3 h-3 text-purple-400" />
              <span>Painel Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
