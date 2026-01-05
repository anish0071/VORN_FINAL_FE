
import React, { useState } from 'react';
import { RowOutput } from '../types';
import { ChevronRight, ShieldAlert, ShieldCheck } from 'lucide-react';

interface DataTableProps { rows: RowOutput[]; onRowSelect: (index: number) => void; }

export const DataTable: React.FC<DataTableProps> = ({ rows, onRowSelect }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 8;
  const totalPages = Math.ceil(rows.length / pageSize);
  
  const paginatedRows = rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="w-full flex flex-col bg-white border border-visa-border rounded-[24px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-visa-gray border-b border-visa-border">
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Registry</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">PAN Ledger</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Identity</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Patches</th>
              <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-visa-border">
            {paginatedRows.map((row, idx) => {
              const globalIdx = currentPage * pageSize + idx;
              return (
                <tr 
                  key={row.id} 
                  className="hover:bg-visa-blue/[0.02] transition-colors group cursor-pointer"
                  onClick={() => onRowSelect(globalIdx)}
                >
                  <td className="px-8 py-3.5">
                    <span className="text-[10px] font-black font-mono text-gray-300 group-hover:text-visa-blue/50">
                      ID-{ (globalIdx + 1).toString().padStart(3, '0') }
                    </span>
                  </td>
                  <td className="px-8 py-3.5">
                    <span className="font-mono text-[11px] font-bold text-visa-blue bg-white px-2 py-1 rounded border border-visa-border group-hover:border-visa-gold/30 transition-all">
                      {row.processed_data.pan_masked || '•••• •••• •••• ••••'}
                    </span>
                  </td>
                  <td className="px-8 py-3.5">
                    <span className="text-[11px] font-bold text-gray-500 group-hover:text-visa-blue transition-colors">
                      {row.processed_data.name_masked || 'ANONYMOUS'}
                    </span>
                  </td>
                  <td className="px-8 py-3.5">
                    <div className="flex items-center gap-2">
                      {row.compliance_status === 'compliant' ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-visa-gold/10 border border-visa-gold/30">
                          <ShieldCheck className="w-2.5 h-2.5 text-visa-gold" />
                          <span className="text-[8px] font-black text-visa-gold uppercase tracking-wider">Pass</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-visa-blue/5 border border-visa-blue/10">
                          <ShieldAlert className="w-2.5 h-2.5 text-visa-blue/60" />
                          <span className="text-[8px] font-black text-visa-blue/60 uppercase tracking-wider">Audit</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-3.5 text-center">
                    <span className={`text-[10px] font-black ${row.fixes_count > 0 ? 'text-visa-gold' : 'text-gray-300'}`}>
                      {row.fixes_count || '0'}
                    </span>
                  </td>
                  <td className="px-8 py-3.5 text-right">
                    <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-visa-blue group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-4 border-t border-visa-border bg-visa-gray flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Batch: <span className="text-visa-blue">{currentPage + 1} / {totalPages}</span>
          </span>
          <div className="h-1 w-20 bg-white rounded-full overflow-hidden border border-visa-border">
            <div 
              className="h-full bg-visa-gold transition-all duration-300" 
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 0}
            onClick={handlePrev}
            className="p-2 bg-white border border-visa-border text-gray-400 rounded-lg hover:text-visa-blue disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>
          <button 
            disabled={currentPage === totalPages - 1}
            onClick={handleNext}
            className="p-2 bg-visa-blue text-visa-gold rounded-lg hover:bg-visa-blueDark disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
