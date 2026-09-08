import { NextResponse } from 'next/server';
import { saveSubmission } from '@/services/submission-service';
import { EvaluationResult } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { facts, eligible_results } = body;

    if (!facts) {
      return NextResponse.json({ error: 'Fatos não fornecidos' }, { status: 400 });
    }

    const eligibleVaccines: string[] = [];
    const reasonsByVaccine: Record<string, string[]> = {};

    if (Array.isArray(eligible_results)) {
      eligible_results.forEach((res: EvaluationResult) => {
        if (res.is_eligible || res.reasons?.length > 0) {
          eligibleVaccines.push(res.vaccine_code);
          reasonsByVaccine[res.vaccine_code] = res.reasons.map((r) => r.description);
        }
      });
    }

    const record = await saveSubmission({
      user_affiliation: facts.user_affiliation || 'NAO_INFORMADO',
      age_bracket: facts.age_bracket || '18_49',
      age: facts.age || 30,
      sex: facts.sex || 'NAO_INFORMAR',
      eligible_vaccines: eligibleVaccines,
      reasons_by_vaccine: reasonsByVaccine,
      facts,
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error: any) {
    console.error('Erro ao salvar submissão:', error);
    return NextResponse.json(
      { error: 'Erro interno ao salvar dados de avaliação' },
      { status: 500 }
    );
  }
}
