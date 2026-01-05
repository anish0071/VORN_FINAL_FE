
import React, { useEffect, useRef } from 'react';
import { ShieldCheck, User, Mail, Lock, Globe, Cpu, ArrowRight } from 'lucide-react';
import * as THREE from 'three';

interface SignInProps {
  onLogin: () => void;
}

const VisaCardComponent = () => {
  return (
    <div className="perspective-1000 group relative w-full max-w-sm aspect-[1.586/1] z-20">
      <div className="relative w-full h-full rounded-[20px] overflow-hidden shadow-[0_40px_80px_rgba(26,31,113,0.5)] transition-all duration-700 ease-out transform group-hover:rotate-y-12 group-hover:rotate-x-6 group-hover:scale-110 preserve-3d">
        {/* Deep Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f71] via-[#0e113d] to-[#1a1f71]">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse"></div>
        </div>

        {/* Card Content */}
        <div className="relative h-full p-8 flex flex-col justify-between text-white select-none">
          <div className="flex justify-between items-start">
            <div className="relative">
               <div className="w-14 h-11 bg-gradient-to-br from-visa-gold to-[#f7d100] rounded-lg shadow-inner flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 grid grid-cols-4 opacity-30">
                    {[...Array(4)].map((_, i) => <div key={i} className="border-r border-visa-blue"></div>)}
                 </div>
                 <Cpu className="w-7 h-7 text-visa-blue/60 relative z-10" />
               </div>
               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-visa-gold rounded-full border-2 border-visa-blue animate-ping"></div>
            </div>
            <div className="flex flex-col items-end">
               <div className="italic font-black text-4xl leading-none tracking-tighter">VISA</div>
               <div className="text-[7px] uppercase tracking-[0.4em] font-black text-visa-gold mt-1">NEXUS PLATINUM</div>
            </div>
          </div>

          <div className="space-y-1 py-4">
            <div className="flex gap-4 font-mono text-2xl tracking-[0.25em] font-medium drop-shadow-xl text-white/90">
              <span>4111</span><span>****</span><span>****</span><span>8890</span>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="text-[6px] font-black uppercase opacity-60 leading-tight">Secure<br/>Node</div>
                 <div className="text-xs font-mono font-bold tracking-[0.2em] text-visa-gold">AUTH_VORN_01</div>
              </div>
              <div className="text-sm font-black uppercase tracking-[0.2em]">OPERATOR ACCESS</div>
            </div>
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl group-hover:scale-125 transition-transform duration-500">
               <ShieldCheck className="w-6 h-6 text-visa-gold" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackgroundGrid = () => (
  <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
       style={{ backgroundImage: 'radial-gradient(#1a1f71 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
  </div>
);

export const SignIn: React.FC<SignInProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-1000">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-12 { transform: rotateY(12deg); }
        .rotate-x-6 { transform: rotateX(6deg); }
      `}</style>

      {/* Brand Side */}
      <div className="w-full md:w-[60%] flex flex-col items-center justify-center p-12 relative bg-[#fcfcfc] border-r border-gray-100 overflow-hidden">
        <BackgroundGrid />
        
        <div className="relative z-10 flex flex-col items-center max-w-2xl text-center space-y-16">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-[2px] w-12 bg-visa-gold/40"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-visa-blue/40">Established 2025</span>
              <div className="h-[2px] w-12 bg-visa-gold/40"></div>
            </div>
            <div className="flex items-center gap-8">
              <div className="bg-visa-blue p-5 rounded-[32px] shadow-2xl animate-spin-slow ring-8 ring-visa-blue/5">
                <ShieldCheck className="w-14 h-14 text-visa-gold" />
              </div>
              <h1 className="text-9xl font-black italic text-visa-blue tracking-tighter leading-none select-none drop-shadow-sm">VORN<span className="text-visa-gold">.</span></h1>
            </div>
          </div>

          <div className="space-y-8 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-visa-gold/10 blur-[60px] rounded-full"></div>
            <h2 className="text-5xl font-black text-visa-blue leading-[1.1] tracking-tight">
              The Sovereign <br />
              <span className="bg-gradient-to-r from-visa-blue via-visa-blueLight to-visa-gold bg-clip-text text-transparent italic">Compliance Nexus.</span>
            </h2>
            <p className="text-gray-400 font-bold text-lg leading-relaxed max-w-md mx-auto uppercase tracking-tighter opacity-70">
              Automated RAG-Agent Orchestration for the <br/>Global Cardholder Data Environment.
            </p>
          </div>

          <div className="w-full flex justify-center py-10">
             <VisaCardComponent />
          </div>

          <div className="flex gap-12 items-center text-[9px] text-gray-300 font-black uppercase tracking-[0.4em]">
             <span className="flex items-center gap-3 hover:text-visa-blue transition-colors cursor-default"><Globe className="w-4 h-4 text-visa-gold/50" /> Omni Protocol</span>
             <span className="flex items-center gap-3 hover:text-visa-blue transition-colors cursor-default"><Cpu className="w-4 h-4 text-visa-gold/50" /> Agent-Core V4</span>
             <span className="flex items-center gap-3 hover:text-visa-blue transition-colors cursor-default"><ShieldCheck className="w-4 h-4 text-visa-gold/50" /> ISO Certified</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-[40%] bg-visa-blue flex flex-col justify-center items-center p-8 md:p-20 relative shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,31,113,0.9),rgba(26,31,113,0.9)),url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        
        <div className="w-full max-w-md space-y-12 relative z-10 animate-in fade-in slide-in-from-right-10 duration-1000">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-visa-gold animate-pulse"></div>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/50">Secure Authentication Node</span>
            </div>
            <h2 className="text-7xl font-black text-white tracking-tighter italic leading-none">Access.</h2>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.5em]">Identity Verification Registry</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-visa-gold uppercase tracking-[0.3em] ml-6">Registry ID</label>
              <div className="relative group">
                <span className="absolute left-7 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-visa-gold transition-colors"><User className="w-5 h-5" /></span>
                <input type="text" placeholder="Personnel_ID_77" className="w-full h-18 bg-white/5 border border-white/10 rounded-[24px] pl-16 pr-8 text-white font-bold focus:outline-none focus:ring-2 focus:ring-visa-gold/50 focus:bg-white/10 transition-all placeholder:text-white/10 placeholder:uppercase" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-visa-gold uppercase tracking-[0.3em] ml-6">Secure Key</label>
              <div className="relative group">
                <span className="absolute left-7 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-visa-gold transition-colors"><Lock className="w-5 h-5" /></span>
                <input type="password" placeholder="••••••••••••" className="w-full h-18 bg-white/5 border border-white/10 rounded-[24px] pl-16 pr-8 text-white font-bold focus:outline-none focus:ring-2 focus:ring-visa-gold/50 focus:bg-white/10 transition-all placeholder:text-white/10" />
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <button 
                onClick={onLogin} 
                className="w-full bg-visa-gold text-visa-blue font-black py-6 rounded-[24px] hover:shadow-[0_20px_40px_rgba(247,182,0,0.3)] hover:-translate-y-1 transition-all text-sm uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 group"
              >
                Establish Connection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <p className="text-center text-[9px] text-white/30 font-bold uppercase tracking-widest">Forgot Registry Credentials?</p>
            </div>
          </div>

          <div className="pt-16 flex flex-col items-center gap-4 opacity-20">
             <div className="h-[1px] w-32 bg-white"></div>
             <p className="text-[8px] text-white uppercase font-black tracking-[0.6em]">Visa Global Security Orchestrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};
