import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Users,
  Building2,
  Phone,
  User,
  ArrowUpDown,
  CheckCircle2,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Lead, LeadStatus, Partner } from '../types';
import { formatDateBR } from '../utils/formatters';
import { LeadModal } from './LeadModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface LeadsViewProps {
  onConvertToSale: (lead: Lead) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({ onConvertToSale }) => {
  const { leads, partners, addLead, updateLead, deleteLead } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [partnerFilter, setPartnerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'partner'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  // Filters & Sorting
  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => {
        const matchesSearch =
          l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.productService.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
        const matchesPartner = partnerFilter === 'all' || l.partnerId === partnerFilter;

        return matchesSearch && matchesStatus && matchesPartner;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'date') {
          comp = new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        } else if (sortBy === 'name') {
          comp = a.name.localeCompare(b.name);
        } else if (sortBy === 'partner') {
          comp = a.partnerName.localeCompare(b.partnerName);
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [leads, searchTerm, statusFilter, partnerFilter, sortBy, sortOrder]);

  const handleOpenCreate = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (l: Lead) => {
    setEditingLead(l);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<Lead, 'id' | 'createdAt'>) => {
    if (editingLead) {
      updateLead(editingLead.id, data);
    } else {
      addLead(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingLead) {
      deleteLead(deletingLead.id);
      setDeletingLead(null);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'novo':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            Novo
          </span>
        );
      case 'contatado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            Contatado
          </span>
        );
      case 'em_negociacao':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            Em negociação
          </span>
        );
      case 'convertido':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0A192F] text-[#C5A059] border border-[#C5A059]/50">
            Convertido
          </span>
        );
      case 'nao_convertido':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            Não convertido
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por lead, produto, parceiro ou telefone..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
            />
          </div>

          {/* Partner Filter */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 text-slate-700 max-w-[160px]"
            >
              <option value="all">Todos os Parceiros</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 text-slate-700"
            >
              <option value="all">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="contatado">Contatado</option>
              <option value="em_negociacao">Em negociação</option>
              <option value="convertido">Convertido</option>
              <option value="nao_convertido">Não convertido</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 text-slate-700"
            >
              <option value="date">Data Mais Recente</option>
              <option value="name">Nome do Lead</option>
              <option value="partner">Parceiro</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#B38E46] text-[#0A192F] font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Lead</span>
        </button>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Nenhum lead encontrado</p>
            <p className="text-xs text-slate-400 mt-1">
              Registre uma indicação de lead ou altere os termos da busca.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Data & Lead</th>
                  <th className="py-3.5 px-4">Empresa Parceira</th>
                  <th className="py-3.5 px-4">Produto/Interesse</th>
                  <th className="py-3.5 px-4">Atendimento</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-[#0A192F] text-sm">{lead.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDateBR(lead.date)}
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#0A192F] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lead.partnerName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-slate-700 font-medium line-clamp-2">
                        {lead.productService || 'Geral'}
                      </p>
                      {lead.notes && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-1">
                          "{lead.notes}"
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-slate-700 font-medium flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{lead.assignedTo || 'Prado Social'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">{getStatusBadge(lead.status)}</td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Converter para Venda button */}
                        {lead.status !== 'convertido' && (
                          <button
                            onClick={() => onConvertToSale(lead)}
                            title="Converter este lead em Venda com Comissão"
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#0A192F] bg-[#C5A059] hover:bg-[#B38E46] rounded-md transition-colors flex items-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Vender</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEdit(lead)}
                          title="Editar Lead"
                          className="p-1.5 text-slate-500 hover:text-[#0A192F] hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingLead(lead)}
                          title="Excluir Lead"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Criar/Editar */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        partners={partners}
        editingLead={editingLead}
      />

      {/* Modal Deletar */}
      <DeleteConfirmModal
        isOpen={!!deletingLead}
        title="Excluir Lead"
        message={`Deseja realmente excluir o lead "${deletingLead?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingLead(null)}
      />
    </div>
  );
};
