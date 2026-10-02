'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  HeartHandshake,
  Check,
  RotateCcw
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AcompanhamentoPage() {
  const [participated, setParticipated] = useState<'SIM' | 'NAO' | null>(null);
  const [soughtCenter, setSoughtCenter] = useState<'SIM' | 'NAO' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Envia a resposta para o backend de forma assíncrona
  const sendResponse = async (part: 'SIM' | 'NAO', sought?: 'SIM' | 'NAO') => {
    setIsSaving(true);
    try {
      await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participated: part,
          sought_center: sought || undefined,
        }),
      });
      setHasSaved(true);
    } catch (err) {
      console.error('Erro ao registrar resposta de acompanhamento:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectParticipated = (val: 'SIM' | 'NAO') => {
    setParticipated(val);
    setSoughtCenter(null);
    setHasSaved(false);

    if (val === 'NAO') {
      sendResponse('NAO');
    }
  };

  const handleSelectSoughtCenter = (val: 'SIM' | 'NAO') => {
    setSoughtCenter(val);
    if (participated === 'SIM') {
      sendResponse('SIM', val);
      if (val === 'SIM') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleReset = () => {
    setParticipated(null);
    setSoughtCenter(null);
    setHasSaved(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080612] text-[#F2F3F7] relative overflow-x-hidden selection:bg-[#7B28E2] selection:text-white">
      {/* GLOW DE FUNDO */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[700px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-[#7B28E2]/20 to-[#2D67FF]/20 blur-[100px] sm:blur-[130px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-6 sm:space-y-8">
        {/* CABEÇALHO DA PÁGINA */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1336] border border-[#7B28E2]/40 text-[#B387F7] text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B387F7]" />
            <span>Pesquisa de Acompanhamento TRIVAX</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Acompanhamento de Imunização
          </h1>

          <p className="text-xs sm:text-sm text-[#AAB0C6] max-w-lg mx-auto leading-relaxed">
            Sua resposta é fundamental para entendermos o impacto da campanha e continuarmos promovendo a conscientização sobre a prevenção vacinal no ambiente corporativo.
          </p>
        </div>

        {/* CONTAINER PRINCIPAL */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-8 shadow-2xl space-y-6 sm:space-y-8 transition-all">
          
          {/* ======================================================== */}
          {/* PERGUNTA 1: Participou da pesquisa de elegibilidade? */}
          {/* ======================================================== */}
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#7B28E2] to-[#2D67FF] text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Você participou da pesquisa de elegibilidade - TRIVAX?</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => handleSelectParticipated('SIM')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl sm:rounded-2xl border text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  participated === 'SIM'
                    ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] border-transparent text-white shadow-lg shadow-[#7B28E2]/30 scale-[1.02]'
                    : 'bg-[#130E2A] border-[#2B1C58] text-[#F2F3F7] hover:border-[#7B28E2]/60 hover:bg-[#1A1336]'
                }`}
              >
                {participated === 'SIM' && <Check className="w-4 h-4 text-white" />}
                <span>Sim</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectParticipated('NAO')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl sm:rounded-2xl border text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  participated === 'NAO'
                    ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] border-transparent text-white shadow-lg shadow-[#7B28E2]/30 scale-[1.02]'
                    : 'bg-[#130E2A] border-[#2B1C58] text-[#F2F3F7] hover:border-[#7B28E2]/60 hover:bg-[#1A1336]'
                }`}
              >
                {participated === 'NAO' && <Check className="w-4 h-4 text-white" />}
                <span>Não</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RAMIFICAÇÃO A: SE RESPONDEU "NÃO" NA PRIMEIRA PERGUNTA */}
          {/* ======================================================== */}
          {participated === 'NAO' && (
            <div className="pt-4 border-t border-[#2B1C58]/60 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#1A1336]/90 border border-[#7B28E2]/50 text-left space-y-3 shadow-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#B387F7] shrink-0 mt-0.5" />
                  <div className="space-y-1.5 text-xs sm:text-sm text-[#E1D4F9] leading-relaxed">
                    <p className="font-bold text-white text-sm sm:text-base">
                      Você ainda pode participar!
                    </p>
                    <p>
                      Clique abaixo para responder à pesquisa de elegibilidade e descobrir para quais vacinas você possui indicação clínica prioritária.
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#AAB0C6] font-medium pt-1">
                      ⚠️ <strong>Por favor, role até o final da parte de orientação para responder as perguntas de conscientização.</strong>
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/questionario"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#7B28E2]/30 hover:opacity-95 transition"
                  >
                    <span>Clique aqui para responder a pesquisa de elegibilidade</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* RAMIFICAÇÃO B: SE RESPONDEU "SIM" NA PRIMEIRA PERGUNTA */}
          {/* Abre Pergunta 2: Buscou centro de imunização? */}
          {/* ======================================================== */}
          {participated === 'SIM' && (
            <div className="pt-4 border-t border-[#2B1C58]/60 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#7B28E2] to-[#2D67FF] text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Você buscou um centro de imunização para se vacinar após a pesquisa?</span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => handleSelectSoughtCenter('SIM')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl sm:rounded-2xl border text-sm sm:text-base font-bold transition-all cursor-pointer ${
                      soughtCenter === 'SIM'
                        ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] border-transparent text-white shadow-lg shadow-[#7B28E2]/30 scale-[1.02]'
                        : 'bg-[#130E2A] border-[#2B1C58] text-[#F2F3F7] hover:border-[#7B28E2]/60 hover:bg-[#1A1336]'
                    }`}
                  >
                    {soughtCenter === 'SIM' && <Check className="w-4 h-4 text-white" />}
                    <span>Sim</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSoughtCenter('NAO')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl sm:rounded-2xl border text-sm sm:text-base font-bold transition-all cursor-pointer ${
                      soughtCenter === 'NAO'
                        ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] border-transparent text-white shadow-lg shadow-[#7B28E2]/30 scale-[1.02]'
                        : 'bg-[#130E2A] border-[#2B1C58] text-[#F2F3F7] hover:border-[#7B28E2]/60 hover:bg-[#1A1336]'
                    }`}
                  >
                    {soughtCenter === 'NAO' && <Check className="w-4 h-4 text-white" />}
                    <span>Não</span>
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SUB-RESPOSTA SIM: AGRADECIMENTO & PARABÉNS */}
              {/* ---------------------------------------------------- */}
              {soughtCenter === 'SIM' && (
                <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1A1336] to-[#120E24] border border-[#7B28E2]/60 text-center space-y-3.5 shadow-xl animate-in zoom-in-95 duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7B28E2] to-[#2D67FF] text-white flex items-center justify-center mx-auto shadow-md shadow-[#7B28E2]/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Agradecemos sua participação e colaboração!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#AAB0C6] leading-relaxed max-w-md mx-auto">
                      Parabéns por cuidar da sua saúde e manter sua imunização atualizada. A vacinação protege você, sua família e toda a comunidade.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 text-xs text-[#B387F7] hover:text-white font-semibold transition"
                    >
                      <span>Voltar para a página inicial</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SUB-RESPOSTA NÃO: CAMPO DE CONSCIENTIZAÇÃO À VACINAÇÃO */}
              {/* ---------------------------------------------------- */}
              {soughtCenter === 'NAO' && (
                <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-[#1A1336]/90 border border-[#7B28E2]/40 space-y-4 shadow-xl text-left animate-in fade-in duration-300">
                  <div className="flex items-center gap-2.5 text-white font-bold text-sm sm:text-base border-b border-[#2B1C58]/60 pb-3">
                    <ShieldCheck className="w-5 h-5 text-[#B387F7] shrink-0" />
                    <span>Conscientização sobre a Imunização do Adulto</span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-[#E1D4F9] leading-relaxed">
                    <p>
                      Muitas doenças respiratórias graves em adultos são causadas pela bactéria do <strong>Pneumococo</strong>, o vírus da <strong>COVID-19</strong> e o <strong>Vírus Sincicial Respiratório (VSR)</strong>, elas podem ser prevenidas com esquemas vacinais atualizados.
                    </p>
                    <p>
                      Mesmo que você não tenha ido a um centro de Imunização, <strong>você ainda pode se proteger!</strong>
                    </p>

                    <div className="bg-[#120E24] p-3.5 sm:p-4 rounded-xl border border-[#2B1C58] space-y-2 text-xs">
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <HeartHandshake className="w-4 h-4 text-[#B387F7] shrink-0" />
                        <span>Facilidades de Acesso e Benefício Corporativo:</span>
                      </p>
                      <ul className="space-y-1.5 text-[#AAB0C6] list-disc list-inside">
                        <li>
                          <strong className="text-white">Rede Pública (SUS):</strong> As vacinas prioritárias estão disponíveis gratuitamente nas Unidades Básicas de Saúde (UBS).
                        </li>
                        <li>
                          <strong className="text-white">Rede Privada:</strong> Lembramos que a vacina contra o VSR e a vacina contra o Pneumococo podem ser acessadas na rede privada mediante avaliação médica, com direito a reembolso para colegas Pfizer e dependentes.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* CHAMADA DE AÇÃO: LOCALIZAR UBS */}
                  <div className="pt-2 border-t border-[#2B1C58]/60 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-white font-bold text-sm sm:text-base">
                      <MapPin className="w-5 h-5 text-[#2D67FF] shrink-0" />
                      <span>Localize a UBS mais próxima de você:</span>
                    </div>
                    <p className="text-xs text-[#AAB0C6]">
                      Acesse o localizador oficial para encontrar a unidade básica de saúde mais perto de casa ou do trabalho e se vacinar:
                    </p>

                    {/* BOTÕES DE DIRECIONAMENTO */}
                    <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
                      <a
                        href="https://deolhonafila.prefeitura.sp.gov.br/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#2D67FF] to-[#7B28E2] text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-[#2D67FF]/25 hover:opacity-95"
                      >
                        <MapPin className="w-4 h-4 text-white" />
                        <span>Localizar UBS mais próxima</span>
                        <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                      </a>

                      <a
                        href="https://www.cuidamosjuntos.com.br/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#120E24] hover:bg-[#251A4F] border border-[#7B28E2]/50 text-white text-xs font-bold transition shadow-md self-center sm:self-auto"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#B387F7]" />
                        <span>Portal Cuidamos Juntos</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INDICADOR DE RESPOSTA GRAVADA COM SUCESSO */}
          {hasSaved && (
            <div className="pt-2 text-center text-xs text-[#B387F7] flex items-center justify-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-[#2D67FF]" />
              <span>Sua resposta foi registrada com sucesso no sistema.</span>
            </div>
          )}

          {/* BOTÃO PARA RECOMEÇAR A RESPOSTA NESTA TELA */}
          {(participated !== null || soughtCenter !== null) && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-[11px] text-[#AAB0C6] hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Alterar minha resposta</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
