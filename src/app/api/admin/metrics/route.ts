import { NextResponse } from 'next/server';
import { getAnalytics } from '@/services/submission-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliation = searchParams.get('affiliation') || undefined;

    const data = await getAnalytics(affiliation);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao obter métricas:', error);
    return NextResponse.json(
      { error: 'Falha ao processar métricas do painel' },
      { status: 500 }
    );
  }
}
