import React, { useState, useEffect } from 'react';
import { X, Building2, Percent, DollarSign, Calendar, Mail, Phone, User, FileText } from 'lucide-react';
import { Partner, PartnerStatus, CommissionType } from '../types';
import { formatCNPJ, formatPhone } from '../utils/formatters';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Omit<Partner, 'id' | 'createdAt'>) => void;
  editingPartner?: Partner | null;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPartner,
}) => {
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [segment, setSegment] = useState('');
  const [responsible, setResponsible] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [productService, setProductService] = useState('');
  const [agreedCommission, setAgreedCommission] = useState<number>(10);
  const [commissionType, setCommissionType] = useState<CommissionType>('percentage');
  const [status, setStatus] = useState<PartnerStatus>('ativo');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingPartner) {
      setName(editingPartner.name || '');
      setCnpj(editingPartner.cnpj || '');
      setSegment(editingPartner.segment || '');
      setResponsible(editingPartner.responsible || '');
      setWhatsapp(editingPartner.whatsapp || '');
      setEmail(editingPartner.email || '');
      setProductService(editingPartner.productService || '');
      setAgreedCommission(editingPartner.agreedCommission ?? 10);
      setCommissionType(editingPartner.commissionType || 'percentage');
      setStatus(editingPartner.status || 'ativo');
      setStartDate(editingPartner.startDate || new Date().toISOString().split('T')[0]);
      setNotes(editingPartner.notes || '');
    } else {
      setName('');
      setCnpj('');
      setSegment('');
      setResponsible('');
      setWhatsapp('');
      setEmail('');
      setProductService('');
      setAgreedCommission(10);
      setCommissionType('percentage');
      setStatus('ativo');
      setStartDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [editingPartner, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      cnpj: cnpj.trim(),
      segment: segment.trim(),
      responsible: responsible.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      productService: productService.trim(),
      agreedCommission: Number(agreedCommission) || 0,
      commissionType,
      status,
      startDate,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0A192F] px-6 py-4 flex items-center justify-between border-b border-[#1E2D4A]">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#C5A059]" />
            <h3 className="text-base font-bold text-white tracking-wide">
              {editingPartner ? 'Editar Empresa Parceira' : 'Cadastrar Empresa Parceira'}
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
            {/* Nome da empresa */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Nexus Tech Soluções"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* CNPJ */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Segmento */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Segmento / Ramo de Atuação
              </label>
              <input
                type="text"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                placeholder="Ex: Tecnologia, Finanças, Audiovisual"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Responsável */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Contato Responsável
              </label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Nome do contato comercial"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                WhatsApp
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com.br"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Status da Parceria */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Status da Parceria
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PartnerStatus)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              >
                <option value="ativo">Ativo</option>
                <option value="em_negociacao">Em negociação</option>
                <option value="prospectando">Prospectando</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            {/* Produto/Serviço */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Produto / Serviço Oferecido
              </label>
              <input
                type="text"
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                placeholder="Ex: Desenvolvimento de Sites e Aplicativos, Consultoria Contábil"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
              />
            </div>

            {/* Tipo de Comissão */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Tipo de Comissão
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCommissionType('percentage')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    commissionType === 'percentage'
                      ? 'bg-[#0A192F] text-[#C5A059] border-[#C5A059]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Percentual (%)
                </button>
                <button
                  type="button"
                  onClick={() => setCommissionType('fixed')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    commissionType === 'fixed'
                      ? 'bg-[#0A192F] text-[#C5A059] border-[#C5A059]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Valor Fixo (R$)
                </button>
              </div>
            </div>

            {/* Comissão Acordada */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                {commissionType === 'percentage' ? 'Comissão Acordada (%)' : 'Comissão Fixa (R$)'} *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  required
                  min="0"
                  value={agreedCommission}
                  onChange={(e) => setAgreedCommission(parseFloat(e.target.value) || 0)}
                  placeholder={commissionType === 'percentage' ? '15' : '1000'}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
                />
                <span className="absolute right-3.5 top-2 text-xs font-bold text-slate-400">
                  {commissionType === 'percentage' ? '%' : 'BRL'}
                </span>
              </div>
            </div>

            {/* Data de início */}
            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-1">
                Data de Início da Parceria
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
                placeholder="Detalhes sobre prazos de pagamento, regras de repasse ou alinhamentos especiais..."
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
              {editingPartner ? 'Salvar Alterações' : 'Cadastrar Parceiro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
