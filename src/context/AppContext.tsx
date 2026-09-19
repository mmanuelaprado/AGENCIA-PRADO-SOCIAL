import React, { createContext, useContext, useState, useEffect } from 'react';
import { Partner, Lead, Sale, Commission, ActiveTab, UserAuth, CommissionStatus } from '../types';
import { INITIAL_PARTNERS, INITIAL_LEADS, INITIAL_SALES, INITIAL_COMMISSIONS } from '../data/initialData';

interface AppContextType {
  // Auth
  auth: UserAuth;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  loginError: string | null;

  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Partners
  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id' | 'createdAt'>) => Partner;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // Sales
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>, expectedCommissionDate?: string) => Sale;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;

  // Commissions
  commissions: Commission[];
  updateCommissionStatus: (id: string, status: CommissionStatus) => void;
  updateCommission: (id: string, commission: Partial<Commission>) => void;
  deleteCommission: (id: string) => void;

  // Quick Action Modal helpers
  selectedLeadForSale: Lead | null;
  setSelectedLeadForSale: (lead: Lead | null) => void;

  // Notification / Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Metrics
  metrics: {
    activePartners: number;
    totalPartners: number;
    inProgressLeads: number;
    convertedLeads: number;
    totalSalesCount: number;
    totalSalesValue: number;
    pendingCommissionsValue: number;
    receivedCommissionsValue: number;
    cancelledCommissionsValue: number;
  };

  // Reset to default sample
  resetToDefaultData: () => void;
}

