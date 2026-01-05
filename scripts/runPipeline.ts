import fs from 'fs';
import path from 'path';
import { ParserAgent } from '../lib/agents/parserAgent.js';
import { PanAgent } from '../lib/agents/panAgent.js';
import { PiiAgent } from '../lib/agents/piiAgent.js';
import { RuleEngineAgent } from '../lib/agents/ruleEngineAgent.js';
import { ComplianceAgent } from '../lib/agents/complianceAgent.js';
import { pciRules, orgRules } from '../lib/agents/ruleCatalog.js';

async function main() {
  const samplePath = path.join(process.cwd(), 'sample.csv');
  let csv = '';
  if (fs.existsSync(samplePath)) {
    csv = fs.readFileSync(samplePath, 'utf8');
    console.log('Using sample.csv from project root');
  } else {
    console.log('No sample.csv found, using built-in sample');
    csv = 'pan,cardholder_name,channel,retention_days,customer_location,consent_flag\n4111111111111111,John Doe,https,30,DE,true\n4111111111111,Jane Roe,http,120,US,false';
  }

  const parser = new ParserAgent();
  const parseResult = parser.parseCsv(csv);
  const rows = parseResult.rows;

  const panAgent = new PanAgent();
  const piiAgent = new PiiAgent();
  const ruleEngine = new RuleEngineAgent([...pciRules, ...orgRules], panAgent, piiAgent);
  const complianceAgent = new ComplianceAgent();

  const outRows = rows.map(r => ruleEngine.processRow(r));
  const score = complianceAgent.computeFileScore(outRows);
  const summary = complianceAgent.summarizeRules(outRows, [...pciRules, ...orgRules]);

  const result = {
    filename: 'sample.csv',
    total_rows: outRows.length,
    compliance_score: score,
    rules_summary: summary,
    rows: outRows,
  };

  const outFile = path.join(process.cwd(), 'vorn_pipeline_result.json');
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
  console.log('Pipeline complete — result written to', outFile);
}

main().catch(err => { console.error('runPipeline error', err); process.exit(1); });
