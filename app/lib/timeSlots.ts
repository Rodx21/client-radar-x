import type { DayHours } from "@/config/client";

// Generates "HH:MM" slot start times, `intervalMinutes` apart, that fully fit within the open/close window.
export function generateSlots(hours: DayHours, intervalMinutes = 30): string[] {
  if (!hours) return [];
  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  const start = openH * 60 + openM;
  const end = closeH * 60 + closeM;
  const slots: string[] = [];
  for (let t = start; t + intervalMinutes <= end; t += intervalMinutes) {
    const h = String(Math.floor(t / 60)).padStart(2, "0");
    const m = String(t % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}

// Filters generated slots to exclude already-booked times and, for today, times that have already passed.
export function availableSlots(hours: DayHours, bookedTimes: string[], opts?: { isToday?: boolean; nowMinutes?: number }): string[] {
  const booked = new Set(bookedTimes.map((t) => t.slice(0, 5)));
  return generateSlots(hours).filter((slot) => {
    if (booked.has(slot)) return false;
    if (opts?.isToday) {
      const [h, m] = slot.split(":").map(Number);
      if (h * 60 + m <= (opts.nowMinutes ?? 0)) return false;
    }
    return true;
  });
}
