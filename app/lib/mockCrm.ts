import { useSyncExternalStore } from "react";
import { LeadStatus } from "@/app/lib/leadStatus";

// ============================================================
// Fictional Business OS data — CRM/inbox/pipeline/agenda/dashboard.
// Stands in for the real "business-os" Supabase project (a separate,
// already-built system this app has no access to yet). Shaped after its
// real pipeline — contacts -> conversations -> messages -> leads, AI
// analysis on conversations, a scheduling engine feeding appointments —
// so swapping this module for real queries later is a data-source change,
// not a screen rewrite.
// ============================================================

export type AiSentiment = "positivo" | "neutro" | "quente";

export type Message = { id: string; direction: "in" | "out"; text: string; time: string };

export type Conversation = {
  id: string;
  contactName: string;
  initials: string;
  phone: string;
  lastMessageAt: string;
  snippet: string;
  unread: boolean;
  aiSentiment?: AiSentiment;
  aiIntent?: string;
  leadId: string;
};

export type Lead = {
  id: string;
  contactName: string;
  phone: string;
  status: LeadStatus;
  service: string;
  vehicle: string;
  estimatedValue: number;
  owner: string;
  origin: string;
  createdAt?: string;
  aiSummary?: string;
  aiNextAction?: string;
};

export type AgendaItem = {
  id: string;
  date: string;
  time: string;
  contactName: string;
  service: string;
  origin: "ai" | "app";
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "c1", contactName: "Carla Sanches", initials: "CS", phone: "+55 11 98877-4412", lastMessageAt: "09:41", snippet: "Perfeito, quero fechar então!", unread: true, aiSentiment: "quente", aiIntent: "Intenção de fechar compra", leadId: "l1" },
  { id: "c2", contactName: "João Pedro Alves", initials: "JP", phone: "+55 11 97711-2290", lastMessageAt: "09:12", snippet: "Vocês instalam som em SUV também?", unread: true, aiSentiment: "neutro", aiIntent: "Dúvida sobre compatibilidade", leadId: "l2" },
  { id: "c3", contactName: "Fernanda Lima", initials: "FL", phone: "+55 11 96622-8834", lastMessageAt: "08:55", snippet: "Qual o prazo pro envelopamento?", unread: true, aiSentiment: "neutro", aiIntent: "Dúvida sobre prazo", leadId: "l3" },
  { id: "c4", contactName: "Rafael Torres", initials: "RT", phone: "+55 11 95544-1123", lastMessageAt: "ontem", snippet: "Obrigado, até sábado então", unread: false, aiSentiment: "positivo", leadId: "l4" },
  { id: "c5", contactName: "Marina Duarte", initials: "MD", phone: "+55 11 94433-7765", lastMessageAt: "ontem", snippet: "Ainda estou decidindo a cor…", unread: false, aiSentiment: "neutro", leadId: "l5" },
  { id: "c6", contactName: "Bruno Castilho", initials: "BC", phone: "+55 11 93322-6654", lastMessageAt: "ter", snippet: "Chrome delete no capô também dá?", unread: false, leadId: "l6" },
  { id: "c7", contactName: "Aline Prado", initials: "AP", phone: "+55 11 92211-5543", lastMessageAt: "ter", snippet: "Recebi o orçamento, obrigada!", unread: false, leadId: "l7" },
  { id: "c8", contactName: "Diego Farias", initials: "DF", phone: "+55 11 91100-4432", lastMessageAt: "seg", snippet: "Vou levar o carro sábado de manhã", unread: false, leadId: "l8" },
];

export const MOCK_THREADS: Record<string, Message[]> = {
  c1: [
    { id: "m1", direction: "in", text: "Oi! Vi o Instagram de vocês, fazem envelopamento de Jeep Compass?", time: "09:14" },
    { id: "m2", direction: "out", text: "Fazemos sim! Temos várias opções de vinil premium. Qual cor você tem em mente?", time: "09:16" },
    { id: "m3", direction: "in", text: "Pensando em um cinza fosco ou preto fosco", time: "09:20" },
    { id: "m4", direction: "out", text: "Ótima escolha, os dois ficam excelentes no Compass. O investimento fica em torno de R$ 1.400, com garantia de 2 anos.", time: "09:24" },
    { id: "m5", direction: "in", text: "Show. Vocês têm horário essa semana?", time: "09:35" },
    { id: "m6", direction: "out", text: "Temos sim, quinta ou sexta de manhã. Consigo te encaixar às 9h na sexta?", time: "09:38" },
    { id: "m7", direction: "in", text: "Perfeito, quero fechar então!", time: "09:41" },
  ],
  c2: [
    { id: "m1", direction: "in", text: "Bom dia! Vocês instalam som em SUV também?", time: "09:12" },
  ],
};

