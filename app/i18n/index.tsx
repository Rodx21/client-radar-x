import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getPref, setPref } from "@/app/lib/storage";

export type Language = "pt-BR" | "en-US";
type Dict = { [key: string]: string | Dict };
type Ctx = { lang: Language; setLang: (l: Language) => void; t: (key: string) => string };
const I18nContext = createContext<Ctx | null>(null);
const PREF = "crx.lang";

// Looks up a dot-separated key path (e.g. "login.title") inside a translation dictionary.
export function resolve(obj: Dict, path: string): string | Dict | undefined {
  return path.split(".").reduce<string | Dict | undefined>((a, k) => {
    if (typeof a === "object" && a !== null && k in a) return a[k];
    return undefined;
  }, obj);
}

const ptBR: Dict = {
  nav: { home: "Início", agenda: "Agenda", gallery: "Galeria", services: "Serviços", budgets: "Orçamentos" },
  common: { getQuote: "Fazer orçamento", seeServices: "Ver serviços", continue: "Continuar", done: "Concluir", details: "Detalhes", loading: "A carregar…", priceFrom: "A partir R$" },
  drawer: { title: "Auto Music Sound", subtitle: "Premium · Instalação profissional", home: "Início", services: "Serviços", agenda: "Agenda", gallery: "Galeria", budgets: "Orçamentos", settings: "Configurações", admin: "Admin", loginRequired: "Requer login", login: "Entrar", logout: "Sair", notLogged: "Não autenticado", notLoggedSub: "Faça login para acessar áreas privadas.", loggedAs: "Logado como", loadingSession: "A carregar sessão…" },
  home: { headline: "Upgrades automotivos premium.", sub: "Película, som, envelopamento, iluminação.", primaryCardTitle: "Orçamento em 60 segundos", primaryCardSub: "Selecione o serviço e receba cotação no WhatsApp.", quickTitle: "Atalhos", quickAgendaTitle: "Agenda", quickAgendaSub: "Ver horários.", quickBudgetsTitle: "Orçamentos", quickBudgetsSub: "Criar orçamento.", quickGalleryTitle: "Galeria", quickGallerySub: "Ver fotos.", trustTitle: "Confiança", trustRating: "4.5 ★ Google", trustWarranty: "Garantia", trustBeforeAfter: "Antes & depois", trustWhatsApp: "WhatsApp rápido", helpTitle: "Precisa de ajuda?", helpSub: "Entre em contacto pelo WhatsApp.", helpPrimary: "Falar no WhatsApp", waQuickMessage: "Olá! Quero um orçamento. Meu carro é: (modelo/ano). Serviço: (película/som/envelopamento).", helpSecondary: "Ver serviços", findUsTitle: "Onde estamos", addressShort: "R. Serra de Botucatu, 2100 — Tatuapé, SP", hoursMF: "Seg–Sex 9h–17h", hoursSat: "Sáb 8h–16h", hoursSunClosed: "Dom fechado", googleRating: "4.5 ★ · 244 avaliações Google" },
  tabs: { servicesTitle: "Serviços", servicesSub: "Todos os serviços disponíveis.", servicesAll: "Todos", servicesCtaTitle: "Quer um orçamento?", servicesCtaSub: "Resposta rápida pelo WhatsApp.", agendaTitle: "Agenda", agendaSub: "Seus agendamentos.", agendaSection: "Agendamentos do dia", agendaNewAppointment: "Novo agendamento", agendaEmptyTitle: "Sem agendamentos", agendaEmptySub: "Nenhum agendamento para este dia.", loginRequiredTitle: "Acesso restrito", loginRequiredSub: "Faça login para acessar.", loginCTA: "Entrar", statusConfirmed: "Confirmado", statusPending: "Aguardando", statusCancelled: "Cancelado", statusCompleted: "Concluído", appointmentsCount: "agendamento(s)", serviceFallback: "Serviço" },
  gallery: { title: "Galeria", subPublic: "Antes e depois dos nossos trabalhos.", noteTitle: "Fotos reais", noteSub: "Todos os trabalhos realizados pela equipa.", badge: "Antes/Depois" },
  login: { title: "Login", tabSignIn: "Entrar", tabSignUp: "Criar conta", headline: "Bem-vindo de volta", sub: "Acesse sua conta.", signupHeadline: "Criar conta", signupSub: "Cadastre-se para agendar.", fullName: "Nome completo", fullNamePh: "Seu nome", email: "Email", emailPh: "seu@email.com", password: "Senha", passwordPh: "mínimo 6 caracteres", submit: "Entrar", signupSubmit: "Criar conta", loading: "Aguarde…", cancel: "Cancelar", errorTitle: "Erro", signupSuccessTitle: "Conta criada!", signupSuccessSub: "Verifique seu email.", note: "Dados protegidos com Supabase Auth." },
  settings: { title: "Configurações", darkMode: "Modo escuro", language: "Idioma", on: "Ativado", off: "Desativado", appLabel: "Aplicativo", versionLabel: "Versão", stackLabel: "Stack", instagramLabel: "Instagram", sourceCodeLabel: "Código-fonte", viewOnGithub: "Ver no GitHub" },
  quote: { title: "Orçamento", hero: "Orçamento rápido", heroSub: "4 passos simples.", step1Title: "Serviço", step2Title: "Veículo", step3Title: "Fotos", step4Title: "Contacto", pickService: "Escolha o serviço", vehicleInfo: "Dados do veículo", photos: "Fotos (opcional)", photosHint: "Adicione fotos do seu carro para um orçamento mais preciso.", addPhotos: "Adicionar fotos", contact: "Seus dados", model: "Modelo", modelPh: "Ex: Honda Civic", year: "Ano", yearPh: "Ex: 2022", name: "Nome", namePh: "Seu nome", phone: "Telefone", phonePh: "WhatsApp", sendWhatsApp: "Enviar pelo WhatsApp", serviceTint: "Película", serviceTintDesc: "Conforto e proteção UV.", serviceAudio: "Som e Multimídia", serviceAudioDesc: "Instalação profissional.", serviceWrap: "Envelopamento", serviceWrapDesc: "Proteção e estilo.", serviceChrome: "Chrome Delete", serviceChromeDesc: "Remoção de cromados.", serviceLighting: "Iluminação LED", serviceLightingDesc: "Kit LED completo.", serviceWheels: "Rodas", serviceWheelsDesc: "Personalização de rodas.", waTemplate: "Olá! Quero um orçamento.\nServiço: {service}\nCarro: {car}\nNome: {name}\nContacto: {phone}", waPhotosLine: "\nFotos: {count} prontas para enviar.", permissionTitle: "Permissão necessária", permissionMessage: "Acesso à galeria necessário." },
  servicesData: { tintTitle: "Película Premium", tintBlurb: "Conforto e proteção UV.", tintPrice: "A partir R$399", audioTitle: "Som e Multimídia", audioBlurb: "Instalação profissional.", audioPrice: "A partir R$450", wrapTitle: "Envelopamento", wrapBlurb: "Proteção e estilo.", wrapPrice: "A partir R$1.200", chromeTitle: "Chrome Delete", chromeBlurb: "Remoção de cromados.", chromePrice: "A partir R$350", lightingTitle: "Iluminação LED", lightingBlurb: "Kit LED completo.", lightingPrice: "A partir R$280", wheelsTitle: "Rodas e Pneus", wheelsBlurb: "Personalização.", wheelsPrice: "A partir R$300" },
  business: { findUsTitle: "Onde estamos", addressShort: "R. Serra de Botucatu, 2100 — Tatuapé, SP", hoursMF: "Seg–Sex 9h–17h", hoursSat: "Sáb 8h–16h", hoursSunClosed: "Dom fechado", googleRating: "4.5 ★ · 244 avaliações Google", howToGet: "Como chegar", seeInstagram: "Instagram" },
  booking: {
    title: "Agendar horário", pickService: "Escolha o serviço", pickServiceSub: "Selecione o que você quer fazer no seu carro.",
    pickDateTime: "Data e horário", pickDateTimeSub: "Escolha o dia e um horário disponível.",
    dayClosed: "Fechado neste dia.", noSlots: "Nenhum horário disponível neste dia.",
    slotTakenTitle: "Horário indisponível", slotTakenSub: "Esse horário acabou de ser reservado por outra pessoa. Escolha outro.",
    confirm: "Confirmar agendamento",
  },
  admin: {
    filterAll: "Todos", save: "Salvar", delete: "Excluir", conceptBadge: "Conceito · dados fictícios",
    hub: { title: "Painel admin", subtitle: "Gerencie agendamentos, orçamentos, serviços, galeria e dados do negócio.",
      appointmentsTitle: "Agendamentos", appointmentsSub: "Ver e atualizar status", quotesTitle: "Orçamentos", quotesSub: "Ver pedidos recebidos",
      servicesTitle: "Serviços", servicesSub: "Gerenciar catálogo", galleryTitle: "Galeria", gallerySub: "Gerenciar fotos antes/depois",
      settingsTitle: "Configurações", settingsSub: "Dados do negócio",
      dashboardTitle: "Cockpit executivo", dashboardSub: "KPIs e funil de conversão",
      inboxTitle: "Inbox / CRM", inboxSub: "Conversas de WhatsApp unificadas",
      pipelineTitle: "Pipeline", pipelineSub: "Funil comercial por estágio",
      agendaTitle: "Agenda", agendaSub: "Compromissos confirmados" },
    dashboard: { title: "Cockpit executivo", subtitle: "Auto Music Sound e Film — visão consolidada da operação",
      funnelTitle: "Funil de conversão", channelTitle: "Leads por canal", vendorsTitle: "Desempenho por vendedor",
      colVendor: "Vendedor", colConversas: "Conversas", colAgendamentos: "Agend.", colVendas: "Vendas", colConversao: "Conversão" },
    inbox: { title: "Inbox / CRM", subtitle: "Conversas de WhatsApp e outros canais, unificadas por contato", empty: "Nenhuma conversa encontrada.",
      leadPanelOrigin: "Origem", leadPanelInterest: "Interesse", leadPanelOwner: "Responsável",
      service: "Serviço", vehicle: "Veículo", estimatedValue: "Valor estimado", createdAt: "Primeiro contato",
      aiSectionTitle: "Análise de IA", nextAction: "Ação sugerida", changeStage: "Mudar estágio", noAiYet: "IA ainda não analisou esta conversa." },
    pipeline: { title: "Pipeline", subtitle: "Funil comercial por estágio", empty: "Nenhum lead neste estágio.",
      statusNovo: "Novo", statusEmAtendimento: "Em atendimento", statusQualificado: "Qualificado", statusAgendado: "Agendado",
      statusCompareceu: "Compareceu", statusVendido: "Vendido", statusPerdido: "Perdido" },
    agenda: { title: "Agenda", subtitle: "Instalações confirmadas — vêm do app do cliente e da IA lendo o WhatsApp", empty: "Nenhum compromisso.",
      originAi: "IA (WhatsApp)", originApp: "App",
      legend: "🤖 criado automaticamente quando a IA identifica confirmação de horário numa conversa de WhatsApp. 📱 cliente agendou direto pelo app." },
    appointments: { title: "Agendamentos", detailTitle: "Detalhes do agendamento", subtitle: "Todos os agendamentos deste negócio.", empty: "Nenhum agendamento encontrado.",
      unknownCustomer: "Cliente", customer: "Cliente", service: "Serviço", when: "Data e hora", notes: "Observações", changeStatus: "Alterar status" },
    quotes: { title: "Orçamentos", detailTitle: "Detalhes do orçamento", subtitle: "Todos os pedidos de orçamento recebidos.", empty: "Nenhum orçamento encontrado.",
      service: "Serviço", vehicle: "Veículo", replyWhatsApp: "Responder no WhatsApp",
      statusPending: "Pendente", statusViewed: "Visto", statusReplied: "Respondido",
      waTemplate: "Olá! Sobre o orçamento que você pediu.\nServiço: {service}\nCarro: {car}" },
    services: { title: "Serviços", subtitle: "Catálogo de serviços deste negócio.", empty: "Nenhum serviço cadastrado.", new: "Novo serviço", edit: "Editar serviço",
      name: "Nome", namePh: "Ex: Película Premium", description: "Descrição", descriptionPh: "Breve descrição do serviço",
      category: "Categoria", priceFrom: "Preço a partir de", imageUrl: "URL da imagem", active: "Ativo", inactive: "Inativo",
      deleteTitle: "Excluir serviço", deleteConfirm: "Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita." },
    gallery: { title: "Galeria", subtitle: "Fotos de antes/depois deste negócio.", empty: "Nenhuma foto cadastrada.", new: "Nova foto", edit: "Editar foto",
      itemTitle: "Título", itemTitlePh: "Ex: Envelopamento fosco", beforeUrl: "URL da foto (antes)", afterUrl: "URL da foto (depois)",
      pickPhoto: "Escolher do dispositivo", uploading: "Enviando…", uploadFailed: "Falha ao enviar a foto.",
      deleteTitle: "Excluir foto", deleteConfirm: "Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita." },
    settings: { title: "Configurações do negócio", subtitle: "Dados exibidos para os clientes no app.",
      name: "Nome do negócio", namePh: "Nome da empresa", brandColor: "Cor da marca", whatsapp: "WhatsApp", address: "Endereço", addressPh: "Endereço completo", instagram: "Instagram (usuário)",
      brandColorHint: "A cor da marca aqui é apenas informativa — o tema visual do app é definido na configuração de compilação (config/client.ts), não neste campo.",
      savedTitle: "Salvo!", savedSub: "Os dados do negócio foram atualizados." },
  },
};

