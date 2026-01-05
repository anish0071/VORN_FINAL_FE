import type { RowInput } from '../types.js';

export interface PiiAnalysis {
  has_pii: boolean;
  has_full_name: boolean;
  has_email: boolean;
  has_phone: boolean;
}

const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phoneRe = /(?:\+?\d[\d\-(). ]{5,}\d)/;

/**
 * PII Agent: detect and pseudonymize personal data.
 */
export class PiiAgent {
  analyse(row: RowInput): PiiAnalysis {
    const name = (row.cardholder_name || '').toString();
    const has_full_name = /\b[A-Za-z]+\s+[A-Za-z]+\b/.test(name);

    // check common places for email
    const fields = Object.values(row).map(v => (v == null ? '' : String(v)));
    const has_email = fields.some(f => emailRe.test(f));
    const has_phone = fields.some(f => phoneRe.test(f));

    return {
      has_pii: has_full_name || has_email || has_phone,
      has_full_name,
      has_email,
      has_phone,
    };
  }

  /**
   * Pseudonymize a human name. "John Doe" -> "J. Doe".
   */
  pseudonymizeName(name?: string | null): string | null {
    if (!name) return null;
    const s = name.trim();
    if (s.length === 0) return null;
    const parts = s.split(/\s+/);
    if (parts.length === 1) {
      const p = parts[0];
      if (p.length <= 2) return p;
      return p[0] + p.slice(1).replace(/./g, '*');
    }
    const last = parts[parts.length - 1];
    const first = parts[0];
    return `${first[0]}. ${last}`;
  }
}
