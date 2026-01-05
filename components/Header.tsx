
import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="h-20 border-b border-gray-200 bg-white sticky top-0 z-50 flex items-center justify-between px-10 shadow-sm">
      <div 
        className="flex items-center gap-4 group cursor-pointer" 
        onClick={() => window.location.hash = '#/'}
      >
        <div className="bg-visa-blue p-2.5 rounded-xl shadow-md group-hover:scale-110 transition-transform animate-spin-slow duration-[10000ms]">
          <ShieldCheck className="text-visa-gold w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black italic text-visa-blue tracking-tighter leading-none select-none">
            VORN<span className="text-visa-gold">.</span>
          </h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black mt-0.5">Omni RAG Nexus</p>
        </div>
      </div>
      
      <button 
        onClick={onLogout}
        className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-visa-blue hover:text-visa-gold transition-all px-6 py-3 rounded-xl border border-gray-100 hover:border-visa-gold/20 shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        Terminate Session
      </button>
    </header>
  );
};
