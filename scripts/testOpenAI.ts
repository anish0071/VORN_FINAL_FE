import 'dotenv/config';
import { getOpenAIClient, getOpenAIModel } from '../lib/openaiClient.js';

async function run() {
  try {
    const client = getOpenAIClient();
    const model = getOpenAIModel();
    const resp: any = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a concise explainer.' },
        { role: 'user', content: 'Explain briefly why PANs must be masked.' }
      ],
      max_tokens: 120,
      temperature: 0.2,
    });
    console.log('response:', resp?.choices?.[0]?.message?.content ?? '[no content]');
  } catch (err: any) {
    console.error('error:', err?.message ?? err);
  }
}
run();