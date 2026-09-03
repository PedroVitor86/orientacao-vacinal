'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { QuestionCard } from '@/components/QuestionCard';
import { useQuizStore, checkVisibility } from '@/store/useQuizStore';
import { defaultRuleEngine } from '@/engine/rule-engine';
import { RuleDefinition } from '@/types';
import rulesData from '@/config/rules.json';

const rules = rulesData as unknown as RuleDefinition[];

export default function QuestionnairePage() {
  const router = useRouter();
  const {
    facts,
    setFact,
    setAgeBracket,
    setObesitySelection,
    setMultiCheckboxItem,
    setNoneSelected,
    goToNextStep,
    goToPrevStep,
    resetQuiz,
    getVisibleSections,
    getCurrentSection,
    getProgressPercentage,
    getSafeStepIndex,
    setResults,
    results,
    setLastSubmissionId,
  } = useQuizStore();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Se o questionário anterior já tinha sido concluído com resultados, reinicia limpo para a nova pessoa
    if (results !== null) {
      resetQuiz();
    }
  }, [results, resetQuiz]);

  const visibleSections = getVisibleSections();
  const safeIndex = getSafeStepIndex();
  const currentSection = getCurrentSection();
  const progress = getProgressPercentage();
  const isLastStep = safeIndex === visibleSections.length - 1;

  // Numeração 100% contínua e sequencial calculada dinamicamente
  const questionNumberMap = useMemo(() => {
    const map: Record<string, number | null> = {};
    let counter = 0;

    for (const section of visibleSections) {
      for (const q of section.questions) {
        if (
          q.visibility_condition &&
          !checkVisibility(q.visibility_condition, facts)
        ) {
          continue;
        }

        // 'q-affiliation' (Colega Pfizer ou Itapevi?) é a seleção inicial sem número
        if (q.id === 'q-affiliation') {
          map[q.id] = null;
          continue;
        }

        counter++;
        map[q.id] = counter;
      }
    }

    return map;
  }, [visibleSections, facts]);

  if (!isClient || !currentSection) {
    return null;
  }

  const handleNext = async () => {
    setValidationError(null);

    // Validação da Etapa de Identificação Inicial
    if (currentSection.id === 'sec-identificacao') {
      if (!facts.user_affiliation) {
        setValidationError('Por favor, selecione sua unidade ou área (Dumas, Itapevi ou Força de Vendas).');
        return;
      }
      if (!facts.age_bracket) {
        setValidationError('Por favor, selecione sua faixa etária.');
        return;
      }
      if (!facts.sex) {
        setValidationError('Por favor, informe como você se identifica.');
        return;
      }
    }

    if (isLastStep) {
      setIsSubmitting(true);
      try {
        const evaluationResults = defaultRuleEngine.evaluate(rules, facts);
        const eligibleOnly = evaluationResults.filter((r) => r.is_eligible);
        setResults(eligibleOnly);

        // Grava no banco analítico para o relatório do Admin
        try {
          const res = await fetch('/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              facts,
              eligible_results: eligibleOnly,
            }),
          });
          if (res.ok) {
            const resJson = await res.json();
            if (resJson?.id) {
              setLastSubmissionId(resJson.id);
            }
          }
        } catch (saveErr) {
          console.warn('Registro analítico offline:', saveErr);
        }

        router.push('/resultado');
      } catch (err) {
        console.error('Erro na avaliação:', err);
        setValidationError('Ocorreu um erro ao calcular suas orientações. Tente novamente.');
        setIsSubmitting(false);
      }
    } else {
      goToNextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    goToPrevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080612] text-[#F2F3F7] relative overflow-x-hidden selection:bg-[#7B28E2] selection:text-white">
      {/* GLOW DE FUNDO */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[700px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-[#7B28E2]/20 to-[#2D67FF]/20 blur-[100px] sm:blur-[130px] pointer-events-none -z-10" />

      <Navbar showReset={true} onReset={resetQuiz} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-10 space-y-4 sm:space-y-6">
        {/* BARRA DE PROGRESSO TRIVAX */}
        <div className="space-y-2 bg-[#120E24]/70 border border-[#2B1C58] p-3 sm:p-4 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-[11px] sm:text-xs font-semibold text-[#AAB0C6]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B387F7]" />
              <span>
                Etapa {safeIndex + 1} de {visibleSections.length}
              </span>
            </span>
            <span className="text-[#B387F7] font-bold">{progress}% concluído</span>
          </div>
          <div className="w-full h-2 sm:h-2.5 bg-[#080612] rounded-full overflow-hidden p-0.5 border border-[#2B1C58]">
            <div
              className="h-full bg-gradient-to-r from-[#2D67FF] via-[#7B28E2] to-[#B387F7] transition-all duration-500 ease-out rounded-full shadow-md shadow-[#7B28E2]/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ALERTA DE ERRO DE VALIDAÇÃO */}
        {validationError && (
          <div className="p-3.5 sm:p-4 bg-[#2A1135] border border-[#7B28E2] rounded-2xl flex items-start gap-2.5 sm:gap-3 text-[#F2F3F7] text-xs sm:text-sm animate-fadeIn shadow-lg">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B387F7] shrink-0 mt-0.5" />
            <span className="leading-snug">{validationError}</span>
          </div>
        )}

        {/* CABEÇALHO DA SEÇÃO ATUAL */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-4 sm:p-7 shadow-xl space-y-1.5">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
            {currentSection.title}
          </h2>
          {currentSection.description && (
            <p className="text-xs sm:text-sm text-[#AAB0C6] leading-relaxed">
              {currentSection.description}
            </p>
          )}
        </div>

        {/* PERGUNTAS DA SEÇÃO */}
        <div className="space-y-3.5 sm:space-y-4">
          {currentSection.questions.map((q) => {
            if (
              q.visibility_condition &&
              !checkVisibility(q.visibility_condition, facts)
            ) {
              return null;
            }

            return (
              <QuestionCard
                key={q.id}
                question={q}
                displayNumber={questionNumberMap[q.id]}
                facts={facts}
                onFactChange={setFact}
                onAgeBracketChange={setAgeBracket}
                onObesityChange={setObesitySelection}
                onMultiCheckboxChange={setMultiCheckboxItem}
                onNoneChange={setNoneSelected}
              />
            );
          })}
        </div>

        {/* NAVEGAÇÃO ENTRE PASSOS (Otimizado para Celular) */}
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2.5 sm:gap-4 pt-3 sm:pt-4 border-t border-[#2B1C58]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={safeIndex === 0}
            className={`min-h-[46px] inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border text-xs sm:text-sm font-semibold transition cursor-pointer active:scale-98 ${
              safeIndex === 0
                ? 'opacity-30 cursor-not-allowed border-[#2B1C58] text-[#AAB0C6] bg-transparent'
                : 'border-[#2B1C58] text-[#F2F3F7] bg-[#120E24] hover:bg-[#201844] hover:border-[#7B28E2]/50 shadow-md'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="min-h-[46px] inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#7B28E2] via-[#5F30EB] to-[#2D67FF] text-white text-xs sm:text-sm font-bold hover:opacity-90 transition shadow-xl shadow-[#7B28E2]/40 cursor-pointer active:scale-98 text-center"
          >
            {isLastStep ? (
              <>
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{isSubmitting ? 'Processando...' : 'Ver Orientações'}</span>
              </>
            ) : (
              <>
                <span>Avançar</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
