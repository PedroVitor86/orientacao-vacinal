import { NextResponse } from 'next/server';
import { DeclarativeRuleEngine } from '@/engine/rule-engine';
import { RuleDefinition } from '@/types';
import rulesData from '@/config/rules.json';

const engine = new DeclarativeRuleEngine();
const rules = rulesData as unknown as RuleDefinition[];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const facts = body.facts || {};

    // Validação mínima de segurança: idade deve ser >= 18
    if (facts.age !== undefined && Number(facts.age) < 18) {
      return NextResponse.json(
        { error: 'A plataforma destina-se exclusivamente a maiores de 18 anos.' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const results = engine.evaluate(rules, facts);
    const executionTimeMs = Date.now() - startTime;

    const eligibleVaccines = results.filter((r) => r.is_eligible);

    return NextResponse.json({
      success: true,
      evaluated_at: new Date().toISOString(),
      execution_time_ms: executionTimeMs,
      summary: {
        total_eligible: eligibleVaccines.length,
        total_rules_evaluated: rules.length,
      },
      results: eligibleVaccines,
      disclaimer:
        'Aviso: Este resultado é estritamente orientativo e baseado em diretrizes clínicas e epidemiológicas vigentes. Não substitui consulta médica ou avaliação do histórico vacinal por profissional de saúde.',
    });
  } catch (error: any) {
    console.error('Erro ao avaliar elegibilidade:', error);
    return NextResponse.json(
      { error: 'Falha interna ao processar motor de regras.', details: error.message },
      { status: 500 }
    );
  }
}
