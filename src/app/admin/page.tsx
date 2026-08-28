'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  RefreshCw, 
  Users, 
  Activity, 
  ArrowLeft, 
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { AnalyticsSummary } from '@/services/submission-service';

export default function AdminPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [affiliationFilter, setAffiliationFilter] = useState<'ALL' | 'PFIZER' | 'ITAPEVI'>('ALL');

  const loadData = async (filter = affiliationFilter) => {
    setLoading(true);
    try {
      const url = filter === 'ALL' ? '/api/admin/metrics' : `/api/admin/metrics?affiliation=${filter}`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Erro ao carregar dados do painel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(affiliationFilter);
  }, [affiliationFilter]);

  const handleExportCSV = () => {
    const url = affiliationFilter === 'ALL' 
      ? '/api/admin/export' 
      : `/api/admin/export?affiliation=${affiliationFilter}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* NAVBAR DO ADMIN */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="text-slate-400 hover:text-white transition inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400" />
              <span>Voltar ao Início</span>
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight">
                Painel do Administrador • Gestão Vacinal
              </span>
            </div>
          </div>

          <button
            onClick={() => loadData()}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 transition cursor-pointer border border-slate-800 hover:border-purple-600"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* BARRA SUPERIOR COM FILTROS E EXPORTAÇÃO */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Relatório de Elegibilidade Populacional
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Análise epidemiológica consolidada das avaliações respondidas pelos colaboradores.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* SELETOR DE UNIDADE */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setAffiliationFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  affiliationFilter === 'ALL'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Todas as Unidades
              </button>
              <button
                onClick={() => setAffiliationFilter('PFIZER')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  affiliationFilter === 'PFIZER'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Colega Pfizer
              </button>
              <button
                onClick={() => setAffiliationFilter('ITAPEVI')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  affiliationFilter === 'ITAPEVI'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Itapevi
              </button>
            </div>

            {/* BOTÃO EXPORTAR CSV EXCEL */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer hover:border-purple-500"
              title="Baixar planilha completa compatível com Microsoft Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-purple-400" />
              <span>Exportar para Excel (.CSV)</span>
            </button>
          </div>
        </div>

        {/* CARDS DE INDICADORES PRINCIPAIS (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TOTAL DE AVALIAÇÕES */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total de Pessoas</span>
              <Users className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-950">
                {data?.totalRespondents ?? 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Colaboradores avaliados no sistema
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between font-medium">
              <span>Pfizer: <strong className="text-slate-900">{data?.byAffiliation.pfizer ?? 0}</strong></span>
              <span>Itapevi: <strong className="text-slate-900">{data?.byAffiliation.itapevi ?? 0}</strong></span>
            </div>
          </div>

          {/* ELEGÍVEIS COVID-19 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 hover:border-blue-300 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">COVID-19</span>
              <div className="w-3 h-3 rounded-full bg-blue-600" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-950">
                  {data?.vaccineStats.COVID_19.count ?? 0}
                </span>
                <span className="text-sm font-bold text-blue-600">
                  ({data?.vaccineStats.COVID_19.percentage ?? 0}%)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Elegíveis por comorbidade ou grupo especial
              </p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${data?.vaccineStats.COVID_19.percentage ?? 0}%` }}
              />
            </div>
          </div>

          {/* ELEGÍVEIS VSR */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 hover:border-purple-300 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">VSR</span>
              <div className="w-3 h-3 rounded-full bg-purple-600" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-950">
                  {data?.vaccineStats.VSR.count ?? 0}
                </span>
                <span className="text-sm font-bold text-purple-600">
                  ({data?.vaccineStats.VSR.percentage ?? 0}%)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Gestantes 32-36 sem, ≥75 anos ou 50-74 com risco
              </p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${data?.vaccineStats.VSR.percentage ?? 0}%` }}
              />
            </div>
          </div>

          {/* ELEGÍVEIS PNEUMO 20 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 hover:border-indigo-300 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Pneumocócica 20</span>
              <div className="w-3 h-3 rounded-full bg-indigo-600" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-950">
                  {data?.vaccineStats.PNEUMO_20.count ?? 0}
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  ({data?.vaccineStats.PNEUMO_20.percentage ?? 0}%)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Universal ≥50 anos ou 18-49 com condição de risco
              </p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${data?.vaccineStats.PNEUMO_20.percentage ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* SEÇÕES DE DETALHAMENTO: FAIXAS ETÁRIAS & TOP COMORBIDADES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DISTRIBUIÇÃO POR FAIXA ETÁRIA */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Distribuição por Faixa Etária</span>
            </h3>

            <div className="space-y-3 pt-2">
              {[
                { key: '18_49', label: '18 a 49 anos' },
                { key: '50_59', label: '50 a 59 anos' },
                { key: '60_74', label: '60 a 74 anos' },
                { key: '75_plus', label: '75 anos ou mais' },
              ].map((bracket) => {
                const count = data?.byAgeBracket[bracket.key] ?? 0;
                const total = data?.totalRespondents || 1;
                const pct = Math.round((count / total) * 100);

                return (
                  <div key={bracket.key} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{bracket.label}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOP CONDIÇÕES / COMORBIDADES MAIS FREQUENTES */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Fatores de Risco Mais Prevalentes</span>
            </h3>

            {data?.topConditions && data.topConditions.length > 0 ? (
              <div className="space-y-3 pt-2">
                {data.topConditions.map((cond) => (
                  <div key={cond.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{cond.name}</span>
                      <span>{cond.count} pessoas ({cond.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${cond.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Nenhum fator de risco registrado até o momento.
              </div>
            )}
          </div>
        </div>

        {/* TABELA DE SUBMISSÕES RECENTES */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-950 text-base">
                Últimas Avaliações Realizadas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exibindo os registros salvos anonimamente no sistema.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
              Total: {data?.totalRespondents ?? 0} registros
            </span>
          </div>

          {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Data / Hora</th>
                    <th className="py-3.5 px-4">Unidade</th>
                    <th className="py-3.5 px-4">Faixa Etária</th>
                    <th className="py-3.5 px-4">Sexo</th>
                    <th className="py-3.5 px-4">Vacinas Indicadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentSubmissions.map((sub) => {
                    const dateFormatted = new Date(sub.timestamp).toLocaleString('pt-BR');
                    return (
                      <tr key={sub.id} className="hover:bg-purple-50/30 transition">
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {dateFormatted}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {sub.user_affiliation === 'PFIZER' ? 'Colega Pfizer' : 'Itapevi'}
                        </td>
                        <td className="py-3 px-4">
                          {sub.age_bracket === '18_49'
                            ? '18 a 49 anos'
                            : sub.age_bracket === '50_59'
                            ? '50 a 59 anos'
                            : sub.age_bracket === '60_74'
                            ? '60 a 74 anos'
                            : '75 anos ou mais'}
                        </td>
                        <td className="py-3 px-4">
                          {sub.sex === 'FEMININO'
                            ? 'Feminino'
                            : sub.sex === 'MASCULINO'
                            ? 'Masculino'
                            : 'Não informado'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {sub.vaccines.length > 0 ? (
                              sub.vaccines.map((v) => (
                                <span
                                  key={v}
                                  className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                                    v === 'COVID_19'
                                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                      : v === 'VSR'
                                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                      : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                  }`}
                                >
                                  {v === 'COVID_19'
                                    ? 'COVID-19'
                                    : v === 'VSR'
                                    ? 'VSR'
                                    : 'Pneumo 20'}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic">Nenhuma</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-sm text-slate-400">
              Nenhuma avaliação registrada ainda. Complete o questionário para ver os dados refletidos aqui em tempo real!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
