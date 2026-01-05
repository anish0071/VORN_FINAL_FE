import type { RowInput, RowOutput, Rule } from '../types.js';
import { PanAgent } from './panAgent.js';
import { PiiAgent } from './piiAgent.js';

/**
 * RuleEngineAgent: execute rules for a single row and apply fixes.
 */
export class RuleEngineAgent {
  private rules: Rule[];
  private panAgent: PanAgent;
  private piiAgent: PiiAgent;
  private rulesMap: Map<string, Rule>;

  constructor(
    rules: Rule[],
    panAgent: PanAgent,
    piiAgent: PiiAgent
  ) {
    this.rules = rules;
    this.panAgent = panAgent;
    this.piiAgent = piiAgent;
    this.rulesMap = new Map(rules.map(r => [r.id, r]));
  }

  processRow(input: RowInput): RowOutput {
    const now = new Date().toISOString();
    const out: RowOutput = {
      merchant_id: input.merchant_id,
      channel: input.channel,
      customer_location: input.customer_location,

      pan_token: null,
      pan_last4: null,
      pan_masked: null,
      log_message_masked: null,
      cardholder_name_masked: null,

      retention_days: 0,
      gdpr_consent: Boolean(input.consent_flag),
      privacy_notice_url: input.privacy_notice_url || '',

      fired_rules: [],
      fixes_applied: [],
      row_compliant: true,
      processing_timestamp: now,
      compliance_warnings: [],
    };

    const panAnalysis = this.panAgent.analysePan(input);
    const piiAnalysis = this.piiAgent.analyse(input);

    // Apply PAN transforms
    this.panAgent.applyPanTransforms(input, out);

    // Default retention
    out.retention_days =
      typeof input.retention_days === 'number' && Number.isFinite(input.retention_days)
        ? input.retention_days
        : 0;

    // Evaluate rules
    for (const rule of this.rules) {
      const violated = this.checkRule(rule, input, out, { panAnalysis, piiAnalysis });
      if (violated) {
        out.fired_rules.push(rule.id);
        const fixName = this.applyFix(rule, input, out, { panAnalysis, piiAnalysis });
        if (fixName) out.fixes_applied.push(fixName);
      }
    }

    // CRITICAL rule handling
    const hasCritical = out.fired_rules.some(
      (id: string) => this.rulesMap.get(id)?.severity === 'CRITICAL'
    );
    out.row_compliant = !hasCritical;

    // Ensure masks
    if (!out.cardholder_name_masked) {
      out.cardholder_name_masked =
        this.piiAgent.pseudonymizeName(input.cardholder_name) || '';
    }

    if (!out.log_message_masked && input.log_message) {
      out.log_message_masked =
        this.panAgent.redactPanInText(input.log_message) || null;
    }

    return out;
  }

  private checkRule(rule: Rule, input: RowInput, output: RowOutput, ctx: any): boolean {
    const { panAnalysis, piiAnalysis } = ctx;

    switch (rule.id) {
      case 'RULE_PCI_001_NO_FULL_PAN_STORAGE':
        return !!input.pan;
      case 'RULE_PCI_002_NO_CVV_STORAGE':
        return Boolean(input.cvv || input.cvv2);
      case 'RULE_PCI_003_NO_PAN_IN_LOGS':
        return panAnalysis.pan_present_in_logs;
      case 'RULE_PCI_004_SECURE_CHANNEL_REQUIRED':
        return Boolean(input.pan) && !(input.channel || '').toLowerCase().startsWith('https');
      case 'RULE_PCI_005_PAN_LUHN_VALID':
        return Boolean(input.pan) && !panAnalysis.pan_valid;
      case 'RULE_PCI_006_PAN_MASKING_FORMAT':
        return (
          typeof output.pan_masked === 'string' &&
          output.pan_masked.length > 0 &&
          !/^([X]{4}-)+\d{4}$/.test(output.pan_masked)
        );
      case 'RULE_PCI_007_NO_CARDHOLDER_FULL_NAME':
        return piiAnalysis.has_full_name;
      case 'RULE_PCI_008_AUDIT_TRAIL_REQUIRED':
        return !input.log_message;

      case 'RULE_ORG_001_RETENTION_POLICY':
        return (
          input.retention_days == null ||
          (typeof rule.default_value === 'number' &&
            input.retention_days > rule.default_value)
        );
      case 'RULE_ORG_002_CONSENT_FOR_PII':
        return piiAnalysis.has_pii && !Boolean(input.consent_flag);
      case 'RULE_ORG_003_PRIVACY_NOTICE_REQUIRED':
        if (!input.customer_location) return false;
        const eu = rule.eu_locations || [];
        return eu.includes((input.customer_location || '').toUpperCase()) &&
               !input.privacy_notice_url;

      default:
        return false;
    }
  }

  private applyFix(rule: Rule, input: RowInput, output: RowOutput, ctx: any): string | null {
    switch (rule.id) {
      case 'RULE_PCI_001_NO_FULL_PAN_STORAGE':
        return 'MASKED_PAN_AND_TOKENIZED';
      case 'RULE_PCI_002_NO_CVV_STORAGE':
        return 'REMOVED_CVV';
      case 'RULE_PCI_003_NO_PAN_IN_LOGS':
        output.log_message_masked =
          this.panAgent.redactPanInText(input.log_message) || null;
        return 'REDACTED_LOG_PAN';
      case 'RULE_PCI_004_SECURE_CHANNEL_REQUIRED':
        output.compliance_warnings.push('Non-HTTPS channel for card data');
        return 'NO_AUTOMATED_FIX';
      case 'RULE_PCI_005_PAN_LUHN_VALID':
        output.compliance_warnings.push('PAN failed Luhn validation');
        return 'FLAG_INVALID_PAN';
      case 'RULE_PCI_006_PAN_MASKING_FORMAT':
        if (output.pan_last4) {
          output.pan_masked = `XXXX-XXXX-XXXX-${output.pan_last4}`;
        }
        return 'APPLIED_MASK_FORMAT';
      case 'RULE_PCI_007_NO_CARDHOLDER_FULL_NAME':
        output.cardholder_name_masked =
          this.piiAgent.pseudonymizeName(input.cardholder_name) || '';
        return 'PSEUDONYMIZED_NAME';
      case 'RULE_PCI_008_AUDIT_TRAIL_REQUIRED':
        output.log_message_masked = '[NO_LOG]';
        return 'ADDED_AUDIT_PLACEHOLDER';

      case 'RULE_ORG_001_RETENTION_POLICY':
        output.retention_days =
          typeof rule.default_value === 'number' ? rule.default_value : 90;
        return 'APPLIED_RETENTION_DEFAULT';
      case 'RULE_ORG_002_CONSENT_FOR_PII':
        output.gdpr_consent = Boolean(input.consent_flag);
        return 'CONSENT_FLAGGED';
      case 'RULE_ORG_003_PRIVACY_NOTICE_REQUIRED':
        output.privacy_notice_url =
          rule.default_url || output.privacy_notice_url || '';
        return 'SET_DEFAULT_PRIVACY_URL';

      default:
        return null;
    }
  }
}
