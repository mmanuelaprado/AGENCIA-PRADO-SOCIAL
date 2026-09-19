import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0A192F] text-white px-4 py-3 rounded-lg shadow-xl border border-[#C5A059]/40 text-sm animate-fade-in">
      <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0" />
      <span className="font-medium text-slate-100">{toastMessage}</span>
    </div>
  );
};
