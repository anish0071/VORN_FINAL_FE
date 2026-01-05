import { prisma } from '../../../lib/prisma';

export const runtime = 'nodejs';

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    let limit = 10;
    if (limitParam) {
      limit = Math.min(50, Math.max(1, Number(limitParam) || 10));
    }

    const files = await prisma.processedFile.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, filename: true, createdAt: true, totalRows: true, complianceScore: true },
    });

    const out = files.map(f => ({
      id: f.id,
      filename: f.filename,
      created_at: f.createdAt.toISOString(),
      total_rows: f.totalRows,
      compliance_score: f.complianceScore,
    }));

    return jsonResponse(out, 200);
  } catch (err: any) {
    console.error('files list error:', err?.message ?? String(err));
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
