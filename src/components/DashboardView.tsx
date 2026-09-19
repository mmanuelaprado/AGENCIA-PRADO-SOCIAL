import React from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface DashboardViewProps {
  onOpenNewPartner?: () => void;
  onOpenNewLead?: () => void;
  onOpenNewSale?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewPartner,
  onOpenNewLead,
  onOpenNewSale,
}) => {
  const { metrics, setActiveTab, sales, commissions } = useApp();

  const recentSales = sales.slice(0, 5);
  const pendingCommissionsList = commissions
    .filter((c) => c.status === 'pendente')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 5 Essential Cards requested by user */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Parceiros Ativos */}
        <div
          onClick={() => setActiveTab('parceiros')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-[#C5A059]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Parceiros Ativos
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0A192F] group-hover:bg-[#0A192F] group-hover:text-[#C5A059] transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#0A192F] tracking-tight">
            {metrics.activePartners}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            de {metrics.totalPartners} parceiros cadastrados
          </p>
        </div>

        {/* 2. Leads em Andamento */}
        <div
          onClick={() => setActiveTab('leads')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-[#C5A059]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Leads em Andamento
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0A192F] group-hover:bg-[#0A192F] group-hover:text-[#C5A059] transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#0A192F] tracking-tight">
            {metrics.inProgressLeads}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {metrics.convertedLeads} leads já convertidos
          </p>
        </div>

        {/* 3. Vendas Realizadas */}
        <div
          onClick={() => setActiveTab('vendas')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-[#C5A059]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Vendas Realizadas
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0A192F] group-hover:bg-[#0A192F] group-hover:text-[#C5A059] transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#0A192F] tracking-tight">
            {metrics.totalSalesCount}
          </div>
          <p className="text-xs text-[#C5A059] font-medium mt-1 truncate">
            {formatCurrency(metrics.totalSalesValue)}
          </p>
        </div>

        {/* 4. Comissões Pendentes */}
        <div
          onClick={() => setActiveTab('comissoes')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-[#C5A059]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Comissões Pendentes
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#C5A059] tracking-tight truncate">
            {formatCurrency(metrics.pendingCommissionsValue)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Aguardando recebimento</p>
        </div>

        {/* 5. Comissões Recebidas */}
        <div
          onClick={() => setActiveTab('comissoes')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-[#C5A059]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Comissões Recebidas
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0A192F] group-hover:bg-[#0A192F] group-hover:text-[#C5A059] transition-colors">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0A192F] tracking-tight truncate">
            {formatCurrency(metrics.receivedCommissionsValue)}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Crédito confirmado</p>
        </div>
      </div>

      {/* Integrated Pipeline Banner: PARCEIRO → LEAD → VENDA → COMISSÃO */}
      <div className="bg-[#0A192F] text-white rounded-xl p-6 border border-[#1E2D4A] relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
            <div>
              <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-widest">
                Ciclo Operacional
              </span>
              <h2 className="text-lg font-bold text-white tracking-wide mt-0.5">
                Fluxo Comercial Agência Prado Social
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {onOpenNewPartner && (
                <button
                  onClick={onOpenNewPartner}
                  className="px-3 py-1.5 bg-[#0F213D] hover:bg-[#152D52] border border-[#C5A059]/40 text-[#C5A059] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Parceiro</span>
                </button>
              )}
              {onOpenNewLead && (
                <button
                  onClick={onOpenNewLead}
                  className="px-3 py-1.5 bg-[#0F213D] hover:bg-[#152D52] border border-[#C5A059]/40 text-[#C5A059] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Lead</span>
                </button>
              )}
              {onOpenNewSale && (
                <button
                  onClick={onOpenNewSale}
                  className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#0A192F] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Venda</span>
                </button>
              )}
            </div>
          </div>

          {/* Stepper visual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-5">
            <div
              onClick={() => setActiveTab('parceiros')}
              className="p-3.5 rounded-lg bg-[#0F213D]/70 border border-[#1E2D4A] hover:border-[#C5A059]/50 transition-all cursor-pointer"
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Passo 1</div>
              <div className="text-sm font-bold text-white mt-1">Parceiro Acordado</div>
              <div className="text-xs text-[#C5A059] font-medium mt-1">
                {metrics.activePartners} ativos
              </div>
            </div>

            <div
              onClick={() => setActiveTab('leads')}
              className="p-3.5 rounded-lg bg-[#0F213D]/70 border border-[#1E2D4A] hover:border-[#C5A059]/50 transition-all cursor-pointer"
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Passo 2</div>
              <div className="text-sm font-bold text-white mt-1">Lead Indicado</div>
              <div className="text-xs text-[#C5A059] font-medium mt-1">
                {metrics.inProgressLeads} em andamento
              </div>
            </div>

            <div
              onClick={() => setActiveTab('vendas')}
              className="p-3.5 rounded-lg bg-[#0F213D]/70 border border-[#1E2D4A] hover:border-[#C5A059]/50 transition-all cursor-pointer"
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Passo 3</div>
              <div className="text-sm font-bold text-white mt-1">Venda Concluída</div>
              <div className="text-xs text-[#C5A059] font-medium mt-1">
                {metrics.totalSalesCount} fechamentos
              </div>
            </div>

            <div
              onClick={() => setActiveTab('comissoes')}
              className="p-3.5 rounded-lg bg-[#0F213D]/70 border border-[#1E2D4A] hover:border-[#C5A059]/50 transition-all cursor-pointer"
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Passo 4</div>
              <div className="text-sm font-bold text-white mt-1">Comissão Gerada</div>
              <div className="text-xs text-[#C5A059] font-medium mt-1">
                {formatCurrency(metrics.pendingCommissionsValue + metrics.receivedCommissionsValue)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns for quick monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-wider">
                Últimas Vendas Registradas
              </h3>
              <p className="text-xs text-slate-500">Contratos com comissão calculada</p>
            </div>
            <button
              onClick={() => setActiveTab('vendas')}
              className="text-xs font-semibold text-[#0A192F] hover:text-[#C5A059] flex items-center gap-1 transition-colors"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSales.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Nenhuma venda registrada ainda.
              </p>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#0A192F]">{sale.clientName}</p>
                    <p className="text-[11px] text-slate-500">
                      {sale.partnerName} • {formatDateBR(sale.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{formatCurrency(sale.saleValue)}</p>
                    <p className="text-[11px] font-semibold text-[#C5A059]">
                      Comissão: {formatCurrency(sale.commissionValue)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Commissions */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-wider">
                Próximas Comissões a Receber
              </h3>
              <p className="text-xs text-slate-500">Valores pendentes por parceiro</p>
            </div>
            <button
              onClick={() => setActiveTab('comissoes')}
              className="text-xs font-semibold text-[#0A192F] hover:text-[#C5A059] flex items-center gap-1 transition-colors"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingCommissionsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Nenhuma comissão pendente no momento.
              </p>
            ) : (
              pendingCommissionsList.map((comm) => (
                <div key={comm.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#0A192F]">{comm.partnerName}</p>
                    <p className="text-[11px] text-slate-500">
                      Cliente: {comm.clientName} • Previsto: {formatDateBR(comm.expectedDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#C5A059] text-sm">
                      {formatCurrency(comm.commissionValue)}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Pendente
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
