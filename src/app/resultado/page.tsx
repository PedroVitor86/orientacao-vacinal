'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Printer, 
  Share2, 
  RotateCcw, 
  AlertTriangle, 
  HeartHandshake, 
  Check, 
  CheckCircle2, 
  ArrowLeft, 
  Building2, 
  Sparkles, 
  HelpCircle,
  ExternalLink,
  MapPin,
  Info,
  Home,
  Clock
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VaccineResultCard } from '@/components/VaccineResultCard';
import { useQuizStore } from '@/store/useQuizStore';
import { defaultRuleEngine } from '@/engine/rule-engine';
import { RuleDefinition } from '@/types';
import rulesData from '@/config/rules.json';
import { trackUbsClick } from '@/lib/track-click';

const rules = rulesData as unknown as RuleDefinition[];

export default function ResultadoPage() {
  const router = useRouter();
  const { 
    facts, 
    results, 
    setResults, 
    resetQuiz,
    lastSubmissionId,
    awarenessFeedback,
    setAwarenessFeedback,
    cardUpdatedFeedback,
    setCardUpdatedFeedback
  } = useQuizStore();

  const [copied, setCopied] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [cardUpdatedFeedbackSaved, setCardUpdatedFeedbackSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isPaused, setIsPaused] = useState(false);

  const handleFinishAndHome = () => {
    resetQuiz();
    router.push('/');
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetQuiz();
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, resetQuiz, router]);

  useEffect(() => {
    setIsClient(true);

    if (!results && (facts.age_bracket || facts.age)) {
      const evalRes = defaultRuleEngine.evaluate(rules, facts);
      setResults(evalRes.filter((r) => r.is_eligible));
    }
  }, [facts, results, setResults]);

  if (!isClient) {
    return null;
  }

  const eligibleList = results || [];

  const getAgeLabel = () => {
    if (facts.age_bracket === '18_49') return '18 a 49 anos';
    if (facts.age_bracket === '50_59') return '50 a 59 anos';
    if (facts.age_bracket === '60_74') return '60 a 74 anos';
    if (facts.age_bracket === '75_plus') return '75 anos ou mais';
    if (facts.age) return `${facts.age} anos`;
    return null;
  };

  const getAffiliationLabel = () => {
    if (facts.user_affiliation === 'DUMAS' || facts.user_affiliation === 'PFIZER') return 'Dumas';
    if (facts.user_affiliation === 'ITAPEVI') return 'Itapevi';
    if (facts.user_affiliation === 'FORCA_DE_VENDAS') return 'Força de Vendas';
    return null;
  };

  const handleCopySummary = () => {
    const affiliationText = getAffiliationLabel() ? `Unidade: ${getAffiliationLabel()}\n` : '';
    const summaryText = [
      '📋 *TRIVAX • Resumo de Orientação Vacinal*',
      `${affiliationText}Faixa etária: ${getAgeLabel()}`,
      `Total de vacinas potencialmente indicadas: ${eligibleList.length}`,
      '',
      ...eligibleList.map(
        (r, i) =>
          `${i + 1}. *${r.vaccine_name}*\n   Motivos:\n${r.reasons
            .map((reas) => `   • ${reas.description}`)
            .join('\n')}`
      ),
      '',
      'ℹ️ *Importante:* Vacinas disponíveis para toda a população. Este resumo retrata a elegibilidade do mercado público (SUS). Lembre-se também de manter as vacinas de Gripe e Sarampo em dia.',
      '🔗 Saiba mais: https://www.cuidamosjuntos.com.br/',
    ].join('\n');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCardUpdatedSelect = async (val: string) => {
    setCardUpdatedFeedback(val);
    setCardUpdatedFeedbackSaved(true);

    if (lastSubmissionId) {
      try {
        await fetch('/api/submissions/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: lastSubmissionId,
            cardUpdatedFeedback: val,
          }),
        });
      } catch (err) {
        console.warn('Erro ao sincronizar feedback de caderneta:', err);
      }
    }
  };

  const handleAwarenessSelect = async (val: string) => {
    setAwarenessFeedback(val);
    setFeedbackSaved(true);

    if (lastSubmissionId) {
      try {
        await fetch('/api/submissions/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: lastSubmissionId,
            feedback: val,
          }),
        });
      } catch (err) {
        console.warn('Erro ao sincronizar feedback de conscientização:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080612] text-[#F2F3F7] relative overflow-x-hidden selection:bg-[#7B28E2] selection:text-white">
      {/* GLOW DE FUNDO */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[700px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-[#7B28E2]/20 to-[#2D67FF]/20 blur-[100px] sm:blur-[130px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-12 space-y-6 sm:space-y-8">
        {/* BOTÃO VOLTAR / REVISAR */}
        <div className="print:hidden">
          <Link
            href="/questionario"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#AAB0C6] hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#B387F7]" />
            <span>Revisar respostas do questionário</span>
          </Link>
        </div>

        {/* BANNER DE CABEÇALHO DO RESULTADO TRIVAX */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#7B28E2] to-[#2D67FF] p-0.5 shadow-xl shadow-[#7B28E2]/40 shrink-0">
                <div className="w-full h-full rounded-2xl bg-[#080612] flex items-center justify-center p-1.5 sm:p-2">
                  <Image
                    src="/trivax-symbol-v3.png"
                    alt="TRIVAX"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain rounded-xl"
                    unoptimized
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                  {getAffiliationLabel() && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#1F1545] text-[#B387F7] border border-[#7B28E2]/30">
                      <Building2 className="w-3 h-3" />
                      {getAffiliationLabel()}
                    </span>
                  )}
                  {getAgeLabel() && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#1A1336] text-[#AAB0C6] border border-[#2B1C58]">
                      Faixa etária: {getAgeLabel()}
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  Suas Orientações TRIVAX
                </h1>
                <p className="text-[11px] sm:text-xs text-[#AAB0C6] mt-0.5">
                  Relatório gerado com base nas diretrizes oficiais e seu perfil de saúde.
                </p>
              </div>
            </div>

            {/* Ações Rápidas (Impressão / Compartilhar) */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 print:hidden pt-2 sm:pt-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full border border-[#2B1C58] bg-[#1A1336] text-xs font-bold text-[#F2F3F7] hover:bg-[#24174D] hover:border-[#7B28E2]/50 transition cursor-pointer"
                title="Imprimir ou Salvar em PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#B387F7]" />
                <span>Imprimir / PDF</span>
              </button>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white text-xs font-bold hover:opacity-90 transition shadow-lg shadow-[#7B28E2]/30 cursor-pointer"
                title="Copiar resumo para WhatsApp"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE RETORNO AUTOMÁTICO PARA O PRÓXIMO USUÁRIO */}
        <div className="bg-[#120E24]/90 border border-[#7B28E2]/40 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2.5 text-[#AAB0C6]">
            <Clock className="w-4 h-4 text-[#B387F7] shrink-0 animate-pulse" />
            <span>
              Privacidade: Para liberar para o próximo colega, a tela retornará ao início em{' '}
              <strong className="text-white font-mono font-bold bg-[#1A1336] px-2 py-0.5 rounded-md border border-[#2B1C58]">
                {timeLeft}s
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="text-[11px] font-semibold text-[#AAB0C6] hover:text-white px-2.5 py-1 rounded-lg border border-[#2B1C58] hover:border-[#7B28E2] transition cursor-pointer"
            >
              {isPaused ? '▶ Continuar tempo' : '⏸ Ler com calma'}
            </button>
            <button
              type="button"
              onClick={handleFinishAndHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white font-bold text-xs hover:opacity-90 transition shadow-md shadow-[#7B28E2]/30 cursor-pointer active:scale-98"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Concluir Agora</span>
            </button>
          </div>
        </div>

        {/* LISTAGEM DE RESULTADOS */}
        {eligibleList.length > 0 ? (
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-4 h-4 text-[#B387F7]" />
                <span>Vacinas Potencialmente Elegíveis ({eligibleList.length})</span>
              </h2>
              <span className="text-[10px] sm:text-xs text-[#AAB0C6]">
                Apresente em um centro de imunização ou clínica
              </span>
            </div>

            <div className="space-y-3.5 sm:space-y-4">
              {eligibleList.map((res) => (
                <VaccineResultCard key={res.vaccine_code} result={res} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-6 sm:p-8 text-center space-y-3 sm:space-y-4 shadow-xl">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-[#1F1545] text-[#B387F7] flex items-center justify-center border border-[#7B28E2]/30">
              <HeartHandshake className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5 sm:space-y-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                Nenhum critério prioritário específico identificado
              </h2>
              <p className="text-xs sm:text-sm text-[#AAB0C6] leading-relaxed">
                Com base nas respostas informadas, você não se enquadra atualmente nos critérios de prioridade ou grupos de risco para estas três vacinas específicas no mercado público (vacina contra a COVID-19 [doses atualizadas], vacina contra o VSR ou vacina contra o Pneumococo).
              </p>
              <p className="text-[11px] sm:text-xs text-[#B387F7] pt-1 leading-relaxed">
                Lembramos que a vacina contra o VSR e a vacina contra o Pneumococo podem ser acessadas na rede privada mediante avaliação médica, com direito a reembolso para colegas Pfizer e dependentes.
              </p>
            </div>
          </div>
        )}

        {/* BLOCO: DISPONIBILIDADE PARA TODOS & ELEGIBILIDADE DO MERCADO PÚBLICO */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-7 shadow-xl space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2D67FF]/20 text-[#2D67FF] flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-white text-sm sm:text-base">
              Disponibilidade das Vacinas e Mercado Público (SUS)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#AAB0C6] leading-relaxed">
            As vacinas avaliadas neste questionário retratam especificamente os critérios de <strong className="text-white">elegibilidade e priorização do mercado público (SUS / PNI)</strong>. Caso você não atenda a um critério prioritário gratuito do SUS, as vacinas podem ser acessadas na rede privada com orientação médica.
          </p>
        </div>

        {/* BLOCO: IMPORTÂNCIA DAS VACINAS DE ROTINA (GRIPE E SARAMPO) */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#7B28E2]/40 p-5 sm:p-7 shadow-xl space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7B28E2]/20 text-[#B387F7] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                Lembrete Essencial: Vacinação contra Gripe e Sarampo
              </h3>
              <p className="text-[11px] text-[#AAB0C6]">
                Manter a caderneta de rotina completa é indispensável para sua proteção continuada.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* GRIPE / INFLUENZA */}
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1.5 hover:border-[#2D67FF]/50 transition">
              <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D67FF]" />
                <span>Vacina da Gripe (Influenza)</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#AAB0C6] leading-relaxed">
                Recomendada <strong className="text-[#F2F3F7]">anualmente</strong> para todos os adultos. O vírus sofre mutações frequentes e a dose anual renova seus anticorpos contra as cepas mais recentes.
              </p>
            </div>

            {/* SARAMPO / TRÍPLICE VIRAL */}
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1.5 hover:border-[#7B28E2]/50 transition">
              <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7B28E2]" />
                <span>Vacina do Sarampo (Tríplice Viral)</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#AAB0C6] leading-relaxed">
                Essencial para adultos de até 59 anos que não possuem histórico de 2 doses registradas. Garante proteção duradoura contra <strong className="text-[#F2F3F7]">sarampo, caxumba e rubéola</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* BLOCO: PORTAL CUIDAMOS JUNTOS E BUSCADOR DE UBS */}
        <div className="bg-gradient-to-r from-[#1E1242] via-[#160E36] to-[#0D1947] rounded-2xl sm:rounded-3xl border border-[#7B28E2]/50 p-5 sm:p-8 shadow-2xl space-y-4">
          <div className="space-y-1.5">
            <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B387F7] bg-[#1F1545] border border-[#7B28E2]/40 px-2.5 py-0.5 rounded-full mb-1">
              Programa &amp; Apoio ao Paciente
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white">
              Conheça a Plataforma Cuidamos Juntos
            </h3>
            <p className="text-xs sm:text-sm text-[#AAB0C6] leading-relaxed">
              O <strong className="text-white">Cuidamos Juntos</strong> é a iniciativa que conecta você a conteúdos educativos, orientações claras de saúde e caminhos para prevenção. Para vacinas do SUS (como a COVID-19), consulte o buscador para encontrar o posto mais próximo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <a
              href="https://www.cuidamosjuntos.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#7B28E2]/30 hover:opacity-90 transition cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Acessar Portal Cuidamos Juntos</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://deolhonafila.prefeitura.sp.gov.br/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackUbsClick('RESULTADO')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#130E2A] hover:bg-[#201742] text-white text-xs sm:text-sm font-semibold border border-[#2B1C58] transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#2D67FF]" />
              <span>Buscador de UBS / Posto de Saúde</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#AAB0C6]" />
            </a>
          </div>
        </div>

        {/* PESQUISA DE CONSCIENTIZAÇÃO UNIFICADA */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#7B28E2]/40 p-5 sm:p-7 shadow-xl space-y-6 print:hidden relative overflow-hidden">
          {/* PERGUNTA 1: ELEGIBILIDADE PARA AS VACINAS (Apenas se tiver ao menos 1 vacina indicada) */}
          {eligibleList.length > 0 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B387F7] bg-[#1F1545] border border-[#7B28E2]/30 px-2.5 py-0.5 rounded-full mb-1">
                  Pesquisa de Conscientização
                </span>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  Você sabia que estava elegível para essas vacinas?
                </h3>
                <p className="text-[11px] sm:text-xs text-[#AAB0C6]">
                  Sua resposta é anônima e nos ajuda a planejar as orientações de saúde preventiva.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { value: 'SIM', label: 'Sim, já sabia' },
                  { value: 'NAO', label: 'Não sabia' },
                  { value: 'PARCIAL', label: 'Sabia de algumas' },
                ].map((opt) => {
                  const isSelected = awarenessFeedback === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleAwarenessSelect(opt.value)}
                      className={`min-h-[46px] px-4 py-2.5 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-semibold transition flex items-center justify-between cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'bg-[#24174D] border-[#7B28E2] text-white ring-2 ring-[#7B28E2]/40 shadow-lg shadow-[#7B28E2]/25 font-bold'
                          : 'bg-[#1A1336]/80 border-[#2B1C58] hover:bg-[#201844] text-[#F2F3F7] hover:border-[#7B28E2]/40'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#B387F7] shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>

              {feedbackSaved && (
                <div className="text-xs text-[#B387F7] flex items-center gap-1.5 pt-0.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-[#B387F7]" />
                  <span>Obrigado! Sua resposta foi gravada com sucesso.</span>
                </div>
              )}
            </div>
          )}

          {/* DIVISOR E PERGUNTA 2: CADERNETA ATUALIZADA */}
          <div className={eligibleList.length > 0 ? "border-t border-[#2B1C58]/60 pt-5 space-y-3.5" : "space-y-3.5"}>
            <div className="space-y-1">
              {eligibleList.length === 0 && (
                <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B387F7] bg-[#1F1545] border border-[#7B28E2]/30 px-2.5 py-0.5 rounded-full mb-1">
                  Pesquisa de Conscientização
                </span>
              )}
              <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                Sua caderneta de vacinação está atualizada?
              </h3>
              <p className="text-[11px] sm:text-xs text-[#AAB0C6]">
                Sua resposta é anônima e nos ajuda a planejar as orientações de saúde preventiva.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { value: 'SIM', label: 'Sim, está atualizada' },
                { value: 'NAO', label: 'Não está atualizada' },
                { value: 'NAO_SEI', label: 'Não sei informar' },
              ].map((opt) => {
                const isSelected = cardUpdatedFeedback === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleCardUpdatedSelect(opt.value)}
                    className={`min-h-[46px] px-4 py-2.5 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-semibold transition flex items-center justify-between cursor-pointer active:scale-98 ${
                      isSelected
                        ? 'bg-[#24174D] border-[#7B28E2] text-white ring-2 ring-[#7B28E2]/40 shadow-lg shadow-[#7B28E2]/25 font-bold'
                        : 'bg-[#1A1336]/80 border-[#2B1C58] hover:bg-[#201844] text-[#F2F3F7] hover:border-[#7B28E2]/40'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#B387F7] shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>

            {cardUpdatedFeedbackSaved && (
              <div className="text-xs text-[#B387F7] flex items-center gap-1.5 pt-0.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-[#B387F7]" />
                <span>Obrigado! Sua resposta foi gravada com sucesso.</span>
              </div>
            )}
          </div>
        </div>

        {/* AVISO MÉDICO OBRIGATÓRIO */}
        <div className="bg-[#110D24] text-[#F2F3F7] border border-[#2B1C58] rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex items-start gap-3 sm:gap-4 shadow-xl">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-[#B387F7] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-[#AAB0C6] leading-relaxed">
            <h3 className="font-bold text-xs sm:text-sm text-white">
              Próximos Passos e Recomendações:
            </h3>
            <p>
              1. <strong>Procure um Centro de Imunização ou seu Médico:</strong> Leve sua caderneta de vacinação para conferência do histórico de doses.
            </p>
            <p>
              2. <strong>Contraindicações e Intervalos:</strong> Caso esteja com febre ou histórico de reações alérgicas graves, procure um serviço de saúde.
            </p>
            <p>
              3. <strong>Validade do Diagnóstico:</strong> Este sistema calcula probabilidades epidemiológicas e não substitui a consulta médica individualizada.
            </p>
          </div>
        </div>

        {/* BOTÕES FINAIS: CONCLUIR E VOLTAR AO INÍCIO / REFAZER */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 sm:pt-4 print:hidden">
          <button
            type="button"
            onClick={() => {
              resetQuiz();
              router.push('/');
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#7B28E2] via-[#5F30EB] to-[#2D67FF] text-white font-bold text-xs sm:text-sm hover:opacity-90 transition shadow-xl shadow-[#7B28E2]/30 cursor-pointer active:scale-98"
          >
            <Home className="w-4 h-4" />
            <span>Finalizar e Voltar ao Início</span>
          </button>

          <button
            type="button"
            onClick={() => {
              resetQuiz();
              router.push('/questionario');
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-full border border-[#2B1C58] bg-[#120E24] hover:bg-[#201844] hover:border-[#7B28E2]/50 text-[#AAB0C6] hover:text-white font-semibold text-xs sm:text-sm transition cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4 text-[#B387F7]" />
            <span>Refazer Avaliação</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
