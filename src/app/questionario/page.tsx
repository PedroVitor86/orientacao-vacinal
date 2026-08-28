'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { QuestionCard } from '@/components/QuestionCard';
import { useQuizStore } from '@/store/useQuizStore';
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
  } = useQuizStore();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const visibleSections = getVisibleSections();
  const safeIndex = getSafeStepIndex();
  const currentSection = getCurrentSection();
  const progress = getProgressPercentage();
  const isLastStep = safeIndex === visibleSections.length - 1;

  if (!isClient || !currentSection) {
    return null;
  }

  // Gera a numeração sequencial contínua (1, 2, 3, 4...) de acordo com as perguntas efetivamente exibidas
  const getQuestionNumberMap = () => {
    const map: Record<string, number | null> = {};
    let counter = 0;

    for (const section of visibleSections) {
      for (const q of section.questions) {
        if (
          q.visibility_condition &&
          facts[q.visibility_condition.fact] !== q.visibility_condition.value
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
  };

  const questionNumberMap = getQuestionNumberMap();

  const handleNext = async () => {
    setValidationError(null);

    // Validação da Etapa de Identificação Inicial
    if (currentSection.id === 'sec-identificacao') {
      if (!facts.user_affiliation) {
        setValidationError('Por favor, informe se você é Colega Pfizer ou Itapevi.');
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
          await fetch('/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              facts,
              eligible_results: eligibleOnly,
            }),
          });
        } catch (saveErr) {
          console.warn('Registro de estatística offline:', saveErr);
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar showReset={true} onReset={resetQuiz} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10 space-y-6">
        {/* BARRA DE PROGRESSO COM GRADIENTE AZUL E ROXO */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
            <span>
              Etapa {safeIndex + 1} de {visibleSections.length}
            </span>
            <span className="text-purple-700 font-bold">{progress}% concluído</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out rounded-full shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ALERTA DE ERRO DE VALIDAÇÃO */}
        {validationError && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3 text-purple-900 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {/* CABEÇALHO DA SEÇÃO ATUAL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-1.5">
          <h2 className="text-2xl font-black text-slate-950 leading-snug">
            {currentSection.title}
          </h2>
          {currentSection.description && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {currentSection.description}
            </p>
          )}
        </div>

        {/* PERGUNTAS DA SEÇÃO COM NUMERAÇÃO SEQUENCIAL CONTÍNUA */}
        <div className="space-y-4">
          {currentSection.questions.map((q) => {
            // Se tiver visibilidade condicional na pergunta individual
            if (
              q.visibility_condition &&
              facts[q.visibility_condition.fact] !== q.visibility_condition.value
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

        {/* NAVEGAÇÃO ENTRE PASSOS */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handlePrev}
            disabled={safeIndex === 0}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer ${
              safeIndex === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-transparent'
                : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100 shadow-xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-bold hover:opacity-95 transition shadow-md shadow-purple-500/25 cursor-pointer"
          >
            {isLastStep ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Processando...' : 'Ver Minhas Orientações'}</span>
              </>
            ) : (
              <>
                <span>Avançar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
