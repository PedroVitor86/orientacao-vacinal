import { NextRequest, NextResponse } from 'next/server';
import { saveFollowUpSubmission, getFollowUpAnalytics } from '@/services/submission-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { participated, sought_center } = body;

    if (!participated || (participated !== 'SIM' && participated !== 'NAO')) {
      return NextResponse.json(
        { error: 'Resposta da participação é obrigatória' },
        { status: 400 }
      );
    }

    const record = await saveFollowUpSubmission({
      participated,
      sought_center: sought_center || undefined,
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error('Erro ao salvar resposta de acompanhamento:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar resposta' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const summary = await getFollowUpAnalytics();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Erro ao buscar métricas de acompanhamento:', error);
    return NextResponse.json(
      { error: 'Falha ao processar métricas de acompanhamento' },
      { status: 500 }
    );
  }
}
