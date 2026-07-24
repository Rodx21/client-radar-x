import { appointmentStatusMeta, APPOINTMENT_STATUSES } from "../../app/lib/appointmentStatus";

const t = (key: string) => key;

describe("appointmentStatusMeta", () => {
  it("maps confirmed to green", () => {
    expect(appointmentStatusMeta("confirmed", t)).toEqual({ label: "tabs.statusConfirmed", color: "green" });
  });

  it("maps pending to amber", () => {
    expect(appointmentStatusMeta("pending", t)).toEqual({ label: "tabs.statusPending", color: "amber" });
  });

  it("maps cancelled to red", () => {
    expect(appointmentStatusMeta("cancelled", t)).toEqual({ label: "tabs.statusCancelled", color: "red" });
  });

  it("maps completed to muted", () => {
    expect(appointmentStatusMeta("completed", t)).toEqual({ label: "tabs.statusCompleted", color: "muted" });
  });

  it("lists all four statuses exactly once", () => {
    expect(APPOINTMENT_STATUSES).toEqual(["pending", "confirmed", "cancelled", "completed"]);
  });
});
