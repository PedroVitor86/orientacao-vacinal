'use client';

import React from 'react';
import { CheckCircle, Info } from 'lucide-react';
import { EvaluationResult } from '../types';

interface VaccineResultCardProps {
  result: EvaluationResult;
}

export const VaccineResultCard: React.FC<VaccineResultCardProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-purple-200 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200 rounded-md mb-1">
              Potencialmente Elegível
            </span>
            <h3 className="text-xl font-extrabold text-slate-950 leading-tight">
              {result.vaccine_name}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <Info className="w-3.5 h-3.5 text-purple-600" />
          <span>Critérios e Motivos Identificados no seu Perfil:</span>
        </h4>

        {result.reasons.length > 0 ? (
          <ul className="space-y-2">
            {result.reasons.map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-slate-800 bg-purple-50/40 p-3 rounded-xl border border-purple-100"
              >
                <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-1.5" />
                <span className="leading-snug font-medium">{reason.description}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-500 italic">Critério clínico atendido conforme faixas de recomendação.</p>
        )}
      </div>
    </div>
  );
};
