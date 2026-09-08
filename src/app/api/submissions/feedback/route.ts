import { NextRequest, NextResponse } from 'next/server';
import { updateSubmissionFeedback } from '@/services/submission-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, feedback, cardUpdatedFeedback } = body;

    if (!id || (!feedback && !cardUpdatedFeedback)) {
      return NextResponse.json(
        { error: 'ID e ao menos um feedback são obrigatórios' },
        { status: 400 }
      );
    }

    const updated = await updateSubmissionFeedback(id, feedback, cardUpdatedFeedback);
    return NextResponse.json({ success: updated });
  } catch (error) {
    console.error('Erro ao atualizar feedback de conscientização:', error);
    return NextResponse.json(
      { error: 'Erro interno ao salvar feedback' },
      { status: 500 }
    );
  }
}
