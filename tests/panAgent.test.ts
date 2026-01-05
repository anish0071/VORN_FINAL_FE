import assert from 'assert';
import { PanAgent } from '../lib/agents/panAgent.js';

const pan = new PanAgent();

// Visa valid sample: 4111111111111111 (common test number)
const input = { pan: '4111111111111111', log_message: 'charged card 4111111111111111' } as any;
const analysis = pan.analysePan(input);
assert(analysis.has_card_data === true, 'should detect card data');
assert(analysis.pan_valid === true, 'should pass Luhn');
assert(analysis.scheme === 'VISA', 'should detect VISA');
assert(analysis.pan_present_in_logs === true, 'should detect pan in logs');

const out: any = {};
pan.applyPanTransforms(input, out);
assert(out.pan_token && out.pan_token.startsWith('V4'), 'token created');
assert(out.pan_last4 === '1111');
assert(out.pan_masked && out.pan_masked.endsWith('1111'));

const red = pan.redactPanInText('here 4111111111111111 there');
assert(red && red.includes('[REDACTED]'));

console.log('panAgent tests OK');
