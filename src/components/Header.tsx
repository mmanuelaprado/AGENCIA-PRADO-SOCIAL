import React from 'react';
import { Menu, ShieldCheck, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenCreateModal?: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string; actionLabel?: string }> = {
  dashboard: {
    title: 'Visão Geral',
    subtitle: 'Indicadores e fluxo de negócios da Agência Prado Social',
  },
  parceiros: {
    title: 'Empresas Parceiras',
    subtitle: 'Gestão de parcerias comerciais, acordos e comissões',
    actionLabel: 'Novo Parceiro',
  },
  leads: {
    title: 'Leads & Clientes Indicados',
    subtitle: 'Acompanhamento do funil de oportunidades e encaminhamentos',
    actionLabel: 'Novo Lead',
  },
  vendas: {
    title: 'Vendas Realizadas',
    subtitle: 'Registro de contratos fechados e cálculo de comissões',
    actionLabel: 'Registrar Venda',
  },
  comissoes: {
    title: 'Comissões a Receber',
    subtitle: 'Controle de valores previstos, recebidos e pendentes',
  },
};

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenCreateModal,
}) => {
  const { activeTab } = useApp();
  const config = TAB_TITLES[activeTab];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0A192F] tracking-tight">
            {config.title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 font-normal">
            {config.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Ambiente Interno</span>
        </div>

        {config.actionLabel && onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#C5A059] hover:bg-[#B38E46] text-[#0A192F] text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{config.actionLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
};
