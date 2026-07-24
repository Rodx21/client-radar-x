// Builds an array of 7 consecutive Date objects starting from the given base date.
export function weekDays(base: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });
}

// Formats a Date as an ISO "YYYY-MM-DD" string for matching against appointment dates.
export function toDate(d: Date) {
  return d.toISOString().split("T")[0];
}
