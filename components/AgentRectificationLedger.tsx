
import React from 'react';
import { RowOutput } from '../types';
import { ShieldCheck, ArrowRight, Cpu, Hash } from 'lucide-react';

interface AgentRectificationLedgerProps {
  rows: RowOutput[];
}

export const AgentRectificationLedger: React.FC<AgentRectificationLedgerProps> = ({ rows }) => {
  const rectifiedRows = rows.filter(r => r.fixes_count > 0).slice(0, 3); // More compact: show top 3

  return (
    <div className="bg-white border border-visa-border rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="bg-visa-gray px-5 py-3 border-b border-visa-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-visa-blue" />
          <h3 className="text-[9px] font-black text-visa-blue uppercase tracking-[0.2em]">Delta Rectification Log</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-visa-gold animate-pulse"></div>
          <span className="text-[8px] font-black text-visa-blue uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="divide-y divide-visa-border">
        {rectifiedRows.length > 0 ? (
          rectifiedRows.map((row, idx) => (
            <div key={row.id} className="p-4 space-y-3 group hover:bg-visa-gray/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-3 h-3 text-visa-gold" />
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Record_ID {row.id.split('_')[1]}</span>
                </div>
                <span className="text-[7px] font-black bg-visa-blue text-white px-1.5 py-0.5 rounded uppercase tracking-widest">PCI-3.3 Compliance</span>
              </div>
              
              <div className="grid grid-cols-[1fr_24px_1fr] items-center gap-2">
                <div className="bg-red-50/50 border border-red-100 p-2 rounded-lg">
                  <p className="text-[7px] font-black text-red-400 uppercase mb-1 tracking-tighter">Violated</p>
                  <p className="text-[9px] font-mono font-bold text-red-700 truncate">{row.original_data.pan || 'CLEAR_PAN'}</p>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-3 h-3 text-visa-gold" />
                </div>

                <div className="bg-visa-blue p-2 rounded-lg shadow-inner">
                  <p className="text-[7px] font-black text-visa-gold uppercase mb-1 tracking-tighter">Remediated</p>
                  <p className="text-[9px] font-mono font-bold text-white truncate">{row.processed_data.pan_masked || 'MASKED_PAN'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center px-4">
             <ShieldCheck className="w-5 h-5 text-visa-blue/10 mx-auto mb-2" />
             <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Nexus Zero-Defect State</p>
          </div>
        )}
      </div>

      <button className="w-full py-3 bg-visa-blue text-visa-gold text-[9px] font-black uppercase tracking-[0.2em] hover:bg-visa-blueDark transition-colors">
        Full Nexus Sync
      </button>
    </div>
  );
};
