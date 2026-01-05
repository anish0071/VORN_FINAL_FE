
import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Save, ArrowRight, ShieldCheck } from 'lucide-react';
import { RowOutput, ChatExplanation } from '../types';
import { api } from '../lib/api';

interface ChatModalProps {
  isOpen: boolean;
  rowIndex?: number;
  rows: RowOutput[];
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, rowIndex, rows, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<ChatExplanation | null>(null);
  
  const row = rowIndex !== undefined ? rows[rowIndex] : null;

  useEffect(() => {
    if (isOpen && row) {
      handleExplain();
    } else {
      setExplanation(null);
    }
  }, [isOpen, rowIndex]);

  const handleExplain = async () => {
    if (!row) return;
    setLoading(true);
    try {
      const res = await api.explainRow(row.original_data, row, row.fired_rules);
      setExplanation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !row) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-visa-blue/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-visa-border rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-8 border-b border-visa-border bg-visa-gray">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-visa-blue rounded-xl shadow-md">
              <MessageSquare className="w-6 h-6 text-visa-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-visa-blue italic">Row Analysis #{rowIndex! + 1}</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">PCI Compliance Audit Trail</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-full text-gray-400 hover:text-visa-blue transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registry Input</h4>
              <div className="bg-visa-gray p-6 rounded-2xl border border-visa-border font-mono text-xs overflow-x-auto">
                <pre className="text-gray-600">
                  {JSON.stringify(row.original_data, null, 2)}
                </pre>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance Mask Output</h4>
                <div className="flex items-center gap-1 text-[10px] text-visa-gold font-black italic">
                  <ShieldCheck className="w-3 h-3" /> SECURE VAULT
                </div>
              </div>
              <div className="bg-visa-blue/5 p-6 rounded-2xl border border-visa-blue/10 font-mono text-xs overflow-x-auto relative">
                <pre className="text-visa-blue font-bold">
                  {JSON.stringify(row.processed_data, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-visa-blue text-white rounded-[32px] p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-visa-gold rounded-xl">
                <ShieldCheck className="w-5 h-5 text-visa-blue" />
              </div>
              <h3 className="font-black italic text-lg uppercase tracking-wider">Audit Intelligence Report</h3>
            </div>
            
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-3 w-3/4 bg-white/20 rounded"></div>
                <div className="h-3 w-1/2 bg-white/20 rounded"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-visa-white/80 leading-relaxed font-medium">
                  {explanation?.explanation}
                </p>
                <div className="flex flex-wrap gap-2">
                  {explanation?.rules_referenced.map(rule => (
                    <span key={rule} className="text-[9px] font-black bg-visa-gold text-visa-blue px-2.5 py-1 rounded-lg uppercase tracking-widest">
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-visa-border bg-visa-gray">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Ask follow-up about PCI compliance..." 
                className="w-full bg-white border border-visa-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-visa-blue text-visa-blue font-medium shadow-sm"
              />
              <button className="absolute right-3 top-3 p-2 bg-visa-blue text-white rounded-xl hover:bg-visa-blueDark transition-colors">
                <Send className="w-4 h-4 text-visa-gold" />
              </button>
            </div>
            <button className="flex items-center gap-2 bg-visa-gold text-visa-blue font-black px-8 py-4 rounded-2xl hover:bg-white border border-visa-gold transition-all shadow-md uppercase text-[11px] tracking-widest">
              <Save className="w-4 h-4" />
              Export Row
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
