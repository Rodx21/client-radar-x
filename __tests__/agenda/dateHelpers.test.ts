import { weekDays, toDate } from "../../app/(drawer)/(tabs)/agenda/dateHelpers";

describe("weekDays", () => {
  it("returns 7 consecutive dates starting from the base date", () => {
    const base = new Date("2026-07-20T00:00:00.000Z");
    const days = weekDays(base);
    expect(days).toHaveLength(7);
    expect(toDate(days[0])).toBe("2026-07-20");
    expect(toDate(days[6])).toBe("2026-07-26");
  });

  it("rolls over correctly across a month boundary", () => {
    const base = new Date("2026-07-30T00:00:00.000Z");
    const days = weekDays(base);
    expect(toDate(days[0])).toBe("2026-07-30");
    expect(toDate(days[2])).toBe("2026-08-01");
  });
});

describe("toDate", () => {
  it("formats a Date as an ISO YYYY-MM-DD string", () => {
    expect(toDate(new Date("2026-01-05T15:30:00.000Z"))).toBe("2026-01-05");
  });
});
