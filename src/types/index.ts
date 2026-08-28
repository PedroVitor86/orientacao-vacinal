export type Operator = 
  | 'equal' 
  | 'notEqual' 
  | 'greaterThan' 
  | 'greaterThanInclusive' 
  | 'lessThan' 
  | 'lessThanInclusive' 
  | 'in';

export interface AtomicCondition {
  fact: string;
  operator: Operator;
  value: any;
  reason?: string;
}

export interface ComplexCondition {
  all?: (AtomicCondition | ComplexCondition)[];
  any?: (AtomicCondition | ComplexCondition)[];
  not?: AtomicCondition | ComplexCondition;
  reason?: string;
  category_label?: string;
}

export interface RuleDefinition {
  vaccine_code: string;
  vaccine_name: string;
  rule_name: string;
  description?: string;
  conditions: ComplexCondition;
}

export interface MatchedReason {
  criterion: string;
  identified_facts: string[];
  description: string;
}

export interface EvaluationResult {
  vaccine_code: string;
  vaccine_name: string;
  is_eligible: boolean;
  reasons: MatchedReason[];
}

export interface VisibilityCondition {
  fact: string;
  operator: Operator;
  value: any;
}

export type InputType = 
  | 'number' 
  | 'radio' 
  | 'checkbox' 
  | 'boolean_buttons' 
  | 'multi_checkbox_group';

export interface QuestionOption {
  label: string;
  value: any;
  description?: string;
  mappedAge?: number; // Para faixas etárias
}

export interface MultiCheckboxItem {
  fact_key: string;
  label: string;
  tooltip?: string;
}

export interface QuestionItem {
  id: string;
  number?: string | number;
  fact_key?: string;
  label: string;
  subtitle?: string;
  help_text?: string;
  tooltip?: string;
  type: InputType;
  options?: QuestionOption[];
  items?: MultiCheckboxItem[]; // Para multi_checkbox_group
  none_key?: string; // Chave para "Nenhuma das opções"
  min?: number;
  max?: number;
  placeholder?: string;
  required?: boolean;
  visibility_condition?: VisibilityCondition;
}

export interface QuestionSection {
  id: string;
  category: string;
  title: string;
  description?: string;
  icon?: string;
  visibility_condition?: VisibilityCondition;
  questions: QuestionItem[];
}
