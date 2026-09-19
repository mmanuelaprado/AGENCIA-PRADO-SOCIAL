export type PartnerStatus = 'prospectando' | 'em_negociacao' | 'ativo' | 'inativo';
export type CommissionType = 'percentage' | 'fixed';

export interface Partner {
  id: string;
  name: string;
  cnpj: string;
  segment: string;
  responsible: string;
  whatsapp: string;
  email: string;
  productService: string;
  agreedCommission: number; // e.g. 15 for 15% or 500 for R$ 500
  commissionType: CommissionType;
  status: PartnerStatus;
  startDate: string; // YYYY-MM-DD
  notes: string;
  createdAt: string;
}

export type LeadStatus = 'novo' | 'contatado' | 'em_negociacao' | 'convertido' | 'nao_convertido';

export interface Lead {
  id: string;
  date: string; // YYYY-MM-DD
  name: string; // Nome/empresa do lead
  phone: string;
  partnerId: string; // Empresa parceira
  partnerName: string;
  productService: string; // Produto/serviço de interesse
  assignedTo: string; // Responsável pelo atendimento
  status: LeadStatus;
  notes: string;
  createdAt: string;
}

export type SaleStatus = 'concluida' | 'em_andamento' | 'cancelada';

export interface Sale {
  id: string;
  date: string; // YYYY-MM-DD
  clientName: string; // Cliente
  leadId?: string;
  partnerId: string; // Parceiro
  partnerName: string;
  productService: string;
  saleValue: number; // Valor da venda em R$
  commissionValue: number; // Valor da comissão em R$
  status: SaleStatus;
  notes?: string;
  createdAt: string;
}

export type CommissionStatus = 'pendente' | 'recebida' | 'cancelada';

export interface Commission {
  id: string;
  saleId: string;
  clientName: string;
  partnerId: string;
  partnerName: string;
  saleValue: number;
  commissionValue: number;
  expectedDate: string; // Data prevista YYYY-MM-DD
  receivedDate?: string;
  status: CommissionStatus;
  notes?: string;
  createdAt: string;
}

export type ActiveTab = 'dashboard' | 'parceiros' | 'leads' | 'vendas' | 'comissoes';

export interface UserAuth {
  isAuthenticated: boolean;
  userEmail: string;
  userName: string;
}
