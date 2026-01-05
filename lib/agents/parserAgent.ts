import type { RowInput } from '../types.js';

export interface ParseResult {
  rows: RowInput[];
  rawHeaders: string[];
  warnings: string[];
}

function toSnakeLower(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

const headerAliases: Record<string, string> = {
  card_number: 'pan',
  primary_account_number: 'pan',
  customer_country: 'customer_location',
  country: 'customer_location',
};

/**
 * ParserAgent: parse CSV content into RowInput[], normalize headers and coerce simple types.
 */
export class ParserAgent {
  parseCsv(csvContent: string): ParseResult {
    const warnings: string[] = [];

    // Minimal CSV parser (supports quoted fields and newlines)
    const lines = csvContent.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return { rows: [], rawHeaders: [], warnings };

    const parseLine = (line: string): string[] => {
      const res: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++; // skip escaped quote
          } else {
            inQuotes = !inQuotes;
          }
          continue;
        }
        if (ch === ',' && !inQuotes) {
          res.push(cur);
          cur = '';
          continue;
        }
        cur += ch;
      }
      res.push(cur);
      return res;
    };

    const headerLine = lines[0];
    const rawHeaders = parseLine(headerLine).map(h => h ?? '');
    const normalizedHeaders = rawHeaders.map(h => toSnakeLower(h || ''));

    // Build map original header -> canonical key
    const headerMap: Record<string, string> = {};
    for (let i = 0; i < rawHeaders.length; i++) {
      const raw = rawHeaders[i] || '';
      const norm = normalizedHeaders[i];
      headerMap[raw] = headerAliases[norm] ?? norm;
    }

    const rows: RowInput[] = [];
    for (let r = 1; r < lines.length; r++) {
      const vals = parseLine(lines[r]);
      const out: RowInput = {};
      for (let c = 0; c < rawHeaders.length; c++) {
        const rawKey = rawHeaders[c] || '';
        const key = headerMap[rawKey] ?? toSnakeLower(rawKey);
        const val = vals[c] === undefined ? null : vals[c];

        if (key === 'retention_days') {
          const n = Number(val as any);
          out.retention_days = Number.isFinite(n) ? n : null;
        } else if (val === '') {
          out[key] = null;
        } else {
          out[key] = val;
        }
      }
      rows.push(out);
    }

    // Ensure at least one PAN-like column
    const hasPan = normalizedHeaders.some(h => ['pan', 'primary_account_number', 'card_number'].includes(h));
    if (!hasPan) warnings.push('No PAN-like column detected (pan or aliases)');

    return { rows, rawHeaders, warnings };
  }
}
