'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Printer, 
  Share2, 
  RotateCcw, 
  AlertTriangle, 
  HeartHandshake, 
  Check, 
  ArrowLeft,
  Building2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VaccineResultCard } from '@/components/VaccineResultCard';
import { useQuizStore } from '@/store/useQuizStore';
import { defaultRuleEngine } from '@/engine/rule-engine';
import { RuleDefinition } from '@/types';
import rulesData from '@/config/rules.json';

const rules = rulesData as unknown as RuleDefinition[];

export default function ResultadoPage() {
  const router = useRouter();
  const { facts, results, setResults, resetQuiz } = useQuizStore();
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Se não houver fatos preenchidos (usuário acessou direto a URL /resultado)
    if (!facts.age_bracket && !facts.age) {
      router.push('/questionario');
      return;
    }

    // Se resultados estiver vazio mas temos fatos, avalia novamente
    if (!results) {
      const evalRes = defaultRuleEngine.evaluate(rules, facts);
      setResults(evalRes.filter((r) => r.is_eligible));
    }
  }, [facts, results, router, setResults]);

  if (!isClient || (!facts.age_bracket && !facts.age)) {
    return null;
  }

  const eligibleList = results || [];

  const getAgeLabel = () => {
    if (facts.age_bracket === '18_49') return '18 a 49 anos';
    if (facts.age_bracket === '50_59') return '50 a 59 anos';
    if (facts.age_bracket === '60_74') return '60 a 74 anos';
    if (facts.age_bracket === '75_plus') return '75 anos ou mais';
    return `${facts.age || ''} anos`;
  };

  const getAffiliationLabel = () => {
    if (facts.user_affiliation === 'PFIZER') return 'Colega Pfizer';
    if (facts.user_affiliation === 'ITAPEVI') return 'Itapevi';
    return null;
  };

  const handleCopySummary = () => {
    const affiliationText = getAffiliationLabel() ? `Unidade: ${getAffiliationLabel()}\n` : '';
    const summaryText = [
      '📋 *Resumo de Orientação Vacinal Adulta*',
      `${affiliationText}Faixa etária: ${getAgeLabel()}`,
      `Total de vacinas potencialmente indicadas: ${eligibleList.length}`,
      '',
      ...eligibleList.map(
        (v) => `✅ *${v.vaccine_name}*\n${v.reasons.map((r) => `  • ${r.description}`).join('\n')}`
      ),
      '',
      '⚠️ *Importante:* Documento orientativo baseado em critérios públicos do PNI/SBIm. Não substitui consulta médica.',
    ].join('\n');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* BOTÃO VOLTAR / NAVEGAÇÃO */}
        <div className="print:hidden">
          <Link
            href="/questionario"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Revisar respostas do questionário</span>
          </Link>
        </div>

        {/* BANNER DE CABEÇALHO */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {getAffiliationLabel() && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200">
                      <Building2 className="w-3 h-3 text-purple-600" />
                      {getAffiliationLabel()}
                    </span>
                  )}
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-900 text-white">
                    Faixa etária: {getAgeLabel()}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                  Suas Orientações Vacinais
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Relatório gerado com base nas características clínicas e faixa etária informadas.
                </p>
              </div>
            </div>

            {/* Ações Rápidas (Impressão / Compartilhar) */}
            <div className="flex items-center gap-2 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                title="Imprimir ou Salvar em PDF"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Imprimir / PDF</span>
              </button>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold hover:opacity-95 transition shadow-sm shadow-purple-500/25 cursor-pointer"
                title="Copiar resumo para WhatsApp"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* LISTAGEM DE RESULTADOS */}
        {eligibleList.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-950">
                Vacinas Potencialmente Elegíveis ({eligibleList.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Apresente este resultado na sua UBS ou consulta
              </span>
            </div>

            <div className="space-y-4">
              {eligibleList.map((res) => (
                <VaccineResultCard key={res.vaccine_code} result={res} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-black text-slate-950">
                Nenhum critério prioritário específico identificado
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Com base nas respostas informadas, você não se enquadra atualmente nos critérios de prioridade ou grupos de risco para estas três vacinas específicas (COVID-19 reforço especial, VSR ou Pneumocócica 20-valente).
              </p>
              <p className="text-xs text-slate-500">
                Continue mantendo suas vacinas de rotina em dia (Tétano, Hepatite B, Febre Amarela, Tríplice Viral e Influenza anual).
              </p>
            </div>
          </div>
        )}

        {/* AVISO MÉDICO OBRIGATÓRIO */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 flex items-start gap-4 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <h3 className="font-bold text-sm text-white">
              Próximos Passos e Recomendações Importantes:
            </h3>
            <p>
              1. <strong>Procure uma Unidade de Saúde ou seu Médico de Confiança:</strong> Leve seu histórico vacinal e este relatório orientativo para validação do esquema de doses anteriores.
            </p>
            <p>
              2. <strong>Contraindicações e Intervalos:</strong> Caso esteja com sintomas agudos (febre, infecção ativa) ou tenha histórico de reações alérgicas graves (anafilaxia) a doses prévias, informe a equipe de imunização.
            </p>
            <p>
              3. <strong>Validade do Diagnóstico:</strong> Este sistema calcula probabilidades de elegibilidade epidemiológica e não substitui a consulta médica presencial.
            </p>
          </div>
        </div>

        {/* BOTÃO RECOMEÇAR */}
        <div className="flex justify-center pt-4 print:hidden">
          <button
            type="button"
            onClick={() => {
              resetQuiz();
              router.push('/questionario');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-purple-50 hover:border-purple-300 text-slate-800 font-bold text-sm transition shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-purple-600" />
            <span>Refazer Avaliação com Outras Respostas</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
