import assert from 'assert';
import { PiiAgent } from '../lib/agents/piiAgent.js';

const a = new PiiAgent();
const r = { cardholder_name: 'John Doe', email: 'john@example.com', phone: '+1 555-123-4567' } as any;
const analysis = a.analyse(r);
assert(analysis.has_full_name === true);
assert(analysis.has_email === true);
assert(analysis.has_phone === true);

const pseudo = a.pseudonymizeName('John Doe');
assert(pseudo === 'J. Doe');

console.log('piiAgent tests OK');
