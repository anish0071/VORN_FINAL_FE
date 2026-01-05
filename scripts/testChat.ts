import 'dotenv/config';
import { ExplanationAgent } from '../lib/agents/explanationAgent.js';
import { getOpenAIClient, getOpenAIModel } from '../lib/openaiClient.js';

async function main() {
  const before = { cardholder_name: 'John Doe' } as any;
  const after = { cardholder_name_masked: 'J. Doe', fired_rules: ['RULE_PCI_007_NO_CARDHOLDER_FULL_NAME'] } as any;
  const fired_rules = ['RULE_PCI_007_NO_CARDHOLDER_FULL_NAME'];

  const agent = new ExplanationAgent();
  const prompt = agent.buildPrompt({ before, after, fired_rules });
  console.log('Prompt built (sensitive fields redacted):\n', prompt);

  try {
    const client = getOpenAIClient();
    const model = getOpenAIModel();
    const resp: any = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a concise PCI/Policy explainer.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.2,
    });

    console.log('OpenAI response:', resp?.choices?.[0]?.message?.content ?? '[no content]');
  } catch (err: any) {
    console.warn('OpenAI unavailable or failed — using fallback');
    const fb = agent.buildFallback({ before, after, fired_rules });
    console.log('Fallback explanation:', fb.explanation);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
