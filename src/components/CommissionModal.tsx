import React, { useState, useEffect } from 'react';
import { X, Coins, Calendar, DollarSign, Building2, User } from 'lucide-react';
import { Commission, CommissionStatus } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (commission: Partial<Commission>) => void;
  editingCommission: Commission | null;
}

export const CommissionModal: React.FC<CommissionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCommission,
}) => {
  const [commissionValue, setCommissionValue] = useState<number>(0);
  const [expectedDate, setExpectedDate] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [status, setStatus] = useState<CommissionStatus>('pendente');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingCommission) {
      setCommissionValue(editingCommission.commissionValue || 0);
      setExpectedDate(editingCommission.expectedDate || '');
      setReceivedDate(editingCommission.receivedDate || '');
      setStatus(editingCommission.status || 'pendente');
      setNotes(editingCommission.notes || '');
    }
  }, [editingCommission, isOpen]);

  if (!isOpen || !editingCommission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      commissionValue: Number(commissionValue) || 0,
      expectedDate,
      receivedDate: status === 'recebida' ? (receivedDate || new Date().toISOString().split('T')[0]) : undefined,
      status,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full my-8 overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0A192F] px-6 py-4 flex items-center justify-between border-b border-[#1E2D4A]">
          <div className="flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-[#C5A059]" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Detalhes da Comissão
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-only reference info */}
        <div className="bg-slate-50 p-4 border-b border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase">Cliente:</span>
            <p className="font-bold text-[#0A192F] mt-0.5">{editingCommission.clientName}</p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold uppercase">Empresa Parceira:</span>
            <p className="font-bold text-[#0A192F] mt-0.5">{editingCommission.partnerName}</p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold uppercase">Valor da Venda:</span>
            <p className="font-bold text-slate-800 mt-0.5">
              {formatCurrency(editingCommission.saleValue)}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold uppercase">Identificador:</span>
            <p className="font-mono text-slate-500 mt-0.5">{editingCommission.id}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
              Status da Comissão *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CommissionStatus)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
            >
              <option value="pendente">Pendente</option>
              <option value="recebida">Recebida</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
              Valor da Comissão (R$) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-xs font-bold text-[#C5A059]">R$</span>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                value={commissionValue}
                onChange={(e) => setCommissionValue(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-3.5 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Data Prevista *
              </label>
              <input
                type="date"
                required
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {status === 'recebida' && (
              <div>
                <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                  Data de Recebimento
                </label>
                <input
                  type="date"
                  value={receivedDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
              Observações / Comprovante
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Número de transação PIX, banco de recebimento ou detalhes..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-[#0A192F] bg-[#C5A059] hover:bg-[#B38E46] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Salvar Comissão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
