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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-purple-300 transition space-y-4">
      {/* CABEÇALHO DA PERGUNTA */}
      <div className="space-y-1">
        {question.subtitle && (
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-md">
            {question.subtitle}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
          {renderNumberPrefix()}
          {question.label}
          {question.required && <span className="text-purple-600 text-xs ml-1">*</span>}
        </h3>
        {question.help_text && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {question.help_text}
          </p>
        )}
      </div>

      {/* TIPO: RADIO (Ex: Colega Pfizer/Itapevi, Idade em faixas, Sexo, IMC) */}
      {question.type === 'radio' && question.options && (
        <div
          className={`grid gap-2.5 ${
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
                className={`px-4 py-3 rounded-xl border text-sm font-semibold text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50/80 border-purple-600 text-purple-950 ring-2 ring-purple-500/25 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* TIPO: BOTÕES BOOLEANOS (Sim / Não) */}
      {question.type === 'boolean_buttons' && question.fact_key && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onFactChange(question.fact_key!, true)}
            className={`flex-1 sm:flex-none sm:w-32 py-2.5 px-5 rounded-xl border text-sm font-bold transition cursor-pointer text-center ${
              currentValue === true
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-xs shadow-purple-500/25'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => onFactChange(question.fact_key!, false)}
            className={`flex-1 sm:flex-none sm:w-32 py-2.5 px-5 rounded-xl border text-sm font-bold transition cursor-pointer text-center ${
              currentValue === false
                ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Não
          </button>
        </div>
      )}

      {/* TIPO: MULTI CHECKBOX GROUP (Com Nenhuma das opções) */}
      {question.type === 'multi_checkbox_group' && question.items && (
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-1 gap-2">
            {question.items.map((item) => {
              const isChecked = !!facts[item.fact_key];
              return (
                <label
                  key={item.fact_key}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                    isChecked
                      ? 'bg-purple-50/70 border-purple-400 text-purple-950 ring-1 ring-purple-400/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
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
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 transition"
                  />
                  <span className="text-sm font-medium leading-snug">{item.label}</span>
                </label>
              );
            })}

            {/* OPÇÃO "NENHUMA DAS OPÇÕES" */}
            {question.none_key && (
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                  facts[question.none_key]
                    ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-500 italic'
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
                  className="w-4 h-4 rounded text-purple-500 focus:ring-purple-500 border-slate-400 transition"
                />
                <span className="text-sm">Nenhuma das opções</span>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
