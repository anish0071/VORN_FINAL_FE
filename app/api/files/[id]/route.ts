import type { FileResult, RuleSummary } from '../../../../lib/types';
import { prisma } from '../../../../lib/prisma';

export const runtime = 'nodejs';

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) return jsonResponse({ error: 'Missing id' }, 400);

    const file = await prisma.processedFile.findUnique({ where: { id } });
    if (!file) return jsonResponse({ error: 'File not found' }, 404);

    let rules_summary: RuleSummary[] = [];
    let file_result: FileResult | null = null;
    try {
      rules_summary = JSON.parse(file.rulesSummaryJson) as RuleSummary[];
      file_result = JSON.parse(file.fileResultJson) as FileResult;
    } catch (parseErr: any) {
      console.error('parse stored json failed', parseErr?.message ?? String(parseErr));
      return jsonResponse({ error: 'Internal server error' }, 500);
    }

    return jsonResponse({
      id: file.id,
      filename: file.filename,
      created_at: file.createdAt.toISOString(),
      total_rows: file.totalRows,
      compliance_score: file.complianceScore,
      rules_summary,
      file_result,
    }, 200);
  } catch (err: any) {
    console.error('files get error:', err?.message ?? String(err));
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
