'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ArrowRight, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-12">
        {/* HERO SECTION */}
        <section className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Motor Clínico de Elegibilidade Vacinal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Descubra as vacinas recomendadas para o seu{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              perfil de saúde
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-700 text-base sm:text-lg leading-relaxed">
            Responda a um questionário rápido sobre sua faixa etária, hábitos e condições de saúde. Nosso sistema avalia automaticamente os critérios técnicos e indica as imunizações potencialmente recomendadas para você.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/questionario"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base hover:opacity-95 transition shadow-lg shadow-purple-500/25 cursor-pointer"
            >
              <span>Iniciar Questionário</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 text-xs font-medium text-slate-600 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              100% Confidencial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Diretrizes PNI e SBIm
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              Apenas 3 a 5 minutos
            </span>
          </div>
        </section>

        {/* VACINAS COBERTAS NESTE MÓDULO */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Vacinas Avaliadas pelo Sistema
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              O motor de regras analisa a sua elegibilidade individual para três importantes imunizantes adultos:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* COVID-19 */}
            <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-2.5 hover:border-blue-300 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-blue-500/30">
                1
              </div>
              <h3 className="font-bold text-slate-950 text-base">Vacina contra COVID-19</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Avaliação de doses de reforço para grupos prioritários, gestantes/puérperas e portadores de comorbidades crônicas.
              </p>
            </div>

            {/* VSR */}
            <div className="p-5 rounded-2xl border border-purple-100 bg-purple-50/40 space-y-2.5 hover:border-purple-300 transition">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-purple-500/30">
                2
              </div>
              <h3 className="font-bold text-slate-950 text-base">Vacina contra VSR</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Proteção neonatal via vacinação de gestantes (32-36 semanas) e prevenção de infecções graves em idosos e doentes crônicos.
              </p>
            </div>

            {/* PNEUMO 20 */}
            <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-2.5 hover:border-indigo-300 transition">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-indigo-500/30">
                3
              </div>
              <h3 className="font-bold text-slate-950 text-base">Vacina Pneumocócica 20-valente</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recomendação universal a partir de 50 anos ou a partir de 18 anos com doenças crônicas, tabagismo ou fatores de risco.
              </p>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2.5 hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-950">1. Você responde</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Você não seleciona vacinas. Apenas informa faixa etária, hábitos e condições de saúde com total sigilo.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2.5 hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-950">2. O sistema analisa</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nosso motor lógico cruza suas respostas com as notas técnicas e matrizes de elegibilidade oficiais.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2.5 hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-bold text-slate-950">3. Relatório orientativo</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receba a indicação de vacinas potencialmente elegíveis e os motivos clínicos para levar ao seu médico.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
