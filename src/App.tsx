import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PartnersView } from './components/PartnersView';
import { LeadsView } from './components/LeadsView';
import { SalesView } from './components/SalesView';
import { CommissionsView } from './components/CommissionsView';
import { Toast } from './components/Toast';
import { PartnerModal } from './components/PartnerModal';
import { LeadModal } from './components/LeadModal';
import { SaleModal } from './components/SaleModal';
import { Partner, Lead } from './types';
import { RefreshCw } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    auth,
    activeTab,
    setActiveTab,
    partners,
    addPartner,
    addLead,
    addSale,
    setSelectedLeadForSale,
    resetToDefaultData,
  } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global modals triggered from Header or cross-tab actions
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  const [defaultPartnerForLead, setDefaultPartnerForLead] = useState<Partner | null>(null);

  if (!auth.isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <Toast />
      </>
    );
  }

  // Header quick action triggers
  const handleOpenCreateModal = () => {
    if (activeTab === 'parceiros') {
      setIsPartnerModalOpen(true);
    } else if (activeTab === 'leads') {
      setDefaultPartnerForLead(null);
      setIsLeadModalOpen(true);
    } else if (activeTab === 'vendas') {
      setIsSaleModalOpen(true);
    }
  };

  // Cross-tab actions:
  // 1. From Partner -> Create Lead for that Partner
  const handleCreateLeadForPartner = (partner: Partner) => {
    setDefaultPartnerForLead(partner);
    setActiveTab('leads');
    setIsLeadModalOpen(true);
  };

  // 2. From Lead -> Convert to Sale
  const handleConvertToSale = (lead: Lead) => {
    setSelectedLeadForSale(lead);
    setActiveTab('vendas');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateModal={handleOpenCreateModal}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenNewPartner={() => {
                setActiveTab('parceiros');
                setIsPartnerModalOpen(true);
              }}
              onOpenNewLead={() => {
                setActiveTab('leads');
                setIsLeadModalOpen(true);
              }}
              onOpenNewSale={() => {
                setActiveTab('vendas');
                setIsSaleModalOpen(true);
              }}
            />
          )}

          {activeTab === 'parceiros' && (
            <PartnersView onOpenNewLeadForPartner={handleCreateLeadForPartner} />
          )}

          {activeTab === 'leads' && (
            <LeadsView onConvertToSale={handleConvertToSale} />
          )}

          {activeTab === 'vendas' && <SalesView />}

          {activeTab === 'comissoes' && <CommissionsView />}

          {/* Discreet footer with system info and sample data reset */}
          <footer className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0A192F]">Agência Prado Social</span>
              <span>•</span>
              <span>Sistema Interno de Gestão</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={resetToDefaultData}
                className="hover:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                title="Restaurar dados de exemplo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar Demonstração</span>
              </button>
              <span>Acesso Único Protegido</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Modals for direct header actions */}
      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        onSave={(data) => addPartner(data)}
      />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setDefaultPartnerForLead(null);
        }}
        onSave={(data) => addLead(data)}
        partners={partners}
        defaultPartner={defaultPartnerForLead}
      />

      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSave={(data, expDate) => addSale(data, expDate)}
        partners={partners}
      />

      {/* Toast notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