const STORAGE_KEYS = {
  AUTH: 'prado_social_auth_v1',
  PARTNERS: 'prado_social_partners_v1',
  LEADS: 'prado_social_leads_v1',
  SALES: 'prado_social_sales_v1',
  COMMISSIONS: 'prado_social_commissions_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [auth, setAuth] = useState<UserAuth>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      isAuthenticated: false,
      userEmail: '',
      userName: '',
    };
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedLeadForSale, setSelectedLeadForSale] = useState<Lead | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Partners state
  const [partners, setPartners] = useState<Partner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARTNERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PARTNERS;
  });

  // Leads state
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LEADS;
  });

  // Sales state
  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SALES;
  });

  // Commissions state
  const [commissions, setCommissions] = useState<Commission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMISSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMMISSIONS;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMISSIONS, JSON.stringify(commissions));
  }, [commissions]);

  // Auth methods
  const login = (email: string, pass: string): boolean => {
    // Single internal access user verification
    const normalizedEmail = email.trim().toLowerCase();
    // Default authorized account: prado@pradosocial.com.br or any pradosocial credentials
    if (
      (normalizedEmail === 'diretoria@pradosocial.com.br' || normalizedEmail === 'admin@pradosocial.com.br' || normalizedEmail.includes('@prado')) &&
      pass === 'prado2026'
    ) {
      const authState: UserAuth = {
        isAuthenticated: true,
        userEmail: normalizedEmail,
        userName: 'Diretoria Prado Social',
      };
      setAuth(authState);
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authState));
      setLoginError(null);
      showToast('Acesso autorizado ao sistema interno.');
      return true;
    } else {
      // Also allow quick direct access with master credentials for test/internal use
      if (pass === 'prado2026') {
        const authState: UserAuth = {
          isAuthenticated: true,
          userEmail: normalizedEmail || 'acesso@pradosocial.com.br',
          userName: 'Gestão Prado Social',
        };
        setAuth(authState);
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authState));
        setLoginError(null);
        showToast('Acesso autorizado com sucesso.');
        return true;
      }
      setLoginError('Credenciais inválidas. Verifique o e-mail ou a senha interna.');
      return false;
    }
  };

  const logout = () => {
    const defaultAuth: UserAuth = {
      isAuthenticated: false,
      userEmail: '',
      userName: '',
    };
    setAuth(defaultAuth);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    showToast('Sessão finalizada com segurança.');
  };

  // Partner operations
  const addPartner = (data: Omit<Partner, 'id' | 'createdAt'>): Partner => {
    const newPartner: Partner = {
      ...data,
      id: `par-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPartners((prev) => [newPartner, ...prev]);
    showToast(`Parceiro "${newPartner.name}" cadastrado com sucesso.`);
    return newPartner;
  };

  const updatePartner = (id: string, updated: Partial<Partner>) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    // If partner name changed, update corresponding leads, sales, commissions
    if (updated.name) {
      setLeads((prev) =>
        prev.map((l) => (l.partnerId === id ? { ...l, partnerName: updated.name! } : l))
      );
      setSales((prev) =>
        prev.map((s) => (s.partnerId === id ? { ...s, partnerName: updated.name! } : s))
      );
      setCommissions((prev) =>
        prev.map((c) => (c.partnerId === id ? { ...c, partnerName: updated.name! } : c))
      );
    }
    showToast('Dados do parceiro atualizados com sucesso.');
  };

  const deletePartner = (id: string) => {
    const partner = partners.find((p) => p.id === id);
    setPartners((prev) => prev.filter((p) => p.id !== id));
    showToast(`Parceiro "${partner?.name || ''}" removido.`);
  };

  // Lead operations
  const addLead = (data: Omit<Lead, 'id' | 'createdAt'>): Lead => {
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    showToast(`Lead "${newLead.name}" registrado com sucesso.`);
    return newLead;
  };

  const updateLead = (id: string, updated: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
    );
    showToast('Lead atualizado com sucesso.');
  };

  const deleteLead = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    showToast(`Lead "${lead?.name || ''}" removido.`);
  };

  // Sales operations (with automatic commission calculation & generation)
  const addSale = (
    data: Omit<Sale, 'id' | 'createdAt'>,
    expectedCommissionDate?: string
  ): Sale => {
    const saleId = `sale-${Date.now()}`;
    const newSale: Sale = {
      ...data,
      id: saleId,
      createdAt: new Date().toISOString(),
    };

    setSales((prev) => [newSale, ...prev]);

    // If sale is linked to a lead, update lead to 'convertido'
    if (newSale.leadId) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === newSale.leadId ? { ...l, status: 'convertido', convertedSaleId: saleId } : l
        )
      );
    }

    // Automatically create linked commission
    // Default expected date to 30 days after sale date or provided date
    let expDate = expectedCommissionDate;
    if (!expDate) {
      const saleD = new Date(newSale.date || Date.now());
      saleD.setDate(saleD.getDate() + 30);
      expDate = saleD.toISOString().split('T')[0];
    }

    const newCommission: Commission = {
      id: `com-${Date.now()}`,
      saleId: saleId,
      clientName: newSale.clientName,
      partnerId: newSale.partnerId,
      partnerName: newSale.partnerName,
      saleValue: newSale.saleValue,
      commissionValue: newSale.commissionValue,
      expectedDate: expDate,
      status: 'pendente',
      notes: `Gerada automaticamente pela venda ${saleId}.`,
      createdAt: new Date().toISOString(),
    };

    setCommissions((prev) => [newCommission, ...prev]);
    showToast(`Venda registrada! Comissão de R$ ${newSale.commissionValue.toFixed(2)} gerada.`);
    return newSale;
  };

  const updateSale = (id: string, updated: Partial<Sale>) => {
    setSales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );

    // Sync corresponding commission
    setCommissions((prev) =>
      prev.map((c) => {
        if (c.saleId === id) {
          return {
            ...c,
            clientName: updated.clientName ?? c.clientName,
            partnerId: updated.partnerId ?? c.partnerId,
            partnerName: updated.partnerName ?? c.partnerName,
            saleValue: updated.saleValue ?? c.saleValue,
            commissionValue: updated.commissionValue ?? c.commissionValue,
          };
        }
        return c;
      })
    );
    showToast('Venda atualizada e comissões sincronizadas.');
  };

  const deleteSale = (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    // Also remove or cancel corresponding commission
    setCommissions((prev) => prev.filter((c) => c.saleId !== id));
    showToast('Venda e respectiva comissão excluídas.');
  };

  // Commission operations
  const updateCommissionStatus = (id: string, status: CommissionStatus) => {
    const today = new Date().toISOString().split('T')[0];
    setCommissions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status,
            receivedDate: status === 'recebida' ? (c.receivedDate || today) : undefined,
          };
        }
        return c;
      })
    );
    const label = status === 'recebida' ? 'recebida' : status === 'cancelada' ? 'cancelada' : 'pendente';
    showToast(`Status da comissão alterado para "${label}".`);
  };

  const updateCommission = (id: string, updated: Partial<Commission>) => {
    setCommissions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    showToast('Comissão atualizada com sucesso.');
  };

  const deleteCommission = (id: string) => {
    setCommissions((prev) => prev.filter((c) => c.id !== id));
    showToast('Comissão removida.');
  };

  const resetToDefaultData = () => {
    setPartners(INITIAL_PARTNERS);
    setLeads(INITIAL_LEADS);
    setSales(INITIAL_SALES);
    setCommissions(INITIAL_COMMISSIONS);
    showToast('Dados de demonstração restaurados com sucesso.');
  };

  // Essential dashboard metrics
  const activePartners = partners.filter((p) => p.status === 'ativo').length;
  const inProgressLeads = leads.filter(
    (l) => l.status === 'novo' || l.status === 'contatado' || l.status === 'em_negociacao'
  ).length;
  const convertedLeads = leads.filter((l) => l.status === 'convertido').length;
  const totalSalesCount = sales.length;
  const totalSalesValue = sales.reduce((acc, curr) => acc + (curr.saleValue || 0), 0);

  const pendingCommissionsValue = commissions
    .filter((c) => c.status === 'pendente')
    .reduce((acc, curr) => acc + (curr.commissionValue || 0), 0);

  const receivedCommissionsValue = commissions
    .filter((c) => c.status === 'recebida')
    .reduce((acc, curr) => acc + (curr.commissionValue || 0), 0);

  const cancelledCommissionsValue = commissions
    .filter((c) => c.status === 'cancelada')
    .reduce((acc, curr) => acc + (curr.commissionValue || 0), 0);

  return (
    <AppContext.Provider
      value={{
        auth,
        login,
        logout,
        loginError,
        activeTab,
        setActiveTab,
        partners,
        addPartner,
        updatePartner,
        deletePartner,
        leads,
        addLead,
        updateLead,
        deleteLead,
        sales,
        addSale,
        updateSale,
        deleteSale,
        commissions,
        updateCommissionStatus,
        updateCommission,
        deleteCommission,
        selectedLeadForSale,
        setSelectedLeadForSale,
        toastMessage,
        showToast,
        metrics: {
          activePartners,
          totalPartners: partners.length,
          inProgressLeads,
          convertedLeads,
          totalSalesCount,
          totalSalesValue,
          pendingCommissionsValue,
          receivedCommissionsValue,
          cancelledCommissionsValue,
        },
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
