export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = ["pending", "confirmed", "cancelled", "completed"];

// Maps an appointment status to its translated label and StatusBadge color.
export function appointmentStatusMeta(
  status: AppointmentStatus,
  t: (key: string) => string
): { label: string; color: "green" | "amber" | "red" | "muted" } {
  switch (status) {
    case "confirmed": return { label: t("tabs.statusConfirmed"), color: "green" };
    case "cancelled": return { label: t("tabs.statusCancelled"), color: "red" };
    case "completed": return { label: t("tabs.statusCompleted"), color: "muted" };
    case "pending":
    default: return { label: t("tabs.statusPending"), color: "amber" };
  }
}
