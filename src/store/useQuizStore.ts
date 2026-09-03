import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QUESTIONNAIRE_SECTIONS } from '../config/questions';
import { QuestionSection, EvaluationResult } from '../types';

interface QuizState {
  facts: Record<string, any>;
  currentStepIndex: number;
  results: EvaluationResult[] | null;
  lastSubmissionId: string | null;
  awarenessFeedback: string | null;
  
  // Ações
  setFact: (key: string, value: any) => void;
  toggleFact: (key: string) => void;
  setAgeBracket: (bracket: string) => void;
  setObesitySelection: (value: 'SIM' | 'NAO' | 'NAO_SEI') => void;
  setMultiCheckboxItem: (factKey: string, checked: boolean, noneKey?: string) => void;
  setNoneSelected: (noneKey: string, itemKeys: string[]) => void;
  setResults: (results: EvaluationResult[]) => void;
  setLastSubmissionId: (id: string | null) => void;
  setAwarenessFeedback: (feedback: string | null) => void;
  cardUpdatedFeedback: string | null;
  setCardUpdatedFeedback: (feedback: string | null) => void;
  goToNextStep: () => boolean; // retorna true se completou
  goToPrevStep: () => void;
  resetQuiz: () => void;
  
  // Helpers calculados
  getVisibleSections: () => QuestionSection[];
  getCurrentSection: () => QuestionSection | undefined;
  getProgressPercentage: () => number;
  getSafeStepIndex: () => number;
}

export function checkVisibility(condition: any, facts: Record<string, any>): boolean {
  if (!condition) return true;
  if (condition.any_of && Array.isArray(condition.any_of)) {
    return condition.any_of.some((k: string) => !!facts[k]);
  }
  const factValue = facts[condition.fact];
  if (condition.operator === 'equal') return factValue === condition.value;
  if (condition.operator === 'notEqual') return factValue !== condition.value;
  if (condition.operator === 'greaterThanInclusive') return Number(factValue) >= Number(condition.value);
  if (condition.operator === 'in') {
    return Array.isArray(condition.value) ? condition.value.includes(factValue) : false;
  }
  return true;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      facts: {},
      currentStepIndex: 0,
      results: null,
      lastSubmissionId: null,
      awarenessFeedback: null,
      cardUpdatedFeedback: null,

      setFact: (key, value) => {
        set((state) => {
          const updated = { ...state.facts, [key]: value };
          
          // Se o sexo mudar para Masculino, limpa fatos de gestação
          if (key === 'sex' && value === 'MASCULINO') {
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

      toggleFact: (key) => {
        const current = !!get().facts[key];
        get().setFact(key, !current);
      },

      setAgeBracket: (bracket) => {
        let numericAge = 30;
        if (bracket === '18_49') numericAge = 30;
        if (bracket === '50_59') numericAge = 55;
        if (bracket === '60_74') numericAge = 65;
        if (bracket === '75_plus') numericAge = 75;

        set((state) => ({
          facts: {
            ...state.facts,
            age_bracket: bracket,
            age: numericAge,
          },
        }));
      },

      setObesitySelection: (value) => {
        set((state) => {
          const updated: Record<string, any> = { ...state.facts, morbid_obesity_selection: value };
          if (value === 'SIM') {
            updated.has_morbid_obesity_bmi_40 = true;
          } else {
            updated.has_morbid_obesity_bmi_40 = false;
          }
          return { facts: updated };
        });
      },

      setMultiCheckboxItem: (factKey, checked, noneKey) => {
        set((state) => {
          const updated = { ...state.facts, [factKey]: checked };
          if (checked && noneKey) {
            delete updated[noneKey]; // desmarca o "nenhuma das opções"
          }
          if (!updated.uses_immunosuppressants && !updated.is_chemotherapy && !updated.is_radiotherapy) {
            delete updated.immunosuppression_treatment_status;
          }
          return { facts: updated };
        });
      },

      setNoneSelected: (noneKey, itemKeys) => {
        set((state) => {
          const current = !!state.facts[noneKey];
          const nextVal = !current;
          const updated = { ...state.facts, [noneKey]: nextVal };

          if (nextVal) {
            // Se marcou "Nenhuma das opções", desmarca todos os itens do grupo
            for (const key of itemKeys) {
              delete updated[key];
            }
            if (!updated.uses_immunosuppressants && !updated.is_chemotherapy && !updated.is_radiotherapy) {
              delete updated.immunosuppression_treatment_status;
            }
          }
          return { facts: updated };
        });
      },

      setResults: (results) => set({ results }),
      setLastSubmissionId: (id) => set({ lastSubmissionId: id }),
      setAwarenessFeedback: (feedback) => set({ awarenessFeedback: feedback }),
      setCardUpdatedFeedback: (feedback) => set({ cardUpdatedFeedback: feedback }),

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
        const total = visible.length;
        if (total === 0) return 0;
        const safeIndex = get().getSafeStepIndex();
        return Math.round(((safeIndex + 1) / total) * 100);
      },

      goToNextStep: () => {
        const visible = get().getVisibleSections();
        const current = get().getSafeStepIndex();
        if (current < visible.length - 1) {
          set({ currentStepIndex: current + 1 });
          return false;
        }
        return true;
      },

      goToPrevStep: () => {
        const current = get().getSafeStepIndex();
        if (current > 0) {
          set({ currentStepIndex: current - 1 });
        }
      },

      resetQuiz: () => {
        set({
          facts: {},
          currentStepIndex: 0,
          results: null,
          lastSubmissionId: null,
          awarenessFeedback: null,
          cardUpdatedFeedback: null,
        });
      },
    }),
    {
      name: 'trivax-quiz-store-v5',
    }
  )
);
