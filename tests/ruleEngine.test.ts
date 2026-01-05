import assert from 'assert';
import { RuleEngineAgent } from '../lib/agents/ruleEngineAgent.js';
import { PanAgent } from '../lib/agents/panAgent.js';
import { PiiAgent } from '../lib/agents/piiAgent.js';
import { pciRules, orgRules } from '../lib/agents/ruleCatalog.js';

const allRules = [...pciRules, ...orgRules];
const engine = new RuleEngineAgent(allRules, new PanAgent(), new PiiAgent());

const input = {
  pan: '4111111111111111',
  cvv: '123',
  cardholder_name: 'Alice Smith',
  merchant_id: 'm1',
  channel: 'http',
  retention_days: null,
  customer_location: 'DE',
} as any;

const out = engine.processRow(input);
assert(out.pan_token, 'should tokenise');
assert(out.fired_rules.length > 0, 'should have fired rules');
assert(typeof out.processing_timestamp === 'string');

console.log('ruleEngineAgent tests OK');
