import { NextResponse } from 'next/server';
import { generateExcelWorkbook } from '@/services/excel-export-service';
import { exportSubmissionsToCSV } from '@/services/submission-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliation = searchParams.get('affiliation') || undefined;
    const format = searchParams.get('format') || 'xlsx';

    const dateStr = new Date().toISOString().slice(0, 10);

    if (format === 'csv') {
      const csvContent = exportSubmissionsToCSV(affiliation);
      const csvWithBom = '\uFEFF' + csvContent;

      return new NextResponse(csvWithBom, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="relatorio-trivax-${dateStr}.csv"`,
        },
      });
    }

    // Por padrão gera o arquivo XLSX real do Microsoft Excel com múltiplas abas/planilhas
    const excelBuffer = await generateExcelWorkbook(affiliation);

    return new NextResponse(excelBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="relatorio-trivax-${dateStr}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error('Erro ao exportar arquivo Excel:', error);
    return NextResponse.json({ error: 'Erro ao gerar exportação' }, { status: 500 });
  }
}
