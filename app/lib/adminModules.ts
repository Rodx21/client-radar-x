// Shared list of admin sections — drives both the mobile hub (app/admin/index.tsx)
// and the desktop sidebar (app/theme/adminShell.tsx), so the two stay in sync.
export const ADMIN_MODULES = [
  { key: "dashboard",    icon: "stats-chart-outline" as const, href: "/admin/dashboard" as const },
  { key: "inbox",        icon: "chatbubbles-outline" as const, href: "/admin/inbox" as const },
  { key: "pipeline",     icon: "funnel-outline" as const,      href: "/admin/pipeline" as const },
  { key: "agenda",       icon: "time-outline" as const,        href: "/admin/agenda" as const },
  { key: "appointments", icon: "calendar-outline" as const,    href: "/admin/appointments" as const },
  { key: "quotes",       icon: "receipt-outline" as const,     href: "/admin/quotes" as const },
  { key: "services",     icon: "construct-outline" as const,   href: "/admin/services" as const },
  { key: "gallery",      icon: "images-outline" as const,      href: "/admin/gallery" as const },
  { key: "settings",     icon: "business-outline" as const,    href: "/admin/settings" as const },
];
