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

        {/* REFERÊNCIAS CIENTÍFICAS E DIRETRIZES (COMPACTO E EXPANSÍVEL) */}
        <details className="group bg-[#0c091a]/90 border border-[#2B1C58]/80 rounded-2xl text-[#8F96B2] overflow-hidden transition-all duration-300">
          <summary className="flex items-center justify-between p-3 sm:p-3.5 cursor-pointer hover:bg-[#150f2e] transition text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider select-none list-none">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B387F7]" />
              <span>Referências</span>
            </span>
            <span className="text-[10px] text-[#B387F7] font-semibold flex items-center gap-1 group-open:rotate-180 transition-transform duration-200">
              ▼
            </span>
          </summary>

          <div className="p-3.5 pt-2 sm:p-4 sm:pt-2.5 border-t border-[#2B1C58]/50 grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] sm:text-[10.5px] leading-relaxed">
            {/* COVID-19 */}
            <div className="space-y-1.5 bg-[#120e24]/70 p-3 rounded-xl border border-[#2B1C58]/40">
              <span className="font-bold text-[#B387F7] block text-[11px]">COVID-19</span>
              <p>
                BRASIL. Ministério da Saúde. Instrução normativa do Calendário Nacional de Vacinação 2025. Brasília, DF: Ministério da Saúde, 2025.{' '}
                <a
                  href="https://www.gov.br/saude/pt-br/vacinacao/publicacoes/instrucao-normativa-que-instrui-o-calendario-nacional-de-vacinacao-2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B387F7] hover:underline font-semibold"
                >
                  [Acessar documento]
                </a>
              </p>
              <p>
                BRASIL. Ministério da Saúde. Vacinação. Brasília, DF: Ministério da Saúde, [s. d.].{' '}
                <a
                  href="https://www.gov.br/saude/pt-br/vacinacao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B387F7] hover:underline font-semibold"
                >
                  [Acessar portal]
                </a>
              </p>
            </div>

            {/* Doença pneumocócica */}
            <div className="space-y-1.5 bg-[#120e24]/70 p-3 rounded-xl border border-[#2B1C58]/40">
              <span className="font-bold text-[#B387F7] block text-[11px]">Doença pneumocócica</span>
              <p>
                SOCIEDADE BRASILEIRA DE IMUNIZAÇÕES. Doença pneumocócica (DP). Família SBIm, [s. d.].{' '}
                <a
                  href="https://familia.sbim.org.br/doencas/doenca-pneumococica-dp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B387F7] hover:underline font-semibold"
                >
                  [Acessar portal]
                </a>
              </p>
              <p>
                BRASIL. Ministério da Saúde. Guia técnico para introdução da vacina pneumocócica 20-valente conjugada no PNI. Brasília, DF: Ministério da Saúde, 2026.{' '}
                <a
                  href="https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/guias-e-manuais/2026/guia-tecnico-para-introducao-da-vacina-pneumococica-20-valente-conjugada-no-programa-nacional-de-imunizacoes.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B387F7] hover:underline font-semibold"
                >
                  [Acessar documento]
                </a>
              </p>
            </div>

            {/* VSR */}
            <div className="space-y-1.5 bg-[#120e24]/70 p-3 rounded-xl border border-[#2B1C58]/40">
              <span className="font-bold text-[#B387F7] block text-[11px]">VSR</span>
              <p>
                SOCIEDADE BRASILEIRA DE IMUNIZAÇÕES. Vírus sincicial respiratório (VSR). Família SBIm, [s. d.].{' '}
                <a
                  href="https://familia.sbim.org.br/doencas/virus-sincicial-respiratorio-vsr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B387F7] hover:underline font-semibold"
                >
                  [Acessar portal]
                </a>
              </p>
              <p>
                SBIm; SBP; FEBRASGO. Guia rápido: imunização contra o vírus sincicial respiratório (VSR). 2026.{' '}
                <a
                  href="https://sbim.org.br/images/nt-guiarapido-imunizacao-vsr-sbimsbpfebrasgo-260304.pdf_2026-03-04.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B387F7] hover:underline font-semibold"
                >
                  [Acessar documento]
                </a>
              </p>
            </div>
          </div>
        </details>

        {/* COPYRIGHT E ADMIN */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2.5 pt-1 text-[10px] sm:text-[11px] text-[#AAB0C6]/80 text-center sm:text-left">
          <p>© {new Date().getFullYear()} TRIVAX</p>
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
