import { quoteStatusMeta, QUOTE_STATUSES } from "../../app/lib/quoteStatus";

const t = (key: string) => key;

describe("quoteStatusMeta", () => {
  it("maps pending to amber", () => {
    expect(quoteStatusMeta("pending", t)).toEqual({ label: "admin.quotes.statusPending", color: "amber" });
  });

  it("maps viewed to muted", () => {
    expect(quoteStatusMeta("viewed", t)).toEqual({ label: "admin.quotes.statusViewed", color: "muted" });
  });

  it("maps replied to green", () => {
    expect(quoteStatusMeta("replied", t)).toEqual({ label: "admin.quotes.statusReplied", color: "green" });
  });

  it("lists all three statuses exactly once", () => {
    expect(QUOTE_STATUSES).toEqual(["pending", "viewed", "replied"]);
  });
});
