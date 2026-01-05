import type { RowInput, RowOutput } from '../../../lib/types';
import { ExplanationAgent } from '../../../lib/agents/explanationAgent';
import { getOpenAIClient, getOpenAIModel } from '../../../lib/openaiClient';
import { prisma } from '../../../lib/prisma';

export const runtime = 'nodejs';

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

/** POST /api/chat
 * Body: { before: RowInput, after: RowOutput, fired_rules: string[] }
 */
export async function POST(req: Request) {
  try {
    if (req.headers.get('content-type')?.includes('application/json') !== true) {
      return jsonResponse({ error: 'Expected application/json' }, 400);
    }

    const body = await req.json();
    const before = body?.before as RowInput | undefined;
    const after = body?.after as RowOutput | undefined;
    const fired_rules = Array.isArray(body?.fired_rules) ? body.fired_rules : undefined;

    if (!before || !after || !Array.isArray(fired_rules)) {
      return jsonResponse({ error: 'Invalid payload: before, after, and fired_rules are required' }, 400);
    }

    const explanationAgent = new ExplanationAgent();
    const prompt = explanationAgent.buildPrompt({ before, after, fired_rules });

    // Call OpenAI
    let explanation = '';
    try {
      const client = getOpenAIClient();
      const model = getOpenAIModel();

      const resp: any = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are a concise PCI/Policy explainer. Reply in 2-3 sentences. Do not provide legal advice.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.2,
      });

      explanation = String(resp?.choices?.[0]?.message?.content || '').trim();
    } catch (openaiErr: any) {
      console.error('OpenAI call failed:', openaiErr?.message ?? String(openaiErr));
      explanation = '';
    }

    if (!explanation) {
      const fb = explanationAgent.buildFallback({ before, after, fired_rules });
      explanation = fb.explanation;
    }

    // Optionally persist explanation if file_id and row_id provided
    try {
      const file_id = typeof (body as any)?.file_id === 'string' ? (body as any).file_id : undefined;
      const row_id = typeof (body as any)?.row_id === 'string' ? (body as any).row_id : undefined;
      if (file_id && row_id) {
        await prisma.chatExplanation.create({
          data: {
            fileId: file_id,
            rowId: row_id,
            rulesReferenced: JSON.stringify(fired_rules),
            explanation,
          },
        });
      }
    } catch (dbErr: any) {
      console.error('Chat persist failed:', dbErr?.message ?? String(dbErr));
    }

    return jsonResponse({ explanation, rules_referenced: fired_rules }, 200);
  } catch (err: any) {
    console.error('chat endpoint error:', err?.message ?? String(err));
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
