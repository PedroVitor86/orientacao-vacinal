'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  RefreshCw, 
  Users, 
  Activity, 
  ArrowLeft, 
  Calendar,
  FileSpreadsheet,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lock,
  LogOut,
  MailCheck,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { AnalyticsSummary } from '@/services/submission-service';

const EMPTY_ANALYTICS: AnalyticsSummary = {
  totalRespondents: 0,
  byAffiliation: { dumas: 0, itapevi: 0, forcaVendas: 0 },
  byAgeBracket: { '18_49': 0, '50_59': 0, '60_74': 0, '75_plus': 0 },
  bySex: {
    feminino: 0,
    masculino: 0,
    naoInformar: 0,
    femininoPercentage: 0,
    masculinoPercentage: 0,
    naoInformarPercentage: 0,
  },
  vaccineStats: {
    COVID_19: { count: 0, percentage: 0 },
    VSR: { count: 0, percentage: 0 },
    PNEUMO_20: { count: 0, percentage: 0 },
  },
  awarenessStats: {
    sim: 0,
    nao: 0,
    parcial: 0,
    simPercentage: 0,
    naoPercentage: 0,
    parcialPercentage: 0,
    totalResponses: 0,
  },
  topConditions: [],
  recentSubmissions: [],
  followUpStats: {
    total: 0,
    participatedSim: 0,
    participatedNao: 0,
    soughtCenterSim: 0,
    soughtCenterNao: 0,
    conversionRate: 0,
  },
  ubsClickStats: {
    total: 0,
    bySource: {
      acompanhamento: 0,
      resultado: 0,
      cardVacina: 0,
    },
  },
};