const enUS: Dict = {
  nav: { home: "Home", agenda: "Schedule", gallery: "Gallery", services: "Services", budgets: "Quotes" },
  common: { getQuote: "Get a quote", seeServices: "View services", continue: "Continue", done: "Done", details: "Details", loading: "Loading…", priceFrom: "From R$" },
  drawer: { title: "Auto Music Sound", subtitle: "Premium · Professional installation", home: "Home", services: "Services", agenda: "Schedule", gallery: "Gallery", budgets: "Quotes", settings: "Settings", admin: "Admin", loginRequired: "Login required", login: "Sign in", logout: "Sign out", notLogged: "Not signed in", notLoggedSub: "Sign in to access private areas.", loggedAs: "Signed in as", loadingSession: "Loading session…" },
  home: { headline: "Premium automotive upgrades.", sub: "Tinting, audio, wraps, lighting.", primaryCardTitle: "Quote in 60 seconds", primaryCardSub: "Pick a service and get a quote on WhatsApp.", quickTitle: "Shortcuts", quickAgendaTitle: "Schedule", quickAgendaSub: "View time slots.", quickBudgetsTitle: "Quotes", quickBudgetsSub: "Create a quote.", quickGalleryTitle: "Gallery", quickGallerySub: "View photos.", trustTitle: "Why trust us", trustRating: "4.5 ★ Google", trustWarranty: "Warranty", trustBeforeAfter: "Before & after", trustWhatsApp: "Quick WhatsApp", helpTitle: "Need help?", helpSub: "Get in touch on WhatsApp.", helpPrimary: "Chat on WhatsApp", waQuickMessage: "Hi! I'd like a quote. My car is: (model/year). Service: (tint/audio/wrap).", helpSecondary: "View services", findUsTitle: "Find us", addressShort: "R. Serra de Botucatu, 2100 — Tatuapé, SP", hoursMF: "Mon–Fri 9am–5pm", hoursSat: "Sat 8am–4pm", hoursSunClosed: "Closed Sundays", googleRating: "4.5 ★ · 244 Google reviews" },
  tabs: { servicesTitle: "Services", servicesSub: "All available services.", servicesAll: "All", servicesCtaTitle: "Want a quote?", servicesCtaSub: "Quick reply on WhatsApp.", agendaTitle: "Schedule", agendaSub: "Your appointments.", agendaSection: "Today's appointments", agendaNewAppointment: "New appointment", agendaEmptyTitle: "No appointments", agendaEmptySub: "No appointments for this day.", loginRequiredTitle: "Restricted access", loginRequiredSub: "Sign in to access this.", loginCTA: "Sign in", statusConfirmed: "Confirmed", statusPending: "Pending", statusCancelled: "Cancelled", statusCompleted: "Completed", appointmentsCount: "appointment(s)", serviceFallback: "Service" },
  gallery: { title: "Gallery", subPublic: "Before and after of our work.", noteTitle: "Real photos", noteSub: "All work carried out by our team.", badge: "Before/After" },
  login: { title: "Login", tabSignIn: "Sign in", tabSignUp: "Create account", headline: "Welcome back", sub: "Access your account.", signupHeadline: "Create account", signupSub: "Sign up to book appointments.", fullName: "Full name", fullNamePh: "Your name", email: "Email", emailPh: "you@email.com", password: "Password", passwordPh: "minimum 6 characters", submit: "Sign in", signupSubmit: "Create account", loading: "Please wait…", cancel: "Cancel", errorTitle: "Error", signupSuccessTitle: "Account created!", signupSuccessSub: "Check your email.", note: "Data protected with Supabase Auth." },
  settings: { title: "Settings", darkMode: "Dark mode", language: "Language", on: "On", off: "Off", appLabel: "App", versionLabel: "Version", stackLabel: "Stack", instagramLabel: "Instagram", sourceCodeLabel: "Source code", viewOnGithub: "View on GitHub" },
  quote: { title: "Quote", hero: "Quick quote", heroSub: "4 simple steps.", step1Title: "Service", step2Title: "Vehicle", step3Title: "Photos", step4Title: "Contact", pickService: "Choose a service", vehicleInfo: "Vehicle info", photos: "Photos (optional)", photosHint: "Add photos of your car for a more accurate quote.", addPhotos: "Add photos", contact: "Your details", model: "Model", modelPh: "E.g.: Honda Civic", year: "Year", yearPh: "E.g.: 2022", name: "Name", namePh: "Your name", phone: "Phone", phonePh: "WhatsApp", sendWhatsApp: "Send via WhatsApp", serviceTint: "Window Tinting", serviceTintDesc: "Comfort and UV protection.", serviceAudio: "Audio & Multimedia", serviceAudioDesc: "Professional installation.", serviceWrap: "Vehicle Wrap", serviceWrapDesc: "Protection and style.", serviceChrome: "Chrome Delete", serviceChromeDesc: "Chrome trim removal.", serviceLighting: "LED Lighting", serviceLightingDesc: "Complete LED kit.", serviceWheels: "Wheels", serviceWheelsDesc: "Custom wheels.", waTemplate: "Hi! I'd like a quote.\nService: {service}\nCar: {car}\nName: {name}\nContact: {phone}", waPhotosLine: "\nPhotos: {count} ready to send.", permissionTitle: "Permission required", permissionMessage: "Access to the gallery is required." },
  servicesData: { tintTitle: "Premium Window Tinting", tintBlurb: "Comfort and UV protection.", tintPrice: "From R$399", audioTitle: "Audio & Multimedia", audioBlurb: "Professional installation.", audioPrice: "From R$450", wrapTitle: "Vehicle Wrap", wrapBlurb: "Protection and style.", wrapPrice: "From R$1,200", chromeTitle: "Chrome Delete", chromeBlurb: "Chrome trim removal.", chromePrice: "From R$350", lightingTitle: "LED Lighting", lightingBlurb: "Complete LED kit.", lightingPrice: "From R$280", wheelsTitle: "Wheels & Tires", wheelsBlurb: "Custom wheels.", wheelsPrice: "From R$300" },
  business: { findUsTitle: "Find us", addressShort: "R. Serra de Botucatu, 2100 — Tatuapé, SP", hoursMF: "Mon–Fri 9am–5pm", hoursSat: "Sat 8am–4pm", hoursSunClosed: "Closed Sundays", googleRating: "4.5 ★ · 244 Google reviews", howToGet: "Get directions", seeInstagram: "Instagram" },
  booking: {
    title: "Book appointment", pickService: "Choose the service", pickServiceSub: "Select what you want done to your car.",
    pickDateTime: "Date & time", pickDateTimeSub: "Choose a day and an available time slot.",
    dayClosed: "Closed this day.", noSlots: "No available times on this day.",
    slotTakenTitle: "Slot unavailable", slotTakenSub: "That time slot was just booked by someone else. Please pick another.",
    confirm: "Confirm booking",
  },
  admin: {
    filterAll: "All", save: "Save", delete: "Delete", conceptBadge: "Concept · fictional data",
    hub: { title: "Admin panel", subtitle: "Manage appointments, quotes, services, gallery, and business info.",
      appointmentsTitle: "Appointments", appointmentsSub: "View and update status", quotesTitle: "Quotes", quotesSub: "View received requests",
      servicesTitle: "Services", servicesSub: "Manage the catalogue", galleryTitle: "Gallery", gallerySub: "Manage before/after photos",
      settingsTitle: "Settings", settingsSub: "Business info",
      dashboardTitle: "Executive cockpit", dashboardSub: "KPIs and conversion funnel",
      inboxTitle: "Inbox / CRM", inboxSub: "Unified WhatsApp conversations",
      pipelineTitle: "Pipeline", pipelineSub: "Sales funnel by stage",
      agendaTitle: "Schedule", agendaSub: "Confirmed appointments" },
    dashboard: { title: "Executive cockpit", subtitle: "Auto Music Sound e Film — consolidated view of the operation",
      funnelTitle: "Conversion funnel", channelTitle: "Leads by channel", vendorsTitle: "Sales rep performance",
      colVendor: "Rep", colConversas: "Chats", colAgendamentos: "Booked", colVendas: "Sales", colConversao: "Conversion" },
    inbox: { title: "Inbox / CRM", subtitle: "WhatsApp and other channels, unified by contact", empty: "No conversations found.",
      leadPanelOrigin: "Origin", leadPanelInterest: "Interest", leadPanelOwner: "Owner",
      service: "Service", vehicle: "Vehicle", estimatedValue: "Estimated value", createdAt: "First contact",
      aiSectionTitle: "AI analysis", nextAction: "Suggested action", changeStage: "Change stage", noAiYet: "AI hasn't analyzed this conversation yet." },
    pipeline: { title: "Pipeline", subtitle: "Sales funnel by stage", empty: "No leads in this stage.",
      statusNovo: "New", statusEmAtendimento: "In progress", statusQualificado: "Qualified", statusAgendado: "Scheduled",
      statusCompareceu: "Attended", statusVendido: "Won", statusPerdido: "Lost" },
    agenda: { title: "Schedule", subtitle: "Confirmed installs — from the client app and from AI reading WhatsApp", empty: "No appointments.",
      originAi: "AI (WhatsApp)", originApp: "App",
      legend: "🤖 auto-created when AI detects a confirmed time in a WhatsApp conversation. 📱 customer booked directly in the app." },
    appointments: { title: "Appointments", detailTitle: "Appointment details", subtitle: "All appointments for this business.", empty: "No appointments found.",
      unknownCustomer: "Customer", customer: "Customer", service: "Service", when: "Date & time", notes: "Notes", changeStatus: "Change status" },
    quotes: { title: "Quotes", detailTitle: "Quote details", subtitle: "All quote requests received.", empty: "No quotes found.",
      service: "Service", vehicle: "Vehicle", replyWhatsApp: "Reply on WhatsApp",
      statusPending: "Pending", statusViewed: "Viewed", statusReplied: "Replied",
      waTemplate: "Hi! About the quote you requested.\nService: {service}\nCar: {car}" },
    services: { title: "Services", subtitle: "This business's service catalogue.", empty: "No services yet.", new: "New service", edit: "Edit service",
      name: "Name", namePh: "E.g.: Premium Window Tinting", description: "Description", descriptionPh: "Short description of the service",
      category: "Category", priceFrom: "Price from", imageUrl: "Image URL", active: "Active", inactive: "Inactive",
      deleteTitle: "Delete service", deleteConfirm: "Are you sure you want to delete this service? This cannot be undone." },
    gallery: { title: "Gallery", subtitle: "This business's before/after photos.", empty: "No photos yet.", new: "New photo", edit: "Edit photo",
      itemTitle: "Title", itemTitlePh: "E.g.: Matte wrap", beforeUrl: "Photo URL (before)", afterUrl: "Photo URL (after)",
      pickPhoto: "Choose from device", uploading: "Uploading…", uploadFailed: "Failed to upload photo.",
      deleteTitle: "Delete photo", deleteConfirm: "Are you sure you want to delete this photo? This cannot be undone." },
    settings: { title: "Business settings", subtitle: "Info shown to customers in the app.",
      name: "Business name", namePh: "Company name", brandColor: "Brand color", whatsapp: "WhatsApp", address: "Address", addressPh: "Full address", instagram: "Instagram (handle)",
      brandColorHint: "The brand color here is informational only — the app's visual theme is set at build time (config/client.ts), not from this field.",
      savedTitle: "Saved!", savedSub: "Business info has been updated." },
  },
};

const DICTS: Record<Language, Dict> = { "pt-BR": ptBR, "en-US": enUS };

export const WEEKDAY_ABBR: Record<Language, string[]> = {
  "pt-BR": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  "en-US": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export const MONTH_ABBR: Record<Language, string[]> = {
  "pt-BR": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  "en-US": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

// Provides the active language and a translate function, persisting the language locally.
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("pt-BR");
  useEffect(() => {
    getPref(PREF).then((v) => { if (v === "pt-BR" || v === "en-US") setLangState(v as Language); });
  }, []);
  // Updates the active language in state and saves it as a local preference.
  const setLang = (l: Language) => { setLangState(l); setPref(PREF, l); };
  // Translates a key in the active language, falling back to Portuguese then the raw key.
  const t = useMemo(() => (key: string) => {
    const v = resolve(DICTS[lang], key);
    if (typeof v === "string") return v;
    const fallback = resolve(ptBR, key);
    return typeof fallback === "string" ? fallback : key;
  }, [lang]);
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

// Hook for consuming the active language and translate function.
export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT outside I18nProvider");
  return ctx;
}
