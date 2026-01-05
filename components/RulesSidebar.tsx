
import React from 'react';
import { RuleSummary } from '../types';
import { ShieldCheck, ShieldAlert, Filter } from 'lucide-react';

interface RulesSidebarProps {
  rules_summary: RuleSummary[];
  onFilter: (ruleIds: string[]) => void;
}

export const RulesSidebar: React.FC<RulesSidebarProps> = ({ rules_summary, onFilter }) => {
  return (
    <div className="w-full lg:w-80 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-visa-blue uppercase tracking-[0.3em] flex items-center gap-3">
          Risk Policy
          <span className="bg-visa-blue/5 text-visa-gold text-[9px] px-2 py-0.5 rounded-full border border-visa-blue/10">
            {rules_summary.length}
          </span>
        </h3>
        <button className="text-gray-300 hover:text-visa-blue transition-all hover:rotate-12 active:scale-90 p-1">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {rules_summary.map((rule) => (
          <div 
            key={rule.rule_id}
            className="group p-5 bg-white border border-visa-border hover:bg-visa-gray border-l-2 border-l-transparent hover:border-l-visa-gold rounded-2xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 transition-transform group-hover:scale-110">
                  {rule.status === 'passed' ? (
                    <ShieldCheck className="w-4 h-4 text-visa-gold" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-visa-blue/40" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black text-visa-blue tracking-widest uppercase group-hover:text-visa-blueDark transition-colors">{rule.rule_id}</h4>
                  <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed font-medium uppercase tracking-wider transition-colors group-hover:text-visa-blue/70">{rule.name}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
