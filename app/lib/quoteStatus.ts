export type QuoteStatus = "pending" | "viewed" | "replied";

export const QUOTE_STATUSES: QuoteStatus[] = ["pending", "viewed", "replied"];

// Maps a quote status to its translated label and StatusBadge color.
export function quoteStatusMeta(status: QuoteStatus, t: (key: string) => string): { label: string; color: "green" | "amber" | "muted" } {
  switch (status) {
    case "replied": return { label: t("admin.quotes.statusReplied"), color: "green" };
    case "viewed": return { label: t("admin.quotes.statusViewed"), color: "muted" };
    case "pending":
    default: return { label: t("admin.quotes.statusPending"), color: "amber" };
  }
}
