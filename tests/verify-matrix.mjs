import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega as regras diretamente do JSON
const rules = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/config/rules.json'), 'utf-8')
);

// Implementação pura do motor para validação dos testes
class Evaluator {
  evaluate(rules, facts) {
    return rules.map((rule) => {
      const isEligible = this.evalComplex(rule.conditions, facts);
      return {
        vaccine_code: rule.vaccine_code,
        is_eligible: isEligible,
      };
    });
  }

  evalComplex(condition, facts) {
    if (condition.all) {
      return condition.all.every((c) => this.evalNode(c, facts));
    }
    if (condition.any) {
      return condition.any.some((c) => this.evalNode(c, facts));
    }
    if (condition.not) {
      return !this.evalNode(condition.not, facts);
    }
    return false;
  }

  evalNode(node, facts) {
    if ('fact' in node) {
      const val = facts[node.fact];
      if (node.operator === 'equal') return val === node.value;
      if (node.operator === 'greaterThanInclusive') return Number(val) >= Number(node.value);
      if (node.operator === 'lessThanInclusive') return Number(val) <= Number(node.value);
      return false;
    }
    return this.evalComplex(node, facts);
  }
}

const evaluator = new Evaluator();

const testCases = [
  {
    id: 'TC-01 (18 a 49 anos Saudável)',
    facts: { age_bracket: '18_49', age: 30, sex: 'MASCULINO' },
    expected: [],
  },
  {
    id: 'TC-02 (Gestante 34 semanas)',
    facts: { age_bracket: '18_49', age: 30, sex: 'FEMININO', is_pregnant: true, pregnancy_weeks_32_36: true },
    expected: ['VSR'],
  },
  {
    id: 'TC-03 (Gestante fora de 32-36 semanas)',
    facts: { age_bracket: '18_49', age: 30, sex: 'FEMININO', is_pregnant: true, pregnancy_weeks_32_36: false },
    expected: [],
  },
  {
    id: 'TC-04 (50 a 59 anos saudável)',
    facts: { age_bracket: '50_59', age: 55, sex: 'MASCULINO' },
    expected: ['PNEUMO_20'],
  },
  {
    id: 'TC-05 (60 a 74 anos sem comorbidade grave)',
    facts: { age_bracket: '60_74', age: 65, sex: 'FEMININO' },
    expected: ['PNEUMO_20'],
  },
  {
    id: 'TC-06 (60 a 74 anos com Insuficiência Cardíaca)',
    facts: { age_bracket: '60_74', age: 65, sex: 'MASCULINO', has_heart_failure: true },
    expected: ['COVID_19', 'PNEUMO_20', 'VSR'],
  },
  {
    id: 'TC-07 (75 anos ou mais sem comorbidades)',
    facts: { age_bracket: '75_plus', age: 75, sex: 'FEMININO' },
    expected: ['PNEUMO_20', 'VSR'],
  },
  {
    id: 'TC-08 (18 a 49 anos com Implante Coclear)',
    facts: { age_bracket: '18_49', age: 30, sex: 'MASCULINO', has_cochlear_implant: true },
    expected: ['PNEUMO_20'],
  },
  {
    id: 'TC-09 (18 a 49 anos Trabalhador da Saúde)',
    facts: { age_bracket: '18_49', age: 30, sex: 'MASCULINO', is_health_worker: true },
    expected: ['COVID_19'],
  },
  {
    id: 'TC-10 (50 a 59 anos com Diabetes)',
    facts: { age_bracket: '50_59', age: 55, sex: 'FEMININO', has_diabetes: true },
    expected: ['COVID_19', 'PNEUMO_20', 'VSR'],
  },
  {
    id: 'TC-11 (18 a 49 anos com Outra condição de imunossupressão)',
    facts: { age_bracket: '18_49', age: 30, sex: 'FEMININO', has_other_immunosuppression: true },
    expected: ['COVID_19', 'PNEUMO_20'],
  },
];

console.log('=== EXECUTANDO BATERIA DE TESTES COM FAIXAS ETÁRIAS E REGRAS ATUALIZADAS ===\n');
let passed = 0;

for (const tc of testCases) {
  const results = evaluator.evaluate(rules, tc.facts);
  const actualEligible = results.filter((r) => r.is_eligible).map((r) => r.vaccine_code).sort();
  const expectedEligible = tc.expected.sort();

  const isMatch = JSON.stringify(actualEligible) === JSON.stringify(expectedEligible);

  if (isMatch) {
    console.log(`✅ [PASSOU] ${tc.id} -> [${actualEligible.join(', ')}]`);
    passed++;
  } else {
    console.error(`❌ [FALHOU] ${tc.id}`);
    console.error(`   Esperado: [${expectedEligible.join(', ')}]`);
    console.error(`   Obtido:   [${actualEligible.join(', ')}]`);
  }
}

console.log(`\nResultado Final: ${passed} de ${testCases.length} testes passaram com sucesso!`);
if (passed === testCases.length) {
  process.exit(0);
} else {
  process.exit(1);
}
