import { generateSlots, availableSlots } from "../../app/lib/timeSlots";

describe("generateSlots", () => {
  it("returns empty for a closed day", () => {
    expect(generateSlots(null)).toEqual([]);
  });

  it("generates 30-minute slots from open to close, excluding a slot that would run past closing", () => {
    expect(generateSlots({ open: "09:00", close: "10:30" })).toEqual(["09:00", "09:30", "10:00"]);
  });

  it("supports a custom interval", () => {
    expect(generateSlots({ open: "08:00", close: "09:00" }, 15)).toEqual(["08:00", "08:15", "08:30", "08:45"]);
  });
});

describe("availableSlots", () => {
  const hours = { open: "09:00", close: "11:00" };

  it("excludes already-booked times", () => {
    expect(availableSlots(hours, ["09:30:00"])).toEqual(["09:00", "10:00", "10:30"]);
  });

  it("excludes past times when the date is today", () => {
    expect(availableSlots(hours, [], { isToday: true, nowMinutes: 9 * 60 + 45 })).toEqual(["10:00", "10:30"]);
  });

  it("returns all slots for a future day with no bookings", () => {
    expect(availableSlots(hours, [])).toEqual(["09:00", "09:30", "10:00", "10:30"]);
  });
});
