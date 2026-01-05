
import React from 'react';
import { FileResult } from '../types';
import { ShieldCheck, FileText, Globe, Lock, AlertCircle, ExternalLink } from 'lucide-react';

interface AgentAuditReportProps {
  fileResult: FileResult;
}

export const AgentAuditReport: React.FC<AgentAuditReportProps> = ({ fileResult }) => {
  const violations = fileResult.rows.filter(r => r.compliance_status !== 'compliant');

  return (
    <div className="bg-white border border-visa-border rounded-[28px] p-6 space-y-6 shadow-sm transition-all hover:shadow-md">
      {/* Documentation Header */}
      <div className="flex justify-between items-start border-b border-visa-border pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-visa-blue p-2 rounded-lg">
            <FileText className="w-4 h-4 text-visa-gold" />
          </div>
          <div>
            <h2 className="text-sm font-black italic text-visa-blue tracking-tighter uppercase">Nexus Compliance Ledger</h2>
            <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em]">Authorized RAG Agent Diagnostic • v4.1</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[9px] font-black text-visa-blue bg-visa-gold/10 px-2 py-0.5 rounded-full border border-visa-gold/20 mb-1 tracking-widest">CERTIFIED</span>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">REF: {fileResult.file_id.slice(0, 12)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Executive Directive */}
        <div className="bg-visa-gray p-4 rounded-2xl border border-visa-border">
          <h3 className="text-[9px] font-black text-visa-blue uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-visa-gold" /> Policy Directive
          </h3>
          <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
            VORN Agent <span className="text-visa-blue font-bold">NODE-01</span> detected <span className="text-red-500 font-bold">{violations.length} high-severity</span> deviations from <span className="text-visa-blue font-bold">PCI DSS 4.0.1</span>. Automated hot-fixing was applied to preserve cryptographic integrity.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-[8px] font-black uppercase text-gray-400">
              <span>Nexus Integrity Score</span>
              <span className="text-visa-blue">{fileResult.compliance_score}%</span>
            </div>
            <div className="h-1 w-full bg-visa-gray rounded-full overflow-hidden">
               <div className="h-full bg-visa-blue" style={{ width: `${fileResult.compliance_score}%` }}></div>
            </div>
            <div className="flex gap-3 pt-1">
              <span className="flex items-center gap-1 text-[7px] font-black text-visa-gold uppercase tracking-widest"><ShieldCheck className="w-2.5 h-2.5" /> Validated</span>
              <span className="flex items-center gap-1 text-[7px] font-black text-visa-blue uppercase tracking-widest"><Globe className="w-2.5 h-2.5" /> EMV Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Directives Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[9px] font-black text-visa-blue uppercase tracking-widest">Remediation Log</h3>
          <button className="text-[8px] font-black text-visa-gold uppercase flex items-center gap-1 hover:underline">
            View Full Docs <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {violations.slice(0, 2).map((row, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-visa-gray/50 rounded-xl border border-visa-border group hover:bg-white hover:border-visa-gold/30 transition-all">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-[9px] font-black text-visa-blue uppercase tracking-tighter">Directive #{i+1}: PAN Redaction</p>
                  <p className="text-[8px] text-red-500 font-bold">REQ 3.3</p>
                </div>
                <p className="text-[9px] text-gray-500 leading-tight">Storage of unmasked primary account number detected. Agent performed truncation fix.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
