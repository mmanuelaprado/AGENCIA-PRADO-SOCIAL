import React, { useState, useEffect } from 'react';
import { X, Users, Calendar, Phone, Building2, User, FileText } from 'lucide-react';
import { Lead, LeadStatus, Partner } from '../types';
import { formatPhone } from '../utils/formatters';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  partners: Partner[];
  editingLead?: Lead | null;
  defaultPartner?: Partner | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  partners,
  editingLead,
  defaultPartner,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [productService, setProductService] = useState('');
  const [assignedTo, setAssignedTo] = useState('Equipe Prado Social');
  const [status, setStatus] = useState<LeadStatus>('novo');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingLead) {
      setDate(editingLead.date || new Date().toISOString().split('T')[0]);
      setName(editingLead.name || '');
      setPhone(editingLead.phone || '');
      setPartnerId(editingLead.partnerId || '');
      setProductService(editingLead.productService || '');
      setAssignedTo(editingLead.assignedTo || 'Equipe Prado Social');
      setStatus(editingLead.status || 'novo');
      setNotes(editingLead.notes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setName('');
      setPhone('');
      const initialPartner = defaultPartner || partners[0];
      setPartnerId(initialPartner ? initialPartner.id : '');
      setProductService(initialPartner ? initialPartner.productService : '');
      setAssignedTo('Equipe Prado Social');
      setStatus('novo');
      setNotes('');
    }
  }, [editingLead, defaultPartner, partners, isOpen]);

  // When partner selection changes, auto-suggest product/service from partner
  const handlePartnerChange = (id: string) => {
    setPartnerId(id);
    const matched = partners.find((p) => p.id === id);
    if (matched && !editingLead) {
      setProductService(matched.productService || '');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !partnerId) return;

    const matchedPartner = partners.find((p) => p.id === partnerId);

    onSave({
      date,
      name: name.trim(),
      phone: phone.trim(),
      partnerId,
      partnerName: matchedPartner ? matchedPartner.name : 'Parceiro',
      productService: productService.trim(),
      assignedTo: assignedTo.trim(),
      status,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full my-8 overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0A192F] px-6 py-4 flex items-center justify-between border-b border-[#1E2D4A]">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#C5A059]" />
            <h3 className="text-base font-bold text-white tracking-wide">
              {editingLead ? 'Editar Lead / Oportunidade' : 'Registrar Novo Lead'}
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
            {/* Data */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Data do Registro *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Status do Lead *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              >
                <option value="novo">Novo</option>
                <option value="contatado">Contatado</option>
                <option value="em_negociacao">Em negociação</option>
                <option value="convertido">Convertido</option>
                <option value="nao_convertido">Não convertido</option>
              </select>
            </div>

            {/* Nome/Empresa do Lead */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Nome do Lead / Empresa Indicada *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Clínica São Bento ou Dr. Carlos Alberto"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(11) 98888-8888"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Responsável pelo atendimento */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Responsável pelo Atendimento
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Ex: Consultor Comercial / Equipe"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Empresa Parceira */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Empresa Parceira Responsável *
              </label>
              <select
                required
                value={partnerId}
                onChange={(e) => handlePartnerChange(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              >
                {partners.length === 0 ? (
                  <option value="">Nenhum parceiro cadastrado ainda</option>
                ) : (
                  partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.agreedCommission}
                      {p.commissionType === 'percentage' ? '%' : ' R$ Fixo'})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Produto/Serviço de interesse */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Produto / Serviço de Interesse
              </label>
              <input
                type="text"
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                placeholder="Ex: Vídeo comercial 4K, Software de Gestão, etc."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Observações */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Observações
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Histórico da conversa, momento de compra, detalhes das reuniões..."
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
              className="px-5 py-2 text-sm font-semibold text-[#0A192F] bg-[#C5A059] hover:bg-[#B38E46] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {editingLead ? 'Salvar Alterações' : 'Registrar Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
