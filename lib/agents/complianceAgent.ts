import type { RowOutput, Rule, RuleSummary } from '../types.js';

export class ComplianceAgent {
  computeFileScore(rows: RowOutput[]): number {
    if (!rows || rows.length === 0) return 100;
    const compliant = rows.filter(r => r.row_compliant).length;
    return Math.round((compliant / rows.length) * 100);
  }

  summarizeRules(rows: RowOutput[], rules: Rule[]): RuleSummary[] {
    const total = rows.length;
    const summaries: RuleSummary[] = rules.map(r => ({ rule_id: r.id, name: r.name, affected_rows: 0, status: 'PASSED' }));
    const idx = new Map(summaries.map(s => [s.rule_id, s]));

    for (const row of rows) {
      for (const fired of row.fired_rules || []) {
        const s = idx.get(fired);
        if (s) s.affected_rows += 1;
      }
    }

    for (const s of summaries) {
      if (s.affected_rows === 0) s.status = 'PASSED';
      else if (s.affected_rows < total) s.status = 'PARTIAL';
      else s.status = 'FAILED';
    }

    return summaries;
  }
}
