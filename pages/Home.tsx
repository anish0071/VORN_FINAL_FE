
import React, { useEffect, useState } from 'react';
import { UploadZone } from '../components/UploadZone';
import { FileList } from '../components/FileList';
import { FileListItem } from '../types';
import { api } from '../lib/api';
import { History, LayoutGrid, ShieldCheck, Zap, Activity, Cpu, Globe, ArrowUpRight } from 'lucide-react';

export const Home: React.FC = () => {
  const [files, setFiles] = useState<FileListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => { loadFiles(); }, []);

  const loadFiles = async () => {
    try {
      const data = await api.listFiles(6);
      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelected = async (file: File) => {
    setProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        try {
          const result = await api.processFile(content, file.name);
          window.location.hash = `#/results/${result.file_id}`;
        } catch (err) {
          alert('Error processing file.');
        } finally {
          setProcessing(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setProcessing(false);
    }
  };

  return (
    <main className="p-10 max-w-[1600px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Upper Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center gap-4">
             <div className="bg-visa-blue/5 border border-visa-blue/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-visa-gold animate-ping"></span>
                <span className="text-[9px] font-black text-visa-blue uppercase tracking-[0.3em]">Operational Node: US-EAST-01</span>
             </div>
             <div className="flex items-center gap-2 text-gray-400">
                <Globe className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Global Nexus Enabled</span>
             </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-7xl font-black text-visa-blue tracking-tighter italic leading-none">NEXUS CONTROL<span className="text-visa-gold">.</span></h1>
            <p className="text-gray-400 font-bold text-lg leading-relaxed uppercase tracking-tighter opacity-80">
              High-Fidelity RAG-Agent Deployment for <br/>Real-Time PCI DSS 4.0 Compliance Orchestration.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white border-2 border-visa-blue p-6 rounded-[32px] shadow-xl shadow-visa-blue/5 flex items-center gap-6 group hover:border-visa-gold transition-colors">
            <div className="p-4 bg-visa-blue rounded-2xl group-hover:rotate-6 transition-transform">
               <Cpu className="w-6 h-6 text-visa-gold" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">RAG Confidence</p>
              <p className="text-3xl font-black text-visa-blue italic leading-none">99.98%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Ingestion & Live Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white border border-visa-border rounded-[48px] overflow-hidden shadow-2xl transition-all hover:shadow-visa-blue/10 group">
             <div className="p-1 bg-gradient-to-r from-visa-blue via-visa-gold to-visa-blue group-hover:from-visa-gold group-hover:via-visa-blue group-hover:to-visa-gold transition-all duration-1000 opacity-20"></div>
             <UploadZone onFileSelected={handleFileSelected} processing={processing} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-visa-gray border border-visa-border p-8 rounded-[40px] space-y-6 hover:bg-white transition-all cursor-default hover:shadow-xl hover:-translate-y-1 group">
               <div className="flex justify-between items-start">
                  <Activity className="w-6 h-6 text-visa-blue group-hover:scale-125 transition-transform" />
                  <ArrowUpRight className="w-4 h-4 text-gray-300" />
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Integrity Rate</h4>
                  <p className="text-3xl font-black text-visa-blue italic">98.4<span className="text-visa-gold">%</span></p>
               </div>
            </div>
            <div className="bg-visa-gray border border-visa-border p-8 rounded-[40px] space-y-6 hover:bg-white transition-all cursor-default hover:shadow-xl hover:-translate-y-1 group">
               <div className="flex justify-between items-start">
                  <ShieldCheck className="w-6 h-6 text-visa-blue group-hover:scale-125 transition-transform" />
                  <ArrowUpRight className="w-4 h-4 text-gray-300" />
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Policies Aligned</h4>
                  <p className="text-3xl font-black text-visa-blue italic">2.4<span className="text-visa-gold text-lg">M+</span></p>
               </div>
            </div>
            <div className="bg-visa-gray border border-visa-border p-8 rounded-[40px] space-y-6 hover:bg-white transition-all cursor-default hover:shadow-xl hover:-translate-y-1 group">
               <div className="flex justify-between items-start">
                  <Zap className="w-6 h-6 text-visa-blue group-hover:scale-125 transition-transform" />
                  <ArrowUpRight className="w-4 h-4 text-gray-300" />
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Remediation Latency</h4>
                  <p className="text-3xl font-black text-visa-blue italic">12<span className="text-visa-gold text-lg">ms</span></p>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="lg:col-span-4 h-full">
           <div className="bg-visa-blue h-full text-white rounded-[48px] p-12 space-y-12 relative overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-80 h-80 bg-visa-gold opacity-10 blur-[100px] -mr-40 -mt-40 animate-pulse"></div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-visa-gold p-2.5 rounded-xl">
                    <LayoutGrid className="w-5 h-5 text-visa-blue" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-visa-gold">Nexus System Stack</h3>
                </div>
                <p className="text-3xl font-black italic tracking-tighter leading-tight">Autonomous Policy Execution Active.</p>
              </div>

              <div className="space-y-8 relative z-10 flex-1 py-10">
                {[
                  { text: "Cryptographic PAN Masking", status: "Active" },
                  { text: "PII Entity Redaction", status: "Enabled" },
                  { text: "PCI DSS 4.0.1 Alignment", status: "Live" },
                  { text: "RAG Verification Cycle", status: "Syncing" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-visa-gold"></div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">{item.text}</span>
                    </div>
                    <span className="text-[9px] font-black text-visa-gold/50 group-hover:text-visa-gold uppercase tracking-[0.2em] border border-white/10 px-3 py-1 rounded-full">{item.status}</span>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-visa-gold/30" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Nexus Network</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-visa-gold/50">Verified End-to-End</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* History Section */}
      <section className="space-y-10 pb-20">
        <div className="flex items-center justify-between border-b-2 border-visa-gray pb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-visa-gray rounded-[24px]">
              <History className="w-8 h-8 text-visa-blue" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-visa-blue tracking-tighter italic uppercase">Audit Archive</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Historical Compliance Ledgers</p>
            </div>
          </div>
          <button className="text-[11px] font-black text-visa-blue hover:text-white transition-all uppercase tracking-[0.3em] border-2 border-visa-blue/10 px-10 py-4 rounded-2xl hover:bg-visa-blue hover:shadow-xl">Global Archive</button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-visa-gray rounded-[40px] animate-pulse"></div>)}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <FileList files={files} onFileSelect={(id) => window.location.hash = `#/results/${id}`} />
          </div>
        )}
      </section>
    </main>
  );
};
