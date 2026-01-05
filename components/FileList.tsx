
import React from 'react';
import { FileListItem } from '../types';
import { FileText, ChevronRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface FileListProps {
  files: FileListItem[];
  onFileSelect: (id: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onFileSelect }) => {
  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div 
          key={file.id}
          onClick={() => onFileSelect(file.id)}
          className="group flex items-center justify-between p-6 bg-white border border-visa-border rounded-[24px] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-visa-gray/50 active:scale-[0.99]"
        >
          <div className="flex items-center gap-5">
            <div className="p-3 bg-visa-blue rounded-xl shadow-md transition-transform group-hover:rotate-6">
              <FileText className="w-6 h-6 text-visa-gold" />
            </div>
            <div>
              <h4 className="font-bold text-visa-blue group-hover:text-visa-blueDark transition-colors">{file.filename}</h4>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {new Date(file.processed_at).toLocaleDateString()}
                </span>
                <span className="text-gray-200">|</span>
                <span>{file.row_count} Entries</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <span className={`text-2xl font-black italic tracking-tighter transition-all group-hover:scale-110 ${file.compliance_score >= 95 ? 'text-visa-gold' : 'text-visa-blue'}`}>
                  {file.compliance_score}%
                </span>
                <CheckCircle2 className={`w-5 h-5 transition-colors ${file.compliance_score >= 95 ? 'text-visa-gold' : 'text-visa-blue/30'}`} />
              </div>
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black group-hover:text-visa-blue/50">Audit Score</p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-visa-gold group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      ))}
      
      {files.length === 0 && (
        <div className="text-center py-20 bg-visa-gray border border-dashed border-visa-border rounded-[32px]">
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No previous audit cycles detected</p>
        </div>
      )}
    </div>
  );
};
