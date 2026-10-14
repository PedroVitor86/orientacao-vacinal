import { NextResponse } from 'next/server';
import { trackClick } from '@/services/submission-service';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const source = body.source || 'ACOMPANHAMENTO';
    const target = body.target || 'DE_OLHO_NA_FILA';

    const record = await trackClick(source, target);

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error('Erro ao registrar clique no localizador:', error);
    return NextResponse.json(
      { error: 'Falha ao registrar clique' },
      { status: 500 }
    );
  }
}
