import OpenAI from 'openai';

let clientInstance: OpenAI | null = null;

/**
 * Return a singleton OpenAI client. Throws if OPENAI_API_KEY is missing.
 */
export function getOpenAIClient(): OpenAI {
  if (clientInstance) return clientInstance;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  clientInstance = new OpenAI({ apiKey });
  return clientInstance;
}

/**
 * Model name to use for chat completions.
 */
export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-4.1-mini';
}
