
import React, { useCallback } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  processing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected, processing }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (processing) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      onFileSelected(file);
    }
  }, [onFileSelected, processing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`relative group border-2 border-dashed rounded-[40px] p-20 transition-all duration-500 flex flex-col items-center justify-center gap-6 ${
        processing 
          ? 'border-visa-gold bg-visa-gold/5' 
          : 'border-visa-border hover:border-visa-blue/50 bg-visa-gray'
      }`}
    >
      <div className={`p-6 rounded-[28px] transition-all duration-700 ${processing ? 'animate-pulse bg-visa-gold shadow-lg' : 'bg-visa-blue border border-visa-border group-hover:scale-110 shadow-xl'}`}>
        {processing ? (
          <CheckCircle2 className="w-16 h-16 text-visa-blue" />
        ) : (
          <Upload className="w-16 h-16 text-visa-gold" />
        )}
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-black text-visa-blue tracking-tight italic">
          {processing ? 'ENCRYPTING AUDIT DATA...' : 'SECURE INGESTION PORTAL'}
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto text-xs font-bold uppercase tracking-[0.1em]">
          Certified PCI DSS 4.0 Validation Node
        </p>
      </div>

      {!processing && (
        <div className="flex gap-4 mt-6">
          <label className="bg-visa-blue text-white px-10 py-4 rounded-2xl cursor-pointer transition-all hover:bg-visa-blueDark font-black uppercase tracking-widest text-[11px] shadow-lg active:scale-95">
            Ingest CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleChange} />
          </label>
        </div>
      )}

      {processing && (
        <div className="w-full max-w-xs mt-8">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden border border-visa-border">
            <div className="h-full bg-visa-gold animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};
