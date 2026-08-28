import { NextResponse } from 'next/server';
import { exportSubmissionsToCSV } from '@/services/submission-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliation = searchParams.get('affiliation') || undefined;

    const csvContent = exportSubmissionsToCSV(affiliation);
    // Adiciona BOM (Byte Order Mark) para o Excel no Windows abrir com acentuação correta
    const csvWithBom = '\uFEFF' + csvContent;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="relatorio-vacinas-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Erro ao exportar CSV:', error);
    return NextResponse.json({ error: 'Erro ao gerar exportação' }, { status: 500 });
  }
}
