import { 
  RuleDefinition, 
  AtomicCondition, 
  ComplexCondition, 
  EvaluationResult, 
  MatchedReason, 
  Operator 
} from '../types';

export class DeclarativeRuleEngine {
  private operators: Record<Operator, (a: any, b: any) => boolean> = {
    equal: (a, b) => a === b,
    notEqual: (a, b) => a !== b,
    greaterThan: (a, b) => Number(a) > Number(b),
    greaterThanInclusive: (a, b) => Number(a) >= Number(b),
    lessThan: (a, b) => Number(a) < Number(b),
    lessThanInclusive: (a, b) => Number(a) <= Number(b),
    in: (a, b) => Array.isArray(b) && b.includes(a),
  };

  /**
   * Avalia um conjunto de regras declarativas contra um mapa de fatos.
   * Totalmente independente da ordem em que os fatos foram respondidos.
   */
  public evaluate(rules: RuleDefinition[], facts: Record<string, any>): EvaluationResult[] {
    return rules.map((rule) => {
      const matchedReasons: MatchedReason[] = [];
      const isEligible = this.evalComplex(rule.conditions, facts, matchedReasons);

      // Eliminar duplicatas de motivos com a mesma descrição
      const uniqueReasons = matchedReasons.filter(
        (reason, index, self) =>
          index === self.findIndex((r) => r.description === reason.description)
      );

      return {
        vaccine_code: rule.vaccine_code,
        vaccine_name: rule.vaccine_name,
        is_eligible: isEligible,
        reasons: isEligible ? uniqueReasons : [],
      };
    });
  }

  private evalComplex(
    condition: ComplexCondition, 
    facts: Record<string, any>, 
    reasons: MatchedReason[]
  ): boolean {
    if (condition.all && condition.all.length > 0) {
      const subReasons: MatchedReason[] = [];
      const pass = condition.all.every((cond) => this.evalNode(cond, facts, subReasons));
      if (pass) {
        if (condition.reason) {
          reasons.push({
            criterion: condition.category_label || 'Critério Combinado',
            identified_facts: subReasons.flatMap((r) => r.identified_facts),
            description: condition.reason,
          });
        } else {
          reasons.push(...subReasons);
        }
      }
      return pass;
    }

    if (condition.any && condition.any.length > 0) {
      let anyPassed = false;
      for (const cond of condition.any) {
        const subReasons: MatchedReason[] = [];
        if (this.evalNode(cond, facts, subReasons)) {
          anyPassed = true;
          reasons.push(...subReasons);
        }
      }
      return anyPassed;
    }

    if (condition.not) {
      return !this.evalNode(condition.not, facts, reasons);
    }

    return false;
  }

  private evalNode(
    node: AtomicCondition | ComplexCondition, 
    facts: Record<string, any>, 
    reasons: MatchedReason[]
  ): boolean {
    if ('fact' in node) {
      return this.evalAtomic(node as AtomicCondition, facts, reasons);
    }
    return this.evalComplex(node as ComplexCondition, facts, reasons);
  }

  private evalAtomic(
    condition: AtomicCondition, 
    facts: Record<string, any>, 
    reasons: MatchedReason[]
  ): boolean {
    const factValue = facts[condition.fact];
    const opHandler = this.operators[condition.operator];

    if (!opHandler) {
      console.warn(`Operador desconhecido: ${condition.operator}`);
      return false;
    }

    const passed = factValue !== undefined && opHandler(factValue, condition.value);

    if (passed && condition.reason) {
      reasons.push({
        criterion: condition.fact,
        identified_facts: [condition.fact],
        description: condition.reason,
      });
    }

    return passed;
  }
}

export const defaultRuleEngine = new DeclarativeRuleEngine();
