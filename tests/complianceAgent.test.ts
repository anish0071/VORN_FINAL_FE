import assert from 'assert';
import { ComplianceAgent } from '../lib/agents/complianceAgent.js';

const ca = new ComplianceAgent();
const rows = [
  { row_compliant: true, fired_rules: [] } as any,
  { row_compliant: false, fired_rules: ['RULE_PCI_001_NO_FULL_PAN_STORAGE'] } as any,
];

const score = ca.computeFileScore(rows);
assert(score === 50, `expected 50 got ${score}`);

const summaries = ca.summarizeRules(rows, [
  { id: 'RULE_PCI_001_NO_FULL_PAN_STORAGE', name: 'x' } as any,
]);
assert(Array.isArray(summaries));

console.log('complianceAgent tests OK');
