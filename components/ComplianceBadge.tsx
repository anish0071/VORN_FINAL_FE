
import React from 'react';
import { FileResult } from '../types';
import { ShieldCheck, Award } from 'lucide-react';

interface ComplianceBadgeProps {
  fileResult: FileResult;
}

export const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({ fileResult }) => {
  return (
    <div className="flex items-center gap-5 bg-visa-gray border border-visa-border rounded-[32px] p-6 pr-10 relative overflow-hidden group shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-visa-gold/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-visa-gold/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-visa-gold/20 transition-colors"></div>
      
      <div className="p-4 rounded-[20px] bg-visa-blue shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-110">
        <ShieldCheck className="w-10 h-10 text-visa-gold" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-4xl font-black text-visa-blue tracking-tighter">
            {fileResult.compliance_score}<span className="text-visa-gold">%</span>
          </h2>
          {fileResult.compliance_score >= 90 && (
            <Award className="w-6 h-6 text-visa-gold fill-visa-gold animate-bounce-slow" />
          )}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1 group-hover:text-visa-blue transition-colors">
          PCI Compliance Metric
        </p>
      </div>
    </div>
  );
};
