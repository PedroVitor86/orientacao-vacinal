import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-[#05040B] text-[#AAB0C6] border-t border-[#2B1C58]/60 py-8 sm:py-12 px-4 print:hidden">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 text-xs">
        {/* ASSINATURA DA MARCA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-[#2B1C58]/40 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#130E2A] p-1 border border-[#2B1C58] shrink-0">
              <Image
                src="/trivax-symbol-v3.png"
                alt="TRIVAX"
                width={36}
                height={36}
                className="w-full h-full object-contain rounded-full"
                unoptimized
              />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-base sm:text-lg text-white tracking-wide block leading-none">
                TRIVAX
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#B387F7] font-semibold block mt-1">
                TRÊS ESCOLHAS. UMA PROTEÇÃO.
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="font-bold text-white text-[11px] sm:text-xs tracking-wider uppercase">
              Informação que conecta. Escolhas que protegem.
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#AAB0C6]">
              Três caminhos podem levar à proteção. A decisão é sua. O cuidado, nosso.
            </p>
          </div>
        </div>

        {/* DISCLAIMER CLÍNICO E ÉTICO */}
        <div className="flex items-start gap-3 bg-[#120E24]/80 border border-[#2B1C58] rounded-2xl p-4 sm:p-5 text-[#AAB0C6] shadow-sm">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B387F7] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white text-[11px] sm:text-xs uppercase tracking-wider">Aviso Ético e Legal:</p>
            <p className="leading-relaxed text-[10px] sm:text-[11px]">
              Esta plataforma digital tem finalidade puramente educativa e de apoio à decisão em saúde para o público adulto. As orientações fornecidas baseiam-se em critérios clínicos e epidemiológicos seguindo recomendações de sociedades científicas (Programa Nacional de Imunizações - PNI e Sociedade Brasileira de Imunizações - SBIm). <strong className="text-white">Não substitui a consulta médica nem constitui prescrição ou diagnóstico.</strong> Consulte sempre um profissional de saúde ou dirija-se a um centro de imunização com sua caderneta de vacinação em mãos.
            </p>
          </div>
        </div>

        {/* COPYRIGHT E ADMIN */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2.5 pt-1 text-[10px] sm:text-[11px] text-[#AAB0C6]/80 text-center sm:text-left">
          <p>© {new Date().getFullYear()} TRIVAX • Todos os direitos reservados.</p>
          <div className="flex items-center gap-3">
            <span>Diretrizes de sociedade científica</span>
            <span>•</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[#B387F7] hover:text-white font-semibold transition"
            >
              <Lock className="w-3 h-3" />
              <span>Painel Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
