'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { QuestionItem } from '../types';

interface QuestionCardProps {
  question: QuestionItem;
  displayNumber?: number | null;
  facts: Record<string, any>;
  onFactChange: (key: string, value: any) => void;
  onAgeBracketChange?: (bracket: string) => void;
  onObesityChange?: (value: 'SIM' | 'NAO' | 'NAO_SEI') => void;
  onMultiCheckboxChange?: (factKey: string, checked: boolean, noneKey?: string) => void;
  onNoneChange?: (noneKey: string, itemKeys: string[]) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  displayNumber,
  facts,
  onFactChange,
  onAgeBracketChange,
  onObesityChange,
  onMultiCheckboxChange,
  onNoneChange,
}) => {
  const currentValue = question.fact_key ? facts[question.fact_key] : undefined;

  // Determina o número a exibir (100% dinâmico e sequencial)
  const renderNumberPrefix = () => {
    if (typeof displayNumber === 'number' && displayNumber > 0) {
      return `${displayNumber}. `;
    }
    return '';
  };

  return (
    <div className="bg-[#120E24]/90 rounded-2xl sm:rounded-3xl border border-[#2B1C58] p-4 sm:p-7 shadow-xl hover:border-[#7B28E2]/50 transition duration-200 space-y-3.5 sm:space-y-4">
      {/* CABEÇALHO DA PERGUNTA */}
      <div className="space-y-1">
        {question.subtitle && (
          <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B387F7] bg-[#1F1545] border border-[#7B28E2]/30 px-2.5 py-0.5 rounded-full mb-1">
            {question.subtitle}
          </span>
        )}
        <h3 className="text-sm sm:text-lg font-extrabold text-white leading-snug">
          {renderNumberPrefix()}
          {question.label}
          {question.required && <span className="text-[#B387F7] text-xs ml-1">*</span>}
        </h3>
        {question.help_text && (
          <p className="text-[11px] sm:text-xs text-[#AAB0C6] leading-relaxed">
            {question.help_text}
          </p>
        )}
      </div>

      {/* TIPO: RADIO (Ex: Colega Pfizer/Itapevi, Idade em faixas, Sexo, IMC) */}
      {question.type === 'radio' && question.options && (
        <div
          className={`grid gap-2 sm:gap-3 ${
            question.options.length <= 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : question.options.length <= 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
        >
          {question.options.map((opt) => {
            const isSelected = currentValue === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (question.id === 'q-age' && onAgeBracketChange) {
                    onAgeBracketChange(opt.value);
                  } else if (question.id === 'q-obesidade' && onObesityChange) {
                    onObesityChange(opt.value);
                  } else if (question.fact_key) {
                    onFactChange(question.fact_key, opt.value);
                  }
                }}
                className={`min-h-[46px] px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-semibold text-left transition duration-200 flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? 'bg-[#24174D] border-[#7B28E2] text-white ring-2 ring-[#7B28E2]/40 shadow-lg shadow-[#7B28E2]/20'
                    : 'bg-[#1A1336]/80 border-[#2B1C58] hover:bg-[#201844] text-[#F2F3F7] hover:border-[#7B28E2]/40'
                }`}
              >
                <span className="leading-snug">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#B387F7] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}

      {/* TIPO: BOTÕES BOOLEANOS (Sim / Não) - Otimizado para Toque no Celular */}
      {question.type === 'boolean_buttons' && question.fact_key && (
        <div className="grid grid-cols-2 sm:flex gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onFactChange(question.fact_key!, true)}
            className={`min-h-[44px] sm:w-32 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold transition cursor-pointer text-center active:scale-[0.98] ${
              currentValue === true
                ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white border-transparent shadow-lg shadow-[#7B28E2]/30'
                : 'bg-[#1A1336] text-[#AAB0C6] border-[#2B1C58] hover:text-white hover:bg-[#201844]'
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => onFactChange(question.fact_key!, false)}
            className={`min-h-[44px] sm:w-32 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold transition cursor-pointer text-center active:scale-[0.98] ${
              currentValue === false
                ? 'bg-[#24174D] text-white border-[#7B28E2] shadow-sm'
                : 'bg-[#1A1336] text-[#AAB0C6] border-[#2B1C58] hover:text-white hover:bg-[#201844]'
            }`}
          >
            Não
          </button>
        </div>
      )}

      {/* TIPO: MULTI CHECKBOX GROUP (Com Nenhuma das opções) */}
      {question.type === 'multi_checkbox_group' && question.items && (
        <div className="space-y-2 pt-0.5">
          <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
            {question.items.map((item) => {
              const isChecked = !!facts[item.fact_key];
              return (
                <label
                  key={item.fact_key}
                  className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition cursor-pointer select-none active:scale-[0.99] ${
                    isChecked
                      ? 'bg-[#24174D] border-[#7B28E2] text-white ring-1 ring-[#7B28E2]/40 shadow-sm'
                      : 'bg-[#1A1336]/80 border-[#2B1C58] hover:bg-[#201844] text-[#F2F3F7] hover:border-[#7B28E2]/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (onMultiCheckboxChange) {
                        onMultiCheckboxChange(item.fact_key, e.target.checked, question.none_key);
                      } else {
                        onFactChange(item.fact_key, e.target.checked);
                      }
                    }}
                    className="w-4 h-4 rounded text-[#7B28E2] focus:ring-[#7B28E2] border-[#2B1C58] bg-[#080612] shrink-0 transition"
                  />
                  <span className="text-xs sm:text-sm font-medium leading-snug">{item.label}</span>
                </label>
              );
            })}

            {/* OPÇÃO "NENHUMA DAS OPÇÕES" */}
            {question.none_key && (
              <label
                className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition cursor-pointer select-none active:scale-[0.99] ${
                  facts[question.none_key]
                    ? 'bg-[#0D091D] border-[#7B28E2]/60 text-white font-bold'
                    : 'bg-[#0F0A21]/60 border-[#2B1C58] hover:bg-[#1A1336] text-[#AAB0C6] italic'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!facts[question.none_key]}
                  onChange={() => {
                    const allKeys = question.items!.map((i) => i.fact_key);
                    if (onNoneChange) {
                      onNoneChange(question.none_key!, allKeys);
                    }
                  }}
                  className="w-4 h-4 rounded text-[#B387F7] focus:ring-[#7B28E2] border-[#2B1C58] bg-[#080612] shrink-0 transition"
                />
                <span className="text-xs sm:text-sm">Nenhuma das opções</span>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
