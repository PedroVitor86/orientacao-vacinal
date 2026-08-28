import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QUESTIONNAIRE_SECTIONS } from '../config/questions';
import { QuestionSection, EvaluationResult } from '../types';

interface QuizState {
  facts: Record<string, any>;
  currentStepIndex: number;
  results: EvaluationResult[] | null;
  
  // Ações
  setFact: (key: string, value: any) => void;
  toggleFact: (key: string) => void;
  setAgeBracket: (bracket: string) => void;
  setObesitySelection: (value: 'SIM' | 'NAO' | 'NAO_SEI') => void;
  setMultiCheckboxItem: (factKey: string, checked: boolean, noneKey?: string) => void;
  setNoneSelected: (noneKey: string, itemKeys: string[]) => void;
  setResults: (results: EvaluationResult[]) => void;
  goToNextStep: () => boolean; // retorna true se completou
  goToPrevStep: () => void;
  resetQuiz: () => void;
  
  // Helpers calculados
  getVisibleSections: () => QuestionSection[];
  getCurrentSection: () => QuestionSection | undefined;
  getProgressPercentage: () => number;
  getSafeStepIndex: () => number;
}

function checkVisibility(condition: any, facts: Record<string, any>): boolean {
  if (!condition) return true;
  const factValue = facts[condition.fact];
  if (condition.operator === 'equal') return factValue === condition.value;
  if (condition.operator === 'notEqual') return factValue !== condition.value;
  if (condition.operator === 'greaterThanInclusive') return Number(factValue) >= Number(condition.value);
  return true;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      facts: {},
      currentStepIndex: 0,
      results: null,

      setFact: (key, value) => {
        set((state) => {
          const updated = { ...state.facts, [key]: value };
          
          // Se o sexo mudar e não for Feminino, limpa fatos de gestação
          if (key === 'sex' && value !== 'FEMININO') {
            delete updated.is_pregnant;
            delete updated.pregnancy_weeks_32_36;
            delete updated.is_postpartum;
          }

          // Se desmarcar gestante, limpa semana 32-36
          if (key === 'is_pregnant' && value === false) {
            delete updated.pregnancy_weeks_32_36;
          }

          return { facts: updated };
        });
      },

      setAgeBracket: (bracket) => {
        let mappedAge = 30;
        if (bracket === '18_49') mappedAge = 30;
        else if (bracket === '50_59') mappedAge = 55;
        else if (bracket === '60_74') mappedAge = 65;
        else if (bracket === '75_plus') mappedAge = 75;

        set((state) => ({
          facts: {
            ...state.facts,
            age_bracket: bracket,
            age: mappedAge,
          },
        }));
      },

      setObesitySelection: (value) => {
        set((state) => ({
          facts: {
            ...state.facts,
            morbid_obesity_selection: value,
            has_morbid_obesity_bmi_40: value === 'SIM',
          },
        }));
      },

      setMultiCheckboxItem: (factKey, checked, noneKey) => {
        set((state) => {
          const updated = { ...state.facts, [factKey]: checked };
          if (checked && noneKey) {
            updated[noneKey] = false;
          }
          return { facts: updated };
        });
      },

      setNoneSelected: (noneKey, itemKeys) => {
        set((state) => {
          const updated = { ...state.facts, [noneKey]: true };
          for (const key of itemKeys) {
            updated[key] = false;
          }
          return { facts: updated };
        });
      },

      toggleFact: (key) => {
        set((state) => ({
          facts: {
            ...state.facts,
            [key]: !state.facts[key],
          },
        }));
      },

      setResults: (results) => set({ results }),

      getVisibleSections: () => {
        const { facts } = get();
        return QUESTIONNAIRE_SECTIONS.filter((sec) =>
          checkVisibility(sec.visibility_condition, facts)
        );
      },

      getSafeStepIndex: () => {
        const visible = get().getVisibleSections();
        if (visible.length === 0) return 0;
        const current = get().currentStepIndex;
        if (current >= visible.length || current < 0) {
          return 0;
        }
        return current;
      },

      getCurrentSection: () => {
        const visible = get().getVisibleSections();
        const safeIndex = get().getSafeStepIndex();
        return visible[safeIndex] || visible[0];
      },

      getProgressPercentage: () => {
        const visible = get().getVisibleSections();
        if (visible.length === 0) return 0;
        const safeIndex = get().getSafeStepIndex();
        return Math.round(((safeIndex + 1) / visible.length) * 100);
      },

      goToNextStep: () => {
        const visible = get().getVisibleSections();
        const safeIndex = get().getSafeStepIndex();
        const nextIndex = safeIndex + 1;
        if (nextIndex >= visible.length) {
          return true; // Chegou ao fim
        }
        set({ currentStepIndex: nextIndex });
        return false;
      },

      goToPrevStep: () => {
        const safeIndex = get().getSafeStepIndex();
        set({
          currentStepIndex: Math.max(0, safeIndex - 1),
        });
      },

      resetQuiz: () => {
        set({
          facts: {},
          currentStepIndex: 0,
          results: null,
        });
      },
    }),
    {
      name: 'vacina-adulto-quiz-v2', // Nova versão limpa o cache antigo
    }
  )
);
