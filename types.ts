
export interface RowInput {
  [key: string]: any;
}

export interface RowOutput {
  id: string;
  original_data: RowInput;
  processed_data: {
    pan_masked?: string;
    name_masked?: string;
    [key: string]: any;
  };
  compliance_status: 'compliant' | 'warning' | 'non_compliant';
  fired_rules: string[];
  fixes_count: number;
}

export interface RuleSummary {
  rule_id: string;
  name: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
  count: number;
}

export interface FileResult {
  file_id: string;
  filename: string;
  rows: RowOutput[];
  compliance_score: number;
  rules_summary: RuleSummary[];
  processed_at: string;
  total_rows: number;
  compliant_count: number;
}

export interface FileListItem {
  id: string;
  filename: string;
  compliance_score: number;
  row_count: number;
  processed_at: string;
}

export interface ChatExplanation {
  explanation: string;
  rules_referenced: string[];
}
