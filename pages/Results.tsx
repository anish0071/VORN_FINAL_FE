
import React, { useEffect } from 'react';
import { useCompliance } from '../lib/ComplianceContext';
import { api } from '../lib/api';
import { ComplianceBadge } from '../components/ComplianceBadge';
import { RulesSidebar } from '../components/RulesSidebar';
import { DataTable } from '../components/DataTable';
import { ChatModal } from '../components/ChatModal';
import { RemediationInsight } from '../components/RemediationInsight';
import { AgentRectificationLedger } from '../components/AgentRectificationLedger';
import { AgentAuditReport } from '../components/AgentAuditReport';
import { ArrowLeft, Download, FileJson, Clock, Zap, ShieldCheck } from 'lucide-react';
import Papa from 'https://esm.sh/papaparse';

interface ResultsProps { fileId: string; }

export const Results: React.FC<ResultsProps> = ({ fileId }) => {
  const { fileResult, setFileResult, selectedRowIndex, setSelectedRowIndex, chatOpen, setChatOpen, isLoading, setIsLoading } = useCompliance();
  useEffect(() => { if (fileId) loadResult(); }, [fileId]);

  const loadResult = async () => {
    setIsLoading(true);
    try {
      const res = await api.getFileResult(fileId);
      setFileResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!fileResult) return;
    const exportData = fileResult.rows.map(r => ({ ...r.processed_data, compliance_status: r.compliance_status, audit_id: fileResult.file_id }));
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VORN_FIXED_${fileResult.filename}`);
    link.click();
  };

  if (isLoading || !fileResult) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] bg-white animate-in fade-in duration-500">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-visa-blue/5 border-t-visa-gold rounded-full animate-spin"></div>
          <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-visa-blue" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-visa-blue font-black italic text-xl uppercase tracking-tighter">Nexus Sync In-Progress</p>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Compiling RAG Audit Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4">
          <button onClick={() => window.location.hash = '#/'} className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-visa-blue transition-all">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Nexus Core
          </button>
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-black text-visa-blue tracking-tighter italic">{fileResult.filename}</h1>
            <div className="flex items-center gap-2 bg-visa-blue/5 px-4 py-1.5 rounded-full border border-visa-blue/10 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-visa-gold" />
              <span className="text-[10px] font-black text-visa-blue uppercase tracking-widest">Compliance Active</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => {}} className="flex items-center gap-3 bg-white border border-visa-border hover:border-visa-blue text-visa-blue font-black px-6 py-3 rounded-2xl transition-all shadow-sm uppercase text-[10px] tracking-widest">
            <FileJson className="w-4 h-4" /> JSON Export
          </button>
          <button onClick={handleDownloadCSV} className="flex items-center gap-3 bg-visa-blue text-white px-8 py-3 rounded-2xl hover:bg-visa-blueDark shadow-xl transition-all font-black uppercase text-[10px] tracking-widest">
            <Download className="w-4 h-4 text-visa-gold" /> Remediated CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-3 space-y-8">
          <ComplianceBadge fileResult={fileResult} />
          <RemediationInsight fileResult={fileResult} />
          <div className="bg-visa-gray border border-visa-border p-6 rounded-[32px] space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] font-black">Audit Sync</p>
              <Clock className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-[10px] font-bold text-gray-500 italic">Validated at {new Date(fileResult.processed_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-10">
          <AgentAuditReport fileResult={fileResult} />
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-visa-blue uppercase tracking-[0.2em]">Registry Ledger (8 / Page)</h3>
              <div className="flex items-center gap-6 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-visa-gold" /> Passed</span>
                 <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-visa-blue" /> Remediated</span>
              </div>
            </div>
            <div className="shadow-[0_20px_50px_rgba(26,31,113,0.05)] rounded-[32px] overflow-hidden border border-visa-border bg-white">
              <DataTable rows={fileResult.rows} onRowSelect={(idx) => { setSelectedRowIndex(idx); setChatOpen(true); }} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-10">
          <AgentRectificationLedger rows={fileResult.rows} />
          <RulesSidebar rules_summary={fileResult.rules_summary} onFilter={() => {}} />
        </div>
      </div>

      <ChatModal isOpen={chatOpen} rowIndex={selectedRowIndex ?? undefined} rows={fileResult.rows} onClose={() => setChatOpen(false)} />
    </div>
  );
};
