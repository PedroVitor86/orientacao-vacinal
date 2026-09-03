'use client';

import React, { useState } from 'react';
import { Check, Calculator } from 'lucide-react';
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

  // Estados da calculadora de IMC integrada para a pergunta de Obesidade
  const [showBmiCalculator, setShowBmiCalculator] = useState(
    question.id === 'q-obesidade' && (facts.morbid_obesity_selection === 'NAO_SEI' || !!facts.calculated_bmi)
  );
  const [calcWeight, setCalcWeight] = useState<string>(facts.user_weight || '');
  const [calcHeight, setCalcHeight] = useState<string>(facts.user_height || '');

  const handleCalculateBmi = (wStr: string, hStr: string) => {
    const w = parseFloat(wStr.replace(',', '.'));
    let h = parseFloat(hStr.replace(',', '.'));
    if (!w || !h || isNaN(w) || isNaN(h)) return;
    if (h > 3) h = h / 100; // Converte cm para metros se digitado ex: 170
    if (h <= 0.5 || h > 2.8 || w < 20 || w > 400) return;

    const bmi = w / (h * h);
    const roundedBmi = Number(bmi.toFixed(1));

    onFactChange('calculated_bmi', roundedBmi);
    onFactChange('user_weight', wStr);
    onFactChange('user_height', hStr);

    if (roundedBmi >= 40) {
      if (onObesityChange) onObesityChange('SIM');
    } else {
      if (onObesityChange) onObesityChange('NAO');
    }
  };

  const onWeightChange = (val: string) => {
    setCalcWeight(val);
    handleCalculateBmi(val, calcHeight);
  };

  const onHeightChange = (val: string) => {
    setCalcHeight(val);
    handleCalculateBmi(calcWeight, val);
  };

  const getComputedBmi = () => {
    const w = parseFloat(calcWeight.replace(',', '.'));
    let h = parseFloat(calcHeight.replace(',', '.'));
    if (!w || !h || isNaN(w) || isNaN(h)) return null;
    if (h > 3) h = h / 100;
    if (h <= 0.5 || h > 2.8 || w < 20 || w > 400) return null;
    return Number((w / (h * h)).toFixed(1));
  };
  const computedBmi = getComputedBmi();

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
                  } else if (question.id === 'q-obesidade') {
                    if (opt.value === 'NAO_SEI') {
                      setShowBmiCalculator(true);
                      if (onObesityChange) onObesityChange('NAO_SEI');
                    } else {
                      setShowBmiCalculator(false);
                      if (onObesityChange) onObesityChange(opt.value as any);
                    }
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

      {/* CALCULADORA DE IMC EMBUTIDA (QUANDO SELECIONA NÃO SEI INFORMAR) */}
      {question.id === 'q-obesidade' && (showBmiCalculator || currentValue === 'NAO_SEI') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1A1336]/90 border border-[#7B28E2]/50 space-y-3.5 animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
              <Calculator className="w-4 h-4 text-[#B387F7]" />
              <span>Calculadora de IMC Integrada</span>
            </div>
            {computedBmi !== null && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                computedBmi >= 40 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {computedBmi >= 40 ? 'IMC ≥ 40 (Acima)' : 'IMC < 40 (Abaixo)'}
              </span>
            )}
          </div>

          <p className="text-[11px] sm:text-xs text-[#AAB0C6] leading-relaxed">
            Digite seu peso e altura para calcularmos se seu IMC está acima ou abaixo de 40:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#AAB0C6] mb-1">
                Peso corporal (kg)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ex: 85 ou 105"
                value={calcWeight}
                onChange={(e) => onWeightChange(e.target.value)}
                className="w-full bg-[#120E24] border border-[#2B1C58] focus:border-[#7B28E2] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#6F768E] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#AAB0C6] mb-1">
                Altura (cm ou metros)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ex: 170 ou 1,70"
                value={calcHeight}
                onChange={(e) => onHeightChange(e.target.value)}
                className="w-full bg-[#120E24] border border-[#2B1C58] focus:border-[#7B28E2] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#6F768E] outline-none transition"
              />
            </div>
          </div>

          {/* MENSAGEM DINÂMICA DE RESULTADO */}
          {computedBmi !== null ? (
            <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 transition animate-fadeIn ${
              computedBmi >= 40
                ? 'bg-[#2E1235]/90 border-[#7B28E2]'
                : 'bg-[#121B38]/90 border-[#2D67FF]'
            }`}>
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    IMC Calculado: <strong className="text-base sm:text-lg text-white font-black">{computedBmi}</strong>
                  </span>
                  <span className={`text-[11px] font-extrabold ${computedBmi >= 40 ? 'text-[#B387F7]' : 'text-[#2D67FF]'}`}>
                    ({computedBmi >= 40 ? 'Igual ou superior a 40' : 'Abaixo de 40'})
                  </span>
                </div>
                <p className="text-[11px] text-[#AAB0C6]">
                  {computedBmi >= 40
                    ? 'Seu IMC é ≥ 40 (Obesidade Grau 3). Sua resposta acima foi preenchida como "SIM".'
                    : 'Seu IMC está abaixo de 40. Sua resposta acima foi preenchida como "NÃO".'}
                </p>
              </div>

              <div className={`self-start sm:self-center shrink-0 px-3 py-1.5 rounded-lg font-black text-xs sm:text-sm border shadow-md ${
                computedBmi >= 40
                  ? 'bg-[#7B28E2] text-white border-white/20'
                  : 'bg-[#2D67FF] text-white border-white/20'
              }`}>
                {computedBmi >= 40 ? 'Resposta: SIM' : 'Resposta: NÃO'}
              </div>
            </div>
          ) : (calcWeight || calcHeight) ? (
            <p className="text-[11px] text-[#B387F7] italic">
              Preencha o peso e a altura para calcularmos o resultado.
            </p>
          ) : null}
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
                <div
                  key={item.fact_key}
                  className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition duration-200 ${
                    isChecked
                      ? 'bg-[#24174D] border-[#7B28E2] text-white ring-1 ring-[#7B28E2]/40 shadow-sm'
                      : 'bg-[#1A1336]/80 border-[#2B1C58] hover:bg-[#201844] text-[#F2F3F7] hover:border-[#7B28E2]/30'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (onMultiCheckboxChange) {
                          onMultiCheckboxChange(item.fact_key, e.target.checked, question.none_key);
                        } else {
                          onFactChange(item.fact_key, e.target.checked);
                        }
                        if (!e.target.checked && item.sub_status_key) {
                          onFactChange(item.sub_status_key, null);
                        }
                      }}
                      className="w-4 h-4 rounded text-[#7B28E2] focus:ring-[#7B28E2] border-[#2B1C58] bg-[#080612] shrink-0 transition"
                    />
                    <span className="text-xs sm:text-sm font-medium leading-snug">{item.label}</span>
                  </label>

                  {/* STATUS DO TRATAMENTO (PREGRESSO, ATUAL, EM PLANEJAMENTO) */}
                  {isChecked && item.sub_status_key && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#7B28E2]/30 space-y-1.5 animate-fadeIn">
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#B387F7] uppercase tracking-wider block">
                        Status do Tratamento:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {[
                          { label: 'Pregresso', value: 'PREGRESSO' },
                          { label: 'Atual', value: 'ATUAL' },
                          { label: 'Em planejamento', value: 'EM_PLANEJAMENTO' },
                        ].map((statusOpt) => {
                          const isStatusSelected = facts[item.sub_status_key!] === statusOpt.value;
                          return (
                            <button
                              key={statusOpt.value}
                              type="button"
                              onClick={() => onFactChange(item.sub_status_key!, statusOpt.value)}
                              className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold text-center transition cursor-pointer border ${
                                isStatusSelected
                                  ? 'bg-gradient-to-r from-[#7B28E2] to-[#2D67FF] text-white border-transparent shadow-md shadow-[#7B28E2]/40 ring-1 ring-white/20'
                                  : 'bg-[#120E24] hover:bg-[#1C143B] text-[#AAB0C6] hover:text-white border-[#2B1C58]'
                              }`}
                            >
                              {statusOpt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
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
