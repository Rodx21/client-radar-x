// Builds an array of `count` consecutive Date objects starting from the given base date.
export function nextDays(base: Date, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });
}

// Builds an array of 7 consecutive Date objects starting from the given base date.
export function weekDays(base: Date) {
  return nextDays(base, 7);
}

// Formats a Date as an ISO "YYYY-MM-DD" string for matching against appointment dates.
export function toDate(d: Date) {
  return d.toISOString().split("T")[0];
}
