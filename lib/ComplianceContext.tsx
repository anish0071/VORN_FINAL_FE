
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FileResult } from '../types';

interface ComplianceContextType {
  fileResult: FileResult | null;
  setFileResult: (res: FileResult | null) => void;
  selectedRowIndex: number | null;
  setSelectedRowIndex: (idx: number | null) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const ComplianceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fileResult, setFileResult] = useState<FileResult | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ComplianceContext.Provider value={{
      fileResult, setFileResult,
      selectedRowIndex, setSelectedRowIndex,
      chatOpen, setChatOpen,
      isLoading, setIsLoading
    }}>
      {children}
    </ComplianceContext.Provider>
  );
};

export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (!context) throw new Error('useCompliance must be used within ComplianceProvider');
  return context;
};
