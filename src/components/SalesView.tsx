import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Building2,
  Calendar,
  DollarSign,
  ArrowUpDown,
  Coins,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Sale, SaleStatus } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { SaleModal } from './SaleModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const SalesView: React.FC = () => {
  const { sales, partners, addSale, updateSale, deleteSale, selectedLeadForSale, setSelectedLeadForSale } =
    useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [partnerFilter, setPartnerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'commission'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [deletingSale, setDeletingSale] = useState<Sale | null>(null);

  // If a lead was selected for sale from another view, open modal directly
  React.useEffect(() => {
    if (selectedLeadForSale) {
      setEditingSale(null);
      setIsModalOpen(true);
    }
  }, [selectedLeadForSale]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSale(null);
    setSelectedLeadForSale(null);
  };

  const filteredSales = useMemo(() => {
    return sales
      .filter((s) => {
        const matchesSearch =
          s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.productService.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.partnerName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPartner = partnerFilter === 'all' || s.partnerId === partnerFilter;
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

        return matchesSearch && matchesPartner && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'date') {
          comp = new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        } else if (sortBy === 'value') {
          comp = b.saleValue - a.saleValue;
        } else if (sortBy === 'commission') {
          comp = b.commissionValue - a.commissionValue;
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [sales, searchTerm, partnerFilter, statusFilter, sortBy, sortOrder]);

  const handleOpenCreate = () => {
    setEditingSale(null);
    setSelectedLeadForSale(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Sale) => {
    setEditingSale(s);
    setSelectedLeadForSale(null);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<Sale, 'id' | 'createdAt'>, expectedDate?: string) => {
    if (editingSale) {
      updateSale(editingSale.id, data);
    } else {
      addSale(data, expectedDate);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingSale) {
      deleteSale(deletingSale.id);
      setDeletingSale(null);
    }
  };

  const getStatusBadge = (status: SaleStatus) => {
    switch (status) {
      case 'concluida':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0A192F] text-[#C5A059] border border-[#C5A059]/50">
            Concluída
          </span>
        );
      case 'em_andamento':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            Em andamento
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Cancelada
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
              placeholder="Buscar por cliente, produto ou parceiro..."
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
              <option value="concluida">Concluída</option>
              <option value="em_andamento">Em andamento</option>
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
              <option value="date">Data Mais Recente</option>
              <option value="value">Maior Valor de Venda</option>
              <option value="commission">Maior Comissão</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#C5A059] hover:bg-[#B38E46] text-[#0A192F] font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Venda</span>
        </button>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Nenhuma venda encontrada</p>
            <p className="text-xs text-slate-400 mt-1">
              Registre a primeira venda fechada através de um parceiro.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Data & Cliente</th>
                  <th className="py-3.5 px-4">Empresa Parceira</th>
                  <th className="py-3.5 px-4">Produto/Serviço</th>
                  <th className="py-3.5 px-4 text-right">Valor da Venda</th>
                  <th className="py-3.5 px-4 text-right">Comissão Prado Social</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-[#0A192F] text-sm">{sale.clientName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{formatDateBR(sale.date)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#0A192F] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{sale.partnerName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-slate-700 font-medium line-clamp-2">
                        {sale.productService || 'Geral'}
                      </p>
                      {sale.notes && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                          "{sale.notes}"
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-slate-900 text-sm">
                        {formatCurrency(sale.saleValue)}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="font-bold text-[#C5A059] text-sm">
                        {formatCurrency(sale.commissionValue)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {sale.saleValue > 0
                          ? `(${((sale.commissionValue / sale.saleValue) * 100).toFixed(1)}%)`
                          : ''}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">{getStatusBadge(sale.status)}</td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(sale)}
                          title="Editar Venda"
                          className="p-1.5 text-slate-500 hover:text-[#0A192F] hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingSale(sale)}
                          title="Excluir Venda"
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

      {/* Modal Criar/Editar Venda */}
      <SaleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        partners={partners}
        editingSale={editingSale}
        initialLead={selectedLeadForSale}
      />

      {/* Modal Excluir Venda */}
      <DeleteConfirmModal
        isOpen={!!deletingSale}
        title="Excluir Venda"
        message={`Deseja excluir a venda de ${formatCurrency(deletingSale?.saleValue || 0)} para "${deletingSale?.clientName}"? A comissão correspondente também será removida.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingSale(null)}
      />
    </div>
  );
};
