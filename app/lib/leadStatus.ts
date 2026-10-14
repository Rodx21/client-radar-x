export type LeadStatus = "novo" | "em_atendimento" | "qualificado" | "agendado" | "compareceu" | "vendido" | "perdido";

export const LEAD_STATUSES: LeadStatus[] = ["novo", "em_atendimento", "qualificado", "agendado", "compareceu", "vendido", "perdido"];

// Maps a lead's pipeline stage to its translated label and StatusBadge color.
export function leadStatusMeta(status: LeadStatus, t: (key: string) => string): { label: string; color: "green" | "amber" | "red" | "muted" } {
  switch (status) {
    case "vendido": return { label: t("admin.pipeline.statusVendido"), color: "green" };
    case "perdido": return { label: t("admin.pipeline.statusPerdido"), color: "red" };
    case "novo": return { label: t("admin.pipeline.statusNovo"), color: "muted" };
    case "em_atendimento": return { label: t("admin.pipeline.statusEmAtendimento"), color: "amber" };
    case "qualificado": return { label: t("admin.pipeline.statusQualificado"), color: "amber" };
    case "agendado": return { label: t("admin.pipeline.statusAgendado"), color: "amber" };
    case "compareceu":
    default: return { label: t("admin.pipeline.statusCompareceu"), color: "amber" };
  }
}
