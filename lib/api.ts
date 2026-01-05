
import { FileResult, FileListItem, RowInput, RowOutput, ChatExplanation } from '../types';

const API_BASE = '/api';

const mockFiles: FileListItem[] = [
  { id: 'file_1', filename: 'q3_transactions_audit.csv', compliance_score: 98, row_count: 1250, processed_at: new Date().toISOString() },
  { id: 'file_2', filename: 'merchant_portal_export.csv', compliance_score: 84, row_count: 450, processed_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'file_3', filename: 'legacy_test_data.csv', compliance_score: 62, row_count: 3100, processed_at: new Date(Date.now() - 172800000).toISOString() }
];

export const api = {
  async processFile(csvContent: string, filename?: string): Promise<FileResult> {
    try {
      const response = await fetch(`${API_BASE}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv_content: csvContent, filename }),
      });
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (e) {
      // Fallback mock for demo if server is offline
      await new Promise(r => setTimeout(r, 2000));
      return {
        file_id: 'mock_' + Math.random().toString(36).substr(2, 9),
        filename: filename || 'uploaded_data.csv',
        rows: Array(10).fill(0).map((_, i) => ({
          id: `row_${i}`,
          original_data: { pan: '4111222233334444', name: 'John Doe', amount: 100 * (i+1) },
          processed_data: { pan_masked: '4111-XXXX-XXXX-4444', name_masked: 'J. Doe', amount: 100 * (i+1) },
          compliance_status: i % 5 === 0 ? 'warning' : 'compliant',
          fired_rules: ['PCI_001', 'VISA_007'],
          fixes_count: 2
        })),
        compliance_score: 92,
        rules_summary: [
          { rule_id: 'PCI_001', name: 'PAN Masking', description: 'Primary Account Numbers must be masked.', status: 'passed', count: 1200 },
          { rule_id: 'VISA_007', name: 'Tokenization', description: 'Sensitive data must use secure tokens.', status: 'warning', count: 50 }
        ],
        processed_at: new Date().toLocaleString(),
        total_rows: 1250,
        compliant_count: 1200
      };
    }
  },

  async listFiles(limit: number = 10): Promise<FileListItem[]> {
    try {
      const response = await fetch(`${API_BASE}/files?limit=${limit}`);
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (e) {
      return mockFiles.slice(0, limit);
    }
  },

  async getFileResult(fileId: string): Promise<FileResult> {
    try {
      const response = await fetch(`${API_BASE}/files/${fileId}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.file_result;
    } catch (e) {
      return {
        file_id: fileId,
        filename: 'demo_results.csv',
        rows: Array(20).fill(0).map((_, i) => ({
          id: `row_${i}`,
          original_data: { pan: '4111222233334444', name: 'Jane Smith', date: '2023-10-01' },
          processed_data: { pan_masked: '4111-XXXX-XXXX-4444', name_masked: 'J. Smith', date: '2023-10-01' },
          compliance_status: i % 7 === 0 ? 'non_compliant' : i % 3 === 0 ? 'warning' : 'compliant',
          fired_rules: ['PCI_001', 'VISA_007'],
          fixes_count: i % 3 === 0 ? 3 : 0
        })),
        compliance_score: 95,
        rules_summary: [
          { rule_id: 'PCI_001', name: 'PAN Encryption', description: 'PAN data should not be in cleartext.', status: 'passed', count: 19 },
          { rule_id: 'VISA_002', name: 'Name Masking', description: 'Personal names should be truncated.', status: 'passed', count: 20 },
          { rule_id: 'ORG_999', name: 'Data Retention', description: 'Expired records must be deleted.', status: 'failed', count: 1 }
        ],
        processed_at: new Date().toLocaleString(),
        total_rows: 20,
        compliant_count: 19
      };
    }
  },

  async explainRow(before: RowInput, after: RowOutput, fired_rules: string[]): Promise<ChatExplanation> {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ before, after, fired_rules }),
      });
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (e) {
      return {
        explanation: "This record was automatically remediated to meet PCI DSS Requirement 3.3. The Primary Account Number (PAN) was truncated to display only the first 6 and last 4 digits. Additionally, the cardholder name was masked as PII (Personally Identifiable Information) to reduce the scope of the CDE (Cardholder Data Environment).",
        rules_referenced: fired_rules.length ? fired_rules : ['PCI-3.3', 'VISA-SECURITY-01']
      };
    }
  }
};