export default function AdminPage() {
  const [data, setData] = useState<AnalyticsSummary>(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [affiliationFilter, setAffiliationFilter] = useState<'ALL' | 'DUMAS' | 'ITAPEVI' | 'FORCA_DE_VENDAS' | 'PFIZER'>('ALL');

  // Estados de controle de acesso com senha (padrão 0802)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const loadData = async (filter = affiliationFilter) => {
    setLoading(true);
    try {
      const url = filter === 'ALL' ? '/api/admin/metrics' : `/api/admin/metrics?affiliation=${filter}`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json || EMPTY_ANALYTICS);
    } catch (err) {
      console.error('Erro ao carregar dados do painel:', err);
      setData(EMPTY_ANALYTICS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedAuth = typeof window !== 'undefined' ? sessionStorage.getItem('trivax_admin_auth') : null;
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      loadData(affiliationFilter);
    } else {
      setLoading(false);
    }
  }, [affiliationFilter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '0802') {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem('trivax_admin_auth', 'true');
      loadData(affiliationFilter);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    sessionStorage.removeItem('trivax_admin_auth');
  };

  const handleExportCSV = () => {
    const url = affiliationFilter === 'ALL' 
      ? '/api/admin/export' 
      : `/api/admin/export?affiliation=${affiliationFilter}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#080612] text-[#F2F3F7] flex flex-col relative overflow-x-hidden selection:bg-[#7B28E2] selection:text-white">
      {/* GLOW DE FUNDO */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[800px] h-[200px] sm:h-[300px] bg-gradient-to-tr from-[#7B28E2]/20 to-[#2D67FF]/20 blur-[100px] sm:blur-[130px] pointer-events-none -z-10" />

      {/* NAVBAR DO ADMIN */}
      <header className="sticky top-0 z-40 bg-[#080612]/95 backdrop-blur-xl border-b border-[#2B1C58] shadow-xl">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link 
              href="/" 
              className="text-[#AAB0C6] hover:text-white transition inline-flex items-center gap-1 text-xs font-semibold shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-[#B387F7]" />
              <span className="hidden sm:inline">Início</span>
            </Link>
            <span className="text-[#2B1C58] hidden sm:inline">|</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#120E24] p-1 border border-[#2B1C58] shrink-0">
                <Image
                  src="/trivax-symbol-v3.png"
                  alt="TRIVAX"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain rounded-full"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xs sm:text-base text-white tracking-wide leading-none">
                  TRIVAX • Painel Admin
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#B387F7] uppercase tracking-wider mt-0.5 leading-none">
                  Indicadores Populacionais
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData()}
              disabled={loading || !isAuthenticated}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#120E24] hover:bg-[#201844] text-[#F2F3F7] transition cursor-pointer border border-[#2B1C58] hover:border-[#7B28E2]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#B387F7] ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Atualizar</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#120E24] hover:bg-rose-950/50 text-rose-300 hover:text-rose-200 transition cursor-pointer border border-rose-900/40 hover:border-rose-500/60"
                title="Bloquear painel"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden xs:inline">Sair</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={`flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8 transition-all duration-500 ${
        !isAuthenticated ? 'filter blur-2xl pointer-events-none select-none opacity-10' : ''
      }`}>
        {/* BARRA SUPERIOR COM FILTROS E EXPORTAÇÃO */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-7 shadow-xl flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Relatório Populacional TRIVAX
            </h1>
            <p className="text-xs sm:text-sm text-[#AAB0C6] mt-0.5">
              Consolidação epidemiológica das avaliações respondidas pelos colaboradores.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {/* SELETOR DE UNIDADE */}
            <div className="inline-flex items-center bg-[#080612] p-1 sm:p-1.5 rounded-full border border-[#2B1C58] text-xs font-semibold shadow-inner shrink-0">
              <button
                type="button"
                onClick={() => setAffiliationFilter('ALL')}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition cursor-pointer text-center text-xs whitespace-nowrap font-medium shrink-0 ${
                  affiliationFilter === 'ALL'
                    ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white shadow-md font-bold'
                    : 'text-[#AAB0C6] hover:text-white'
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setAffiliationFilter('DUMAS')}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition cursor-pointer text-center text-xs whitespace-nowrap font-medium shrink-0 ${
                  affiliationFilter === 'DUMAS'
                    ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white shadow-md font-bold'
                    : 'text-[#AAB0C6] hover:text-white'
                }`}
              >
                Dumas
              </button>
              <button
                type="button"
                onClick={() => setAffiliationFilter('ITAPEVI')}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition cursor-pointer text-center text-xs whitespace-nowrap font-medium shrink-0 ${
                  affiliationFilter === 'ITAPEVI'
                    ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white shadow-md font-bold'
                    : 'text-[#AAB0C6] hover:text-white'
                }`}
              >
                Itapevi
              </button>
              <button
                type="button"
                onClick={() => setAffiliationFilter('FORCA_DE_VENDAS')}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition cursor-pointer text-center text-xs whitespace-nowrap font-medium shrink-0 ${
                  affiliationFilter === 'FORCA_DE_VENDAS'
                    ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white shadow-md font-bold'
                    : 'text-[#AAB0C6] hover:text-white'
                }`}
              >
                Força de Vendas
              </button>
            </div>

            {/* BOTÃO EXPORTAR EXCEL MULTI-ABAS */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-[#7B28E2]/30 cursor-pointer hover:opacity-90 active:scale-98 shrink-0 whitespace-nowrap"
              title="Baixar planilha completa organizada em múltiplas abas / páginas no Microsoft Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-white shrink-0" />
              <span>Exportar Excel (.XLSX)</span>
            </button>
          </div>
        </div>

        {/* CARDS DE INDICADORES PRINCIPAIS (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* TOTAL DE AVALIAÇÕES */}
          <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-6 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between text-[#AAB0C6]">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Total de Pessoas</span>
              <Users className="w-5 h-5 text-[#B387F7]" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                {data?.totalRespondents ?? 0}
              </p>
              <p className="text-[11px] sm:text-xs text-[#AAB0C6] mt-0.5">
                Colaboradores avaliados no TRIVAX
              </p>
            </div>
            <div className="pt-2.5 sm:pt-3 border-t border-[#2B1C58] grid grid-cols-3 gap-1 text-center text-[10px] sm:text-[11px] text-[#AAB0C6]">
              <div className="bg-[#1A1336]/60 p-1.5 rounded-lg border border-[#2B1C58]/60">
                <span className="block text-[9px] text-[#AAB0C6] uppercase font-bold">Dumas</span>
                <strong className="text-white text-xs sm:text-sm font-black">{data?.byAffiliation?.dumas ?? 0}</strong>
              </div>
              <div className="bg-[#1A1336]/60 p-1.5 rounded-lg border border-[#2B1C58]/60">
                <span className="block text-[9px] text-[#AAB0C6] uppercase font-bold">Itapevi</span>
                <strong className="text-white text-xs sm:text-sm font-black">{data?.byAffiliation?.itapevi ?? 0}</strong>
              </div>
              <div className="bg-[#1A1336]/60 p-1.5 rounded-lg border border-[#2B1C58]/60">
                <span className="block text-[9px] text-[#AAB0C6] uppercase font-bold truncate">F. Vendas</span>
                <strong className="text-white text-xs sm:text-sm font-black">{data?.byAffiliation?.forcaVendas ?? 0}</strong>
              </div>
            </div>
          </div>

          {/* ELEGÍVEIS COVID-19 */}
          <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-6 shadow-xl space-y-2.5 hover:border-[#2D67FF]/60 transition">
            <div className="flex items-center justify-between text-[#AAB0C6]">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2D67FF]">COVID-19</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#2D67FF]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {data?.vaccineStats?.COVID_19?.count ?? 0}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#2D67FF]">
                  ({data?.vaccineStats?.COVID_19?.percentage ?? 0}%)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#AAB0C6] mt-0.5">
                Comorbidade ou grupo especial
              </p>
            </div>
            <div className="w-full bg-[#080612] h-1.5 sm:h-2 rounded-full overflow-hidden border border-[#2B1C58]">
              <div
                className="bg-[#2D67FF] h-full rounded-full transition-all duration-500"
                style={{ width: `${data?.vaccineStats?.COVID_19?.percentage ?? 0}%` }}
              />
            </div>
          </div>

          {/* ELEGÍVEIS VSR */}
          <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-6 shadow-xl space-y-2.5 hover:border-[#7B28E2]/60 transition">
            <div className="flex items-center justify-between text-[#AAB0C6]">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#B387F7]">VSR</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#7B28E2]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {data?.vaccineStats?.VSR?.count ?? 0}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#B387F7]">
                  ({data?.vaccineStats?.VSR?.percentage ?? 0}%)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#AAB0C6] mt-0.5">
                Gestante ≥24 sem, ≥75a ou 50-74 com risco
              </p>
            </div>
            <div className="w-full bg-[#080612] h-1.5 sm:h-2 rounded-full overflow-hidden border border-[#2B1C58]">
              <div
                className="bg-[#7B28E2] h-full rounded-full transition-all duration-500"
                style={{ width: `${data?.vaccineStats?.VSR?.percentage ?? 0}%` }}
              />
            </div>
          </div>

          {/* ELEGÍVEIS PNEUMO 20 */}
          <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-6 shadow-xl space-y-2.5 hover:border-[#B387F7]/60 transition">
            <div className="flex items-center justify-between text-[#AAB0C6]">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#B387F7]">Pneumo 20</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#B387F7]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {data?.vaccineStats?.PNEUMO_20?.count ?? 0}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#B387F7]">
                  ({data?.vaccineStats?.PNEUMO_20?.percentage ?? 0}%)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#AAB0C6] mt-0.5">
                Universal ≥50a ou 18-49 com risco
              </p>
            </div>
            <div className="w-full bg-[#080612] h-1.5 sm:h-2 rounded-full overflow-hidden border border-[#2B1C58]">
              <div
                className="bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] h-full rounded-full transition-all duration-500"
                style={{ width: `${data?.vaccineStats?.PNEUMO_20?.percentage ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD DE CONHECIMENTO PRÉVIO / CONSCIENTIZAÇÃO */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#7B28E2]/40 p-5 sm:p-8 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#B387F7]">
                Indicador de Conscientização
              </span>
              <h3 className="text-base sm:text-xl font-black text-white flex items-center gap-2 mt-0.5">
                <HelpCircle className="w-5 h-5 text-[#B387F7]" />
                <span>&quot;Você sabia que estava elegível para essas vacinas?&quot;</span>
              </h3>
            </div>
            <span className="text-xs text-[#AAB0C6] font-semibold bg-[#1A1336] px-3 py-1 rounded-full border border-[#2B1C58] w-fit">
              Total de respostas: {data?.awarenessStats?.totalResponses ?? 0}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* SIM */}
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-2">
              <div className="flex justify-between items-center text-xs text-[#AAB0C6]">
                <span className="font-bold text-white">Sim, já sabia</span>
                <span className="text-[#B387F7] font-bold">{data?.awarenessStats?.simPercentage ?? 0}%</span>
              </div>
              <p className="text-2xl font-black text-white">{data?.awarenessStats?.sim ?? 0}</p>
              <div className="w-full bg-[#080612] h-2 rounded-full overflow-hidden border border-[#2B1C58]">
                <div
                  className="bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] h-full rounded-full transition-all duration-500"
                  style={{ width: `${data?.awarenessStats?.simPercentage ?? 0}%` }}
                />
              </div>
            </div>

            {/* NÃO */}
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-2">
              <div className="flex justify-between items-center text-xs text-[#AAB0C6]">
                <span className="font-bold text-white">Não sabia</span>
                <span className="text-[#2D67FF] font-bold">{data?.awarenessStats?.naoPercentage ?? 0}%</span>
              </div>
              <p className="text-2xl font-black text-white">{data?.awarenessStats?.nao ?? 0}</p>
              <div className="w-full bg-[#080612] h-2 rounded-full overflow-hidden border border-[#2B1C58]">
                <div
                  className="bg-[#2D67FF] h-full rounded-full transition-all duration-500"
                  style={{ width: `${data?.awarenessStats?.naoPercentage ?? 0}%` }}
                />
              </div>
            </div>

            {/* PARCIALMENTE */}
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-2">
              <div className="flex justify-between items-center text-xs text-[#AAB0C6]">
                <span className="font-bold text-white">Sabia de algumas</span>
                <span className="text-[#B387F7] font-bold">{data?.awarenessStats?.parcialPercentage ?? 0}%</span>
              </div>
              <p className="text-2xl font-black text-white">{data?.awarenessStats?.parcial ?? 0}</p>
              <div className="w-full bg-[#080612] h-2 rounded-full overflow-hidden border border-[#2B1C58]">
                <div
                  className="bg-[#B387F7] h-full rounded-full transition-all duration-500"
                  style={{ width: `${data?.awarenessStats?.parcialPercentage ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOCO DE ACOMPANHAMENTO PÓS-PESQUISA (E-MAIL DE SEGUIMENTO) */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-8 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B1C58] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MailCheck className="w-5 h-5 text-[#B387F7]" />
                <h2 className="text-base sm:text-lg font-black text-white">
                  Acompanhamento Pós-Pesquisa (Campanha de E-mail)
                </h2>
              </div>
              <p className="text-xs text-[#AAB0C6]">
                Monitoramento das respostas enviadas pelos colaboradores no e-mail de seguimento.
              </p>
            </div>
            <Link
              href="/acompanhamento"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1336] hover:bg-[#251A4F] text-[#B387F7] hover:text-white border border-[#7B28E2]/40 text-xs font-bold transition w-fit"
            >
              <span>Abrir tela pública</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* TOTAL DE RESPOSTAS */}
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1">
              <span className="text-[11px] font-bold text-[#AAB0C6] uppercase">Respostas Totais</span>
              <p className="text-2xl sm:text-3xl font-black text-white">
                {data?.followUpStats?.total ?? 0}
              </p>
              <p className="text-[10px] text-[#AAB0C6]">Recebidas pelo link</p>
            </div>

            {/* JÁ PARTICIPARAM DA TRIVAX */}
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1">
              <span className="text-[11px] font-bold text-[#AAB0C6] uppercase">Já Participaram</span>
              <p className="text-2xl sm:text-3xl font-black text-[#B387F7]">
                {data?.followUpStats?.participatedSim ?? 0}
              </p>
              <p className="text-[10px] text-[#AAB0C6]">
                {data?.followUpStats?.total ? Math.round(((data.followUpStats.participatedSim || 0) / data.followUpStats.total) * 100) : 0}% dos respondentes
              </p>
            </div>

            {/* BUSCARAM CENTRO VACINAL */}
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1">
              <span className="text-[11px] font-bold text-[#AAB0C6] uppercase">Buscaram Vacinação</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                {data?.followUpStats?.soughtCenterSim ?? 0}
              </p>
              <p className="text-[10px] text-[#AAB0C6]">Foram a UBS / rede privada</p>
            </div>

            {/* TAXA DE CONVERSÃO PRÁTICA */}
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1">
              <span className="text-[11px] font-bold text-[#AAB0C6] uppercase">Taxa de Conversão</span>
              <p className="text-2xl sm:text-3xl font-black text-[#2D67FF]">
                {data?.followUpStats?.conversionRate ?? 0}%
              </p>
              <p className="text-[10px] text-[#AAB0C6]">Ida efetiva pós-pesquisa</p>
            </div>
          </div>

          {/* DETALHAMENTO DE DIRECIONAMENTO E CONSCIENTIZAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0D091D] p-3.5 rounded-xl border border-[#2B1C58]/70 flex justify-between items-center">
              <span className="text-[#AAB0C6]">Não participaram antes e receberam convite para avaliar:</span>
              <span className="font-bold text-white bg-[#1A1336] px-2 py-0.5 rounded border border-[#2B1C58]">
                {data?.followUpStats?.participatedNao ?? 0}
              </span>
            </div>

            <div className="bg-[#0D091D] p-3.5 rounded-xl border border-[#2B1C58]/70 flex justify-between items-center">
              <span className="text-[#AAB0C6]">Participaram mas ainda não buscaram (receberam conscientização):</span>
              <span className="font-bold text-amber-400 bg-[#1A1336] px-2 py-0.5 rounded border border-[#2B1C58]">
                {data?.followUpStats?.soughtCenterNao ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* BLOCO: MONITORAMENTO DE CLIQUES NO LOCALIZADOR DE UBS (DE OLHO NA FILA) */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B1C58] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2D67FF] to-[#7B28E2] text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Cliques no Localizador de UBS (De Olho na Fila)
                </h3>
                <p className="text-[11px] sm:text-xs text-[#AAB0C6]">
                  Contabilização em tempo real de pessoas que clicaram para encontrar o posto de vacinação.
                </p>
              </div>
            </div>
            <a
              href="https://deolhonafila.prefeitura.sp.gov.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1336] hover:bg-[#201844] text-[#2D67FF] hover:text-white border border-[#2D67FF]/40 text-xs font-bold transition w-fit"
            >
              <span>Ver site deolhonafila</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1">
              <span className="text-[11px] font-bold text-[#AAB0C6] uppercase">Total Geral de Cliques</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                {data?.ubsClickStats?.total ?? 0}
              </p>
              <p className="text-[10px] text-[#AAB0C6]">Cliques em todos os botões de UBS</p>
            </div>

            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1">
              <span className="text-[11px] font-bold text-[#AAB0C6] uppercase">Pela Tela de Acompanhamento</span>
              <p className="text-2xl sm:text-3xl font-black text-[#B387F7]">
                {data?.ubsClickStats?.bySource?.acompanhamento ?? 0}
              </p>
              <p className="text-[10px] text-[#AAB0C6]">Disparo do e-mail de conscientização</p>
            </div>

            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1">
              <span className="text-[11px] font-bold text-[#AAB0C6] uppercase">Pela Tela de Resultado</span>
              <p className="text-2xl sm:text-3xl font-black text-[#2D67FF]">
                {data?.ubsClickStats?.bySource?.resultado ?? 0}
              </p>
              <p className="text-[10px] text-[#AAB0C6]">Rodapé da página pós-questionário</p>
            </div>

            <div className="bg-[#1A1336] p-4 rounded-2xl border border-[#2B1C58] space-y-1">
              <span className="text-[11px] font-bold text-[#AAB0C6] uppercase">Pelos Cards de Vacina</span>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">
                {data?.ubsClickStats?.bySource?.cardVacina ?? 0}
              </p>
              <p className="text-[10px] text-[#AAB0C6]">Diretamente no card da vacina indicada</p>
            </div>
          </div>
        </div>

        {/* SEÇÕES DE DETALHAMENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* DISTRIBUIÇÃO POR FAIXA ETÁRIA E SEXO */}
          <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between">
            {/* PARTE SUPERIOR: FAIXA ETÁRIA */}
            <div className="space-y-3.5">
              <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#B387F7]" />
                <span>Distribuição por Faixa Etária</span>
              </h3>

              <div className="space-y-2.5 pt-1">
                {[
                  { key: '18_49', label: '18 a 49 anos' },
                  { key: '50_59', label: '50 a 59 anos' },
                  { key: '60_74', label: '60 a 74 anos' },
                  { key: '75_plus', label: '75 anos ou mais' },
                ].map((bracket) => {
                  const count = data?.byAgeBracket?.[bracket.key] ?? 0;
                  const total = data?.totalRespondents || 1;
                  const pct = Math.round((count / total) * 100);

                  return (
                    <div key={bracket.key} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#AAB0C6]">
                        <span>{bracket.label}</span>
                        <span className="text-white">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#080612] h-2 rounded-full overflow-hidden border border-[#2B1C58]">
                        <div
                          className="bg-gradient-to-r from-[#2D67FF] to-[#7B28E2] h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PARTE INFERIOR: DISTRIBUIÇÃO POR SEXO */}
            <div className="pt-5 border-t border-[#2B1C58] space-y-3.5">
              <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2D67FF]" />
                <span>Distribuição por Sexo</span>
              </h3>

              <div className="space-y-2.5 pt-1">
                {/* MULHERES */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#AAB0C6]">
                    <span className="flex items-center gap-1.5 text-white">
                      <span className="w-2 h-2 rounded-full bg-[#7B28E2]" />
                      Feminino (Mulheres)
                    </span>
                    <span className="text-white">
                      {data?.bySex?.feminino ?? 0} ({data?.bySex?.femininoPercentage ?? 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#080612] h-2 rounded-full overflow-hidden border border-[#2B1C58]">
                    <div
                      className="bg-gradient-to-r from-[#7B28E2] to-[#B387F7] h-full rounded-full transition-all duration-500"
                      style={{ width: `${data?.bySex?.femininoPercentage ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* HOMENS */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#AAB0C6]">
                    <span className="flex items-center gap-1.5 text-white">
                      <span className="w-2 h-2 rounded-full bg-[#2D67FF]" />
                      Masculino (Homens)
                    </span>
                    <span className="text-white">
                      {data?.bySex?.masculino ?? 0} ({data?.bySex?.masculinoPercentage ?? 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#080612] h-2 rounded-full overflow-hidden border border-[#2B1C58]">
                    <div
                      className="bg-gradient-to-r from-[#2D67FF] to-[#60A5FA] h-full rounded-full transition-all duration-500"
                      style={{ width: `${data?.bySex?.masculinoPercentage ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* NÃO INFORMADO */}
                {(data?.bySex?.naoInformar ?? 0) > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#AAB0C6]">
                      <span className="flex items-center gap-1.5 text-[#AAB0C6]">
                        <span className="w-2 h-2 rounded-full bg-[#AAB0C6]" />
                        Não informado
                      </span>
                      <span className="text-white">
                        {data?.bySex?.naoInformar ?? 0} ({data?.bySex?.naoInformarPercentage ?? 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#080612] h-2 rounded-full overflow-hidden border border-[#2B1C58]">
                      <div
                        className="bg-[#AAB0C6] h-full rounded-full transition-all duration-500"
                        style={{ width: `${data?.bySex?.naoInformarPercentage ?? 0}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TOP CONDIÇÕES */}
          <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-5 sm:p-8 shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2D67FF]" />
              <span>Fatores de Risco Mais Prevalentes</span>
            </h3>

            {data?.topConditions && data.topConditions.length > 0 ? (
              <div className="space-y-3 pt-1">
                {data?.topConditions?.map((cond) => (
                  <div key={cond.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#AAB0C6]">
                      <span className="truncate max-w-[200px]">{cond.name}</span>
                      <span className="text-white shrink-0">{cond.count} ({cond.percentage}%)</span>
                    </div>
                    <div className="w-full bg-[#080612] h-2 rounded-full overflow-hidden border border-[#2B1C58]">
                      <div
                        className="bg-[#7B28E2] h-full rounded-full"
                        style={{ width: `${cond.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#AAB0C6]">
                Nenhum fator de risco registrado até o momento.
              </div>
            )}
          </div>
        </div>

        {/* TABELA DE SUBMISSÕES RECENTES COM SCROLL MOBILE SUAVE */}
        <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-[#2B1C58] flex items-center justify-between gap-2">
            <div>
              <h3 className="font-black text-white text-sm sm:text-base">
                Últimas Avaliações
              </h3>
              <p className="text-[11px] sm:text-xs text-[#AAB0C6]">
                Registros salvos anonimamente no sistema TRIVAX.
              </p>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#B387F7] bg-[#1F1545] px-2.5 py-1 rounded-full border border-[#7B28E2]/40 whitespace-nowrap">
              Total: {data?.totalRespondents ?? 0}
            </span>
          </div>

          {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#F2F3F7] min-w-[650px]">
                <thead className="bg-[#0D091D] text-[#AAB0C6] uppercase tracking-wider font-bold border-b border-[#2B1C58]">
                  <tr>
                    <th className="py-3 px-3 sm:px-4">Data/Hora</th>
                    <th className="py-3 px-3 sm:px-4">Unidade</th>
                    <th className="py-3 px-3 sm:px-4">Faixa Etária</th>
                    <th className="py-3 px-3 sm:px-4">Sexo</th>
                    <th className="py-3 px-3 sm:px-4">Vacinas Indicadas</th>
                    <th className="py-3 px-3 sm:px-4">Sabia da Elegibilidade?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B1C58]/60">
                  {data?.recentSubmissions?.map((sub) => {
                    const dateFormatted = new Date(sub.timestamp).toLocaleString('pt-BR');
                    return (
                      <tr key={sub.id} className="hover:bg-[#1A1336]/60 transition">
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono text-[#AAB0C6] text-[11px]">
                          {dateFormatted}
                        </td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-white">
                          {sub.user_affiliation === 'DUMAS' || sub.user_affiliation === 'PFIZER'
                            ? 'Dumas'
                            : sub.user_affiliation === 'ITAPEVI'
                            ? 'Itapevi'
                            : sub.user_affiliation === 'FORCA_DE_VENDAS'
                            ? 'Força de Vendas'
                            : sub.user_affiliation || 'Não informado'}
                        </td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-[#AAB0C6]">
                          {sub.age_bracket === '18_49'
                            ? '18 a 49 anos'
                            : sub.age_bracket === '50_59'
                            ? '50 a 59 anos'
                            : sub.age_bracket === '60_74'
                            ? '60 a 74 anos'
                            : '75 anos ou mais'}
                        </td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-[#AAB0C6]">
                          {sub.sex === 'FEMININO'
                            ? 'Feminino'
                            : sub.sex === 'MASCULINO'
                            ? 'Masculino'
                            : 'Não informado'}
                        </td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                          <div className="flex gap-1 flex-wrap">
                            {sub.vaccines.length > 0 ? (
                              sub.vaccines.map((v) => (
                                <span
                                  key={v}
                                  className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                                    v === 'COVID_19'
                                      ? 'bg-[#2D67FF]/20 text-[#2D67FF] border border-[#2D67FF]/40'
                                      : v === 'VSR'
                                      ? 'bg-[#7B28E2]/20 text-[#B387F7] border border-[#7B28E2]/40'
                                      : 'bg-[#B387F7]/20 text-[#B387F7] border border-[#B387F7]/40'
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
                              <span className="text-[#AAB0C6] italic text-[11px]">Nenhuma</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                          {sub.awareness_feedback === 'SIM' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                              <CheckCircle2 className="w-3 h-3" />
                              Sim, já sabia
                            </span>
                          ) : sub.awareness_feedback === 'NAO' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/60">
                              <AlertCircle className="w-3 h-3" />
                              Não sabia
                            </span>
                          ) : sub.awareness_feedback === 'PARCIAL' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B387F7] bg-[#1F1545] px-2.5 py-0.5 rounded-full border border-[#7B28E2]/40">
                              Sabia de algumas
                            </span>
                          ) : (
                            <span className="text-[#AAB0C6]/60 italic text-[10px]">
                              Pendente
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#AAB0C6]">
              Nenhuma avaliação registrada ainda. Complete o questionário para ver os dados aqui!
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE AUTENTICAÇÃO COM SENHA E TELA 100% BORRADA */}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080612]/85 backdrop-blur-2xl animate-fadeIn">
          <div className="max-w-sm w-full bg-[#120E24] border border-[#7B28E2]/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 relative overflow-hidden">
            {/* GLOW DECORATIVO NO MODAL */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#7B28E2]/30 blur-2xl pointer-events-none -z-10" />

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7B28E2]/30 to-[#2D67FF]/30 border border-[#7B28E2]/50 flex items-center justify-center mx-auto text-[#B387F7] shadow-lg shadow-[#7B28E2]/25">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-white">
                Acesso Restrito
              </h2>
              <p className="text-xs text-[#AAB0C6] leading-relaxed">
                Painel administrativo confidencial TRIVAX. Digite a senha de acesso para visualizar as métricas.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5 pt-1">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Digite a senha..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  className={`w-full text-center tracking-widest font-mono text-base px-4 py-3 rounded-2xl bg-[#1A1336] border transition outline-none text-white placeholder:text-[#6F768E] placeholder:tracking-normal ${
                    authError 
                      ? 'border-rose-500 ring-2 ring-rose-500/30' 
                      : 'border-[#2B1C58] focus:border-[#7B28E2] focus:ring-2 focus:ring-[#7B28E2]/40'
                  }`}
                />
                {authError && (
                  <p className="text-xs font-semibold text-rose-400 mt-2 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Senha incorreta. Tente novamente.</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#7B28E2] via-[#5F30EB] to-[#2D67FF] text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-[#7B28E2]/30 cursor-pointer active:scale-98"
              >
                Entrar no Painel
              </button>
            </form>

            <div className="pt-1">
              <Link
                href="/"
                className="text-xs text-[#AAB0C6] hover:text-white transition inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar à página inicial</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
