import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  TrendingUp,
  Coins,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, logout, auth } = useApp();

  const menuItems: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'parceiros', label: 'Parceiros', icon: Building2 },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'vendas', label: 'Vendas', icon: TrendingUp },
    { id: 'comissoes', label: 'Comissões', icon: Coins },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A192F] text-slate-100 flex flex-col border-r border-[#1E2D4A] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#1E2D4A]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F213D] border border-[#C5A059]/60 flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-brand text-lg font-bold text-[#C5A059]">PS</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide uppercase font-brand">
                Prado Social
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Sistema Interno
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#0F213D]"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu (Only the 5 requested items) */}
        <div className="flex-1 py-6 px-3 overflow-y-auto space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-semibold text-[#C5A059]/80 uppercase tracking-widest">
            Menu Principal
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#0F213D] text-[#C5A059] border-l-3 border-[#C5A059] shadow-inner font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#0F213D]/60'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-[#C5A059]' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Flow visual summary indicator */}
        <div className="px-4 py-3 mx-3 mb-4 rounded-lg bg-[#0F213D]/80 border border-[#1E2D4A] text-[11px] text-slate-400">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Fluxo Integrado
          </div>
          <div className="font-mono text-[10px] text-[#C5A059] flex items-center justify-between">
            <span>PARCEIRO</span>
            <span>→</span>
            <span>LEAD</span>
            <span>→</span>
            <span>VENDA</span>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[#1E2D4A]/80 bg-[#071325]/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#0F213D] border border-[#C5A059]/40 flex items-center justify-center text-xs font-bold text-[#C5A059] shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-slate-200 truncate">
                {auth.userName || 'Diretoria'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">Acesso Único</p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sair do sistema"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#0F213D] rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
