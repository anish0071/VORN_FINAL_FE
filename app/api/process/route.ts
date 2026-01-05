export const runtime = 'nodejs';

import type { RowInput, FileResult } from '../../../lib/types';
import { ParserAgent } from '../../../lib/agents/parserAgent';
import { PanAgent } from '../../../lib/agents/panAgent';
import { PiiAgent } from '../../../lib/agents/piiAgent';
import { RuleEngineAgent } from '../../../lib/agents/ruleEngineAgent';
import { ComplianceAgent } from '../../../lib/agents/complianceAgent';
import { pciRules, orgRules } from '../../../lib/agents/ruleCatalog';
import { prisma } from '../../../lib/prisma';

const MAX_ROWS = Number(process.env.VORN_MAX_ROWS || 5000);
const MAX_BYTES = Number(process.env.VORN_MAX_BYTES || 5 * 1024 * 1024); // 5 MB

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * POST /api/process
 * Body: { csv_content: string, filename?: string }
 */
export async function POST(req: Request) {
  const started = Date.now();

  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return jsonResponse({ error: 'Expected application/json' }, 400);
    }

    const body = await req.json();
    const csv_content =
      typeof body?.csv_content === 'string' ? body.csv_content : null;
    const filename =
      typeof body?.filename === 'string' ? body.filename : undefined;

    if (!csv_content || csv_content.trim().length === 0) {
      return jsonResponse({ error: 'csv_content is required' }, 400);
    }

    const bytes = Buffer.byteLength(csv_content, 'utf8');
    if (bytes > MAX_BYTES) {
      return jsonResponse({ error: 'Payload too large' }, 413);
    }

    const parser = new ParserAgent();
    const parseResult = parser.parseCsv(csv_content);
    const rows = parseResult.rows as RowInput[];

    if (!rows || rows.length === 0) {
      return jsonResponse({ error: 'CSV contains no data rows' }, 400);
    }

    if (rows.length > MAX_ROWS) {
      return jsonResponse(
        { error: `Row count exceeds limit of ${MAX_ROWS}` },
        413
      );
    }

    const panAgent = new PanAgent();
    const piiAgent = new PiiAgent();
    const ruleEngine = new RuleEngineAgent(
      [...pciRules, ...orgRules],
      panAgent,
      piiAgent
    );
    const complianceAgent = new ComplianceAgent();

    const rowsOut = rows.map((r) => ruleEngine.processRow(r));

    const compliance_score =
      complianceAgent.computeFileScore(rowsOut);
    const rules_summary =
      complianceAgent.summarizeRules(rowsOut, [...pciRules, ...orgRules]);

    const processing_duration_ms = Date.now() - started;

    const result: FileResult = {
      filename: filename || 'upload.csv',
      total_rows: rowsOut.length,
      rows: rowsOut,
      compliance_score,
      rules_summary,
      processing_duration_ms,
      error: null,
    };

    // ---- DB Persistence (safe, isolated) ----
    let fileId: string | null = null;

    try {
      const file = await prisma.processedFile.create({
        data: {
          filename: result.filename,
          totalRows: result.total_rows,
          complianceScore: result.compliance_score,
          rulesSummaryJson: JSON.stringify(result.rules_summary),
          fileResultJson: JSON.stringify(result),
        },
      });

      fileId = file.id;

      for (let i = 0; i < rowsOut.length; i++) {
        const r = rowsOut[i];

        const row = await prisma.processedRow.create({
          data: {
            fileId: file.id,
            index: i,
            rowJson: JSON.stringify(r),
          },
        });

        const hits = (r.fired_rules || []).map((ruleId) => ({
          rowId: row.id,
          ruleId,
        }));

        if (hits.length > 0) {
          await prisma.ruleHit.createMany({ data: hits });
        }
      }
    } catch (dbErr) {
      if (dbErr instanceof Error) {
        console.error('DB persist error:', dbErr.message);
      } else {
        console.error('DB persist error:', dbErr);
      }
      result.error = 'DB persistence failed';
    }

    console.info(
      `processed rows=${rowsOut.length} duration_ms=${processing_duration_ms} persisted=${fileId ? 'yes' : 'no'}`
    );

    return jsonResponse({ ...result, file_id: fileId }, 200);
  } catch (err) {
    if (err instanceof Error) {
      console.error('process endpoint error:', err.message);
    } else {
      console.error('process endpoint error:', err);
    }
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
