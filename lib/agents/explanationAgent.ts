import type { RowInput, RowOutput } from '../types.js';

export interface ExplanationRequest {
  before: RowInput;
  after: RowOutput;
  fired_rules: string[];
}

export interface ExplanationResponse {
  explanation: string;
  rules_referenced: string[];
}

export class ExplanationAgent {
  buildPrompt(req: ExplanationRequest): string {
    const parts: string[] = [];
    parts.push('You are given an input row and the processed output.');
    parts.push('Do NOT include or echo raw PAN or other raw PII.');
    parts.push('Input:');
    const safeBefore = { ...req.before } as any;
    if (safeBefore.pan) safeBefore.pan = '[REDACTED]';
    if (safeBefore.log_message) safeBefore.log_message = '[REDACTED]';
    parts.push(JSON.stringify(safeBefore, null, 2));
    parts.push('Output:');
    parts.push(JSON.stringify(req.after, null, 2));
    parts.push('Fired rules: ' + JSON.stringify(req.fired_rules));
    parts.push('Provide a concise explanation of what changed and why, referencing rule IDs.');
    return parts.join('\n\n');
  }

  buildFallback(req: ExplanationRequest): ExplanationResponse {
    const lines: string[] = [];
    lines.push('Processed the row and applied automated compliance fixes.');
    if (req.fired_rules.length) {
      lines.push(`Triggered rules: ${req.fired_rules.join(', ')}.`);
      lines.push('Fixes were applied where possible (masking, pseudonymization, defaults).');
    } else {
      lines.push('No rules were triggered.');
    }

    return {
      explanation: lines.join(' '),
      rules_referenced: req.fired_rules,
    };
  }
}
