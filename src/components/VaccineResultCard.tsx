'use client';

import React from 'react';
import { CheckCircle2, Info, Sparkles, MapPin, ExternalLink, HeartHandshake } from 'lucide-react';
import { EvaluationResult } from '../types';

interface VaccineResultCardProps {
  result: EvaluationResult;
}

export const VaccineResultCard: React.FC<VaccineResultCardProps> = ({ result }) => {
  return (
    <div className="bg-[#120E24] rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-4 sm:p-7 shadow-xl hover:border-[#7B28E2]/60 hover:shadow-[#7B28E2]/10 transition duration-300 space-y-4 sm:space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#7B28E2] to-[#2D67FF] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#7B28E2]/40 mt-0.5 sm:mt-0">
            <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#1F1545] text-[#B387F7] border border-[#7B28E2]/40 rounded-full mb-1">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#B387F7]" />
              Potencialmente Elegível
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
              {result.vaccine_name}
            </h3>
          </div>
        </div>
      </div>

      <div className="pt-3 sm:pt-4 border-t border-[#2B1C58]/60 space-y-2.5 sm:space-y-3">
        <h4 className="text-[11px] sm:text-xs font-bold text-[#AAB0C6] uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#B387F7] shrink-0" />
          <span>Critérios Clínicos Identificados:</span>
        </h4>

        {result.reasons.length > 0 ? (
          <ul className="space-y-2">
            {result.reasons.map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#F2F3F7] bg-[#1A1336]/80 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-[#2B1C58]"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] shrink-0 mt-1.5 shadow-xs" />
                <span className="leading-relaxed font-medium">{reason.description}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[#AAB0C6] italic">Critério de rotina atendido conforme faixa de recomendação.</p>
        )}
      </div>

      {/* DIRECIONAMENTO: LOCALIZAR UBS + CUIDAMOS JUNTOS E TEXTO ABAIXO */}
      <div className="pt-3 sm:pt-4 border-t border-[#2B1C58]/40 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
          <a
            href="https://deolhonafila.prefeitura.sp.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1336] hover:bg-[#251A4F] border border-[#2D67FF]/50 text-white text-xs font-bold transition group shadow-md hover:border-[#2D67FF]"
          >
            <MapPin className="w-3.5 h-3.5 text-[#2D67FF] group-hover:scale-110 transition" />
            <span>Localizar UBS mais próxima para vacinação</span>
            <ExternalLink className="w-3 h-3 text-[#AAB0C6]" />
          </a>

          <a
            href="https://cuidamosjuntos.pfizer.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1336] hover:bg-[#251A4F] border border-[#7B28E2]/50 text-white text-xs font-bold transition group shadow-md hover:border-[#7B28E2]"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#B387F7] group-hover:scale-110 transition" />
            <span>Saiba mais no portal Cuidamos Juntos</span>
            <ExternalLink className="w-3 h-3 text-[#AAB0C6]" />
          </a>
        </div>

        <p className="text-[11px] sm:text-xs text-[#AAB0C6]">
          Apresente sua caderneta em um centro de imunização ou consulte seu médico.
        </p>
      </div>
    </div>
  );
};
