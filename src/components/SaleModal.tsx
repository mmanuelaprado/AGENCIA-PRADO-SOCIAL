import React, { useState, useEffect } from 'react';
import { X, TrendingUp, DollarSign, Calendar, Building2, User, Sparkles } from 'lucide-react';
import { Sale, SaleStatus, Partner, Lead } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Omit<Sale, 'id' | 'createdAt'>, expectedCommissionDate?: string) => void;
  partners: Partner[];
  editingSale?: Sale | null;
  initialLead?: Lead | null;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  partners,
  editingSale,
  initialLead,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [productService, setProductService] = useState('');
  const [saleValue, setSaleValue] = useState<number | ''>('');
  const [commissionValue, setCommissionValue] = useState<number | ''>('');
  const [status, setStatus] = useState<SaleStatus>('concluida');
  const [expectedDate, setExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [isAutoCalculated, setIsAutoCalculated] = useState(true);

  // Initialize or update fields
  useEffect(() => {
    if (editingSale) {
      setDate(editingSale.date || new Date().toISOString().split('T')[0]);
      setClientName(editingSale.clientName || '');
      setPartnerId(editingSale.partnerId || '');
      setProductService(editingSale.productService || '');
      setSaleValue(editingSale.saleValue || 0);
      setCommissionValue(editingSale.commissionValue || 0);
      setStatus(editingSale.status || 'concluida');
      setNotes(editingSale.notes || '');
      setIsAutoCalculated(false);
    } else if (initialLead) {
      // Pre-filled from lead conversion
      setDate(new Date().toISOString().split('T')[0]);
      setClientName(initialLead.name);
      setPartnerId(initialLead.partnerId);
      setProductService(initialLead.productService || '');
      setSaleValue('');
      setCommissionValue('');
      setStatus('concluida');
      setNotes(`Venda convertida a partir do lead: ${initialLead.name}`);
      setIsAutoCalculated(true);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setClientName('');
      const defaultP = partners[0];
      setPartnerId(defaultP ? defaultP.id : '');
      setProductService(defaultP ? defaultP.productService : '');
      setSaleValue('');
      setCommissionValue('');
      setStatus('concluida');
      setNotes('');
      setIsAutoCalculated(true);
    }
  }, [editingSale, initialLead, partners, isOpen]);

  // Selected partner
  const currentPartner = partners.find((p) => p.id === partnerId);

  // Auto-calculate commission whenever saleValue or partner changes
  useEffect(() => {
    if (!isAutoCalculated || !currentPartner) return;

    const numValue = typeof saleValue === 'number' ? saleValue : parseFloat(String(saleValue)) || 0;

    if (currentPartner.commissionType === 'percentage') {
      const calc = (numValue * (currentPartner.agreedCommission || 0)) / 100;
      setCommissionValue(Number(calc.toFixed(2)));
    } else {
      setCommissionValue(currentPartner.agreedCommission || 0);
    }
  }, [saleValue, partnerId, currentPartner, isAutoCalculated]);

  const handlePartnerChange = (pId: string) => {
    setPartnerId(pId);
    const p = partners.find((item) => item.id === pId);
    if (p && !productService) {
      setProductService(p.productService);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !partnerId) return;

    const finalSaleVal = typeof saleValue === 'number' ? saleValue : parseFloat(String(saleValue)) || 0;
    const finalCommVal = typeof commissionValue === 'number' ? commissionValue : parseFloat(String(commissionValue)) || 0;

    const p = partners.find((item) => item.id === partnerId);

    onSave(
      {
        date,
        clientName: clientName.trim(),
        leadId: initialLead?.id || editingSale?.leadId,
        partnerId,
        partnerName: p ? p.name : 'Parceiro',
        productService: productService.trim(),
        saleValue: finalSaleVal,
        commissionValue: finalCommVal,
        status,
        notes: notes.trim(),
      },
      expectedDate
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0A192F] px-6 py-4 flex items-center justify-between border-b border-[#1E2D4A]">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-[#C5A059]" />
            <h3 className="text-base font-bold text-white tracking-wide">
              {editingSale ? 'Editar Venda' : 'Registrar Nova Venda'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Data da Venda */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Data da Venda *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Status da Venda */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Status da Venda *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SaleStatus)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              >
                <option value="concluida">Concluída</option>
                <option value="em_andamento">Em andamento</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            {/* Cliente */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Nome do Cliente / Razão Social *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Construtora Aliança ou Hospital PetCare"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Empresa Parceira */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider">
                  Empresa Parceira *
                </label>
                {currentPartner && (
                  <span className="text-xs font-medium text-[#C5A059]">
                    Comissão Acordada: {currentPartner.agreedCommission}
                    {currentPartner.commissionType === 'percentage' ? '%' : ' R$ Fixo'}
                  </span>
                )}
              </div>
              <select
                required
                value={partnerId}
                onChange={(e) => handlePartnerChange(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              >
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.agreedCommission}
                    {p.commissionType === 'percentage' ? '%' : ' R$ Fixo'})
                  </option>
                ))}
              </select>
            </div>

            {/* Produto/Serviço */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Produto / Serviço Vendido *
              </label>
              <input
                type="text"
                required
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                placeholder="Ex: Desenvolvimento de Software, Produção de Vídeo 4K"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Valor da Venda */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Valor Total da Venda (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={saleValue}
                  onChange={(e) => setSaleValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0,00"
                  className="w-full pl-10 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Comissão (Com cálculo automático) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider">
                  Comissão Prado Social (R$) *
                </label>
                <div className="flex items-center gap-1 text-[10px] text-[#C5A059] font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>Cálculo Automático</span>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-xs font-bold text-[#C5A059]">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={commissionValue}
                  onChange={(e) => {
                    setIsAutoCalculated(false);
                    setCommissionValue(e.target.value === '' ? '' : parseFloat(e.target.value));
                  }}
                  placeholder="0,00"
                  className="w-full pl-10 pr-3.5 py-2 text-sm font-semibold bg-amber-50/50 border border-[#C5A059]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 text-[#0A192F]"
                />
              </div>
            </div>

            {/* Previsão de Pagamento da Comissão */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Data Prevista para Recebimento da Comissão
              </label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Gera automaticamente a pendência na aba <strong>Comissões</strong>.
              </p>
            </div>

            {/* Observações */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Observações da Venda
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Condições de pagamento, número de parcelas, notas fiscais..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>
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
              className="px-5 py-2 text-sm font-semibold text-[#0A192F] bg-[#C5A059] hover:bg-[#B38E46] rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{editingSale ? 'Salvar Venda' : 'Confirmar Venda & Comissão'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