const INITIAL_LEADS: Lead[] = [
  { id: "l1", contactName: "Carla Sanches", phone: "+55 11 98877-4412", status: "qualificado", service: "Envelopamento", vehicle: "Jeep Compass '23", estimatedValue: 1400, owner: "Marcos", origin: "WhatsApp · Envelopamento — Conversão", createdAt: "12/08 09:14", aiSummary: "Cliente decidido, comparando cor fosco vs. brilhante. Sentimento positivo, alta intenção de compra.", aiNextAction: "Confirmar horário de sexta às 9h" },
  { id: "l2", contactName: "João Pedro Alves", phone: "+55 11 97711-2290", status: "em_atendimento", service: "Som e Multimídia", vehicle: "não informado", estimatedValue: 950, owner: "Bianca", origin: "WhatsApp direto" },
  { id: "l3", contactName: "Fernanda Lima", phone: "+55 11 96622-8834", status: "qualificado", service: "Envelopamento", vehicle: "não informado", estimatedValue: 1400, owner: "Marcos", origin: "Instagram orgânico" },
  { id: "l4", contactName: "Rafael Torres", phone: "+55 11 95544-1123", status: "agendado", service: "Rodas e Pneus", vehicle: "não informado", estimatedValue: 1800, owner: "Diego", origin: "WhatsApp direto" },
  { id: "l5", contactName: "Marina Duarte", phone: "+55 11 94433-7765", status: "compareceu", service: "Envelopamento", vehicle: "não informado", estimatedValue: 3200, owner: "Marcos", origin: "Envelopamento — Conversão" },
  { id: "l6", contactName: "Bruno Castilho", phone: "+55 11 93322-6654", status: "agendado", service: "Chrome Delete", vehicle: "não informado", estimatedValue: 650, owner: "Bianca", origin: "WhatsApp direto" },
  { id: "l7", contactName: "Aline Prado", phone: "+55 11 92211-5543", status: "vendido", service: "Película Premium", vehicle: "não informado", estimatedValue: 1950, owner: "Diego", origin: "Instagram orgânico" },
  { id: "l8", contactName: "Diego Farias", phone: "+55 11 91100-4432", status: "vendido", service: "Rodas e Pneus", vehicle: "não informado", estimatedValue: 2400, owner: "Marcos", origin: "WhatsApp direto" },
  { id: "l9", contactName: "Paula Nery", phone: "+55 11 90099-3321", status: "novo", service: "Som e Multimídia", vehicle: "não informado", estimatedValue: 900, owner: "Fila (sem dono)", origin: "WhatsApp direto" },
  { id: "l10", contactName: "Igor Matos", phone: "+55 11 90088-2210", status: "novo", service: "Som e Multimídia", vehicle: "não informado", estimatedValue: 1200, owner: "Fila (sem dono)", origin: "Envelopamento — Conversão" },
  { id: "l11", contactName: "Vitor Hugo", phone: "+55 11 90077-1109", status: "perdido", service: "Chrome Delete", vehicle: "não informado", estimatedValue: 800, owner: "Bianca", origin: "WhatsApp direto" },
];

// Minimal reactive store (no extra dependency) so a status change made in one
// screen (e.g. the inbox lead panel) is actually visible in another (e.g. the
// pipeline board) instead of only updating local component state and looking
// saved without being saved. Swap for real Supabase queries + mutations later.
let leadsState: Lead[] = INITIAL_LEADS;
const leadListeners = new Set<() => void>();

function setLeads(next: Lead[]) {
  leadsState = next;
  leadListeners.forEach((listener) => listener());
}

export function useLeads(): Lead[] {
  return useSyncExternalStore(
    (onChange) => {
      leadListeners.add(onChange);
      return () => leadListeners.delete(onChange);
    },
    () => leadsState,
  );
}

export function updateLeadStatus(leadId: string, status: LeadStatus) {
  setLeads(leadsState.map((l) => (l.id === leadId ? { ...l, status } : l)));
}

export const MOCK_AGENDA: AgendaItem[] = [
  { id: "a1", date: "Qui, 21/08", time: "09:00", contactName: "Rafael Torres", service: "Envelopamento fosco — Compass", origin: "ai" },
  { id: "a2", date: "Qui, 21/08", time: "14:00", contactName: "Sofia Reis", service: "Película Premium", origin: "app" },
  { id: "a3", date: "Sex, 22/08", time: "09:00", contactName: "Carla Sanches", service: "Envelopamento — Jeep Compass", origin: "ai" },
  { id: "a4", date: "Sex, 22/08", time: "10:30", contactName: "Bruno Castilho", service: "Chrome Delete", origin: "app" },
  { id: "a5", date: "Sex, 22/08", time: "15:00", contactName: "Igor Matos", service: "Som e Multimídia", origin: "ai" },
  { id: "a6", date: "Sáb, 23/08", time: "09:00", contactName: "Diego Farias", service: "Rodas e Pneus", origin: "app" },
];

export const MOCK_KPIS = [
  { label: "Leads (30d)", value: "214", delta: "▲ 18%", good: true },
  { label: "Conversas iniciadas", value: "486", delta: "▲ 9%", good: true },
  { label: "Tempo médio de 1ª resposta", value: "6 min", delta: "▼ 22%", good: true },
  { label: "Agendamentos", value: "122", delta: "▲ 12%", good: true },
  { label: "Comparecimento", value: "87%", delta: "▲ 3pp", good: true },
  { label: "Vendas", value: "81", delta: "▲ 15%", good: true },
  { label: "Ticket médio", value: "R$ 2.313", delta: "▼ 4%", good: false },
  { label: "Custo por venda", value: "R$ 143", delta: "▼ 8%", good: true },
];

export const MOCK_FUNNEL = [
  { stage: "Novo", count: 214 },
  { stage: "Em atendimento", count: 190 },
  { stage: "Qualificado", count: 151 },
  { stage: "Agendado", count: 122 },
  { stage: "Compareceu", count: 106 },
  { stage: "Vendido", count: 81 },
];

export const MOCK_CHANNEL_SHARE = [
  { name: "WhatsApp", pct: 68 },
  { name: "Instagram", pct: 19 },
  { name: "Site / outros", pct: 13 },
];

export const MOCK_VENDORS = [
  { name: "Marcos", conversas: 128, agendamentos: 44, vendas: 29, conversao: "22.7%" },
  { name: "Bianca", conversas: 96, agendamentos: 31, vendas: 19, conversao: "19.8%" },
  { name: "Diego", conversas: 74, agendamentos: 25, vendas: 16, conversao: "21.6%" },
  { name: "Fila (sem dono)", conversas: 42, agendamentos: 12, vendas: 6, conversao: "14.3%" },
];
