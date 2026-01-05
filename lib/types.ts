/** Shared types for V.O.R.N agents layer */
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RowInput {
  pan?: string;
  cvv?: string | null;
  cvv2?: string | null;
  cardholder_name?: string;
  merchant_id?: string;
  log_message?: string;
  channel?: string;
  retention_days?: number | null;
  customer_location?: string;
  consent_flag?: boolean | null;
  privacy_notice_url?: string | null;
  [key: string]: any;
}

export interface RowOutput {
  merchant_id?: string;
  channel?: string;
  customer_location?: string;

  pan_token: string | null;
  pan_last4: string | null;
  pan_masked: string | null;
  log_message_masked?: string | null;
  cardholder_name_masked: string | null;

  retention_days: number;
  gdpr_consent: boolean;
  privacy_notice_url: string;

  fired_rules: string[];
  fixes_applied: string[];
  row_compliant: boolean;
  processing_timestamp: string;
  compliance_warnings: string[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  category: 'PCI' | 'ORG';
  default_value?: any;
  eu_locations?: string[];
  default_url?: string;
  [key: string]: any;
}

export interface RuleSummary {
  rule_id: string;
  name: string;
  affected_rows: number;
  status: 'PASSED' | 'PARTIAL' | 'FAILED';
}

export interface FileResult {
  filename: string;
  total_rows: number;
  rows: RowOutput[];
  compliance_score: number;
  rules_summary: RuleSummary[];
  processing_duration_ms: number;
  error?: string | null;
}
