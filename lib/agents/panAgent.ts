import type { RowInput, RowOutput } from '../types.js';

export interface PanAnalysis {
  has_card_data: boolean;
  pan_valid: boolean;
  scheme: 'VISA' | 'OTHER' | 'UNKNOWN';
  pan_present_in_logs: boolean;
}

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, '');
  let sum = 0;
  let toggle = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (toggle) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    toggle = !toggle;
  }
  return sum % 10 === 0;
}

function isPanLike(s?: string | null): boolean {
  if (!s) return false;
  const digs = s.replace(/\D/g, '');
  return digs.length >= 13 && digs.length <= 19 && /^\d+$/.test(digs);
}

function maskPanFromLast(last4: string, totalLen = 16): string {
  // produce groups of 4 Xs and final last4
  const maskedGroups = Math.max(0, Math.ceil((totalLen - 4) / 4));
  const groups = new Array(maskedGroups).fill('XXXX');
  return [...groups, last4].join('-');
}

function randomAlphaNum(len = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

/**
 * PanAgent: pure utilities for PAN detection, validation, tokenization, and redaction.
 */
export class PanAgent {
  /**
   * Analyze PAN presence and logs for card data.
   */
  analysePan(input: RowInput): PanAnalysis {
    const panRaw = input.pan?.toString() ?? '';
    const has_card_data = isPanLike(panRaw);
    const panDigits = panRaw.replace(/\D/g, '');
    const pan_valid = has_card_data ? luhnCheck(panDigits) : false;
    const scheme = has_card_data && panDigits.startsWith('4') ? 'VISA' : has_card_data ? 'OTHER' : 'UNKNOWN';

    // detect PAN-like sequences in logs
    const log = input.log_message ?? '';
    const matches = Array.from(log.matchAll(/(\d{13,19})/g)) as RegExpMatchArray[];
    const pan_present_in_logs = matches.some(m => luhnCheck(m[1]));

    return { has_card_data, pan_valid, scheme, pan_present_in_logs };
  }

  /**
   * Apply tokenization and masking to the provided output object.
   * This NEVER copies raw PAN into the output.
   */
  applyPanTransforms(input: RowInput, output: RowOutput): void {
    const panRaw = input.pan?.toString() ?? '';
    if (!isPanLike(panRaw)) {
      output.pan_token = null;
      output.pan_last4 = null;
      output.pan_masked = null;
      return;
    }

    const digits = panRaw.replace(/\D/g, '');
    const last4 = digits.slice(-4);
    const totalLen = digits.length;
    const valid = luhnCheck(digits);

    if (valid && digits.startsWith('4')) {
      // Token format: V4<random>-<8chars>-<last4>
      output.pan_token = `V4${randomAlphaNum(2)}-${randomAlphaNum(8)}-${last4}`;
    } else {
      output.pan_token = null;
    }

    output.pan_last4 = last4;
    output.pan_masked = maskPanFromLast(last4, totalLen);
  }

  /**
   * Redact any 13-19 digit sequences passing Luhn in free text.
   */
  redactPanInText(text?: string | null): string | null {
    if (!text) return null;
    return text.replace(/(\d{13,19})/g, (m, g1) => {
      if (luhnCheck(g1)) return '[REDACTED]';
      return m;
    });
  }
}
