import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Phone,
  Mail,
  User,
  ArrowUpDown,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Partner, PartnerStatus } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { PartnerModal } from './PartnerModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface PartnersViewProps {
  onOpenNewLeadForPartner?: (partner: Partner) => void;
}

export const PartnersView: React.FC<PartnersViewProps> = ({ onOpenNewLeadForPartner }) => {
  const { partners, addPartner, updatePartner, deletePartner, setActiveTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'commission'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);

  // Filter & Sort
  const filteredPartners = useMemo(() => {
    return partners
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.productService.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.cnpj.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') {
          comp = a.name.localeCompare(b.name);
        } else if (sortBy === 'date') {
          comp = new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime();
        } else if (sortBy === 'commission') {
          comp = b.agreedCommission - a.agreedCommission;
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [partners, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleOpenCreate = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Partner) => {
    setEditingPartner(p);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<Partner, 'id' | 'createdAt'>) => {
    if (editingPartner) {
      updatePartner(editingPartner.id, data);
    } else {
      addPartner(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingPartner) {
      deletePartner(deletingPartner.id);
      setDeletingPartner(null);
    }
  };

  const getStatusBadge = (status: PartnerStatus) => {
    switch (status) {
      case 'ativo':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0A192F] text-[#C5A059] border border-[#C5A059]/40">
            Ativo
          </span>
        );
      case 'em_negociacao':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            Em negociação
          </span>
        );
      case 'prospectando':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            Prospectando
          </span>
        );
      case 'inativo':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            Inativo
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Control Bar: Search, Filters, Sorting & Add */}
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
              placeholder="Buscar por empresa, segmento, responsável ou CNPJ..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 text-slate-700"
            >
              <option value="all">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="em_negociacao">Em negociação</option>
              <option value="prospectando">Prospectando</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 text-slate-700"
            >
              <option value="name">Nome (A-Z)</option>
              <option value="date">Data de Início</option>
              <option value="commission">Comissão</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#B38E46] text-[#0A192F] font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Parceiro</span>
        </button>
      </div>

      {/* Partners List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredPartners.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Nenhum parceiro encontrado</p>
            <p className="text-xs text-slate-400 mt-1">
              Ajuste os filtros de busca ou cadastre uma nova empresa parceira.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Empresa & Segmento</th>
                  <th className="py-3.5 px-4">Responsável & Contato</th>
                  <th className="py-3.5 px-4">Produto/Serviço</th>
                  <th className="py-3.5 px-4 text-center">Comissão Acordada</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPartners.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-[#0A192F] text-sm">{p.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {p.segment || 'Segmento não informado'}
                        {p.cnpj && ` • CNPJ: ${p.cnpj}`}
                      </div>
                      {p.startDate && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Início: {formatDateBR(p.startDate)}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.responsible || '-'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 space-y-0.5 mt-1">
                        {p.whatsapp && (
                          <div className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{p.whatsapp}</span>
                          </div>
                        )}
                        {p.email && (
                          <div className="flex items-center gap-1 text-slate-600 truncate max-w-[200px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{p.email}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-slate-700 font-medium line-clamp-2">
                        {p.productService || 'Não especificado'}
                      </p>
                      {p.notes && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-1">
                          "{p.notes}"
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="inline-block font-bold text-sm text-[#0A192F]">
                        {p.commissionType === 'percentage'
                          ? `${p.agreedCommission}%`
                          : formatCurrency(p.agreedCommission)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {p.commissionType === 'percentage' ? 'por venda' : 'fixo / venda'}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">{getStatusBadge(p.status)}</td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenNewLeadForPartner && (
                          <button
                            onClick={() => onOpenNewLeadForPartner(p)}
                            title="Gerar Lead para este parceiro"
                            className="p-1.5 text-[#C5A059] hover:bg-[#0A192F]/5 rounded-md transition-colors"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Editar Parceiro"
                          className="p-1.5 text-slate-500 hover:text-[#0A192F] hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingPartner(p)}
                          title="Excluir Parceiro"
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

      {/* Modal Cadastro/Edição */}
      <PartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingPartner={editingPartner}
      />

      {/* Modal Confirmação Exclusão */}
      <DeleteConfirmModal
        isOpen={!!deletingPartner}
        title="Excluir Empresa Parceira"
        message={`Tem certeza de que deseja remover a parceria com "${deletingPartner?.name}"? Esta ação removerá o registro do sistema.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingPartner(null)}
      />
    </div>
  );
};
