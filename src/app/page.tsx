'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Lock, 
  Activity, 
  HelpCircle, 
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useQuizStore } from '@/store/useQuizStore';

export default function HomePage() {
  const router = useRouter();
  const { resetQuiz } = useQuizStore();

  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

  const handleStart = () => {
    resetQuiz();
    router.push('/questionario');
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#080612] text-[#F2F3F7] relative overflow-x-hidden selection:bg-[#7B28E2] selection:text-white">
      {/* GLOWS DE FUNDO CONTIDOS */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[320px] sm:w-[700px] h-[300px] sm:h-[450px] bg-gradient-to-tr from-[#7B28E2]/25 via-[#2D67FF]/20 to-transparent blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#7B28E2]/15 blur-[90px] sm:blur-[120px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-16 sm:space-y-24">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* LADO ESQUERDO: TEXTO E CTA */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#1A1238] border border-[#7B28E2]/40 text-[#B387F7] text-[11px] sm:text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#B387F7] shrink-0" />
              <span>TRÊS ESCOLHAS. UMA PROTEÇÃO.</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              Informação que conecta.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#B387F7] via-[#7B28E2] to-[#2D67FF]">
                Escolhas que protegem.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#AAB0C6] leading-relaxed max-w-xl">
              Responda algumas perguntas sobre seu perfil e histórico de saúde para descobrir algumas vacinas do nosso portfólio que podem ser indicadas para você. Siga seu caminho com confiança.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-[#7B28E2] via-[#5F30EB] to-[#2D67FF] text-white font-bold text-sm sm:text-base hover:opacity-90 transition shadow-xl shadow-[#7B28E2]/30 group cursor-pointer text-center"
              >
                <span>Iniciar agora</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition duration-200" />
              </button>
              <Link
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:px-6 sm:py-4 rounded-full bg-[#130E2A] hover:bg-[#201742] text-[#F2F3F7] font-semibold text-xs sm:text-sm border border-[#2B1C58] transition text-center"
              >
                <span>Como funciona</span>
                <ChevronRight className="w-4 h-4 text-[#B387F7]" />
              </Link>
            </div>
          </div>

          {/* LADO DIREITO: LOGO TRIVAX COM ÍCONE TRANSPARENTE E EFEITO DE BRILHO */}
          <div className="lg:col-span-5 flex items-center justify-center relative pt-2 lg:pt-0">
            <div className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80">
              {/* Brilho pulsante por trás da logo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7B28E2] via-[#2D67FF] to-[#B387F7] blur-2xl sm:blur-3xl opacity-35 animate-pulse" />
              
              {/* Moldura de vidro */}
              <div className="relative w-full h-full rounded-3xl bg-[#110D24]/80 border border-[#2B1C58] p-6 sm:p-10 flex items-center justify-center shadow-2xl backdrop-blur-md">
                <Image
                  src="/trivax-symbol-v3.png"
                  alt="Símbolo TRIVAX 3 Anéis"
                  width={300}
                  height={300}
                  className="w-full h-full object-contain drop-shadow-[0_12px_28px_rgba(123,40,226,0.65)]"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAIXA DE BENEFÍCIOS (4 PILARES) */}
        <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#120E24]/80 border border-[#2B1C58] p-4 sm:p-5 rounded-2xl space-y-1.5 hover:border-[#7B28E2]/60 transition">
            <div className="w-8 h-8 rounded-xl bg-[#7B28E2]/20 text-[#B387F7] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Personalizado</h3>
            <p className="text-xs text-[#AAB0C6] leading-relaxed">
              Recomendações de acordo com o seu perfil.
            </p>
          </div>

          <div className="bg-[#120E24]/80 border border-[#2B1C58] p-4 sm:p-5 rounded-2xl space-y-1.5 hover:border-[#7B28E2]/60 transition">
            <div className="w-8 h-8 rounded-xl bg-[#2D67FF]/20 text-[#2D67FF] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Confiável</h3>
            <p className="text-xs text-[#AAB0C6] leading-relaxed">
              Conteúdo baseado em evidências clínicas.
            </p>
          </div>

          <div className="bg-[#120E24]/80 border border-[#2B1C58] p-4 sm:p-5 rounded-2xl space-y-1.5 hover:border-[#7B28E2]/60 transition">
            <div className="w-8 h-8 rounded-xl bg-[#7B28E2]/20 text-[#B387F7] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Simples</h3>
            <p className="text-xs text-[#AAB0C6] leading-relaxed">
              Jornada rápida, interativa e intuitiva.
            </p>
          </div>

          <div className="bg-[#120E24]/80 border border-[#2B1C58] p-4 sm:p-5 rounded-2xl space-y-1.5 hover:border-[#7B28E2]/60 transition">
            <div className="w-8 h-8 rounded-xl bg-[#2D67FF]/20 text-[#2D67FF] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Seguro</h3>
            <p className="text-xs text-[#AAB0C6] leading-relaxed">
              Seus dados protegidos com total privacidade.
            </p>
          </div>
        </section>

        {/* O SIGNIFICADO DA MARCA (TRI + VAX = TRIVAX) */}
        <section id="sobre" className="bg-[#120E24]/90 border border-[#2B1C58] rounded-3xl p-5 sm:p-10 space-y-6 sm:space-y-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#B387F7]">
              O Significado
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              TRI + VAX = <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B387F7] to-[#2D67FF]">TRIVAX</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AAB0C6] leading-relaxed">
              Três vacinas essenciais que se conectam para oferecer mais proteção em cada etapa da sua vida adulta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-1">
            {/* CONEXÃO */}
            <div className="bg-[#1A1336] p-5 sm:p-6 rounded-2xl border border-[#2B1C58] space-y-2.5 hover:border-[#7B28E2]/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#7B28E2]/20 border border-[#7B28E2]/40 flex items-center justify-center text-[#B387F7]">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">CONEXÃO</h3>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Três caminhos diferentes que se unem pelo mesmo objetivo: o seu bem-estar e longevidade.
              </p>
            </div>

            {/* INDIVIDUALIDADE */}
            <div className="bg-[#1A1336] p-5 sm:p-6 rounded-2xl border border-[#2B1C58] space-y-2.5 hover:border-[#7B28E2]/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#2D67FF]/20 border border-[#2D67FF]/40 flex items-center justify-center text-[#2D67FF]">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">INDIVIDUALIDADE</h3>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Cada pessoa é única e merece respostas personalizadas de acordo com seu histórico.
              </p>
            </div>

            {/* PROTEÇÃO */}
            <div className="bg-[#1A1336] p-5 sm:p-6 rounded-2xl border border-[#2B1C58] space-y-2.5 hover:border-[#7B28E2]/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#7B28E2]/20 border border-[#7B28E2]/40 flex items-center justify-center text-[#B387F7]">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">PROTEÇÃO</h3>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Informação confiável para decisões seguras hoje e sempre, com respaldo científico.
              </p>
            </div>
          </div>
        </section>

        {/* AS 3 VACINAS AVALIADAS */}
        <section className="space-y-6">
          <div className="text-left sm:text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#B387F7]">
              Cobertura do Motor Clínico
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              As Três Vacinas Integradas no TRIVAX
            </h2>
            <p className="text-xs sm:text-sm text-[#AAB0C6]">
              O algoritmo avalia simultaneamente os critérios técnicos para os seguintes imunizantes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
            {/* PNEUMOCOCO */}
            <div className="bg-[#120E24] border border-[#2B1C58] p-5 sm:p-6 rounded-3xl space-y-2.5 hover:border-[#B387F7] transition">
              <div className="w-8 h-8 rounded-xl bg-[#B387F7]/20 text-[#B387F7] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white">Vacina contra o Pneumococo</h3>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Indicação universal a partir de 50 anos ou a partir de 18 anos com doenças crônicas.
              </p>
            </div>

            {/* COVID-19 */}
            <div className="bg-[#120E24] border border-[#2B1C58] p-5 sm:p-6 rounded-3xl space-y-2.5 hover:border-[#2D67FF] transition">
              <div className="w-8 h-8 rounded-xl bg-[#2D67FF]/20 text-[#2D67FF] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white">Vacina contra COVID-19</h3>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Doses atualizadas direcionadas a grupos prioritários, gestantes, puérperas, imunossuprimidos e doentes crônicos.
              </p>
            </div>

            {/* VSR */}
            <div className="bg-[#120E24] border border-[#2B1C58] p-5 sm:p-6 rounded-3xl space-y-2.5 hover:border-[#7B28E2] transition">
              <div className="w-8 h-8 rounded-xl bg-[#7B28E2]/20 text-[#B387F7] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white">Vacina contra VSR</h3>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Proteção neonatal em gestantes (a partir de 24 semanas de gestação) e prevenção de quadros graves em idosos e adultos com doenças crônicas.
              </p>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA (A JORNADA DO USUÁRIO) */}
        <section id="como-funciona" className="bg-[#120E24]/70 border border-[#2B1C58] rounded-3xl p-5 sm:p-10 space-y-6 sm:space-y-8">
          <div className="text-left space-y-1.5">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#B387F7]">
              Metodologia
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Como funciona o TRIVAX
            </h2>
            <p className="text-xs sm:text-sm text-[#AAB0C6]">
              Uma jornada transparente e fundamentada em evidências em 4 etapas:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-1">
            <div className="bg-[#1A1336]/60 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-[#2B1C58] space-y-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7B28E2] to-[#2D67FF] text-white flex items-center justify-center text-xs font-bold shadow-md">
                1
              </div>
              <h4 className="font-bold text-sm text-white">Entenda suas opções</h4>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Perguntas inteligentes para entender o que faz sentido para você.
              </p>
            </div>

            <div className="bg-[#1A1336]/60 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-[#2B1C58] space-y-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7B28E2] to-[#2D67FF] text-white flex items-center justify-center text-xs font-bold shadow-md">
                2
              </div>
              <h4 className="font-bold text-sm text-white">Conteúdo que conecta</h4>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Informação clara e atualizada, baseada em evidências científicas.
              </p>
            </div>

            <div className="bg-[#1A1336]/60 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-[#2B1C58] space-y-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7B28E2] to-[#2D67FF] text-white flex items-center justify-center text-xs font-bold shadow-md">
                3
              </div>
              <h4 className="font-bold text-sm text-white">Decisões com confiança</h4>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Orientação segura para você tomar a melhor decisão de saúde.
              </p>
            </div>

            <div className="bg-[#1A1336]/60 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-[#2B1C58] space-y-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7B28E2] to-[#2D67FF] text-white flex items-center justify-center text-xs font-bold shadow-md">
                4
              </div>
              <h4 className="font-bold text-sm text-white">Proteção que acompanha</h4>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Cuidar hoje é garantir mais tranquilidade para o seu amanhã.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ / DÚVIDAS */}
        <section id="duvidas" className="space-y-5">
          <div className="text-left sm:text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#B387F7]">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
            <div className="bg-[#120E24] border border-[#2B1C58] p-4 sm:p-5 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#B387F7] shrink-0" />
                <span>O sistema substitui consulta médica?</span>
              </h4>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Não. O TRIVAX é uma plataforma educativa de apoio à decisão. Suas orientações devem ser validadas com um profissional de saúde ou em um centro de imunização com sua caderneta em mãos.
              </p>
            </div>

            <div className="bg-[#120E24] border border-[#2B1C58] p-4 sm:p-5 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2D67FF] shrink-0" />
                <span>Meus dados ficam salvos de forma confidencial?</span>
              </h4>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Sim. Não coletamos nome, CPF ou dados identificáveis. Apenas características populacionais anônimas para apoiar o planejamento epidemiológico.
              </p>
            </div>
          </div>
        </section>

        {/* BANNER FINAL CTA */}
        <section className="bg-gradient-to-r from-[#1E1242] via-[#160E36] to-[#0D1947] border border-[#7B28E2]/40 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              Pronto para descobrir suas vacinas recomendadas?
            </h2>
            <p className="text-xs sm:text-sm text-[#AAB0C6]">
              Leva apenas de 3 a 5 minutos para preencher o questionário interativo.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleStart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white font-bold text-sm sm:text-base hover:opacity-90 transition shadow-xl shadow-[#7B28E2]/40 cursor-pointer"
            >
              <span>Começar Questionário TRIVAX</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
