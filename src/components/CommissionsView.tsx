import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  Coins,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Commission, CommissionStatus } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { CommissionModal } from './CommissionModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const CommissionsView: React.FC = () => {
  const {
    commissions,
    partners,
    updateCommissionStatus,
    updateCommission,
    deleteCommission,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [partnerFilter, setPartnerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'expectedDate' | 'commissionValue' | 'saleValue'>('expectedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
  const [deletingCommission, setDeletingCommission] = useState<Commission | null>(null);

  // Totals summary in Commissions view
  const pendingTotal = useMemo(() => {
    return commissions
      .filter((c) => c.status === 'pendente')
      .reduce((acc, c) => acc + (c.commissionValue || 0), 0);
  }, [commissions]);

  const receivedTotal = useMemo(() => {
    return commissions
      .filter((c) => c.status === 'recebida')
      .reduce((acc, c) => acc + (c.commissionValue || 0), 0);
  }, [commissions]);

  const filteredCommissions = useMemo(() => {
    return commissions
      .filter((c) => {
        const matchesSearch =
          c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.partnerName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPartner = partnerFilter === 'all' || c.partnerId === partnerFilter;
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

        return matchesSearch && matchesPartner && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'expectedDate') {
          comp = new Date(a.expectedDate || 0).getTime() - new Date(b.expectedDate || 0).getTime();
        } else if (sortBy === 'commissionValue') {
          comp = b.commissionValue - a.commissionValue;
        } else if (sortBy === 'saleValue') {
          comp = b.saleValue - a.saleValue;
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [commissions, searchTerm, partnerFilter, statusFilter, sortBy, sortOrder]);

  const handleOpenEdit = (c: Commission) => {
    setEditingCommission(c);
    setIsModalOpen(true);
  };

  const handleSave = (updated: Partial<Commission>) => {
    if (editingCommission) {
      updateCommission(editingCommission.id, updated);
      setIsModalOpen(false);
      setEditingCommission(null);
    }
  };

  const handleQuickMarkReceived = (id: string) => {
    updateCommissionStatus(id, 'recebida');
  };

  const handleConfirmDelete = () => {
    if (deletingCommission) {
      deleteCommission(deletingCommission.id);
      setDeletingCommission(null);
    }
  };

  const getStatusBadge = (status: CommissionStatus) => {
    switch (status) {
      case 'recebida':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Recebida</span>
          </span>
        );
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pendente</span>
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            <XCircle className="w-3 h-3 text-slate-500" />
            <span>Cancelada</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Mini summary header for commissions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Pendente
            </span>
            <div className="text-2xl font-bold text-[#C5A059] mt-0.5">
              {formatCurrency(pendingTotal)}
            </div>
            <p className="text-[11px] text-slate-400">Previsão de crédito comercial</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Recebido
            </span>
            <div className="text-2xl font-bold text-[#0A192F] mt-0.5">
              {formatCurrency(receivedTotal)}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">Liquidado com sucesso</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Sorting */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente ou empresa parceira..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]"
          />
        </div>

        {/* Partner Filter */}
        <div className="flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 text-slate-700 max-w-[170px]"
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
            <option value="pendente">Pendente</option>
            <option value="recebida">Recebida</option>
            <option value="cancelada">Cancelada</option>
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
            <option value="expectedDate">Data Prevista</option>
            <option value="commissionValue">Maior Comissão</option>
            <option value="saleValue">Maior Valor de Venda</option>
          </select>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredCommissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Coins className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Nenhuma comissão encontrada</p>
            <p className="text-xs text-slate-400 mt-1">
              As comissões são geradas automaticamente ao cadastrar uma venda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Cliente Indicado</th>
                  <th className="py-3.5 px-4">Empresa Parceira</th>
                  <th className="py-3.5 px-4 text-right">Valor da Venda</th>
                  <th className="py-3.5 px-4 text-right">Comissão Prado Social</th>
                  <th className="py-3.5 px-4 text-center">Data Prevista</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCommissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-[#0A192F] text-sm">{comm.clientName}</div>
                      {comm.notes && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                          {comm.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#0A192F] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{comm.partnerName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="font-medium text-slate-700">
                        {formatCurrency(comm.saleValue)}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-[#C5A059] text-sm">
                        {formatCurrency(comm.commissionValue)}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="font-medium text-slate-700 flex items-center justify-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateBR(comm.expectedDate)}</span>
                      </div>
                      {comm.receivedDate && comm.status === 'recebida' && (
                        <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                          Recebido em: {formatDateBR(comm.receivedDate)}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">{getStatusBadge(comm.status)}</td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick action: Marcar como recebida if pendente */}
                        {comm.status === 'pendente' && (
                          <button
                            onClick={() => handleQuickMarkReceived(comm.id)}
                            title="Confirmar Recebimento desta comissão"
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-md transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>Recebida</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEdit(comm)}
                          title="Editar Comissão"
                          className="p-1.5 text-slate-500 hover:text-[#0A192F] hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeletingCommission(comm)}
                          title="Excluir Comissão"
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

      {/* Modal Editar Comissão */}
      <CommissionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCommission(null);
        }}
        onSave={handleSave}
        editingCommission={editingCommission}
      />

      {/* Modal Excluir Comissão */}
      <DeleteConfirmModal
        isOpen={!!deletingCommission}
        title="Excluir Registro de Comissão"
        message={`Deseja excluir a comissão de ${formatCurrency(deletingCommission?.commissionValue || 0)} referente a "${deletingCommission?.clientName}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCommission(null)}
      />
    </div>
  );
};
