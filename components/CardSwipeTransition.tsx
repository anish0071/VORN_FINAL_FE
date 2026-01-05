
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

interface CardSwipeTransitionProps {
  isTriggered: boolean;
}

export const CardSwipeTransition: React.FC<CardSwipeTransitionProps> = ({ isTriggered }) => {
  const [stage, setStage] = useState<'idle' | 'swiping'>('idle');

  useEffect(() => {
    if (isTriggered) {
      setStage('swiping');
      const timer = setTimeout(() => setStage('idle'), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTriggered]);

  if (stage === 'idle') return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden">
      <div 
        className="absolute inset-0 flex items-center transition-transform duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] transform"
        style={{ 
          transform: isTriggered ? 'translateX(0%)' : 'translateX(-100%)',
          animation: 'swipeSequence 1s cubic-bezier(0.87, 0, 0.13, 1) forwards'
        }}
      >
        {/* The Curtain (Wipe Pane) */}
        <div className="relative w-screen h-screen bg-visa-blue flex items-center justify-end">
          <div className="absolute inset-0 bg-gradient-to-r from-visa-blueDark to-visa-blue"></div>
          <div className="absolute inset-y-0 right-0 w-2 bg-visa-gold shadow-[0_0_30px_rgba(247,182,0,0.5)]"></div>
          
          {/* The Leading Card */}
          <div className="relative translate-x-1/2 scale-75 md:scale-100 rotate-y-12">
            <div className="w-[400px] aspect-[1.586/1] bg-gradient-to-br from-[#1a1f71] via-[#0e113d] to-[#1a1f71] rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 p-8 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="w-14 h-11 bg-gradient-to-br from-visa-gold to-[#f7d100] rounded-lg shadow-inner flex items-center justify-center">
                  <Cpu className="w-7 h-7 text-visa-blue/60" />
                </div>
                <div className="italic font-black text-3xl text-white">VISA</div>
              </div>

              <div className="font-mono text-xl tracking-[0.2em] text-white/90 relative z-10">
                NEXUS SCAN ACTIVE
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div className="text-[10px] font-black uppercase tracking-widest text-visa-gold">
                  VALIDATING COMPLIANCE...
                </div>
                <ShieldCheck className="w-8 h-8 text-visa-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes swipeSequence {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
