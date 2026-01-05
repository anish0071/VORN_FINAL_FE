
import React from 'react';
import { BrainCircuit, Workflow, ShieldCheck, Zap, ArrowRight, Database } from 'lucide-react';
import { FileResult } from '../types';

interface RemediationInsightProps {
  fileResult: FileResult;
}

export const RemediationInsight: React.FC<RemediationInsightProps> = ({ fileResult }) => {
  const violations = fileResult.total_rows - fileResult.compliant_count;
  
  return (
    <div className="bg-visa-blue text-white rounded-[32px] p-8 space-y-8 relative overflow-hidden group shadow-2xl shadow-visa-blue/20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-visa-gold/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-visa-gold/20 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-16 -mb-16"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-visa-gold rounded-2xl shadow-lg transform group-hover:rotate-12 transition-transform">
            <BrainCircuit className="w-6 h-6 text-visa-blue" />
          </div>
          <div>
            <h3 className="text-lg font-black italic tracking-tight uppercase leading-none">Agentic Alignment</h3>
            <p className="text-[9px] text-visa-gold font-black uppercase tracking-[0.3em] mt-1">Nexus RAG Logic Active</p>
          </div>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
           <Zap className="w-3 h-3 text-visa-gold animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-6">
        {/* Remediation Flow Diagram */}
        <div className="flex items-center justify-between px-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Database className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Raw Input</span>
          </div>
          <ArrowRight className="w-4 h-4 text-visa-gold/50 animate-pulse" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-visa-gold flex items-center justify-center shadow-[0_0_20px_rgba(247,182,0,0.4)]">
              <Workflow className="w-5 h-5 text-visa-blue" />
            </div>
            <span className="text-[8px] font-black uppercase text-visa-gold tracking-widest">RAG Agent</span>
          </div>
          <ArrowRight className="w-4 h-4 text-visa-gold/50 animate-pulse" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-[8px] font-black uppercase text-white tracking-widest">Aligned</span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
            <p className="text-[10px] text-visa-gold font-black uppercase tracking-widest mb-2">Omni Engine Report</p>
            <p className="text-xs text-white/70 leading-relaxed">
              Analyzed <span className="text-white font-bold">{fileResult.total_rows} entries</span> against latest <span className="text-visa-gold font-bold">PCI DSS 4.0.1</span> policies. 
              <span className="text-white font-bold"> {violations} anomalies</span> were detected and neutralized via agentic masking.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-[8px] text-gray-400 font-black uppercase mb-1">Agent Confidence</p>
              <p className="text-lg font-black text-visa-gold italic">99.8%</p>
            </div>
            <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-[8px] text-gray-400 font-black uppercase mb-1">Policy Matches</p>
              <p className="text-lg font-black text-white italic">42</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Meta */}
      <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
        <span>Nexus Node: US-EAST-01</span>
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Encrypted Logs</span>
      </div>
    </div>
  );
};
